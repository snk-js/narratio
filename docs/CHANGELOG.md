# Improvement Changelog

How this solution evolved, from a plain prompt to the shipped workflow. One entry per meaningful experiment, each tied to the run that produced its evidence — including the experiment we removed.

**Evaluation is identical across every entry:** same corpus, same model (`claude-opus-4-8`, adaptive thinking on all agents), same blind judge, same commands ([`docs/REPRODUCE.md`](REPRODUCE.md)). The judge never learns which arm wrote which text.

| Stage | What we tried and why | Evidence | Decision / learning |
|---|---|---|---|
| **Baseline** | One well-written prompt to the same model: adapt this essay into narration, preserve voice, stay faithful. The honest version of what a writer does today in a chat window. | [`results/baseline/`](../results/baseline/), [`results/eval/latest.md`](../results/eval/latest.md) | Established the starting point. The output is fluent and arrives without provenance, so the writer's only way to know what was invented is to re-read the source line by line. |
| **Iteration 1** — provenance anchors | Adapter must emit, per segment, a **verbatim quote** of the source passage it derives from, checked mechanically by string search with zero model judgment. We chose verbatim quotes over the character offsets the design docs originally specified: offsets are hostile territory for an LLM, while quotes are checkable with `String.includes`. | 131/131 anchors valid across 9 cases — [`results/eval/anchor-verification.md`](../results/eval/anchor-verification.md) | **Kept.** Provenance held at full corpus size with zero mechanical failures. Of everything in this submission, this is the one claim that requires trusting no model at all. |
| **Iteration 2** — adversarial verifier + bounded revision | A critic instructed to hunt invention, drift, scaffolding and register-flattening, returning line-referenced verdicts that drive a revision loop capped at 2 rounds. Anything still unresolved after those rounds goes to the human. | [`results/workflow/*.json`](../results/workflow/) (`verifierReport`, `rounds`), [`trajectories/`](../trajectories/) | **Kept.** Catches the failure the mechanical layer is structurally blind to: a segment whose anchor exists while its narration drifts past what that anchor says. |
| **Iteration 3** — escalation as a first-class action | The adapter may emit an `escalation` — quote the ambiguous passage, state both readings, ask the question — as an alternative to choosing. Escalating on a genuinely ambiguous passage is scored as a success in its own right. | jul-01 escalated on the exact sentence the baseline corrupted — [`results/workflow/jul-01.json`](../results/workflow/jul-01.json) | **Kept.** Produced the headline result and the hot take below. |
| **[removed]** — adapter v2, "no verbatim pass-through" | Hypothesis: the syn-03 escalation miss happened because the adapter copied anchors verbatim into narration, letting it dodge the reading choice. Attempted fix: forbid character-for-character copies. | v2 run: 0 escalations on syn-03 (unchanged), segment [11] still verbatim, 14/21 segments still verbatim — [`docs/FINDINGS.md`](FINDINGS.md) § Removed experiment | **Removed.** The change had no effect, and the hypothesis was wrong twice over: the real cause was a weak trap, and the model's preference for passing through already-spoken-ready prose is *correct* behavior the rule would have broken. A soft prompt rule with nothing mechanical behind it also simply lost to the model's own judgment. |
| **Iteration 4** — adversarial corpus | The first full run showed the entire measured gap resting on one case. We built three new cases on the single trap mechanism that had demonstrably worked — a **load-bearing apparent slip** the narration must render and cannot paraphrase around. | [`results/eval/trap-check.md`](../results/eval/trap-check.md); `syn-09` polarity · `syn-10` idiom · `syn-11` referent | **Kept, with one of three landing.** `syn-11` corrupted the baseline independently of jul-01, in a different language and by a different mechanism, which removes the single-point-of-failure. `syn-09` and `syn-10` were rendered faithfully by both arms — reported as a finding about model robustness on English prose rather than quietly dropped. |
| **Iteration 5** — judge-free trap metric | On 2026-08-29 our LLM judge returned **opposite verdicts on byte-identical text**: at 02:00 it correctly flagged the jul-01 polarity inversion; at 03:00, after `thinking: adaptive` was enabled on the judge, it passed the same committed baseline artifact. The text never changed. We responded by making the trap metric deterministic: for the one sentence each trap turns on, a string check over committed files decides whether the author's claim survived or was corrupted. | [`results/eval/trap-check.md`](../results/eval/trap-check.md), [`src/eval/trap-check.ts`](../src/eval/trap-check.ts) (the incident is documented in its header) | **Kept, and promoted to the headline metric for trap cases.** A number that moves while the artifact stands still is unable to carry a claim. This one is reproducible by construction — and the incident itself is this project's thesis happening to its own measurement instrument. |
| **Iteration 6** — the checkpoint made real | Reviewing the architecture against rule 4 exposed a gap: the escalation wrote a question into a JSON file and the run finished regardless. Nothing ever waited for a person. We extracted the workflow into a library taking an `askHuman` hook, and built a local studio where that hook parks the run on an unresolved promise until someone answers in the browser — with the answer fed into a final adapter pass so it changes the artifact. | [`src/workflow.ts`](../src/workflow.ts) (`askHuman`), [`src/studio/server.ts`](../src/studio/server.ts), [`docs/UI.md`](UI.md) | **Kept.** "Human approval before the consequential action" is now enforced by control flow rather than asserted in a document. Batch mode keeps the previous behavior (escalations recorded, left open), so every committed evaluation artifact remains valid and comparable. |
| **Final** | Anchors + verifier + bounded revision + escalation, with deterministic checks carrying the headline claims and results reported separately for natural, adversarial and clean cases. | [`results/eval/trap-check.md`](../results/eval/trap-check.md), [`results/eval/anchor-verification.md`](../results/eval/anchor-verification.md) | **Source claim corrupted: baseline 2/4, workflow 0/4.** Anchor validity 164/164 across all twelve cases. The main contribution turned out to be the provenance layer rather than escalation — see below. |

