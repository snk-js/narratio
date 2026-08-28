# narratio

**Verifiable essay-to-narration adaptation.** An agent workflow that adapts a written essay into a narration script where every sentence carries provenance back into the source text, an adversarial style guard catches invented claims before a human ever reads the draft, and *escalate-to-human* is a first-class agent action with its own success criteria.

> *Narratio* — in classical rhetoric, the part of an *oratio* where the orator lays out the facts. The one section of the speech that must stay faithful to what actually happened.

Submission for the **micro1 Agentic Workflows Hackathon** (August 2026).

---

## Who has this problem?

Writers who publish their own prose and want it in a second medium: essayists turning posts into narrated video or podcast audio, Substack authors recording voiceovers, newsletter writers producing audio editions. The concrete user this was built for is an essayist adapting philosophical essays into narrated YouTube videos — but the workflow applies to anyone whose name is on the text.

## What bottleneck makes it worth solving?

Adapting an essay into spoken narration by hand takes hours per piece. Doing it with a single LLM prompt takes seconds — and produces text that *reads* fine but fails in three invisible ways:

1. **Invention.** The adaptation adds claims the essay never made. Worse, it adds *true* claims the essay never made — plausible context, a real citation, a fact the author knows but chose not to write. True-but-absent is still invention when the byline is yours.
2. **Flattening.** The author's rhythm and register get normalized into generic "AI narration voice" — the exact quality that platforms now demote and audiences click away from.
3. **Silent resolution of ambiguity.** Where the source text admits two readings, the model confidently picks one. The author discovers the wrong pick after publication, if ever.

The bottleneck is not generation — it's **verification**. Checking a fluent adaptation against its source, sentence by sentence, is slower than writing the adaptation yourself. So writers either ship unverified AI drafts under their own name, or don't use the tooling at all.

## Does the agent solve it well?

The workflow makes the adaptation *verifiable by construction*:

- The **adapter agent** must emit, for every narration segment, a verbatim quote of the source passage it derives from. Quotes are checked **mechanically** — string containment against the essay, no model judgment involved. A segment with no valid source anchor is flagged before any human reads it.
- The **style guard** is an adversarial critic, not a rubber stamp: it hunts for unsupported claims (semantic drift beyond the anchored span), scaffolding insertions ("in this video…", recaps, CTAs), and register flattening — and returns line-referenced verdicts that drive a bounded revision loop.
- **Escalation is an action, not a failure.** When the source is genuinely ambiguous, the adapter's job is to surface both readings and stop — measured on planted-ambiguity cases, where silently picking a reading counts against it.

Measured against a fair baseline (one well-written prompt to the same model), on the same cases, with the same evaluation: see [`docs/CHANGELOG.md`](docs/CHANGELOG.md) for the iteration-by-iteration evidence and [`results/`](results/) for full runs.

## Can another person reproduce the result?

Yes — the corpus is public-domain and synthetic essays committed to this repo, every metric is either mechanical or produced by a pinned judge configuration, and [`docs/REPRODUCE.md`](docs/REPRODUCE.md) walks from a clean environment to the headline comparison with exact commands, versions, expected output, runtime, and cost.

---

## What existed before the competition

Per hackathon rule 2, the boundary is explicit:

| | What | Evidence |
|---|---|---|
| **Before** (Aug 16–19, 2026) | Design documents only, in a separate private repo (`oratio-scriptorum`): an RFC for a full essay-to-video pipeline, ADRs, and **one hand-worked adaptation** of one essay done conversationally with Claude — which specified this problem and produced four style rules and the escalation insight. **Zero lines of executable code existed.** | Timestamped PRs #1–#2 in that repo; excerpts available to judges on request |
| **During** (Aug 28–31, 2026) | Everything in this repository: all code, prompts, corpus, evaluation harness, changelog, results, video, trajectories. | This repo's git history |

The prior design work is why the problem statement is sharp; the hackathon work is the implementation and the measurement.

## Repository map

| Path | Contents |
|---|---|
| `src/` | Baseline, adapter agent, style guard, revision loop, eval harness (TypeScript, plain Anthropic SDK) |
| `prompts/` | Every instruction that shapes an agent, versioned |
| `corpus/` | Evaluation cases: public-domain + synthetic essays, with planted traps |
| `results/` | Eval runs: per-case scores, aggregate tables |
| `trajectories/` | Representative agent trajectories per deliverable 04 |
| `docs/PLAN.md` | The working plan and progress tracker |
| `docs/CHANGELOG.md` | The improvement changelog (deliverable 01) |
| `docs/REPRODUCE.md` | Reproduction guide (deliverable 02) |
| `docs/HACKATHON.md` | Rubric, rules, and deliverables checklist we're building against |

## Main failure mode & hot take

*Filled at the end from measured results — see the closing section of [`docs/CHANGELOG.md`](docs/CHANGELOG.md).*
