/** The workflow as a library: adapter -> mechanical anchor check -> adversarial
 *  verifier -> bounded revision -> HUMAN CHECKPOINT -> optional resolution pass.
 *
 *  Extracted from the CLI so two callers can share one implementation:
 *    - `npm run adapt`   batch mode; escalations are recorded and left open
 *    - `npm run studio`  interactive mode; the run BLOCKS at the checkpoint
 *      until a person answers, and their answer is fed back into a final pass
 *
 *  The checkpoint is a real suspension of the run rather than a note in a file.
 *  Rules 4 and 5 of the hackathon brief ask for human approval before the
 *  consequential action; an escalation that nobody has to answer would be a
 *  claim the architecture never enforces. */
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, TARGET_LANG, languageDirective, loadPrompt, logTrajectory, addUsage, newTotals, type UsageTotals } from "./client.js";
import { checkAnchors, normalize } from "./anchor-check.js";
import { AdaptationSchema, VerifierReportSchema, type Adaptation, type Escalation, type EssayCase, type VerifierReport } from "./types.js";

export const MAX_REVISIONS = 2;

export type RunEvent =
  | { type: "stage"; stage: string; status: "start" | "done"; detail?: string }
  | { type: "segments"; segments: { index: number; narration: string; anchor: string; note?: string }[]; anchorsOk: boolean[] }
  | { type: "verdicts"; verdicts: VerifierReport["verdicts"]; overall: string; summary: string }
  | { type: "blocked"; escalations: Escalation[] }
  | { type: "answered"; answers: { sourceQuote: string; answer: string }[] }
  | { type: "cost"; usd: number; calls: number }
  | { type: "done"; result: WorkflowResult }
  | { type: "error"; message: string };

/** Returning null leaves the escalations open (batch behavior). Returning
 *  answers resumes the run and makes them consequential. */
export type AskHuman = (escalations: Escalation[], ctx: { caseId: string }) => Promise<{ sourceQuote: string; answer: string }[] | null>;

export interface WorkflowResult {
  caseId: string;
  arm: "workflow";
  promptVersions: Record<string, string>;
  model: string;
  targetLang: string;
  adaptation: Adaptation;
  anchorsOk: boolean[];
  verifierReport: VerifierReport | null;
  rounds: { anchorsOk: boolean[]; verifierOverall: string }[];
  openIssuesForHuman: number;
  escalationsForHuman: Escalation[];
  humanAnswers: { sourceQuote: string; answer: string }[] | null;
  approvalBlocked: boolean;
  usage: UsageTotals & { wallMs: number };
}

/** Escalations are sticky across the AUTOMATIC revision loop. No human has
 *  answered yet during that loop, so a question the adapter raised earlier cannot
 *  be legitimately resolved — if a revise pass drops it, re-attach it, otherwise
 *  the human checkpoint is silently skipped. Dedup by normalized source quote. */
function mergeEscalations(prior: Escalation[], current: Escalation[]): Escalation[] {
  const key = (e: Escalation) => normalize(e.sourceQuote ?? "");
  const have = new Set(current.map(key));
  const readd = prior.filter((e) => !have.has(key(e)));
  return [...current, ...readd];
}

