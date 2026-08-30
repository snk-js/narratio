# narratio

**Verifiable essay-to-narration adaptation.** An agent workflow that turns a written essay into a
narration script where every sentence carries provenance back into the source text, an adversarial
style guard catches invented claims before a human reads the draft, and *escalate-to-human* is a
first-class agent action with its own success criteria.

> *Narratio* — in classical rhetoric, the part of an *oratio* where the orator lays out the facts.
> The one section of the speech that has to stay faithful to what actually happened.

Submission for the **micro1 Agentic Workflows Hackathon** (August 2026).

---

## How I got here

I want to open with the timeline rather than the architecture, because the design only makes sense
once you know which problem arrived first.

The starting idea was **essay-to-video assembly**. I already had experience with
[Remotion](https://www.remotion.dev/), a TypeScript tool that lets a video be expressed as a JSON
contract, so the mechanical half of that pipeline was familiar ground. The obvious next move was to
let a model take one of my essays and produce the video end to end. I went the other way: I wanted
the tool to depend *more* on human interaction, at the exact moments where human judgment is the
only thing that can settle the question.

Human time per task was the resource worth protecting. So I took the narration stage on its own and
gave it four layers: **mechanical anchor → adversarial verifier → revision loop (max 2) → human
checkpoint.**

The hackathon arrived at the right moment. The parent project is
`oratio-scriptorum` — "the discourse of the writers" — which is where I keep the design work for the
full pipeline. I write essays, I like Latin, and I wanted a mechanism that behaves deterministically
enough that hand-crafted authored text survives a pass through an LLM with its intentions and its
assumptions intact. The same mechanism applies to translation, narration, caption integrity, and the
other places where language has ontological cousins that a fluent model will happily blur.

## The example that started it

The first trap I ever found was in my own writing, before I built any of this. My essay says:

> nomeá-los não o torna **mais** inefável

A single well-written prompt to a strong model rendered it as:

> nomeá-los não os torna **menos** inefáveis

| | pt-BR | en-US |
|---|---|---|
| **My original** | "nomeá-los não o torna **mais** inefável" | "naming them doesn't make them any **more** ineffable" |
| **Baseline output** | "não os torna **menos** inefáveis" | "doesn't make them any **less** ineffable" |

One word carries the entire claim, and the inverted version reads better than the original. That is
the failure this project measures.

---

## Install

**Requirement:** [Node 20+](https://nodejs.org/en/download/current). Nothing else is needed to
verify the central claims.

```bash
git clone https://github.com/snk-js/narratio
cd narratio
npm install          # ~20s, no build step, no native dependencies
```

To run the agents yourself you also need an Anthropic API key:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Open the live run surface:

```bash
npm run studio       # → http://localhost:4321
```

---

## The main flow: how an essay gets checked and narrated

### 1. An essay goes in

`corpus/essays/` holds the source texts and `corpus/cases/` holds their metadata — language, case
class, and any planted traps. Everything is committed to the repository, and nothing is downloaded
at run time.

### 2. The adapter drafts, and has to show its work

```bash
npm run adapt -- jul-01      # one case by id; omit the id to run all twelve
```

The adapter returns narration split into segments, and every segment carries a **verbatim quote** of
the source passage it came from. That constraint is the whole design: a quote can be checked by
string search, so provenance becomes a fact a computer confirms rather than a promise a model makes.

### 3. The mechanical check runs first, with no model involved

Each anchor is searched for in the essay. Present, or absent. Zero judgment, zero cost, zero API
calls. A segment whose anchor is missing gets flagged before any human reads a word of it.

### 4. The verifier hunts for what strings are unable to see

An adversarial critic reads each segment against its anchor, looking for invented claims, drift
past what the anchor supports, scaffolding ("in this video…"), and register flattening. Its verdicts
quote the convicting words, and they drive a revision loop capped at two rounds. Whatever remains
unresolved after those rounds goes to a person rather than to round seven.

### 5. The run stops and asks

When a sentence genuinely admits two readings, the adapter's correct move is to decline to choose.
It quotes the passage, states both readings, and asks.

In the studio this is a real suspension. Pick a case, press Run, and the pipeline streams its stages
into the browser. When the question arrives the run halts — the server parks it on an unresolved
promise — and resumes only after you answer, with your answer fed into a final adapter pass so that
it changes the narration itself.

### 6. What comes out

Narration, a provenance record for every segment, and any questions still open. Approval stays
blocked while a question is unanswered.

```bash
npm run eval          # blind judge over both arms
npm run trajectories  # every API call, rendered readable
```

A full 12-case run of both arms plus evaluation costs about **$2.15** (pessimistic) and takes
roughly 2–9 minutes depending on your connection.

---

## Verify the claims yourself, for free

These three commands need no API key, no credentials, and no network. They read committed files.

```bash
npm run verify-anchors   # 164/164 anchors valid across 12 cases, zero API calls
npm run trap-check       # did each arm carry the author's claim, or corrupt it?
npm run report           # → results/report.html, opens offline in a browser
```

[`docs/REPRODUCE.md`](docs/REPRODUCE.md) walks from a clean environment to the headline comparison
with exact commands, versions, expected output, runtime, and cost.

### The headline result

| | Baseline | Workflow |
|---|---|---|
| **Source claim corrupted** | **2 / 4** | **0 / 4** |
| Source claim carried faithfully | 2 | 4 |

Two independent corruptions, in two languages, through two different mechanisms — the `mais`/`menos`
polarity inversion above, and `syn-11`, where the essay says only *"She apologised"* and deliberately
leaves the referent open while the baseline renders *"My grandmother apologised."* Both outputs are
fluent, confident, and wrong.

The measurement also says plainly which layer earned it: on `syn-11` the workflow stayed faithful
while emitting **zero escalations**, so the verbatim-quote requirement carried that case on its own.
Full reporting, including the two constructed traps that left the baseline unbroken and the bug we
found in our own instrument, is in [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

---

## Who has this problem?

- Writers who publish their own prose and want it in a second medium
- Essayists turning posts into narrated video or podcast audio
- Substack authors recording voiceovers
- Newsletter writers producing audio editions
- The concrete user this was built for is an essayist adapting philosophical essays into narrated
  YouTube videos — me

## What bottleneck makes it worth solving?

Adapting an essay into spoken narration by hand takes hours per piece. Doing it with a single LLM
prompt takes seconds and produces text that *reads* fine while failing in three invisible ways:

1. **Invention.** The adaptation adds claims the essay never made. The subtlest version adds *true*
   claims the essay never made — plausible context, a real citation, a fact the author knows and
   chose to leave out. True-but-absent still counts as invention when the byline is yours.
2. **Flattening.** The author's rhythm and register get normalized into generic "AI narration voice",
   the exact quality that platforms now demote and audiences click away from.
3. **Silent resolution of ambiguity.** Where the source admits two readings, the model confidently
   picks one. The author discovers the wrong pick after publication, if ever.

**Verification is the bottleneck.** Generating an adaptation is fast and cheap; checking a fluent
adaptation against its source sentence by sentence is slower than writing the adaptation yourself.

## Does the agent solve it well?

The workflow makes the adaptation **verifiable by construction**:

- The **adapter agent** emits, for every narration segment, a verbatim quote of the source passage it
  derives from. Quotes are checked **mechanically** — string containment against the essay, with zero
  model judgment involved. A segment lacking a valid source anchor is flagged before any human reads it.
- The **style guard** is an adversarial critic instructed to find failures: unsupported claims,
  semantic drift beyond the anchored span, scaffolding insertions, and register flattening. It returns
  line-referenced verdicts that drive a revision loop capped at two rounds; anything still unresolved
  goes to the author.
- **Escalation is a success condition of its own.** When the source is genuinely ambiguous, the
  adapter's job is to surface both readings, ask the author, and stop. This is measured directly on
  planted-ambiguity cases, where silently picking a reading counts against the system.

The comparison runs against a fair baseline — one well-written prompt to the same model — on the same
cases, with the same evaluation, and the judge never learns which arm wrote which text.

## Can another person reproduce the result?

Yes, and the central claims can be verified for free. The corpus is twelve essays committed to this
repository: one of the author's own, eleven synthetic and disclosed as such, split into **natural**,
**adversarial**, and **clean** case classes so that cases designed to break the baseline are unable to
inflate a pooled headline. The two strongest claims — every anchor exists verbatim in its source, and
each trap sentence either survived or was corrupted — are deterministic string checks over committed
files.

---

## What existed before the competition

Per hackathon rule 2, the boundary is explicit:

| | What | Evidence |
|---|---|---|
| **Before** (Aug 16–19, 2026) | Design documents only, in a separate private repository (`oratio-scriptorum`): an RFC for the full essay-to-video pipeline, ADRs, and **one hand-worked adaptation** of one essay done conversationally with Claude — which specified this problem and produced four style rules plus the escalation insight. **Zero lines of executable code existed.** | Timestamped PRs #1–#2 in that repository; excerpts available to judges on request |
| **During** (Aug 28–31, 2026) | Everything in this repository: all code, prompts, corpus, evaluation harness, changelog, results, video, trajectories. | This repository's git history |

The prior design work is why the problem statement is sharp; the hackathon work is the implementation
and the measurement.

## Repository map

| Path | Contents |
|---|---|
| `src/` | Baseline, adapter agent, style guard, revision loop, eval harness (TypeScript, plain Anthropic SDK) |
| `src/studio/` | Live run surface — streams stages to the browser and blocks at the human checkpoint |
| `prompts/` | Every instruction that shapes an agent, versioned |
| `corpus/` | Evaluation cases: the essays plus per-case metadata, including planted traps |
| `results/` | Committed outputs of every run: per-case scores, aggregate tables, deterministic checks |
| `trajectories/` | Representative agent trajectories per deliverable 04 |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | The improvement changelog (deliverable 01), including the main failure mode and the hot take |
| [`docs/REPRODUCE.md`](docs/REPRODUCE.md) | Reproduction guide (deliverable 02) |
| [`docs/FINDINGS.md`](docs/FINDINGS.md) | The validation run log — what each run showed, including corrected diagnoses |
| [`docs/UI.md`](docs/UI.md) | Review-surface design: user flows, layout, and the reasoning behind each rule |
| [`docs/PLAN.md`](docs/PLAN.md) | The working plan and progress tracker |
| [`docs/HACKATHON.md`](docs/HACKATHON.md) | Rubric, rules, and deliverables checklist |
| `docs/changelog/` | One entry per pull request to this repository |

## Main failure mode and hot take

Both are written from measured results and live in the closing sections of
[`docs/CHANGELOG.md`](docs/CHANGELOG.md). The short version: the workflow earns its cost on the
specific passages where staying faithful to the source and sounding natural pull in opposite
directions, and the most valuable thing the agent produces there is a question for the author rather
than a confident guess.
