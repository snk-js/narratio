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
  fs.appendFileSync(file, JSON.stringify(record) + "\n");
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
