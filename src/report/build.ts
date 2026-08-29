/** REVIEW REPORT — a self-contained HTML page built from committed results.
 *
 *  Zero API calls, zero dependencies, no server. Writes results/report.html,
 *  which opens over file:// and works offline, so a judge can inspect every
 *  claim without credentials. See docs/UI.md for the design rationale.
 *
 *  Usage: npm run report */
import fs from "node:fs";
import path from "node:path";
import { loadAllCases } from "../cases.js";
import { anchorExists, normalize } from "../anchor-check.js";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function readJson(p: string): any | null {
  const f = path.join(process.cwd(), p);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null;
}

/** Verdicts the judge recorded for one arm, recovered from the trajectory log. */
function judgeVerdicts(caseId: string, label: string): Map<number, { supported: boolean; reason: string }> {
  const out = new Map<number, { supported: boolean; reason: string }>();
  const f = path.join(process.cwd(), "trajectories", "raw", `${caseId}.judge.jsonl`);
  if (!fs.existsSync(f)) return out;
  for (const line of fs.readFileSync(f, "utf8").trim().split("\n")) {
    let rec: any;
    try { rec = JSON.parse(line); } catch { continue; }
    if (rec.step !== label) continue;
    const text = (Array.isArray(rec.response) ? rec.response : [])
      .filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
    try {
      for (const v of JSON.parse(text).verdicts) out.set(v.index, { supported: v.supported, reason: v.reason });
    } catch { /* keep whatever parsed */ }
  }
  return out;
}

/** Highlight one anchor inside the essay, matching on normalized text so
 *  typographic variance never breaks the highlight. */
function essayWithAnchor(text: string, anchor: string | null): string {
  if (!anchor) return esc(text);
  const nText = normalize(text);
  const nAnchor = normalize(anchor);
  const at = nText.indexOf(nAnchor);
  if (at < 0) return esc(text);
  // Walk the raw string, counting normalized characters, to map the span back.
  let seen = 0, start = -1, end = -1, prevSpace = false;
  for (let i = 0; i <= text.length; i++) {
    if (seen === at && start < 0) start = i;
    if (seen === at + nAnchor.length && end < 0) { end = i; break; }
    const ch = text[i];
    if (ch === undefined) break;
    const isSpace = /\s/.test(ch);
    if (isSpace && prevSpace) continue;
    prevSpace = isSpace;
    seen++;
  }
  if (start < 0) return esc(text);
  if (end < 0) end = text.length;
  return esc(text.slice(0, start)) + `<mark>${esc(text.slice(start, end))}</mark>` + esc(text.slice(end));
}

const trapCheck = readJson("results/eval/trap-check.json");
const anchorsDoc = readJson("results/eval/repeat-reliability.json");
const cases = loadAllCases();

interface Pane { id: string; title: string; html: string; verified: number; flagged: number; questions: number }
const panes: Pane[] = [];

for (const c of cases) {
  const wf = readJson(`results/workflow/${c.id}.json`);
  const base = readJson(`results/baseline/${c.id}.json`);
  if (!wf) continue;

  const segs: any[] = wf.adaptation.segments;
  const anchorsOk: boolean[] = wf.anchorsOk ?? segs.map((s) => anchorExists(c.text, s.anchor));
  const verdicts = judgeVerdicts(c.id, "B");
  const critic = new Map<number, any>(
    (wf.verifierReport?.verdicts ?? []).map((v: any) => [v.index, v]),
  );
  const escalations: any[] = wf.escalationsForHuman ?? [];

  let verified = 0, flagged = 0;
  const segHtml = segs.map((s, i) => {
    const okAnchor = anchorsOk[i] !== false;
    const cv = critic.get(s.index);
    const jv = verdicts.get(s.index);
    const bad = !okAnchor || (cv && cv.mustRevise) || (jv && !jv.supported);
    bad ? flagged++ : verified++;
    const notes: string[] = [];
    if (!okAnchor) notes.push(`<div class="why"><b>Anchor missing.</b> This quote was absent from the essay — mechanical check.</div>`);
    if (cv && cv.mustRevise) notes.push(`<div class="why"><b>Critic: ${esc(cv.support)}.</b> ${esc(cv.explanation)}</div>`);
    if (jv && !jv.supported) notes.push(`<div class="why"><b>Judge: unsupported.</b> ${esc(jv.reason)}</div>`);
    if (s.note) notes.push(`<div class="note">Adapter note: ${esc(s.note)}</div>`);
    return `<div class="seg ${bad ? "flag" : "ok"}" data-anchor="${esc(s.anchor)}" tabindex="0">
      <div class="seg-h"><span class="num">${s.index}</span><span class="tag">${bad ? "needs you" : "verified"}</span></div>
      <p>${esc(s.narration)}</p>
      <details><summary>source anchor</summary><blockquote>${esc(s.anchor)}</blockquote></details>
      ${notes.join("")}
    </div>`;
  }).join("\n");

  const escHtml = escalations.map((e) => `<div class="esc">
      <div class="esc-h">Question — blocks approval</div>
      <blockquote>${esc(e.sourceQuote)}</blockquote>
      <ol>${(e.readings ?? []).map((r: string) => `<li>${esc(r)}</li>`).join("")}</ol>
      <p class="q">${esc(e.question)}</p>
    </div>`).join("\n");

  // Trap comparison: the one sentence, both arms, side by side.
  const tc = trapCheck?.rows?.find((r: any) => r.caseId === c.id);
  let trapHtml = "";
  if (tc) {
    const cell = (v: any) => v ? (v.verdict === "CORRUPTED"
      ? `<span class="bad">CORRUPTED</span> <code>${esc(v.hits[0] ?? "")}</code>`
      : v.verdict === "faithful" ? `<span class="good">faithful</span> <code>${esc(v.hits[0] ?? "")}</code>`
      : "indeterminate") : "— not run";
    trapHtml = `<div class="trap">
      <b>Trap sentence:</b> <em>${esc(tc.sentence)}</em>
      <table><tr><th>baseline</th><td>${cell(tc.baseline)}</td></tr>
      <tr><th>workflow</th><td>${cell(tc.workflow)}</td></tr></table>
      <div class="why">${esc(tc.note)}</div></div>`;
  }

  panes.push({
    id: c.id, title: c.title, verified, flagged, questions: escalations.length,
    html: `<div class="banner"><b>${esc(c.id)}</b> · ${esc(c.title)} · <span class="cc">${c.caseClass ?? "clean"}</span>
        <span class="counts">${verified} verified · ${flagged} need you · ${escalations.length} question(s)</span></div>
      ${trapHtml}${escHtml}
      <div class="panes">
        <section class="essay"><h3>Source essay</h3><div class="etext" id="e-${c.id}">${esc(c.text)}</div></section>
        <section class="narr"><h3>Narration${base ? ` <small>(baseline available for comparison)</small>` : ""}</h3>${segHtml}</section>
      </div>`,
  });
}

