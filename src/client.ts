import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";

/** Single model everywhere — baseline, workflow agents, and judge run on the
 *  same model so the comparison isolates the workflow, not the model. */
export const MODEL = "claude-opus-4-8";

/** claude-opus-4-8 pricing, USD per million tokens (input, output). */
const PRICE_IN = 5.0;
const PRICE_OUT = 25.0;

export const client = new Anthropic();

/** Optional narration target language, e.g. TARGET_LANG="en-US". Empty = preserve
 *  the source essay's language (default). Anchors ALWAYS stay in the source
 *  language regardless — they are checked by exact string match against the essay. */
export const TARGET_LANG = process.env.TARGET_LANG?.trim() ?? "";

/** Language instruction injected into every agent's system/prompt.
 *  - role "author": agents that WRITE narration (baseline, adapter).
 *  - role "critic": agents that EVALUATE narration (verifier, judge).
 *  `anchored` marks agents that also handle verbatim source anchors. */
export function languageDirective(role: "author" | "critic", anchored = false): string {
  if (!TARGET_LANG) {
    return role === "author"
      ? "\n\n## Language\n\nWrite the narration in the same language as the source essay."
      : ""; // languages match; no cross-lingual note needed
  }
  if (role === "author") {
    let s =
      `\n\n## Language\n\nWrite the narration in ${TARGET_LANG}. The source essay may be in another ` +
      `language; translating the author's own words into ${TARGET_LANG} is part of the adaptation and ` +
      `is NOT invention.`;
    if (anchored)
      s +=
        ` Each \`anchor\` must remain a VERBATIM quote in the essay's ORIGINAL language — never ` +
        `translate an anchor; anchors are checked by exact string match against the source.`;
    return s;
  }
  return (
    `\n\n## Cross-language note\n\nThe narration is in ${TARGET_LANG} while the source essay` +
    `${anchored ? " and the anchors are" : " is"} in its original language. This is intended: a faithful ` +
    `translation of the essay's content counts as SUPPORTED. Judge meaning and support, not language — ` +
    `only flag additions, drift, or claims absent from the source, in any language.`
  );
}

export interface CallMeta {
  /** which agent this call belongs to, e.g. "baseline" | "adapter" | "verifier" | "judge" */
  agent: string;
  caseId: string;
  /** free-form step label, e.g. "revision-1" */
  step: string;
}

export interface UsageTotals {
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  calls: number;
}

export function newTotals(): UsageTotals {
  return { inputTokens: 0, outputTokens: 0, costUsd: 0, calls: 0 };
}

export function costUsd(inputTokens: number, outputTokens: number): number {
  return (inputTokens * PRICE_IN + outputTokens * PRICE_OUT) / 1e6;
}

const TRAJ_DIR = path.join(process.cwd(), "trajectories", "raw");

/** Files this process has already written to. The first write of a run truncates
 *  the file; later steps of the SAME run append. Since baseline/adapt/eval each run
 *  as their own process and touch disjoint agent files, this is effectively
 *  per-run truncation — a re-run starts clean instead of appending duplicate
 *  records (which would double-count cost in the rendered deliverable). */
const trajFilesThisRun = new Set<string>();

/** Append one raw trajectory record. Every API interaction in this project goes
 *  through here — the hackathon's deliverable 04 is rendered from these files. */
export function logTrajectory(
  meta: CallMeta,
  request: unknown,
  response: unknown,
  usage: { input_tokens: number; output_tokens: number },
): void {
  fs.mkdirSync(TRAJ_DIR, { recursive: true });
  const file = path.join(TRAJ_DIR, `${meta.caseId}.${meta.agent}.jsonl`);
  const record = {
    ts: new Date().toISOString(),
    ...meta,
    model: MODEL,
    request,
    response,
    usage,
    costUsd: costUsd(usage.input_tokens, usage.output_tokens),
  };
  const line = JSON.stringify(record) + "\n";
  if (trajFilesThisRun.has(file)) {
    fs.appendFileSync(file, line);
  } else {
    trajFilesThisRun.add(file);
    fs.writeFileSync(file, line); // truncate stale records from prior runs
  }
}

export function addUsage(totals: UsageTotals, usage: { input_tokens: number; output_tokens: number }): void {
  totals.inputTokens += usage.input_tokens;
  totals.outputTokens += usage.output_tokens;
  totals.costUsd += costUsd(usage.input_tokens, usage.output_tokens);
  totals.calls += 1;
}

export function loadPrompt(name: string): string {
  return fs.readFileSync(path.join(process.cwd(), "prompts", name), "utf8");
}
