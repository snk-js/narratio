/** Scores the filled-in judge hand-audit worksheet. Zero API calls.
 *  Usage: npx tsx src/eval/audit-score.ts */
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "results", "audit");
const sample = JSON.parse(fs.readFileSync(path.join(dir, "sample.json"), "utf8"));
const worksheet = fs.readFileSync(path.join(dir, "worksheet.md"), "utf8");

// One `HUMAN: <verdict>` line per item, in worksheet order.
const answers = [...worksheet.matchAll(/`HUMAN:\s*(supported|unsupported)?\s*`/gi)].map((m) =>
  m[1] ? m[1].toLowerCase() : null,
);

const items: any[] = sample.sample;
if (answers.length !== items.length) {
  console.error(`Found ${answers.length} HUMAN: lines but ${items.length} items — worksheet may be edited out of shape.`);
}

let agree = 0, disagree = 0, blank = 0;
const disagreements: string[] = [];
const rows: any[] = [];

items.forEach((item, i) => {
  const human = answers[i];
  if (!human) { blank++; return; }
  const humanSupported = human === "supported";
  const match = humanSupported === item.supported;
  match ? agree++ : disagree++;
  rows.push({ ...item, human, agreed: match });
  if (!match) {
    disagreements.push(
      `- \`${item.caseId}\` (${item.caseClass}) ${item.arm} seg ${item.index}: judge said **${item.supported ? "supported" : "unsupported"}**, human said **${human}**\n  - narration: ${item.narration.slice(0, 200)}\n  - judge reason: ${item.reason}`,
    );
  }
});

const scored = agree + disagree;
const rate = scored ? agree / scored : 0;
// A lenient judge shows up specifically as: judge said supported, human said unsupported.
const falsePasses = rows.filter((r) => !r.agreed && r.supported).length;
const falseFlags = rows.filter((r) => !r.agreed && !r.supported).length;

const md = `# Judge hand-audit result

Sample seed ${sample.seed}. **${scored}** segments scored${blank ? ` (${blank} left blank)` : ""}.

| Metric | Value |
|---|---|
| Human–judge agreement | **${(100 * rate).toFixed(1)}%** (${agree}/${scored}) |
| Judge passed, human failed (**leniency**) | ${falsePasses} |
| Judge flagged, human passed (**over-strictness**) | ${falseFlags} |

${
  falsePasses === 0
    ? "> No leniency found in this sample: the judge did not pass anything the human auditor failed. The reported unsupported-claim rates are not inflated by same-family circularity in the segments checked."
    : `> **${falsePasses} leniency error(s) found.** The reported unsupported-claim rate is therefore a *lower bound* — the true rate is at least this high in both arms. This must be stated wherever the metric is cited.`
}

${disagreements.length ? `## Disagreements\n\n${disagreements.join("\n\n")}\n` : "## Disagreements\n\nNone.\n"}
`;

fs.writeFileSync(path.join(dir, "result.md"), md);
fs.writeFileSync(path.join(dir, "result.json"), JSON.stringify({ seed: sample.seed, scored, blank, agree, disagree, rate, falsePasses, falseFlags, rows }, null, 2));
console.log(md);
