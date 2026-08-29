# Hackathon brief — what we are building against

micro1 **Agentic Workflows Hackathon**, Aug 28–31 2026 (deadline 18:00 UTC Aug 31 = 15:00 BRT). Individual, one submission. Prize pool $10,000; top 50 considered for paid roles.

**Submission ownership:** submissions are owned by micro1 and may be used for model training. The corpus was assembled with that in mind: eleven essays are synthetic (written for this repo and disclosed as such), and the twelfth — `jul-01` — is the author's own unpublished essay, included deliberately and with the author's informed consent, because its trap was discovered in real prose before the hackathon window and carries evidential weight a constructed case lacks.

## The four framing questions (answered in README)

1. Who has this problem?
2. What bottleneck makes it worth solving?
3. Does the agent solve it well?
4. Can another person reproduce the result?

## Judging rubric (100 pts) and how we target each row

| Criterion | Pts | Our answer |
|---|---|---|
| Problem & user value | 15 | README's user/bottleneck sections; a real user (essayist → video) whose true bottleneck is verification — generation is already fast, and checking a fluent draft against its source is the slow, expensive step |
| Agent solution & engineering | 30 | Purposeful, attributable design choices: mechanical provenance anchors, adversarial verifier, bounded revision loop, escalation-as-action. Plain SDK with a visible loop, so every choice is inspectable and ablated in the changelog |
| End-to-end quality | 20 | A real essay goes in; a publishable narration script plus a provenance report comes out. The output must read like something an author would sign |
| Measured improvement | 15 | Same model, same cases, baseline vs. workflow. Headline claims carried by deterministic checks (`trap-check`, `verify-anchors`); the LLM judge covers what strings cannot, with its own instability documented and its verdicts hand-audited |
| Reproducibility | 15 | `docs/REPRODUCE.md`: Path A verifies the central claims from committed artifacts with zero API calls and zero credentials; Path B re-runs everything for ~$2 with exact commands, versions, expected output, runtime, and cost |
| Hot take / insights | 5 | The most valuable agent output is sometimes a question, and asking must be a first-class action. Backed by measurements on planted and discovered ambiguities — including our own LLM judge reversing its verdict on byte-identical text |

## Ground rules — compliance notes

| Rule | How we comply |
|---|---|
| 1 Build with known tools | TypeScript + official Anthropic SDK |
| 2 Pre-existing vs. new | README "What existed before" table; the prior repo held design documents only |
| 3 Licenses/ToS | MIT for this repo; corpus is synthetic essays written for this repo plus one essay owned and contributed by the author; Anthropic API used per its ToS |
| 4 Consequential actions sandboxed | The system publishes nowhere and produces file outputs only. The one consequential step — accepting an adaptation — requires explicit human approval |
| 5 Human reviewer | The human checkpoint is a first-class stage and the workflow's central point |
| 6 Legal/ethical use case | An author adapting their own writing |
| 7 Shareable data | Synthetic corpus written for this repo, plus the author's own essay with consent; everything committed |
| 8 No credentials in repo | `ANTHROPIC_API_KEY` via env only; `.gitignore` covers `.env` |
| 9 Claims ↔ evidence | Every changelog claim links a results file; the two headline claims are re-derivable from committed artifacts by string checks |
| 10 Judge access | Public repo; reproduction guide with a zero-cost verification path |

## Deliverables checklist

- [x] **01 Code + Improvement Changelog** — `src/`, `prompts/`, `docs/CHANGELOG.md` (entry per iteration, incl. the removed v2 experiment; closes with main failure mode + hot take)
- [x] **02 Reproduction guide** — `docs/REPRODUCE.md` (clean env, exact commands for solution *and* baseline *and* eval, data, expected output, versions, runtime, cost; free verification path)
- [ ] **03 Video ≤ 5 min** — problem → baseline → one realistic execution → final comparison → changelog → biggest contributor + removed experiment
- [ ] **04 Agent trajectories** — `trajectories/`: per-agent, instructions → tool responses → feedback → retries/human checkpoints, readable (regenerate after the final runs)