const tcTotals = trapCheck ? {
  bCorrupt: trapCheck.rows.filter((r: any) => r.baseline?.verdict === "CORRUPTED").length,
  wCorrupt: trapCheck.rows.filter((r: any) => r.workflow?.verdict === "CORRUPTED").length,
  n: trapCheck.rows.filter((r: any) => r.baseline).length,
} : null;

const overview = `<div class="banner"><b>Overview</b><span class="counts">${panes.length} cases</span></div>
  <div class="head">
    <h2>Does the narration still say what the author wrote?</h2>
    ${tcTotals ? `<table class="big"><tr><th></th><th>Baseline</th><th>Workflow</th></tr>
      <tr><th>Source claim corrupted</th><td class="bad">${tcTotals.bCorrupt} / ${tcTotals.n}</td><td class="good">${tcTotals.wCorrupt} / ${tcTotals.n}</td></tr></table>` : ""}
    <p>Every verdict on this page is derived from committed files. The trap results and anchor
    validity are string comparisons with no model involved, reproducible offline with
    <code>npm run trap-check</code> and <code>npm run verify-anchors</code>.</p>
  </div>
  <table class="idx"><tr><th>Case</th><th>Class</th><th>Verified</th><th>Needs you</th><th>Questions</th></tr>
  ${panes.map((p) => `<tr><td><a href="#" data-go="${p.id}">${p.id}</a> ${esc(p.title)}</td>
    <td>${esc(cases.find((c) => c.id === p.id)?.caseClass ?? "clean")}</td>
    <td>${p.verified}</td><td>${p.flagged ? `<b>${p.flagged}</b>` : "0"}</td><td>${p.questions}</td></tr>`).join("")}
  </table>`;

