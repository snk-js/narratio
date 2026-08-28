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

  let md = `# Trajectory — case \`${caseId}\`, agent \`${agent}\`\n\n`;
  md += `Model: \`${records[0]?.model}\`. ${records.length} call(s). `;
  md += `Total cost: $${records.reduce((n: number, r: any) => n + (r.costUsd ?? 0), 0).toFixed(4)}.\n\n`;
  md += `Raw record (full requests/responses): \`trajectories/raw/${file}\`\n\n`;

  for (const r of records) {
    md += `---\n\n## Step: ${r.step} — ${r.ts}\n\n`;
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
