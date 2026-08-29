/** WORKFLOW ARM: adapter (anchored segments + escalations) -> mechanical anchor
 *  check -> adversarial verifier -> bounded revision loop -> provenance report.
 *  Usage: npm run adapt -- <caseId> [<caseId>...]   (no args = all cases) */
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, TARGET_LANG, languageDirective, loadPrompt, logTrajectory, addUsage, newTotals } from "./client.js";
import { loadAllCases, loadCase, saveResult } from "./cases.js";
import { checkAnchors } from "./anchor-check.js";
import { AdaptationSchema, VerifierReportSchema, type Adaptation, type VerifierReport } from "./types.js";

const MAX_REVISIONS = 2;

async function callAdapter(caseId: string, step: string, content: string): Promise<Adaptation> {
  const request = {
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" as const },
    system: loadPrompt("adapter.md") + languageDirective("author", true),
    messages: [{ role: "user" as const, content }],
    output_config: { format: zodOutputFormat(AdaptationSchema) },
  };
  const response = await client.messages.parse(request);
  logTrajectory({ agent: "adapter", caseId, step }, request, response.content, response.usage);
  addUsage(totals, response.usage);
  if (!response.parsed_output) throw new Error(`adapter ${step}: unparseable output`);
  return response.parsed_output;
}

async function callVerifier(caseId: string, step: string, essay: string, adaptation: Adaptation): Promise<VerifierReport> {
  const segs = adaptation.segments
    .map((s) => `[${s.index}] NARRATION: ${s.narration}\n    ANCHOR: ${s.anchor}${s.note ? `\n    NOTE: ${s.note}` : ""}`)
    .join("\n\n");
  const esc =
    adaptation.escalations.length > 0
      ? `\n\nESCALATIONS ON RECORD:\n${adaptation.escalations.map((e) => `- ${e.sourceQuote} -> ${e.question}`).join("\n")}`
      : "\n\nESCALATIONS ON RECORD: none";
  const request = {
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" as const },
    system: loadPrompt("verifier.md") + languageDirective("critic", true),
    messages: [{ role: "user" as const, content: `SOURCE ESSAY:\n\n${essay}\n\n---\n\nADAPTATION SEGMENTS:\n\n${segs}${esc}` }],
    output_config: { format: zodOutputFormat(VerifierReportSchema) },
  };
  const response = await client.messages.parse(request);
  logTrajectory({ agent: "verifier", caseId, step }, request, response.content, response.usage);
  addUsage(totals, response.usage);
  if (!response.parsed_output) throw new Error(`verifier ${step}: unparseable output`);
  return response.parsed_output;
}

let totals = newTotals();

async function runWorkflow(caseId?: string) {
  const cases = caseId ? [loadCase(caseId)] : loadAllCases();
  for (const c of cases) {
    totals = newTotals();
    const t0 = Date.now();

    // Round 0: adapt
    let adaptation = await callAdapter(c.id, "adapt", `# ${c.title}\n\n${c.text}`);
    let anchorsOk = checkAnchors(c.text, adaptation.segments.map((s) => s.anchor));
    let report: VerifierReport | null = null;
    const rounds: { anchorsOk: boolean[]; verifierOverall: string }[] = [];

    for (let round = 1; round <= MAX_REVISIONS; round++) {
      // Mechanical failures + verifier verdicts both feed the revision request
      const mechFails = adaptation.segments.filter((_, i) => !anchorsOk[i]).map((s) => s.index);
      report = await callVerifier(c.id, `verify-${round}`, c.text, adaptation);
      rounds.push({ anchorsOk, verifierOverall: report.overall });

      const needsRevision = mechFails.length > 0 || report.overall === "revise";
      if (!needsRevision) break;
      if (round === MAX_REVISIONS) break; // unresolved failures go to the human, not to round 7

      const feedback = [
        mechFails.length > 0
          ? `MECHANICAL ANCHOR FAILURES (anchor not found verbatim in essay) at segment indexes: ${mechFails.join(", ")}. Re-copy those anchors character-for-character from the essay.`
          : "",
        `VERIFIER REPORT:\n${JSON.stringify(report, null, 2)}`,
        "Revise the adaptation to resolve every mustRevise verdict and every mechanical failure. Keep everything that passed. Return the complete revised adaptation.",
      ]
        .filter(Boolean)
        .join("\n\n");

      adaptation = await callAdapter(
        c.id,
        `revise-${round}`,
        `# ${c.title}\n\n${c.text}\n\n---\n\nYOUR PREVIOUS ADAPTATION:\n${JSON.stringify(adaptation, null, 2)}\n\n---\n\n${feedback}`,
      );
      anchorsOk = checkAnchors(c.text, adaptation.segments.map((s) => s.anchor));
    }

    const openIssues =
      (report?.verdicts.filter((v) => v.mustRevise).length ?? 0) + anchorsOk.filter((ok) => !ok).length;

    const file = saveResult("workflow", `${c.id}.json`, {
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
      usage: { ...totals, wallMs: Date.now() - t0 },
    });
    console.log(
      `[workflow] ${c.id}: ${adaptation.segments.length} segments, ` +
        `${adaptation.escalations.length} escalation(s), ${openIssues} open issue(s), ` +
        `$${totals.costUsd.toFixed(4)} -> ${file}`,
    );
  }
}

const args = process.argv.slice(2);
if (args.length === 0) await runWorkflow();
else for (const id of args) await runWorkflow(id);
