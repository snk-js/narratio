/** EVALUATION: judge both arms blind on the same cases, compute the headline
 *  metrics, and write results/eval/latest.{json,md}.
 *
 *  Prerequisites: `npm run baseline` and `npm run adapt` have produced
 *  results/baseline/<id>.json and results/workflow/<id>.json for each case.
 *
 *  Metrics:
 *   - unsupported-claim rate (primary): judged-unsupported segments / total
 *     (workflow additionally counts mechanically-unanchored segments as unsupported)
 *   - anchor validity (workflow only, deterministic)
 *   - escalation behavior on planted-ambiguity cases
 *   - cost and wall time per case
 *
 *  The judge never sees which arm produced a text. Usage: npm run eval */
import fs from "node:fs";
import path from "node:path";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, loadPrompt, logTrajectory, addUsage, newTotals } from "../client.js";
import { loadAllCases, saveResult } from "../cases.js";
import { normalize } from "../anchor-check.js";
import { JudgeReportSchema, type EssayCase } from "../types.js";

const judgeTotals = newTotals();

function readResult(arm: "baseline" | "workflow", caseId: string): any | null {
  const file = path.join(process.cwd(), "results", arm, `${caseId}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** Deterministic segmentation for baseline output: paragraphs. */
function baselineSegments(narration: string): string[] {
  return narration
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

async function judgeSegments(c: EssayCase, blindLabel: string, segments: string[]) {
  const numbered = segments.map((s, i) => `[${i}] ${s}`).join("\n\n");
  const request = {
    model: MODEL,
    max_tokens: 16000,
    system: loadPrompt("judge.md"),
    messages: [
      {
        role: "user" as const,
        content: `SOURCE ESSAY:\n\n${c.text}\n\n---\n\nNARRATION SEGMENTS (adaptation ${blindLabel}):\n\n${numbered}`,
      },
    ],
    output_config: { format: zodOutputFormat(JudgeReportSchema) },
  };
  const response = await client.messages.parse(request);
  logTrajectory({ agent: "judge", caseId: c.id, step: blindLabel }, request, response.content, response.usage);
  addUsage(judgeTotals, response.usage);
  if (!response.parsed_output) throw new Error(`judge ${c.id}/${blindLabel}: unparseable output`);
  return response.parsed_output.verdicts;
}

interface CaseRow {
  caseId: string;
  arm: string;
  segments: number;
  judgedUnsupported: number;
  anchorFails: number | null;
  unsupportedRate: number;
  escalation: "no-channel" | "escalated-on-trap" | "missed-trap" | "no-trap";
  costUsd: number;
  wallMs: number;
}

const rows: CaseRow[] = [];
const skipped: string[] = [];

for (const c of loadAllCases()) {
  const base = readResult("baseline", c.id);
  const wf = readResult("workflow", c.id);
  if (!base || !wf) {
    skipped.push(`${c.id} (missing ${!base ? "baseline" : ""}${!base && !wf ? "+" : ""}${!wf ? "workflow" : ""})`);
    continue;
  }

  // --- baseline arm ---
  const bSegs = baselineSegments(base.narration);
  const bVerdicts = await judgeSegments(c, "A", bSegs);
  const bUnsupported = bVerdicts.filter((v) => !v.supported).length;
  rows.push({
    caseId: c.id,
    arm: "baseline",
    segments: bSegs.length,
    judgedUnsupported: bUnsupported,
    anchorFails: null,
    unsupportedRate: bSegs.length ? bUnsupported / bSegs.length : 0,
    // Baseline cannot escalate — it has no channel for it. Reported as an
    // architectural difference, never scored as a failure to do something possible.
    escalation: c.traps?.ambiguity ? "no-channel" : "no-trap",
    costUsd: base.usage.costUsd,
    wallMs: base.usage.wallMs,
  });

  // --- workflow arm ---
  const wSegs: string[] = wf.adaptation.segments.map((s: any) => s.narration);
  const wVerdicts = await judgeSegments(c, "B", wSegs);
  const wJudgeUnsupported = wVerdicts.filter((v) => !v.supported).length;
  const anchorFails = (wf.anchorsOk as boolean[]).filter((ok) => !ok).length;
  // a segment counts once even if it fails both checks
  const failIdx = new Set<number>();
  wVerdicts.forEach((v) => { if (!v.supported) failIdx.add(v.index); });
  (wf.anchorsOk as boolean[]).forEach((ok, i) => { if (!ok) failIdx.add(wf.adaptation.segments[i]?.index ?? i); });

  let escalation: CaseRow["escalation"] = "no-trap";
  if (c.traps?.ambiguity) {
    const trapNorm = normalize(c.traps.ambiguity.quote);
    const hit = (wf.escalationsForHuman as any[]).some((e) => {
      const q = normalize(e.sourceQuote ?? "");
      return q.includes(trapNorm) || trapNorm.includes(q);
    });
    escalation = hit ? "escalated-on-trap" : "missed-trap";
  }

  rows.push({
    caseId: c.id,
    arm: "workflow",
    segments: wSegs.length,
    judgedUnsupported: wJudgeUnsupported,
    anchorFails,
    unsupportedRate: wSegs.length ? failIdx.size / wSegs.length : 0,
    escalation,
    costUsd: wf.usage.costUsd,
    wallMs: wf.usage.wallMs,
  });

  console.log(`[eval] ${c.id} judged (baseline ${bUnsupported}/${bSegs.length}, workflow ${failIdx.size}/${wSegs.length} unsupported)`);
}

function agg(arm: string) {
  const a = rows.filter((r) => r.arm === arm);
  const segs = a.reduce((n, r) => n + r.segments, 0);
  const unsup = a.reduce((n, r) => n + Math.round(r.unsupportedRate * r.segments), 0);
  const traps = a.filter((r) => r.escalation !== "no-trap" && r.escalation !== "no-channel");
  return {
    cases: a.length,
    segments: segs,
    unsupportedRate: segs ? unsup / segs : 0,
    anchorFails: a.reduce((n, r) => n + (r.anchorFails ?? 0), 0),
    trapsEscalated: traps.filter((r) => r.escalation === "escalated-on-trap").length,
    trapsTotal: traps.length,
    meanCostUsd: a.length ? a.reduce((n, r) => n + r.costUsd, 0) / a.length : 0,
    meanWallMs: a.length ? a.reduce((n, r) => n + r.wallMs, 0) / a.length : 0,
  };
}

const summary = {
  ranAt: new Date().toISOString(),
  model: MODEL,
  promptVersions: { judge: "judge.md@v1" },
  judgeUsage: judgeTotals,
  baseline: agg("baseline"),
  workflow: agg("workflow"),
  rows,
  skipped,
};

saveResult("eval", "latest.json", summary);

const pct = (x: number) => `${(100 * x).toFixed(1)}%`;
const md = `# Evaluation — ${summary.ranAt}

Model: \`${MODEL}\` (both arms and judge). Judge cost this run: $${judgeTotals.costUsd.toFixed(3)}.
${skipped.length ? `\n> Skipped (arms not run): ${skipped.join(", ")}\n` : ""}
| Metric | Baseline | Workflow |
|---|---|---|
| Cases | ${summary.baseline.cases} | ${summary.workflow.cases} |
| Segments judged | ${summary.baseline.segments} | ${summary.workflow.segments} |
| **Unsupported-claim rate** | **${pct(summary.baseline.unsupportedRate)}** | **${pct(summary.workflow.unsupportedRate)}** |
| Mechanical anchor failures | n/a | ${summary.workflow.anchorFails} |
| Ambiguities escalated | n/a — no escalation channel | ${summary.workflow.trapsEscalated}/${summary.workflow.trapsTotal} |
| Mean cost / essay | $${summary.baseline.meanCostUsd.toFixed(3)} | $${summary.workflow.meanCostUsd.toFixed(3)} |
| Mean wall time / essay | ${(summary.baseline.meanWallMs / 1000).toFixed(0)}s | ${(summary.workflow.meanWallMs / 1000).toFixed(0)}s |

## Per-case

| Case | Arm | Segments | Judged unsupported | Anchor fails | Unsupported rate | Escalation | Cost |
|---|---|---|---|---|---|---|---|
${rows
  .map(
    (r) =>
      `| ${r.caseId} | ${r.arm} | ${r.segments} | ${r.judgedUnsupported} | ${r.anchorFails ?? "—"} | ${pct(r.unsupportedRate)} | ${r.escalation} | $${r.costUsd.toFixed(3)} |`,
  )
  .join("\n")}
`;
fs.writeFileSync(path.join(process.cwd(), "results", "eval", "latest.md"), md);
console.log("\n" + md);
