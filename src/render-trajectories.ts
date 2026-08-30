/** Render raw trajectory logs (trajectories/raw/*.jsonl — every API call the
 *  system made) into readable markdown, one file per case+agent: the agent's
 *  instructions, what it produced, what feedback shaped the next step.
 *  Usage: npm run trajectories */
import fs from "node:fs";
import path from "node:path";

const RAW = path.join(process.cwd(), "trajectories", "raw");
const OUT = path.join(process.cwd(), "trajectories");

function short(s: string, n = 4000): string {
  return s.length <= n ? s : s.slice(0, n) + `\n… [${s.length - n} chars truncated — full text in raw/]`;
}

function renderContent(content: unknown): string {
  if (typeof content === "string") return short(content);
  if (Array.isArray(content)) {
    return content
      .map((b: any) => {
        if (b.type === "text") return short(b.text);
        if (b.type === "thinking") return b.thinking ? `> *(thinking)* ${short(b.thinking, 800)}` : "";
        return `\`[${b.type} block]\``;
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return short(JSON.stringify(content, null, 2));
}

if (!fs.existsSync(RAW)) {
  console.error("No raw trajectories yet — run the arms first.");
  process.exit(1);
}

for (const file of fs.readdirSync(RAW).filter((f) => f.endsWith(".jsonl")).sort()) {
  const records = fs
    .readFileSync(path.join(RAW, file), "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
  const name = file.replace(/\.jsonl$/, "");
  const [caseId, agent] = name.split(".");

  const steps: string[] = records.map((r: any) => String(r.step));
  const revised = steps.filter((s) => s.startsWith("revise")).length;
  const resolved = steps.some((s) => s === "resolve");

  let md = `# Trajectory — case \`${caseId}\`, agent \`${agent}\`\n\n`;
  md += `Model: \`${records[0]?.model}\`. ${records.length} call(s): ${steps.map((s) => `\`${s}\``).join(" → ")}. `;
  md += `Total cost: $${records.reduce((n: number, r: any) => n + (r.costUsd ?? 0), 0).toFixed(4)}.\n\n`;

  // Make the loop structure legible at a glance — deliverable 04 asks specifically
  // for the feedback that shaped the next step, plus retries and human checkpoints.
  md += `**What happened in this run:** `;
  if (records.length === 1) {
    md += `a single pass. The verifier returned \`pass\` on the first round, so the revision loop never fired and no step needed feedback from a previous one.`;
  } else {
    const parts: string[] = [];
    if (revised) parts.push(`**${revised} revision round(s)** — each \`revise-N\` step receives the verifier's line-referenced verdicts and the list of mechanical anchor failures as its input, and those are visible verbatim below`);
    if (resolved) parts.push(`**a human checkpoint** — the run was suspended at \`resolve\` until a person answered the escalation, and their answer appears in that step's input`);
    md += parts.join("; ") + `.`;
  }
  md += `\n\nRaw record (full requests/responses): \`trajectories/raw/${file}\`\n\n`;

  for (const [i, r] of records.entries()) {
    const step = String(r.step);
    md += `---\n\n## Step ${i + 1}: \`${step}\` — ${r.ts}\n\n`;
    if (step.startsWith("revise")) {
      md += `> **This step exists because the previous one failed review.** Its input below carries the verifier's verdicts and any mechanical anchor failures — that is the feedback that shaped it.\n\n`;
    }
    if (step === "resolve") {
      md += `> **HUMAN CHECKPOINT.** The run was suspended here until a person answered the escalation. Their answer appears in the input below, and it changes the artifact rather than being recorded beside it.\n\n`;
    }
    if (step === "verify-final") {
      md += `> Re-verification after the author's answer was applied.\n\n`;
    }
    const sys = (r.request as any)?.system;
    if (sys) md += `### Agent instructions (system)\n\n${short(typeof sys === "string" ? sys : JSON.stringify(sys), 2500)}\n\n`;
    const msgs = (r.request as any)?.messages ?? [];
    for (const m of msgs) md += `### Input (${m.role})\n\n${renderContent(m.content)}\n\n`;
    md += `### Agent output\n\n${renderContent(r.response)}\n\n`;
    md += `*usage: ${r.usage.input_tokens} in / ${r.usage.output_tokens} out — $${(r.costUsd ?? 0).toFixed(4)}*\n\n`;
  }
  fs.writeFileSync(path.join(OUT, `${name}.md`), md);
  console.log(`rendered trajectories/${name}.md (${records.length} steps)`);
}
