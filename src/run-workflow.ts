/** WORKFLOW ARM, batch mode. Thin wrapper over the shared implementation in
 *  `src/workflow.ts`. Escalations are recorded and left open for the author —
 *  the interactive checkpoint lives in `npm run studio`.
 *
 *  Usage: npm run adapt -- <caseId> [<caseId>...]   (no args = all cases) */
import { loadAllCases, loadCase, saveResult } from "./cases.js";
import { runOneCase } from "./workflow.js";

async function run(caseId?: string) {
  const cases = caseId ? [loadCase(caseId)] : loadAllCases();
  for (const c of cases) {
    const result = await runOneCase(c);
    const file = saveResult("workflow", `${c.id}.json`, result);
    console.log(
      `[workflow] ${c.id}: ${result.adaptation.segments.length} segments, ` +
        `${result.escalationsForHuman.length} escalation(s), ${result.openIssuesForHuman} open issue(s), ` +
        `$${result.usage.costUsd.toFixed(4)} -> ${file}`,
    );
  }
}

const args = process.argv.slice(2);
if (args.length === 0) await run();
else for (const id of args) await run(id);
