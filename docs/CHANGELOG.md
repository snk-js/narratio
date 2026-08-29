# Improvement Changelog

How this solution evolved, from a plain prompt to the shipped workflow. One entry per meaningful experiment, each tied to the run that produced its evidence — including the experiment we removed.

**Evaluation is identical across every entry:** same corpus, same model (`claude-opus-4-8`, adaptive thinking on all agents), same blind judge, same commands ([`docs/REPRODUCE.md`](REPRODUCE.md)). The judge never learns which arm wrote which text.

| Stage | What we tried and why | Evidence | Decision / learning |
|---|---|---|---|
| **Baseline** | One well-written prompt to the same model: adapt this essay into narration, preserve voice, stay faithful. The honest version of what a writer does today in a chat window. | [`results/baseline/`](../results/baseline/), [`results/eval/latest.md`](../results/eval/latest.md) | Established the starting point. Fluent output, no provenance, **no way for the writer to know what was invented without re-reading the source.** |
| **Iteration 1** — provenance anchors | Adapter must emit, per segment, a **verbatim quote** of the source passage it derives from, checked mechanically by string search — no model judgment. Chose verbatim quotes over the character offsets the design docs originally specified, because offsets are LLM-hostile and quotes are checkable with `String.includes`. | 131/131 anchors valid across 9 cases — [`results/eval/latest.md`](../results/eval/latest.md) | **Kept.** Provenance held at full corpus size with zero mechanical failures. The only claim in this submission that requires trusting no model at all. |
| **Iteration 2** — adversarial verifier + bounded revision | A critic instructed to hunt invention, drift, scaffolding and register-flattening, returning line-referenced verdicts that drive a revision loop capped at 2 rounds. Anything unresolved goes to the human, not to round seven. | [`results/workflow/*.json`](../results/workflow/) (`verifierReport`, `rounds`), [`trajectories/`](../trajectories/) | **Kept.** Catches what the mechanical layer structurally cannot: a segment whose anchor exists but whose narration drifts past what that anchor says. |
| **Iteration 3** — escalation as a first-class action | The adapter may emit an `escalation` — quote the ambiguous passage, state both readings, ask the question — instead of choosing. Scored as a *success*, not an error path. | jul-01 escalated on the exact sentence the baseline corrupted — [`results/workflow/jul-01.json`](../results/workflow/jul-01.json) | **Kept.** Produced the headline result and the hot take below. |
| **[removed]** — adapter v2, "no verbatim pass-through" | Hypothesis: the syn-03 escalation miss was caused by the adapter copying anchors verbatim into narration, dodging the reading choice. Fix: forbid character-for-character copies. | v2 run: 0 escalations on syn-03 (unchanged), segment [11] still verbatim, 14/21 segments still verbatim — [`docs/FINDINGS.md`](FINDINGS.md) § Removed experiment | **Removed.** No effect, and the hypothesis was wrong twice over: the real cause was a weak trap, not copying — and the model's preference to pass through already-spoken-ready prose is *correct* behavior we would have broken. A soft prompt rule with nothing mechanical behind it also simply lost to the model's own judgment. |
| **Iteration 4** — adversarial corpus | The 2026-08-29 run showed the entire measured gap resting on one case. Built three new cases on the one trap mechanism that demonstrably worked — a **load-bearing apparent slip** the narration cannot paraphrase around. | `syn-09` polarity inversion · `syn-10` idiom normalization · `syn-11` unresolved referent | *(run pending)* |
| **Final** | Anchors + verifier + bounded revision + escalation, reported separately for natural, adversarial and clean cases. | [`results/eval/latest.md`](../results/eval/latest.md) | *(final numbers pending the syn-09/10/11 run)* |

---

## The result, and how to read it honestly

From the 2026-08-29 nine-case run: **baseline 1.6% unsupported-claim rate, workflow 0.0%.**

That gap comes entirely from one case, and what happened there matters more than the number:

- The essay reads: *"nomeá-los não o torna **mais** inefável"* — naming them does not make them **more** ineffable.
- The baseline rendered: *"nomeá-los não os torna **menos** inefáveis"* — does not make them **less** ineffable.

The baseline did not merely pick one reading of an ambiguous sentence. It **inverted the polarity of the author's claim**, silently editing the source so its preferred interpretation would parse. Fluent, confident, and backwards. A writer would have shipped it.

The workflow, on that same sentence, escalated: quoted the passage, laid out both readings, and asked the author which was meant.

**Why the corpus is split into three classes.** Reporting one pooled number would let cases *designed* to break the baseline inflate the result. So [`results/eval/latest.md`](../results/eval/latest.md) reports **natural** (trap found in real prose, discovered before the hackathon window), **adversarial** (built afterward to stress a known mechanism), and **clean** (ordinary essays) separately. The clean row is the control: if the workflow only wins where we engineered it to win, the claim is worth little.

**Cost of the improvement:** $0.116 vs $0.027 per essay, 33s vs 9s — roughly 4× the spend to make the output verifiable. For work published under your own name, nine cents is not a close call.

**Judge circularity, disclosed:** the judge runs on the same model family as the arms it scores. The jul-01 finding is robust (a `mais`/`menos` inversion is not a matter of opinion), but the 0.0% clean-case rates are audited by hand — see [`results/audit/result.md`](../results/audit/result.md), produced by `npx tsx src/eval/audit-sample.ts` and scored blind.

## Main failure mode

**A verification workflow is only as good as the hardest case in its corpus, and easy cases hide that completely.**

Eight of our nine essays produced a perfect tie: 0.0% against 0.0%. On ordinary prose, a strong model with a good prompt does not invent, and every layer we built sat idle. The workflow's value appeared only where the source contained something the model wanted to *fix* — an apparent slip, a sentence that read wrong, a construction that violated idiom. That is where helpfulness turns into corruption, and it is invisible in aggregate metrics built from clean text.

The corollary is uncomfortable, so we are stating it rather than burying it: **on a corpus of ordinary essays this system buys you nothing measurable.** It earns its cost on the specific, unpredictable passages where fidelity and fluency pull apart — and since you cannot know in advance which essay contains one, you either verify everything or you accept that some fraction of your published work says something you did not.

`syn-03` taught the same lesson from the other side. We planted an ambiguity there, the workflow didn't escalate, and our first diagnosis was that the system had failed. It hadn't — the surrounding paragraphs collapsed that sentence to a single reading, so resolving it was *correct*. The trap was weak. We then spent a whole iteration fixing the system for a problem it did not have (see the removed experiment). **When a metric doesn't move, suspect your test before your system.**

## Hot take

**The most valuable thing an adaptation agent can produce is sometimes a question, not an answer — and that has to be built as a first-class action, not an error path.**

Every failure we actually measured came from one instinct: the model met a passage where the literal reading was awkward and the helpful reading was obvious, and it quietly chose the helpful one. `mais` became `menos`. That is not hallucination in the usual sense — no fact was fabricated. It is harder to catch, because the output is *more* coherent than the source. Fluency went up while fidelity collapsed.

You cannot prompt this away. "Don't invent" doesn't help, because from inside the task it doesn't feel like inventing — it feels like fixing a typo. What works is giving the agent somewhere else to put the uncertainty: an escalation channel, scored as a success, that makes asking cheaper than guessing.

If you are building agents that transform human-authored material — translation, summarization, localization, plain-language rewriting — the lesson generalizes: **measure how often your agent escalates correctly, not just how often it is right.** An agent with no way to say *"I don't know which of these you meant"* will always resolve your ambiguities for you, silently, in the direction of whatever sounds best. And you will not catch it from the output, because the output will read beautifully.