const html = `<!doctype html><meta charset="utf-8"><title>narratio — review</title>
<style>
:root{--bg:#fbfbfa;--fg:#22201d;--mut:#6b6660;--line:#e2ded8;--ok:#3f7d3f;--warn:#b8860b;--bad:#a5453f;--mark:#fdf0c8}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);
font:15px/1.6 ui-serif,Georgia,serif;-webkit-text-size-adjust:100%}
nav{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);padding:8px 16px;
display:flex;gap:6px;flex-wrap:wrap;z-index:5}
nav button{font:600 12px/1 ui-sans-serif,system-ui;padding:6px 10px;border:1px solid var(--line);
background:#fff;border-radius:5px;cursor:pointer;color:var(--fg)}
nav button[aria-current=true]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
main{max-width:1180px;margin:0 auto;padding:16px}
.banner{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:baseline;
padding:10px 12px;background:#fff;border:1px solid var(--line);border-radius:6px;margin-bottom:14px}
.counts,.cc{font:600 12px/1 ui-sans-serif,system-ui;color:var(--mut)}
.panes{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:900px){.panes{grid-template-columns:1fr}}
section{background:#fff;border:1px solid var(--line);border-radius:6px;padding:14px;min-width:0}
h2{font-size:20px;margin:.2em 0 .5em}h3{font:600 12px/1 ui-sans-serif,system-ui;letter-spacing:.08em;
text-transform:uppercase;color:var(--mut);margin:0 0 10px}
.etext{white-space:pre-wrap;max-height:70vh;overflow:auto}
mark{background:var(--mark);padding:1px 0}
.seg{border-left:3px solid var(--line);padding:6px 0 6px 10px;margin-bottom:10px;cursor:pointer}
.seg:focus{outline:2px solid #9bb; outline-offset:2px}
.seg p{margin:.2em 0}
.seg.ok{border-left-color:var(--ok)}.seg.ok p{color:var(--mut)}
.seg.flag{border-left-color:var(--warn);background:#fffdf6}
.seg-h{display:flex;gap:8px;align-items:center;font:600 11px/1 ui-sans-serif,system-ui;color:var(--mut)}
.num{background:var(--line);border-radius:3px;padding:2px 5px}
.tag{text-transform:uppercase;letter-spacing:.06em}
.seg.flag .tag{color:var(--warn)}
details{font:13px/1.5 ui-sans-serif,system-ui;color:var(--mut);margin-top:4px}
blockquote{margin:6px 0;padding-left:10px;border-left:2px solid var(--line);color:var(--mut)}
.why,.note{font:13px/1.5 ui-sans-serif,system-ui;margin-top:6px;padding:6px 8px;border-radius:4px;background:#f6f3ec}
.esc{background:#fff;border:1px solid var(--bad);border-left-width:4px;border-radius:6px;padding:12px;margin-bottom:14px}
.esc-h{font:700 11px/1 ui-sans-serif,system-ui;text-transform:uppercase;letter-spacing:.08em;color:var(--bad)}
.esc ol{margin:8px 0;padding-left:20px}.q{font-weight:600}
.trap{background:#fff;border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:14px}
table{border-collapse:collapse;font:14px/1.5 ui-sans-serif,system-ui}
table.big{margin:10px 0;font-size:15px}table.idx{width:100%;margin-top:12px;background:#fff}
th,td{border:1px solid var(--line);padding:6px 10px;text-align:left}
.good{color:var(--ok);font-weight:700}.bad{color:var(--bad);font-weight:700}
code{font:12px/1 ui-monospace,monospace;background:#f2efe9;padding:2px 4px;border-radius:3px}
.head{background:#fff;border:1px solid var(--line);border-radius:6px;padding:14px}
</style>
<nav id="nav"></nav><main id="main"></main>
<script>
const PANES = ${JSON.stringify([{ id: "__overview", title: "Overview", html: overview }, ...panes.map((p) => ({ id: p.id, title: p.title, html: p.html }))])};
const nav = document.getElementById('nav'), main = document.getElementById('main');
function show(id){
  const p = PANES.find(x => x.id === id) || PANES[0];
  main.innerHTML = p.html;
  [...nav.children].forEach(b => b.setAttribute('aria-current', String(b.dataset.id === p.id)));
  main.querySelectorAll('.seg').forEach(seg => {
    const pick = () => {
      const box = main.querySelector('.etext'); if (!box) return;
      main.querySelectorAll('.seg').forEach(s => s.style.background = '');
      seg.style.background = '#f4f1ea';
      box.innerHTML = highlight(box.dataset.raw || (box.dataset.raw = box.textContent), seg.dataset.anchor);
      const m = box.querySelector('mark'); if (m) m.scrollIntoView({block:'center', behavior:'smooth'});
    };
    seg.addEventListener('click', pick);
    seg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
  main.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); show(a.dataset.go); }));
}
const norm = s => s.replace(/[‘’‚′]/g,"'").replace(/[“”„″]/g,'"').replace(/[–—−]/g,'-').replace(/\\s+/g,' ').trim().toLowerCase();
function highlight(text, anchor){
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  if (!anchor) return esc(text);
  const nt = norm(text), na = norm(anchor), at = nt.indexOf(na);
  if (at < 0) return esc(text);
  let seen = 0, start = -1, end = -1, prevSpace = false;
  for (let i = 0; i <= text.length; i++){
    if (seen === at && start < 0) start = i;
    if (seen === at + na.length && end < 0) { end = i; break; }
    const ch = text[i]; if (ch === undefined) break;
    const isSpace = /\\s/.test(ch);
    if (isSpace && prevSpace) continue;
    prevSpace = isSpace; seen++;
  }
  if (start < 0) return esc(text);
  if (end < 0) end = text.length;
  return esc(text.slice(0,start)) + '<mark>' + esc(text.slice(start,end)) + '</mark>' + esc(text.slice(end));
}
PANES.forEach(p => { const b = document.createElement('button'); b.textContent = p.id === '__overview' ? 'Overview' : p.id;
  b.dataset.id = p.id; b.onclick = () => show(p.id); nav.append(b); });
show('__overview');
</script>`;

const out = path.join(process.cwd(), "results", "report.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Wrote results/report.html — ${panes.length} case(s). Open it directly in a browser; no server needed.`);
