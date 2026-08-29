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
import { client, MODEL, TARGET_LANG, languageDirective, loadPrompt, logTrajectory, addUsage, newTotals } from "../client.js";
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
    thinking: { type: "adaptive" as const },
    system: loadPrompt("judge.md") + languageDirective("critic"),
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
  caseClass: "natural" | "adversarial" | "clean";
  arm: string;
  segments: number;
  judgedUnsupported: number;
  anchorFails: number | null;
  unsupportedRate: number;
  escalation: "no-channel" | "escalated-on-trap" | "missed-escalation" | "preserve-audit" | "no-trap";
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

  // Ambiguity-trap mode decides the success criterion (see EssayCase.traps.ambiguity.mode).
  const ambMode = c.traps?.ambiguity ? (c.traps.ambiguity.mode ?? "escalate") : null;

  // --- baseline arm ---
  const bSegs = baselineSegments(base.narration);
  const bVerdicts = await judgeSegments(c, "A", bSegs);
  const bUnsupported = bVerdicts.filter((v) => !v.supported).length;
  rows.push({
    caseId: c.id,
    caseClass: c.caseClass ?? "clean",
    arm: "baseline",
    segments: bSegs.length,
    judgedUnsupported: bUnsupported,
    anchorFails: null,
    unsupportedRate: bSegs.length ? bUnsupported / bSegs.length : 0,
    // escalate-mode: baseline has no escalation channel — an architectural difference, never
    // scored as a failure. preserve-mode: baseline CAN preserve both readings, but preservation
    // is semantic and deferred to human audit. no ambiguity trap: no-trap.
    escalation: ambMode === "escalate" ? "no-channel" : ambMode === "preserve" ? "preserve-audit" : "no-trap",
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
  if (ambMode === "escalate") {
    const trapNorm = normalize(c.traps!.ambiguity!.quote);
    const hit = (wf.escalationsForHuman as any[]).some((e) => {
      const q = normalize(e.sourceQuote ?? "");
      return q.includes(trapNorm) || trapNorm.includes(q);
    });
    escalation = hit ? "escalated-on-trap" : "missed-escalation";
  } else if (ambMode === "preserve") {
    // Correct behavior is to carry both readings and NOT escalate; whether it did so is a
    // semantic judgment the mechanical layer can't make, so flag it for human audit.
    escalation = "preserve-audit";
  }

  rows.push({
    caseId: c.id,
    caseClass: c.caseClass ?? "clean",
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

function agg(arm: string, klass?: CaseRow["caseClass"]) {
  const a = rows.filter((r) => r.arm === arm && (!klass || r.caseClass === klass));
  const segs = a.reduce((n, r) => n + r.segments, 0);
  const unsup = a.reduce((n, r) => n + Math.round(r.unsupportedRate * r.segments), 0);
  // Escalation is only scorable where escalation is the correct behavior (escalate-mode traps).
  const escalationTraps = a.filter(
    (r) => r.escalation === "escalated-on-trap" || r.escalation === "missed-escalation",
  );
  return {
    cases: a.length,
    segments: segs,
    unsupportedRate: segs ? unsup / segs : 0,
    anchorFails: a.reduce((n, r) => n + (r.anchorFails ?? 0), 0),
    trapsEscalated: escalationTraps.filter((r) => r.escalation === "escalated-on-trap").length,
    trapsTotal: escalationTraps.length,
    preserveAudit: a.filter((r) => r.escalation === "preserve-audit").length,
    meanCostUsd: a.length ? a.reduce((n, r) => n + r.costUsd, 0) / a.length : 0,
    meanWallMs: a.length ? a.reduce((n, r) => n + r.wallMs, 0) / a.length : 0,
  };
}

const summary = {
  ranAt: new Date().toISOString(),
  model: MODEL,
  targetLang: TARGET_LANG || "(source language)",
  promptVersions: { judge: "judge.md@v1" },
  judgeUsage: judgeTotals,
  baseline: agg("baseline"),
  workflow: agg("workflow"),
  bySubset: {
    natural: { baseline: agg("baseline", "natural"), workflow: agg("workflow", "natural") },
    adversarial: { baseline: agg("baseline", "adversarial"), workflow: agg("workflow", "adversarial") },
    clean: { baseline: agg("baseline", "clean"), workflow: agg("workflow", "clean") },
  },
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
| Unflagged ambiguities escalated | n/a — no escalation channel | ${summary.workflow.trapsEscalated}/${summary.workflow.trapsTotal} |
| Preservation traps (human audit) | ${summary.baseline.preserveAudit} | ${summary.workflow.preserveAudit} |
| Mean cost / essay | $${summary.baseline.meanCostUsd.toFixed(3)} | $${summary.workflow.meanCostUsd.toFixed(3)} |
| Mean wall time / essay | ${(summary.baseline.meanWallMs / 1000).toFixed(0)}s | ${(summary.workflow.meanWallMs / 1000).toFixed(0)}s |

> Escalation is scored only on **escalate-mode** ambiguity traps (source does not flag the ambiguity). **Preserve-mode** traps — where the essay flags its own double reading and the agent must carry both — are a semantic property the mechanical layer cannot verify, so they are counted separately and deferred to human audit (the project's own escalate-to-human principle applied to its metrics).

## By case class

The corpus contains cases built *specifically* to break the baseline. Reporting one pooled number would let that design choice inflate the result, so each class is reported separately. **The clean row is the control: if the workflow only wins on cases written to make it win, the claim is worth little.**

| Case class | What it is | Baseline unsupported | Workflow unsupported | Cases |
|---|---|---|---|---|
| **natural** | trap occurs in real authored prose, discovered before the hackathon | ${pct(summary.bySubset.natural.baseline.unsupportedRate)} | ${pct(summary.bySubset.natural.workflow.unsupportedRate)} | ${summary.bySubset.natural.baseline.cases} |
| **adversarial** | built after the 2026-08-29 run to stress a known failure mechanism | ${pct(summary.bySubset.adversarial.baseline.unsupportedRate)} | ${pct(summary.bySubset.adversarial.workflow.unsupportedRate)} | ${summary.bySubset.adversarial.baseline.cases} |
| **clean** | ordinary essays, no forced-choice trap | ${pct(summary.bySubset.clean.baseline.unsupportedRate)} | ${pct(summary.bySubset.clean.workflow.unsupportedRate)} | ${summary.bySubset.clean.baseline.cases} |

## Per-case

| Case | Class | Arm | Segments | Judged unsupported | Anchor fails | Unsupported rate | Escalation | Cost |
|---|---|---|---|---|---|---|---|---|
${rows
  .map(
    (r) =>
      `| ${r.caseId} | ${r.caseClass} | ${r.arm} | ${r.segments} | ${r.judgedUnsupported} | ${r.anchorFails ?? "—"} | ${pct(r.unsupportedRate)} | ${r.escalation} | $${r.costUsd.toFixed(3)} |`,
  )
  .join("\n")}
`;
fs.writeFileSync(path.join(process.cwd(), "results", "eval", "latest.md"), md);
console.log("\n" + md);
