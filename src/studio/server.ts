/** STUDIO — watch a run happen, and answer the agent when it stops to ask.
 *
 *  A local HTTP server (Node built-ins only, no dependencies) that runs the
 *  real workflow and streams its stages to the browser over Server-Sent Events.
 *  When the adapter raises an escalation the run genuinely SUSPENDS: the promise
 *  parked here resolves only once a person posts an answer, and that answer is
 *  fed back into a final adapter pass. The checkpoint is enforced by control
 *  flow rather than asserted in a document.
 *
 *  Usage: npm run studio   → http://localhost:4321 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadAllCases, loadCase, saveResult } from "../cases.js";
import { runOneCase, type RunEvent } from "../workflow.js";
import type { Escalation } from "../types.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 4321);

interface Session {
  id: string;
  caseId: string;
  events: RunEvent[];
  clients: http.ServerResponse[];
  /** Set while the run is parked at the human checkpoint. */
  pending: { escalations: Escalation[]; resolve: (a: { sourceQuote: string; answer: string }[] | null) => void } | null;
  finished: boolean;
}

const sessions = new Map<string, Session>();

function push(s: Session, e: RunEvent) {
  s.events.push(e);
  const frame = `data: ${JSON.stringify(e)}\n\n`;
  for (const c of s.clients) c.write(frame);
}

function startRun(caseId: string): Session {
  const id = `${caseId}-${Date.now().toString(36)}`;
  const s: Session = { id, caseId, events: [], clients: [], pending: null, finished: false };
  sessions.set(id, s);

  (async () => {
    try {
      const c = loadCase(caseId);
      const result = await runOneCase(c, {
        onEvent: (e) => push(s, e),
        askHuman: (escalations) =>
          new Promise((resolve) => {
            // The run stops here. Nothing advances until POST /answer arrives.
            s.pending = { escalations, resolve };
          }),
      });
      saveResult("workflow", `${caseId}.studio.json`, result);
    } catch (err) {
      push(s, { type: "error", message: err instanceof Error ? err.message : String(err) });
    } finally {
      s.finished = true;
      for (const c of s.clients) c.end();
      s.clients = [];
    }
  })();

  return s;
}

function json(res: http.ServerResponse, code: number, body: unknown) {
  const b = JSON.stringify(body);
  res.writeHead(code, { "content-type": "application/json", "content-length": Buffer.byteLength(b) });
  res.end(b);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (url.pathname === "/") {
    const html = fs.readFileSync(path.join(here, "ui.html"), "utf8");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(html);
  }

  if (url.pathname === "/api/cases") {
    return json(res, 200, loadAllCases().map((c) => ({
      id: c.id, title: c.title, language: c.language, caseClass: c.caseClass ?? "clean",
      words: c.text.split(/\s+/).length, hasTrap: Boolean(c.traps?.mechanicalCheck),
    })));
  }

  if (url.pathname === "/api/case" && url.searchParams.get("id")) {
    const c = loadCase(url.searchParams.get("id")!);
    return json(res, 200, { id: c.id, title: c.title, text: c.text });
  }

  if (url.pathname === "/api/run" && req.method === "POST") {
    const caseId = url.searchParams.get("id");
    if (!caseId) return json(res, 400, { error: "id required" });
    if (!process.env.ANTHROPIC_API_KEY) return json(res, 400, { error: "ANTHROPIC_API_KEY is unset — the studio runs the real workflow." });
    const s = startRun(caseId);
    return json(res, 200, { sessionId: s.id });
  }

  if (url.pathname === "/api/stream" && url.searchParams.get("s")) {
    const s = sessions.get(url.searchParams.get("s")!);
    if (!s) return json(res, 404, { error: "no such session" });
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
    for (const e of s.events) res.write(`data: ${JSON.stringify(e)}\n\n`); // replay for late joiners
    if (s.finished) return res.end();
    s.clients.push(res);
    req.on("close", () => { s.clients = s.clients.filter((c) => c !== res); });
    return;
  }

  if (url.pathname === "/api/answer" && req.method === "POST") {
    const s = sessions.get(url.searchParams.get("s") ?? "");
    if (!s) return json(res, 404, { error: "no such session" });
    if (!s.pending) return json(res, 409, { error: "this run is not waiting for an answer" });
    let body = "";
    for await (const chunk of req) body += chunk;
    let answers: { sourceQuote: string; answer: string }[] | null = null;
    try { answers = JSON.parse(body).answers ?? null; } catch { return json(res, 400, { error: "bad JSON" }); }
    const { resolve } = s.pending;
    s.pending = null;
    resolve(answers);           // ← the run resumes here, and only here
    return json(res, 200, { ok: true });
  }

  res.writeHead(404); res.end("not found");
});

server.listen(PORT, () => {
  console.log(`\n  narratio studio → http://localhost:${PORT}\n`);
  console.log(`  Pick a case and press Run. The workflow streams its stages live, and`);
  console.log(`  when the adapter raises a question the run stops until you answer it.\n`);
  if (!process.env.ANTHROPIC_API_KEY) console.log(`  Note: ANTHROPIC_API_KEY is unset; runs will refuse to start.\n`);
});
