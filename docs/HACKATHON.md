# Hackathon brief — what we are building against

micro1 **Agentic Workflows Hackathon**, Aug 28–31 2026 (deadline 18:00 UTC Aug 31 = 15:00 BRT). Individual, one submission. Prize pool $10,000; top 50 considered for paid roles. Submissions are owned by micro1 and may be used for model training — which is why this repo contains **no personal essays**: the corpus is public-domain and synthetic only.

## The four framing questions (answered in README)

1. Who has this problem?
2. What bottleneck makes it worth solving?
3. Does the agent solve it well?
4. Can another person reproduce the result?

## Judging rubric (100 pts) and how we target each row

| Criterion | Pts | Our answer |
|---|---|---|
| Problem & user value | 15 | README's user/bottleneck sections; a real user (essayist → video) with a bottleneck that is *verification*, not generation |
| Agent solution & engineering | 30 | Purposeful, attributable design choices: mechanical provenance anchors, adversarial verifier, bounded revision loop, escalation-as-action. Plain SDK, visible loop — every choice inspectable and ablated in the changelog |
| End-to-end quality | 20 | A real essay goes in; a publishable narration script + provenance report comes out. Output must read like something an author would sign |
| Measured improvement | 15 | Same model, same cases, baseline vs. workflow; unsupported-claim rate as primary metric; every changelog entry tied to a run |
| Reproducibility | 15 | `docs/REPRODUCE.md`: clean env → headline table. Committed corpus, pinned versions, deterministic mechanical checks, exact commands, cost/runtime stated |
| Hot take / insights | 5 | Escalation: the most valuable agent output is sometimes a question. Backed by planted-ambiguity measurements, not anecdote |

## Ground rules — compliance notes

| Rule | How we comply |
|---|---|
| 1 Build with known tools | TypeScript + official Anthropic SDK |
| 2 Pre-existing vs. new | README "What existed before" table; prior repo is design-docs only |
| 3 Licenses/ToS | MIT for this repo; corpus is public-domain (Gutenberg) + synthetic; Anthropic API per ToS |
| 4 Consequential actions sandboxed | Nothing publishes anywhere; file outputs only. The one "consequential" step (accepting an adaptation) requires explicit human approval |
| 5 Human reviewer | The workflow's entire point: human checkpoint is a first-class stage |
| 6 Legal/ethical use case | Author adapting their own writing |
| 7 Shareable data | Public-domain + synthetic corpus, committed |
| 8 No credentials in repo | `ANTHROPIC_API_KEY` via env only; `.gitignore` covers `.env` |
| 9 Claims ↔ evidence | Every changelog claim links a results file |
| 10 Judge access | Public repo; reproduction guide |

## Deliverables checklist

- [ ] **01 Code + Improvement Changelog** — `src/`, `prompts/`, `docs/CHANGELOG.md` (entry per iteration, incl. one removed experiment; closes with main failure mode + hot take)
- [ ] **02 Reproduction guide** — `docs/REPRODUCE.md` (clean env, exact commands for solution *and* baseline *and* eval, data, expected output, versions, runtime, cost)
- [ ] **03 Video ≤ 5 min** — problem → baseline → one realistic execution → final comparison → changelog → biggest contributor + removed experiment
- [ ] **04 Agent trajectories** — `trajectories/`: per-agent, instructions → tool responses → feedback → retries/human checkpoints, readable