export async function runOneCase(
  c: EssayCase,
  opts: { onEvent?: (e: RunEvent) => void; askHuman?: AskHuman } = {},
): Promise<WorkflowResult> {
  const emit = opts.onEvent ?? (() => {});
  const totals = newTotals();
  const t0 = Date.now();

  const callAdapter = async (step: string, content: string): Promise<Adaptation> => {
    emit({ type: "stage", stage: "adapter", status: "start", detail: step });
    const request = {
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" as const },
      system: loadPrompt("adapter.md") + languageDirective("author", true),
      messages: [{ role: "user" as const, content }],
      output_config: { format: zodOutputFormat(AdaptationSchema) },
    };
    const response = await client.messages.parse(request);
    logTrajectory({ agent: "adapter", caseId: c.id, step }, request, response.content, response.usage);
    addUsage(totals, response.usage);
    emit({ type: "cost", usd: totals.costUsd, calls: totals.calls });
    if (!response.parsed_output) throw new Error(`adapter ${step}: unparseable output`);
    emit({ type: "stage", stage: "adapter", status: "done", detail: step });
    return response.parsed_output;
  };

  const callVerifier = async (step: string, adaptation: Adaptation): Promise<VerifierReport> => {
    emit({ type: "stage", stage: "verifier", status: "start", detail: step });
    const segs = adaptation.segments
      .map((s) => `[${s.index}] NARRATION: ${s.narration}\n    ANCHOR: ${s.anchor}${s.note ? `\n    NOTE: ${s.note}` : ""}`)
      .join("\n\n");
    const escLine =
      adaptation.escalations.length > 0
        ? `\n\nESCALATIONS ON RECORD:\n${adaptation.escalations.map((e) => `- ${e.sourceQuote} -> ${e.question}`).join("\n")}`
        : "\n\nESCALATIONS ON RECORD: none";
    const request = {
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" as const },
      system: loadPrompt("verifier.md") + languageDirective("critic", true),
      messages: [{ role: "user" as const, content: `SOURCE ESSAY:\n\n${c.text}\n\n---\n\nADAPTATION SEGMENTS:\n\n${segs}${escLine}` }],
      output_config: { format: zodOutputFormat(VerifierReportSchema) },
    };
    const response = await client.messages.parse(request);
    logTrajectory({ agent: "verifier", caseId: c.id, step }, request, response.content, response.usage);
    addUsage(totals, response.usage);
    emit({ type: "cost", usd: totals.costUsd, calls: totals.calls });
    if (!response.parsed_output) throw new Error(`verifier ${step}: unparseable output`);
    emit({ type: "stage", stage: "verifier", status: "done", detail: step });
    emit({ type: "verdicts", verdicts: response.parsed_output.verdicts, overall: response.parsed_output.overall, summary: response.parsed_output.summary });
    return response.parsed_output;
  };

  const checkAndEmit = (adaptation: Adaptation) => {
    emit({ type: "stage", stage: "anchor-check", status: "start" });
    const ok = checkAnchors(c.text, adaptation.segments.map((s) => s.anchor));
    emit({ type: "segments", segments: adaptation.segments, anchorsOk: ok });
    emit({ type: "stage", stage: "anchor-check", status: "done", detail: `${ok.filter(Boolean).length}/${ok.length} anchors valid` });
    return ok;
  };

  let adaptation = await callAdapter("adapt", `# ${c.title}\n\n${c.text}`);
  let anchorsOk = checkAndEmit(adaptation);
  let report: VerifierReport | null = null;
  const rounds: { anchorsOk: boolean[]; verifierOverall: string }[] = [];

  for (let round = 1; round <= MAX_REVISIONS; round++) {
    const mechFails = adaptation.segments.filter((_, i) => !anchorsOk[i]).map((s) => s.index);
    report = await callVerifier(`verify-${round}`, adaptation);
    rounds.push({ anchorsOk, verifierOverall: report.overall });

    const needsRevision = mechFails.length > 0 || report.overall === "revise";
    if (!needsRevision) break;
    if (round === MAX_REVISIONS) break; // whatever remains goes to the human

    const feedback = [
      mechFails.length > 0
        ? `MECHANICAL ANCHOR FAILURES (anchor not found verbatim in essay) at segment indexes: ${mechFails.join(", ")}. Re-copy those anchors character-for-character from the essay.`
        : "",
      `VERIFIER REPORT:\n${JSON.stringify(report, null, 2)}`,
      "Revise the adaptation to resolve every mustRevise verdict and every mechanical failure. Keep everything that passed. Return the complete revised adaptation.",
    ].filter(Boolean).join("\n\n");

    const priorEscalations = adaptation.escalations;
    adaptation = await callAdapter(
      `revise-${round}`,
      `# ${c.title}\n\n${c.text}\n\n---\n\nYOUR PREVIOUS ADAPTATION:\n${JSON.stringify(adaptation, null, 2)}\n\n---\n\n${feedback}`,
    );
    // A revise pass must not silently drop a question raised before any human input.
    adaptation.escalations = mergeEscalations(priorEscalations, adaptation.escalations);
    anchorsOk = checkAndEmit(adaptation);
  }

  // ---- HUMAN CHECKPOINT ----------------------------------------------------
  let humanAnswers: { sourceQuote: string; answer: string }[] | null = null;
  let approvalBlocked = adaptation.escalations.length > 0;

  if (adaptation.escalations.length > 0) {
    emit({ type: "stage", stage: "human-checkpoint", status: "start", detail: `${adaptation.escalations.length} question(s)` });
    emit({ type: "blocked", escalations: adaptation.escalations });
    humanAnswers = opts.askHuman ? await opts.askHuman(adaptation.escalations, { caseId: c.id }) : null;

    if (humanAnswers && humanAnswers.length) {
      emit({ type: "answered", answers: humanAnswers });
      // The answer has to change the artifact, or the checkpoint is decoration.
      const resolved = humanAnswers
        .map((a) => `SOURCE: ${a.sourceQuote}\nAUTHOR'S ANSWER: ${a.answer}`)
        .join("\n\n");
      adaptation = await callAdapter(
        "resolve",
        `# ${c.title}\n\n${c.text}\n\n---\n\nYOUR PREVIOUS ADAPTATION:\n${JSON.stringify(adaptation, null, 2)}\n\n---\n\nThe author has answered the questions you raised:\n\n${resolved}\n\nApply these answers. Return the complete adaptation with the ambiguity resolved as the author specified, and with the corresponding escalations removed. Change nothing else.`,
      );
      anchorsOk = checkAndEmit(adaptation);
      report = await callVerifier("verify-final", adaptation);
      rounds.push({ anchorsOk, verifierOverall: report.overall });
      approvalBlocked = adaptation.escalations.length > 0;
    }
    emit({ type: "stage", stage: "human-checkpoint", status: "done", detail: humanAnswers ? "answered" : "left open" });
  }

  const openIssues =
    (report?.verdicts.filter((v) => v.mustRevise).length ?? 0) + anchorsOk.filter((ok) => !ok).length;

  const result: WorkflowResult = {
    caseId: c.id,
    arm: "workflow",
    promptVersions: { adapter: "adapter.md@v1", verifier: "verifier.md@v1" },
    model: MODEL,
    targetLang: TARGET_LANG || c.language,
    adaptation,
    anchorsOk,
    verifierReport: report,
    rounds,
    openIssuesForHuman: openIssues,
    escalationsForHuman: adaptation.escalations,
    humanAnswers,
    approvalBlocked,
    usage: { ...totals, wallMs: Date.now() - t0 },
  };
  emit({ type: "done", result });
  return result;
}
