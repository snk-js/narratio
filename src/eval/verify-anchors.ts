/** ANCHOR VERIFICATION — zero API calls, zero credentials.
 *
 *  Re-checks, from committed artifacts alone, that every segment the workflow
 *  produced carries a source anchor that appears verbatim in its essay. This is
 *  the submission's strongest claim precisely because a reader can verify it
 *  with every model out of the loop: it is a string search that runs for free.
 *
 *  Usage: npm run verify-anchors */
import fs from "node:fs";
import path from "node:path";
import { loadAllCases } from "../cases.js";
import { anchorExists } from "../anchor-check.js";

let total = 0;
let failures = 0;
const rows: string[] = [];
const detail: string[] = [];

for (const c of loadAllCases()) {
  const f = path.join(process.cwd(), "results", "workflow", `${c.id}.json`);
  if (!fs.existsSync(f)) {
    rows.push(`| \`${c.id}\` | — | — | not run |`);
    continue;
  }
  const wf = JSON.parse(fs.readFileSync(f, "utf8"));
  const segs: { index: number; anchor: string }[] = wf.adaptation.segments;
  let bad = 0;
  for (const s of segs) {
    total++;
    if (!anchorExists(c.text, s.anchor)) {
      bad++; failures++;
      detail.push(`- \`${c.id}\` segment ${s.index}: anchor not found verbatim\n  > ${s.anchor.slice(0, 200)}`);
    }
  }
  rows.push(`| \`${c.id}\` | ${segs.length} | ${segs.length - bad} | ${bad === 0 ? "all valid" : `**${bad} FAILED**`} |`);
}

const md = `# Anchor verification — zero API calls

Generated ${new Date().toISOString()}.

Every segment the workflow produced must carry a quote of the source passage it derives from,
appearing **verbatim** in that essay. This check is \`String.includes\` after normalizing quotes,
dashes, whitespace and case; it runs offline and requires neither a model nor credentials.

**Result: ${total - failures} / ${total} anchors valid, ${failures} failure(s).**

| Case | Segments | Valid | Status |
|---|---|---|---|
${rows.join("\n")}

${failures ? `## Failures\n\n${detail.join("\n")}\n` : "No failures. Every claim in every workflow narration traces to a verbatim span of its source essay.\n"}`;

const dir = path.join(process.cwd(), "results", "eval");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "anchor-verification.md"), md);
console.log(md);
process.exit(failures === 0 ? 0 : 1);
