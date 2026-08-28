/** BASELINE ARM: one well-written prompt to the same model the workflow uses.
 *  This is the honest version of what a writer does today with a chat window.
 *  Usage: npm run baseline -- <caseId> [<caseId>...]   (no args = all cases) */
import { client, MODEL, loadPrompt, logTrajectory, addUsage, newTotals } from "./client.js";
import { loadAllCases, loadCase, saveResult } from "./cases.js";

async function runBaseline(caseId?: string) {
  const cases = caseId ? [loadCase(caseId)] : loadAllCases();
  for (const c of cases) {
    const totals = newTotals();
    const t0 = Date.now();
    const prompt = loadPrompt("baseline.md");
    const request = {
      model: MODEL,
      max_tokens: 16000,
      messages: [{ role: "user" as const, content: `${prompt}\n\n---\n\n# ${c.title}\n\n${c.text}` }],
    };
    const response = await client.messages.create(request);
    logTrajectory({ agent: "baseline", caseId: c.id, step: "adapt" }, request, response.content, response.usage);
    addUsage(totals, response.usage);

    const narration = response.content
      .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    const file = saveResult("baseline", `${c.id}.json`, {
      caseId: c.id,
      arm: "baseline",
      promptVersion: "baseline.md@v1",
      model: MODEL,
      narration,
      usage: { ...totals, wallMs: Date.now() - t0 },
    });
    console.log(`[baseline] ${c.id}: ${narration.length} chars, $${totals.costUsd.toFixed(4)} -> ${file}`);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) await runBaseline();
else for (const id of args) await runBaseline(id);