---

## The result, and how to read it honestly

The deterministic trap check across the 12-case corpus gives the headline, with zero API calls and zero model judgment:

| | Baseline | Workflow |
|---|---|---|
| **Source claim corrupted** | **2 / 4** | **0 / 4** |
| Source claim carried faithfully | 2 | 4 |

Two independent corruptions, in two languages, through two different mechanisms:

**`jul-01` (pt-BR, natural).** The essay reads *"nomeá-los não o torna **mais** inefável"* — naming them does not make them **more** ineffable. The baseline rendered *"não os torna **menos** inefáveis"* — **less**. It went beyond picking one reading of an ambiguous sentence and inverted the polarity of the author's claim, silently editing the source so its preferred interpretation would parse.

**`syn-11` (en, adversarial).** The essay says only *"She apologised"* and deliberately leaves the referent open; the narrator states outright that he never asked which woman it was. The baseline rendered *"My grandmother apologised."* — asserting who was in the wrong, and inverting the moral shape of the scene.

Both outputs are fluent, confident, and wrong, and a writer reviewing quickly would have shipped either one.

**The main contribution was the provenance layer, and the measurement says so plainly.** On `syn-11` the workflow stayed faithful while emitting **zero escalations**: the requirement to quote a source passage verbatim held the narration at `she apologised` on its own. Escalation fired on `jul-01` alone, 1 of 4 trap cases. Iteration 1 and Iteration 3 do complementary work, and the cheaper, deterministic layer carried more of the load than the design anticipated.

**Two of three constructed traps left the baseline unbroken.** `syn-09` (polarity, English) and `syn-10` (idiom normalization) were rendered faithfully by both arms. We report this as a finding about model robustness — on English prose `claude-opus-4-8` resisted both mechanisms we could construct, while the corruptions we did capture arose in a cross-language rendering and in a referent the essay leaves genuinely open.

