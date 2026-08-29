/** JUDGE HAND-AUDIT (deterministic, zero API calls).
 *
 *  The judge runs on the same model family as the arms it scores, so its
 *  verdicts — especially the 0.0% clean-case rate — need a human read before
 *  they are cited as evidence. This samples segments across cases and arms,
 *  emits a worksheet with the source essay and the judge's verdict, and leaves
 *  a blank for the human verdict.
 *
 *  Usage:  npx tsx src/eval/audit-sample.ts [n=15] [seed=1]
 *  Then:   fill in AGREE/DISAGREE in results/audit/worksheet.md
 *  Then:   npx tsx src/eval/audit-score.ts   (computes agreement rate) */
import fs from "node:fs";
import path from "node:path";
import { loadAllCases } from "../cases.js";

const N = Number(process.argv[2] ?? 15);
const SEED = Number(process.argv[3] ?? 1);

/** Deterministic PRNG so the sample is reproducible from the seed alone. */
function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);

function readJson(p: string): any | null {
  const f = path.join(process.cwd(), p);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null;
}

/** Recover the judge's per-segment verdicts from the raw trajectory log. */
function judgeVerdicts(caseId: string, blindLabel: string): { index: number; supported: boolean; reason: string }[] {
  const f = path.join(process.cwd(), "trajectories", "raw", `${caseId}.judge.jsonl`);
  if (!fs.existsSync(f)) return [];
  for (const line of fs.readFileSync(f, "utf8").trim().split("\n")) {
    const rec = JSON.parse(line);
    if (rec.step !== blindLabel) continue;
    const text = (Array.isArray(rec.response) ? rec.response : [])
      .filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
    try { return JSON.parse(text).verdicts; } catch { /* fall through */ }
  }
  return [];
}

interface Item {
  caseId: string; caseClass: string; arm: string; index: number;
  narration: string; anchor?: string; supported: boolean; reason: string;
}

const pool: Item[] = [];
for (const c of loadAllCases()) {
  const base = readJson(`results/baseline/${c.id}.json`);
  const wf = readJson(`results/workflow/${c.id}.json`);
  if (base) {
    const segs = base.narration.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
    for (const [i, v] of judgeVerdicts(c.id, "A").entries()) {
      const narration = segs[v.index] ?? segs[i];
      if (narration) pool.push({ caseId: c.id, caseClass: c.caseClass ?? "clean", arm: "baseline", index: v.index, narration, supported: v.supported, reason: v.reason });
    }
  }
  if (wf) {
    for (const v of judgeVerdicts(c.id, "B")) {
      const seg = wf.adaptation.segments.find((s: any) => s.index === v.index);
      if (seg) pool.push({ caseId: c.id, caseClass: c.caseClass ?? "clean", arm: "workflow", index: v.index, narration: seg.narration, anchor: seg.anchor, supported: v.supported, reason: v.reason });
    }
  }
}

if (pool.length === 0) {
  console.error("No judged segments found. Run the arms and `npm run eval` first.");
  process.exit(1);
}

// Stratify: always include every segment the judge FLAGGED (they carry the claim),
// then fill the rest with a random sample of segments it PASSED (they are what
// needs auditing for leniency).
const flagged = pool.filter((p) => !p.supported);
const passed = pool.filter((p) => p.supported);
for (let i = passed.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [passed[i], passed[j]] = [passed[j]!, passed[i]!];
}
const sample = [...flagged, ...passed.slice(0, Math.max(0, N - flagged.length))];

const essays = new Map(loadAllCases().map((c) => [c.id, c]));
let md = `# Judge hand-audit worksheet

Sample of **${sample.length}** segments (seed ${SEED}), drawn from ${pool.length} judged segments.
All ${flagged.length} judge-flagged segment(s) are included by construction; the remainder is a
random sample of segments the judge PASSED — those are what must be checked for leniency,
since the judge shares a model family with the arms it scores.

**How to fill this in:** for each item, read the source essay excerpt, then the narration, then
decide *independently* whether every claim in the narration is supported by the essay. Write
\`HUMAN: supported\` or \`HUMAN: unsupported\` on the marked line. Do not read the judge's reason
until after you have decided — it is placed below the answer line for that purpose.

Then run \`npx tsx src/eval/audit-score.ts\`.

`;

for (const [n, item] of sample.entries()) {
  const c = essays.get(item.caseId)!;
  md += `---\n\n## ${n + 1}. \`${item.caseId}\` (${item.caseClass}) — ${item.arm}, segment ${item.index}\n\n`;
  md += `### Narration\n\n> ${item.narration.replace(/\n/g, "\n> ")}\n\n`;
  if (item.anchor) md += `### Claimed anchor\n\n> ${item.anchor.replace(/\n/g, "\n> ")}\n\n`;
  md += `### Your verdict\n\n\`HUMAN: \`  ← write \`supported\` or \`unsupported\`\n\n`;
  md += `<details><summary>Judge said (open only after deciding)</summary>\n\n`;
  md += `**${item.supported ? "supported" : "UNSUPPORTED"}** — ${item.reason}\n\n</details>\n\n`;
}

md += `---\n\n## Source essays (reference)\n\n`;
for (const id of [...new Set(sample.map((s) => s.caseId))]) {
  const c = essays.get(id)!;
  md += `### \`${id}\` — ${c.title}\n\n\`\`\`\n${c.text}\n\`\`\`\n\n`;
}

const dir = path.join(process.cwd(), "results", "audit");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "worksheet.md"), md);
fs.writeFileSync(path.join(dir, "sample.json"), JSON.stringify({ seed: SEED, n: sample.length, pool: pool.length, sample }, null, 2));
console.log(`Wrote results/audit/worksheet.md — ${sample.length} items (${flagged.length} flagged, ${sample.length - flagged.length} passed).`);
console.log("Fill in the HUMAN: lines, then run: npx tsx src/eval/audit-score.ts");
