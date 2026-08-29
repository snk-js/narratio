/** REPEAT SCORING — zero API calls.
 *
 *  Reads every `results/<arm>/<id>.runN.json` produced by the repeat harness and
 *  reports, per case and per arm, in how many runs the author's claim survived.
 *  Uses the same deterministic markers as `trap-check`, including the same
 *  self-validation: a corrupt marker occurring in its own source essay is
 *  disqualified, because it would fire on a faithful quotation.
 *
 *  Usage: npm run repeat:score */
import fs from "node:fs";
import path from "node:path";
import { loadAllCases, saveResult } from "../cases.js";
import { normalize } from "../anchor-check.js";

type Verdict = "faithful" | "CORRUPTED" | "indeterminate";

function verdictFor(text: string, chk: { faithful: string[]; corrupt: string[] }): Verdict {
  const hay = normalize(text);
  if (chk.corrupt.some((s) => hay.includes(normalize(s)))) return "CORRUPTED";
  if (chk.faithful.some((s) => hay.includes(normalize(s)))) return "faithful";
  return "indeterminate";
}

function armText(arm: "baseline" | "workflow", file: string): string | null {
  const p = path.join(process.cwd(), "results", arm, file);
  if (!fs.existsSync(p)) return null;
  const d = JSON.parse(fs.readFileSync(p, "utf8"));
  return arm === "baseline"
    ? (d.narration as string)
    : (d.adaptation.segments as any[]).map((s) => s.narration).join("\n\n");
}

interface CaseStat {
  caseId: string;
  caseClass: string;
  sentence: string;
  runs: Record<"baseline" | "workflow", { faithful: number; corrupted: number; indeterminate: number; total: number }>;
}

const stats: CaseStat[] = [];
const disqualified: string[] = [];

for (const c of loadAllCases()) {
  const chk = c.traps?.mechanicalCheck;
  if (!chk) continue;

  const hayEssay = normalize(c.text);
  const selfMatching = chk.corrupt.filter((m) => hayEssay.includes(normalize(m)));
  if (selfMatching.length) {
    disqualified.push(`\`${c.id}\`: ${selfMatching.map((m) => `\`${m}\``).join(", ")}`);
    chk.corrupt = chk.corrupt.filter((m) => !hayEssay.includes(normalize(m)));
  }

  const stat: CaseStat = {
    caseId: c.id,
    caseClass: c.caseClass ?? "clean",
    sentence: chk.sentence,
    runs: {
      baseline: { faithful: 0, corrupted: 0, indeterminate: 0, total: 0 },
      workflow: { faithful: 0, corrupted: 0, indeterminate: 0, total: 0 },
    },
  };

  for (const arm of ["baseline", "workflow"] as const) {
    const dir = path.join(process.cwd(), "results", arm);
    if (!fs.existsSync(dir)) continue;
    // Every sample of this case: the canonical run plus every tagged repeat.
    const files = fs.readdirSync(dir).filter((f) => f === `${c.id}.json` || f.startsWith(`${c.id}.run`));
    for (const f of files) {
      const text = armText(arm, f);
      if (text === null) continue;
      const v = verdictFor(text, chk);
      stat.runs[arm].total++;
      if (v === "CORRUPTED") stat.runs[arm].corrupted++;
      else if (v === "faithful") stat.runs[arm].faithful++;
      else stat.runs[arm].indeterminate++;
    }
  }
  stats.push(stat);
}

const totalRuns = (arm: "baseline" | "workflow") => stats.reduce((n, s) => n + s.runs[arm].total, 0);
const totalCorrupt = (arm: "baseline" | "workflow") => stats.reduce((n, s) => n + s.runs[arm].corrupted, 0);

const rate = (x: { corrupted: number; total: number }) =>
  x.total === 0 ? "—" : `${x.corrupted}/${x.total}` + (x.total > 1 ? ` (${Math.round((100 * x.corrupted) / x.total)}%)` : "");

const md = `# Repeat-run reliability — judge-free

Generated ${new Date().toISOString()}. **Zero API calls.** Scores every committed sample of each
trap case, using the same deterministic markers as \`trap-check\`.

A single sample per arm shows that a corruption *can* happen. Repeat sampling shows how *reliably*
it happens, which is the claim a reader actually needs. Each cell below is the number of runs in
which that arm corrupted the author's claim on that case.

${disqualified.length ? `> **Disqualified markers** (present in their own source essay, so they would fire on a faithful quotation): ${disqualified.join("; ")}\n` : ""}
| Case | Class | Trap sentence | Baseline corrupted | Workflow corrupted |
|---|---|---|---|---|
${stats
  .map(
    (s) =>
      `| \`${s.caseId}\` | ${s.caseClass} | ${s.sentence.slice(0, 48)}${s.sentence.length > 48 ? "…" : ""} | **${rate(s.runs.baseline)}** | ${rate(s.runs.workflow)} |`,
  )
  .join("\n")}

## Pooled

| | Baseline | Workflow |
|---|---|---|
| Samples scored | ${totalRuns("baseline")} | ${totalRuns("workflow")} |
| **Source claim corrupted** | **${totalCorrupt("baseline")} (${totalRuns("baseline") ? Math.round((100 * totalCorrupt("baseline")) / totalRuns("baseline")) : 0}%)** | **${totalCorrupt("workflow")} (${totalRuns("workflow") ? Math.round((100 * totalCorrupt("workflow")) / totalRuns("workflow")) : 0}%)** |

## Per-case detail

${stats
  .map(
    (s) => `### \`${s.caseId}\`

**Trap sentence:** ${s.sentence}

| Arm | Faithful | Corrupted | Indeterminate | Samples |
|---|---|---|---|---|
| baseline | ${s.runs.baseline.faithful} | ${s.runs.baseline.corrupted} | ${s.runs.baseline.indeterminate} | ${s.runs.baseline.total} |
| workflow | ${s.runs.workflow.faithful} | ${s.runs.workflow.corrupted} | ${s.runs.workflow.indeterminate} | ${s.runs.workflow.total} |
`,
  )
  .join("\n")}`;

saveResult("eval", "repeat-reliability.json", { ranAt: new Date().toISOString(), stats });
fs.writeFileSync(path.join(process.cwd(), "results", "eval", "repeat-reliability.md"), md);
console.log(md);