**Our own instrument carried a bug, found by inspection.** The trap check first reported `syn-10` corrupted in both arms; both arms were in fact faithfully quoting the essay's own line about the corrections other people offer, and the marker `ill for eleven years` occurs verbatim in the source. The markers are now scoped to the opening line, and `trap-check.ts` validates its own markers before scoring — any corrupt marker occurring in the source essay is disqualified and reported. Determinism guarantees a check returns the same answer every time; correctness is a separate property that has to be established by looking.

**The LLM judge failed the same way our adapters can.** It flagged the `jul-01` inversion correctly at 02:00 and passed the identical committed artifact at 03:00 once adaptive thinking was enabled, reasoning its way into accepting a reversed claim. This is why the headline claims rest on `npm run trap-check` and `npm run verify-anchors`, which any reader can re-run for free, and why the judge is retained only for what strings are unable to measure, with a hand audit over its verdicts ([`results/audit/`](../results/audit/)).

**Why the corpus is split into three classes.** Pooling everything into one number would let cases *designed* to break the baseline inflate the result. Results report **natural**, **adversarial**, and **clean** separately, with the clean subset as the control: a workflow that only wins on cases written to make it win has proven very little.

**Cost of the improvement:** $0.112 vs $0.026 per essay, 32s vs 9s — roughly 4× the spend to make the output verifiable. For work published under your own name, nine cents per essay is an easy trade.

## Main failure mode

**A verification workflow is only as good as the hardest case in its corpus, and easy cases hide that completely.**

Eight of our nine essays produced a perfect tie: 0.0% against 0.0%. On ordinary prose, a strong model with a good prompt stays faithful on its own, and every layer we built sat idle. The workflow's value appeared only where the source contained something the model wanted to *fix* — an apparent slip, a sentence that read wrong, a construction that violated idiom. That is where helpfulness turns into corruption, and it stays invisible inside aggregate metrics built from clean text.

The corollary is uncomfortable, so we state it plainly: **on a corpus of ordinary essays this system buys you nothing measurable.** It earns its cost on the specific, unpredictable passages where staying faithful to the source and sounding natural pull in opposite directions. Since you have no way to know in advance which essay contains such a passage, your options are to verify everything or to accept that some fraction of your published work says something other than what you wrote.

`syn-03` taught the same lesson from the other side. We planted an ambiguity there, the workflow declined to escalate, and our first diagnosis was that the system had failed. The opposite was true: the surrounding paragraphs collapse that sentence to a single reading, so resolving it was correct behavior, and the trap itself was weak. We then spent a whole iteration fixing the system for a problem it never had (see the removed experiment). **When a metric refuses to move, suspect your test before your system.**

And the judge flip completes the pattern: the failure mode we built this system to catch — a model quietly rewriting meaning in the direction of what reads best — appeared inside our own evaluation. Any layer implemented as an LLM inherits the failure modes of LLMs, which is the reason the deterministic layer exists and the reason it carries the claims.

## Hot take

**The most valuable thing an adaptation agent can produce is sometimes a question — and asking has to be built as a first-class action with its own success criteria.**

Every failure we actually measured came from one instinct: the model met a passage where the literal reading was awkward and the helpful reading was obvious, and it quietly chose the helpful one. `mais` became `menos`. No fact was fabricated, which is what makes this harder to catch than classic hallucination: the output is *more* coherent than the source. Fluency went up while fidelity collapsed.

Prompting alone is powerless against this. "Never invent" fails as an instruction because, from inside the task, the corruption feels like fixing a typo rather than inventing. What works is giving the agent somewhere else to put its uncertainty: an escalation channel, scored as a success, that makes asking cheaper than guessing.

For anyone building agents that transform human-authored material — translation, summarization, localization, plain-language rewriting — the lesson generalizes: **measure how often your agent escalates correctly, alongside how often it is right.** An agent that lacks a way to say *"I am unsure which of these you meant"* will resolve your ambiguities for you, silently, in the direction of whatever sounds best — and the output will read beautifully, which is exactly why you will only catch it with your name already on it.
