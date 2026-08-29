/** MECHANICAL TRAP CHECK — the judge-free fidelity metric.
 *
 *  Zero API calls. Reads the committed arm outputs and asks one deterministic
 *  question per trap case: on the single sentence the trap turns on, did the
 *  narration carry the author's claim, or corrupt it?
 *
 *  Why this exists: on 2026-08-29 the LLM judge returned opposite verdicts on
 *  byte-identical text after `thinking: adaptive` was enabled — it accepted a
 *  polarity inversion (`mais` -> `menos`) that it had correctly flagged an hour
 *  earlier. A metric that can flip without the artifact changing cannot carry a
 *  claim. This one cannot flip: it is `String.includes` over committed files,
 *  and any reader can rerun it for free.
 *
 *  Usage: npm run trap-check */
import fs from "node:fs";
import path from "node:path";
import { loadAllCases, saveResult } from "../cases.js";
import { normalize } from "../anchor-check.js";

type Verdict = "faithful" | "CORRUPTED" | "indeterminate";

function readArm(arm: "baseline" | "workflow", caseId: string): { text: string } | null {
  const f = path.join(process.cwd(), "results", arm, `${caseId}.json`);
  if (!fs.existsSync(f)) return null;
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  const text =
    arm === "baseline"
      ? (d.narration as string)
      : (d.adaptation.segments as any[]).map((s) => s.narration).join("\n\n");
  return { text };
}

function judgeText(text: string, chk: { faithful: string[]; corrupt: string[] }): { verdict: Verdict; hits: string[] } {
  const hay = normalize(text);
  const corrupt = chk.corrupt.filter((s) => hay.includes(normalize(s)));
  const faithful = chk.faithful.filter((s) => hay.includes(normalize(s)));
  if (corrupt.length) return { verdict: "CORRUPTED", hits: corrupt };
  if (faithful.length) return { verdict: "faithful", hits: faithful };
  return { verdict: "indeterminate", hits: [] };
}

interface Row {
  caseId: string; caseClass: string; sentence: string; note: string;
  baseline: { verdict: Verdict; hits: string[] } | null;
  workflow: { verdict: Verdict; hits: string[] } | null;
}

const rows: Row[] = [];
for (const c of loadAllCases()) {
  const chk = c.traps?.mechanicalCheck;
  if (!chk) continue;
  const b = readArm("baseline", c.id);
  const w = readArm("workflow", c.id);
  rows.push({
    caseId: c.id,
    caseClass: c.caseClass ?? "clean",
    sentence: chk.sentence,
    note: chk.note,
    baseline: b ? judgeText(b.text, chk) : null,
    workflow: w ? judgeText(w.text, chk) : null,
  });
}

if (rows.length === 0) {
  console.error("No cases carry traps.mechanicalCheck.");
  process.exit(1);
}

const count = (arm: "baseline" | "workflow", v: Verdict) =>
  rows.filter((r) => r[arm]?.verdict === v).length;
const scored = (arm: "baseline" | "workflow") => rows.filter((r) => r[arm] !== null).length;

const mark = (x: { verdict: Verdict; hits: string[] } | null) =>
  !x ? "— not run" : x.verdict === "CORRUPTED" ? `**CORRUPTED** (\`${x.hits[0]}\`)` : x.verdict === "faithful" ? `faithful (\`${x.hits[0]}\`)` : "indeterminate";

const md = `# Mechanical trap check — judge-free

Generated ${new Date().toISOString()}. **Zero API calls.** Every verdict below is \`String.includes\`
over committed result files, after normalizing quotes/dashes/whitespace/case. Anyone can rerun it
with \`npm run trap-check\` and no credentials.

This metric exists because our LLM judge is not stable: on 2026-08-29 it returned opposite verdicts
on byte-identical text once \`thinking: adaptive\` was enabled, accepting a polarity inversion it had
flagged correctly an hour before. A number that moves while the artifact stands still cannot carry a
claim. This one is reproducible by construction.

| Case | Class | Trap sentence | Baseline | Workflow |
|---|---|---|---|---|
${rows.map((r) => `| \`${r.caseId}\` | ${r.caseClass} | ${r.sentence.slice(0, 60)}${r.sentence.length > 60 ? "…" : ""} | ${mark(r.baseline)} | ${mark(r.workflow)} |`).join("\n")}

## Totals

| | Baseline | Workflow |
|---|---|---|
| Source claim **corrupted** | **${count("baseline", "CORRUPTED")} / ${scored("baseline")}** | **${count("workflow", "CORRUPTED")} / ${scored("workflow")}** |
| Source claim carried faithfully | ${count("baseline", "faithful")} | ${count("workflow", "faithful")} |
| Indeterminate (sentence not clearly rendered either way) | ${count("baseline", "indeterminate")} | ${count("workflow", "indeterminate")} |

*Indeterminate* means neither a faithful nor a corrupt marker appeared — the narration paraphrased
around the sentence. It is not scored as a pass; it is reported so the reader can inspect the case.

## Per-case detail

${rows.map((r) => `### \`${r.caseId}\` — ${r.caseClass}

**Trap sentence:** ${r.sentence}

**Why it matters:** ${r.note}

- **Baseline:** ${mark(r.baseline)}
- **Workflow:** ${mark(r.workflow)}
`).join("\n")}`;

saveResult("eval", "trap-check.json", { ranAt: new Date().toISOString(), rows });
fs.writeFileSync(path.join(process.cwd(), "results", "eval", "trap-check.md"), md);
console.log(md);
