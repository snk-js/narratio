# narratio

**Verifiable essay-to-narration adaptation.** An agent workflow that adapts a written essay into a narration script where every sentence carries provenance back into the source text, an adversarial style guard catches invented claims before a human ever reads the draft, and *escalate-to-human* is a first-class agent action with its own success criteria.

> *Narratio* — in classical rhetoric, the part of an *oratio* where the orator lays out the facts. The one section of the speech that must stay faithful to what actually happened.

Submission for the **micro1 Agentic Workflows Hackathon** (August 2026).

---

## Who has this problem?

Writers who publish their own prose and want it in a second medium: essayists turning posts into narrated video or podcast audio, Substack authors recording voiceovers, newsletter writers producing audio editions. The concrete user this was built for is an essayist adapting philosophical essays into narrated YouTube videos, and the workflow applies to anyone whose name is on the text.

## What bottleneck makes it worth solving?

Adapting an essay into spoken narration by hand takes hours per piece. Doing it with a single LLM prompt takes seconds, and produces text that *reads* fine while failing in three invisible ways:

1. **Invention.** The adaptation adds claims the essay never made. The subtlest version adds *true* claims the essay never made — plausible context, a real citation, a fact the author knows but chose to leave out. True-but-absent still counts as invention when the byline is yours.
2. **Flattening.** The author's rhythm and register get normalized into generic "AI narration voice" — the exact quality that platforms now demote and audiences click away from.
3. **Silent resolution of ambiguity.** Where the source text admits two readings, the model confidently picks one. The author discovers the wrong pick after publication, if ever.

The bottleneck lives in **verification**. Generating an adaptation is fast and cheap; checking a fluent adaptation against its source, sentence by sentence, is slower than writing the adaptation yourself. Faced with that arithmetic, writers either ship unverified AI drafts under their own name or give up on the tooling entirely.

## Does the agent solve it well?

The workflow makes the adaptation *verifiable by construction*:

- The **adapter agent** must emit, for every narration segment, a verbatim quote of the source passage it derives from. Quotes are checked **mechanically** — string containment against the essay, with zero model judgment involved. A segment lacking a valid source anchor is flagged before any human reads it.
- The **style guard** is an adversarial critic whose instructions are to find failures: unsupported claims (semantic drift beyond the anchored span), scaffolding insertions ("in this video…", recaps, calls to action), and register flattening. It returns line-referenced verdicts that drive a revision loop capped at two rounds; anything still unresolved goes to the author.
- **Escalation is a success condition of its own.** When the source is genuinely ambiguous, the adapter's job is to surface both readings, ask the author, and stop. This behavior is measured directly on planted-ambiguity cases, where silently picking a reading counts against the system.

The comparison runs against a fair baseline — one well-written prompt to the same model — on the same cases, with the same evaluation. See [`docs/CHANGELOG.md`](docs/CHANGELOG.md) for the iteration-by-iteration evidence and [`results/`](results/) for full runs.

## Can another person reproduce the result?

Yes, and the central claims can be verified **for free**. The corpus is twelve essays committed to this repo (one the author's own, eleven synthetic and disclosed as such, split into natural / adversarial / clean case classes). The two strongest claims — every anchor exists verbatim in its source, and each trap sentence either survived or was corrupted — are deterministic string checks over committed files, runnable with zero API calls and zero credentials. [`docs/REPRODUCE.md`](docs/REPRODUCE.md) walks from a clean environment to the headline comparison with exact commands, versions, expected output, runtime, and cost. `npm run report` builds a browsable review page (`results/report.html`) that opens offline with no credentials.

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
| `corpus/` | Evaluation cases: the essays plus per-case metadata, including planted traps |
| `results/` | Committed outputs of every run: per-case scores, aggregate tables, deterministic checks |
| `trajectories/` | Representative agent trajectories per deliverable 04 |
| `docs/PLAN.md` | The working plan and progress tracker |
| `docs/FINDINGS.md` | The validation run log — what each run showed, including corrected diagnoses |
| `docs/CHANGELOG.md` | The improvement changelog (deliverable 01) |
| `docs/REPRODUCE.md` | Reproduction guide (deliverable 02) |
| `docs/UI.md` | Review-surface design: user flows, layout, and the reasoning behind each rule |
| `src/studio/` | Live run surface — streams stages to the browser and blocks at the human checkpoint |
| `docs/HACKATHON.md` | Rubric, rules, and deliverables checklist we're building against |

## Main failure mode & hot take

Both are written from measured results — see the closing sections of [`docs/CHANGELOG.md`](docs/CHANGELOG.md). The short version: the workflow earns its cost on the specific passages where staying faithful to the source and sounding natural pull in opposite directions, and the most valuable thing the agent produces there is a question for the author rather than a confident guess.
