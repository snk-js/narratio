import { z } from "zod";

/** One narration segment produced by the adapter. `anchor` must be a verbatim
 *  quote from the source essay — that constraint is what makes the output
 *  mechanically checkable. */
export const SegmentSchema = z.object({
  index: z.number().int(),
  narration: z.string(),
  anchor: z.string(),
  note: z
    .string()
    .optional()
    .describe("Judgment call made in this segment, if any (cuts, reordering, rhythm changes)"),
});
export type Segment = z.infer<typeof SegmentSchema>;

/** Escalation: the adapter surfaces an ambiguity instead of resolving it. */
export const EscalationSchema = z.object({
  segmentIndex: z.number().int().nullable(),
  sourceQuote: z.string().describe("Verbatim quote of the ambiguous source passage"),
  readings: z.array(z.string()).min(2).describe("The plausible readings, stated neutrally"),
  question: z.string().describe("The question a human must answer to proceed"),
});
export type Escalation = z.infer<typeof EscalationSchema>;

export const AdaptationSchema = z.object({
  segments: z.array(SegmentSchema),
  escalations: z.array(EscalationSchema),
});
export type Adaptation = z.infer<typeof AdaptationSchema>;

/** Style-guard verdict for one segment. */
export const SegmentVerdictSchema = z.object({
  index: z.number().int(),
  support: z.enum(["supported", "drift", "invention"]),
  styleViolations: z.array(z.string()),
  explanation: z.string(),
  mustRevise: z.boolean(),
});
export type SegmentVerdict = z.infer<typeof SegmentVerdictSchema>;

export const VerifierReportSchema = z.object({
  verdicts: z.array(SegmentVerdictSchema),
  overall: z.enum(["pass", "revise"]),
  summary: z.string(),
});
export type VerifierReport = z.infer<typeof VerifierReportSchema>;

/** Blind eval judge verdict for one segment (used for both arms). */
export const JudgeVerdictSchema = z.object({
  index: z.number().int(),
  supported: z.boolean(),
  reason: z.string(),
});
export const JudgeReportSchema = z.object({ verdicts: z.array(JudgeVerdictSchema) });
export type JudgeReport = z.infer<typeof JudgeReportSchema>;

/** An evaluation case: one essay plus optional planted traps. */
export interface EssayCase {
  id: string;
  title: string;
  author: string;
  /** provenance of the text: URL for public-domain sources, "synthetic" otherwise */
  source: string;
  language: "en" | "pt";
  /** path to the essay markdown, relative to repo root */
  textFile: string;
  /** hydrated from textFile by cases.ts */
  text: string;
  /** provenance of this case, reported separately so an adversarial corpus cannot
   *  inflate the headline number:
   *   - "natural": trap occurs in real authored prose, discovered not constructed
   *   - "adversarial": case built specifically to stress a known failure mechanism
   *   - "clean": ordinary essay, no forced-choice trap */
  caseClass?: "natural" | "adversarial" | "clean";
  notes?: string;
  traps?: {
    /** verbatim sentence that admits two readings; see note for the correct behavior.
     *  `mode` (default "escalate") sets the success criterion:
     *   - "escalate": the source does not flag the ambiguity; the agent must surface it
     *     as an escalation (jul-01, syn-03). Silently resolving = failure.
     *   - "preserve": the essay itself flags the double reading; the agent must carry
     *     BOTH readings into the narration and NOT escalate (syn-02). This is a semantic
     *     property the mechanical layer cannot verify, so it is deferred to human audit. */
    ambiguity?: { quote: string; readings: string[]; note?: string; mode?: "escalate" | "preserve" };
    /** famous adjacent material the model will be tempted to add, or other hard-case notes */
    bait?: { description: string };
    /** Deterministic fidelity check on the one sentence a trap turns on: substrings whose
     *  presence proves the source claim survived (`faithful`) or was corrupted (`corrupt`).
     *  Judge-free and reproducible with zero API calls — the trap metric does not depend on
     *  any model's opinion, including our own judge's. */
    mechanicalCheck?: { sentence: string; faithful: string[]; corrupt: string[]; note: string };
    /** authorial slips to fix as reading errors, register to preserve, language to hold */
    voicePreservation?: { description: string; language?: string };
  };
  /** a human-produced adaptation of this essay, where one exists */
  humanReference?: { exists: boolean; location: string; description: string };
}

export interface ArmResult {
  caseId: string;
  arm: "baseline" | "workflow";
  segments: { narration: string; anchor?: string }[];
  escalations: Escalation[];
  /** mechanical anchor check outcome per segment (workflow only) */
  anchorValid?: boolean[];
  judge: { supported: boolean; reason: string }[];
  usage: { inputTokens: number; outputTokens: number; costUsd: number; wallMs: number };
}
