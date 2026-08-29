/** REPEAT RUNS — turn a single observation into a rate.
 *
 *  The headline result rests on one sample per arm per case. LLM output varies
 *  between runs, so a reader is entitled to ask whether the baseline's
 *  corruption of a source claim was reliable behavior or one unlucky draw.
 *  This harness answers that: it re-runs both arms N times over the trap cases
 *  and reports, per case, in how many runs each arm carried the author's claim.
 *
 *  Runs go to results/<arm>/<id>.runN.json via NARRATIO_RUN_TAG, leaving the
 *  committed headline artifacts untouched.
 *
 *  Usage:  npm run repeat -- [n=5] [caseId ...]   (default: the trap cases)
 *  Then:   npm run repeat:score
 *
 *  Cost: roughly $0.14 per case per run (baseline + workflow). Five runs over
 *  four trap cases is about $2.80. */
import { spawnSync } from "node:child_process";
import { loadAllCases } from "../cases.js";

const args = process.argv.slice(2);
const n = Number(args[0] ?? 5);
const explicit = args.slice(1);

const trapCases = loadAllCases()
  .filter((c) => c.traps?.mechanicalCheck)
  .map((c) => c.id);
const cases = explicit.length ? explicit : trapCases;

if (!Number.isFinite(n) || n < 1) {
  console.error("Usage: npm run repeat -- [n] [caseId ...]");
  process.exit(1);
}

console.log(`Repeat sampling: ${n} run(s) × ${cases.length} case(s) [${cases.join(", ")}]`);
console.log(`Estimated cost: ~$${(0.14 * n * cases.length).toFixed(2)}\n`);

for (let run = 1; run <= n; run++) {
  const tag = `run${run}`;
  for (const arm of ["baseline", "adapt"] as const) {
    console.log(`— ${tag} / ${arm}`);
    const r = spawnSync("npx", ["tsx", arm === "baseline" ? "src/run-baseline.ts" : "src/run-workflow.ts", ...cases], {
      stdio: "inherit",
      env: { ...process.env, NARRATIO_RUN_TAG: tag },
    });
    if (r.status !== 0) {
      console.error(`\n${tag}/${arm} failed (exit ${r.status}). Runs completed so far are on disk; re-run to continue.`);
      process.exit(r.status ?? 1);
    }
  }
}

console.log(`\nDone. Score with: npm run repeat:score`);
