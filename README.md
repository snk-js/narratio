# narratio

So, this is a sincere and human introduction about rarratio, on not going straight to technical details but I wanted the reader to feel this solution through a quick timeline of how I ended up building Narratio: 

Starting from an idea of: _essay-to-video-assembly_ Rule 2 of the hackathon requires separating what existed before from what was built during — and "I extracted much of my experience" using Remotion, a TS tool for creating a contract of my video design with a JSON, cool, I can take my essays and turning into a generated video automatically yet? no, I wanted the tool to depend *more* on human interaction. 

Human time per task was the absolute gold that I could extract from the previous idea, taking the narration idea and specialize with 4 pipeline layers: mechanical anchor → adversarial verifier → revision loop (max 2) → human checkpoint. Hackaton appeared in perfect timing because "oratio-scriptorum" was parent idea that is the exact agentic-workflow I could get deep in, as I always like Latin, "oratio-scriptorum" means the "the discourse of the writers" because I am a person who likes to write essays and that would be cool for me and similars, a more determinisc output from a AI mechanism to not let any of authoral hand craftd texts missed or distort any intention or assumption on a LLM passthrough... Some of the creative ideas using it they are: translations, narrations, captions integrity and more cases that have ontological language cousins. 

Take for example in my first written essay for making a former test using *evaluation instruments*: The judge and trap-check. lets get as an example: 

The first trap I ever found was in my own writing, before I built any of this. My essay
says:

> nomeá-los não o torna **mais** inefável

The baseline rendered it as:

> nomeá-los não os torna **menos** inefáveis

| test essay | ptBR | enUS |
| --- | --- | --- |
| my original |"nomeá-los não o torna mais inefável" | "naming them doesn't make them any **more** ineffable" |
| corrupted baseline | "não os torna menos inefáveis" | "doesn't make them any **less** ineffable" |


## Installation

### requirement (Nothing else is needed to verify the central claims):
`Node 20+` 
https://nodejs.org/en/download/current

To run the agents yourself you need an Anthropic API key:

`export ANTHROPIC_API_KEY=sk-ant-...`

### on bash

```bash
git clone https://github.com/snk-js/narratio
cd narratio
npm install          # ~20s, no build step, no native dependencies
```
### opening the UI
`npm run studio      # → http://localhost:4321`

## The main flow, how do I check and narrate my essay?

### 1. An essay goes in

`corpus/essays/` holds the source texts; `corpus/cases/` holds their metadata — language,
case class, and any traps. Nothing is downloaded; everything is committed.

### 2. The adapter drafts, and must show its work

```bash
npm run adapt -- name-of-your-file-essay-without.json
```

## technical mechanism
The adapter returns narration split into segments, and every segment must carry a
verbatim quote of the source passage it came from. That constraint is the whole design:
a quote can be checked by string search, so provenance stops being a promise the model
makes and becomes a fact a computer confirms.

3. The mechanical check runs first — no model involved
Each anchor is searched for in the essay. Present, or absent. No judgment, no opinion, no
cost. A segment whose anchor is missing is flagged before any human reads a word.

4. The verifier hunts for what strings cannot see
An adversarial critic reads each segment against its anchor, looking for invented claims,
drift past what the anchor supports, scaffolding ("in this video…"), and register
flattening. Its verdicts quote the convicting words, and they drive a revision loop capped
at two rounds — whatever remains unresolved goes to a person rather than to round
seven.

5. The run stops and asks
When a sentence genuinely admits two readings, the adapter's correct move is to refuse
to choose. It quotes the passage, states both readings, and asks. In the studio this is
a real suspension:

`npm run studio      # → http://localhost:4321`

Pick a case, press Run, and the pipeline streams its stages into the browser. When the
question arrives the run halts — the server parks it on an unresolved promise — and
resumes only after you answer, with your answer fed into a final pass so it changes the
narration rather than sitting beside it.

6. What comes out
Narration, a provenance record for every segment, and any questions still open. Approval
is blocked while a question is unanswered.

```node
npm run eval          # blind judge over both arms
npm run trajectories  # every API call, rendered readable
```

### post instalation commands of interest
```
npm run verify-anchors   # 124/124 anchors valid, zero API calls
npm run trap-check       # did each arm carry the author's claim, or corrupt it?
npm run report           # → results/report.html, opens offline in a browser
```

A full 12-case run of both arms plus evaluation costs about $2.15 (pessimistic), the speed depends on your connection or cpu but it usually taking ~2-9 minutes.


## Summarization
**Verifiable essay-to-narration adaptation.** An agent workflow that adapts a written essay into a narration script where every sentence carries provenance back into the source text, an adversarial style guard catches invented claims before a human ever reads the draft, and *escalate-to-human* is a first-class agent action with its own success criteria.

> *Narratio* — in classical rhetoric, the part of an *oratio* where the orator lays out the facts. The one section of the speech that must stay faithful to what actually happened.

Submission for the **micro1 Agentic Workflows Hackathon** (August 2026).

---

## Who has this problem?

- Writers who publish their own prose and want it in a second medium
- essayists turning posts into narrated video or podcast audio
- Substack authors recording voiceovers
- Newsletter writers producing audio editions.
- The concrete user this was built for is an essayist adapting philosophical essays into narrated YouTube videos (mycase)

## What bottleneck makes it worth solving?

Adapting an essay into spoken narration by hand takes hours per piece. Doing it with a single LLM prompt takes seconds, and produces text that *reads* fine while failing in three invisible ways:

1. **Invention.** The adaptation adds claims the essay never made. The subtlest version adds *true* claims the essay never made — plausible context, a real citation, a fact the author knows but chose to leave out. True-but-absent still counts as invention when the byline is yours.
2. **Flattening.** The author's rhythm and register get normalized into generic "AI narration voice" — the exact quality that platforms now demote and audiences click away from.
3. **Silent resolution of ambiguity.** Where the source text admits two readings, the model confidently picks one. The author discovers the wrong pick after publication, if ever.

**verification** is the bottleneck and this can help by Generating an adaptation fast and cheap
- checking a fluent adaptation against its source, sentence by sentence, is slower than writing the adaptation yourself. 

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
