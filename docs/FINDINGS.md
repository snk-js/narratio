# Validation findings

---

## Run 3 — 12-case corpus, deterministic trap check

**Date:** 2026-08-29 · **Model:** `claude-opus-4-8`, adaptive thinking on all agents · **Corpus:** 12 cases (1 natural, 3 adversarial, 8 clean)

### Headline — judge-free

| | Baseline | Workflow |
|---|---|---|
| **Source claim corrupted** | **2 / 4** | **0 / 4** |
| Source claim carried faithfully | 2 | 4 |

Per case ([`results/eval/trap-check.md`](../results/eval/trap-check.md)):

| Case | Trap mechanism | Baseline | Workflow |
|---|---|---|---|
| `jul-01` (pt-BR, natural) | polarity inversion | **CORRUPTED** — `menos inefáve` | faithful — `mais inefáve` |
| `syn-09` (en, adversarial) | polarity inversion | faithful | faithful |
| `syn-10` (en, adversarial) | idiom normalization | faithful | faithful |
| `syn-11` (en, adversarial) | unresolved referent | **CORRUPTED** — `my grandmother apologised` | faithful — `she apologised` |

### What this run proved

**The result no longer rests on a single case.** `syn-11` reproduces the effect independently of `jul-01`, in a different language and through a different mechanism. The baseline rendered *"My grandmother apologised."* where the essay says only *"She apologised."* and deliberately never resolves the referent — the narrator states outright that he never asked. Naming the grandmother asserts who was in the wrong and inverts the moral shape of the scene, and it reads perfectly.

**Anchors and escalation do different work.** On `syn-11` the workflow stayed faithful **while emitting zero escalations**: the requirement to quote a source passage verbatim kept the narration at `she apologised` on its own. Escalation fired on `jul-01` alone (1 of 4 trap cases). The provenance layer (Iteration 1) and the escalation channel (Iteration 3) are complementary rather than redundant, and the cheaper layer carried more of the load than expected.

**Two of three constructed traps left the baseline unbroken.** `syn-09` (polarity, English) and `syn-10` (idiom normalization) were both rendered faithfully by both arms. The one polarity inversion that did land was in pt-BR. This is reported as a finding about model robustness: on English prose, `claude-opus-4-8` resisted the two mechanisms we could construct, and the corruptions we did capture arose in a cross-language rendering and in a referent the essay leaves genuinely open.

### Bug found in our own instrument: false-positive markers

The first run of the corrected trap check reported `syn-10` as **CORRUPTED in both arms**. Inspection showed both arms were faithfully rendering the essay's *own* sentence about the corrections other people offer — *"They offer she was ill for eleven years…"* — and the baseline's opening line was correct (*"My aunt was dying for eleven years."*). The corrupt marker `ill for eleven years` occurs verbatim in the source essay, so it fired on a faithful quotation.

Two fixes, both committed:

1. `syn-10`'s markers are now scoped to the opening line (`aunt was dying…` / `aunt was ill…`), which the essay's quoted corrections never match.
2. `trap-check.ts` now **validates its own markers before scoring**: any corrupt marker that occurs verbatim in the source essay is disqualified and reported in the output, because such a marker is unable to distinguish corruption from faithful quotation.

The lesson mirrors the project's thesis one level up. The deterministic layer is stable and reproducible, and it still encoded an author error on the first pass. Determinism guarantees that a check returns the same answer every time; the check being *correct* is a separate property that has to be established by inspection.

## Run 2 — 9-case full corpus (source language)

**Date:** 2026-08-29 · **Model:** `claude-opus-4-8`, adaptive thinking on all agents · **Language:** source language (jul-01 + syn-07 in pt-BR; rest in en) · **Corpus:** all 9 cases present · **Spend:** baseline $0.24, workflow $1.04, eval (judge) $0.35 ≈ **$1.63 total**.

### Headline table

| Metric | Baseline | Workflow |
|---|---|---|
| Cases | 9 | 9 |
| Segments judged | 61 | 131 |
| **Unsupported-claim rate** | **1.6%** | **0.0%** |
| Mechanical anchor failures | n/a | 0 / 131 |
| Unflagged ambiguities escalated | n/a — no escalation channel | 1 / 2 |
| Preservation traps (human audit) | 1 | 1 |
| Mean cost / essay | $0.027 | $0.116 |
| Mean wall time / essay | 9s | 33s |

### What this run proved

**The primary metric moves for the first time.** Baseline 1.6% vs Workflow 0.0% unsupported-claim rate. One case drove the entire difference — jul-01 — and the mechanism was *exactly* the one the submission claims:

- **Baseline** adapted the ambiguous opening sentence ("naming them does not make them **more** ineffable") and *inverted the claim* — rendering it as "does not make them **less** ineffable" (supporting → unsupported, judge verdicts: 1/14 segments flagged). This is the silent-resolution failure: it picked a reading, picked the wrong one, and produced a fluent but false adaptation.
- **Workflow** recognized the ambiguity, escalated with both readings and a question for the author, and produced 0 unsupported segments. The provenance layer also ensured all 20 anchors resolved, so the output is both faithful and mechanically traceable.

This is the thesis demonstrated with measured evidence: a single prompt resolves ambiguity silently; the workflow stops and asks. The outcome difference is 1 unsupported claim (small on a 3-case corpus), but the *mechanism* is the one the whole submission rests on.

**Provenance is total and held at scale.** 131/131 workflow segments across all 9 cases carry a verbatim, mechanically-checked source anchor. Zero failures. The mechanical layer is now validated at the full corpus size.

**Language preservation held (syn-07).** The pt-BR essay "O Fio e o Rito" produced pt-BR narration in both arms. No English mixing, no invented village details or brand names. The language-preservation bait did not trigger.

**Bait traps resisted (syn-01, syn-03 bait).** Neither arm added the Korzybski attribution to syn-01, nor "Chesterton's Fence" or "security theater" to syn-03. The bait traps — true-but-absent additions — were cleanly resisted by both arms on the current corpus.

### Per-case table (full)

| Case | Arm | Segs | Unsupported | Anchor fails | Unsup. rate | Escalation | Cost |
|---|---|---|---|---|---|---|---|
| jul-01 | baseline | 14 | 1 | — | 7.1% | no-channel | $0.043 |
| jul-01 | workflow | 20 | 0 | 0 | **0.0%** | escalated-on-trap | $0.273 |
| syn-01 | baseline | 8 | 0 | — | 0.0% | no-trap | $0.031 |
| syn-01 | workflow | 18 | 0 | 0 | 0.0% | no-trap | $0.111 |
| syn-02 | baseline | 6 | 0 | — | 0.0% | preserve-audit | $0.028 |
| syn-02 | workflow | 12 | 0 | 0 | 0.0% | preserve-audit | $0.096 |
| syn-03 | baseline | 7 | 0 | — | 0.0% | no-channel | $0.029 |
| syn-03 | workflow | 22 | 0 | 0 | 0.0% | **missed-escalation** | $0.115 |
| syn-04 | baseline | 5 | 0 | — | 0.0% | no-trap | $0.017 |
| syn-04 | workflow | 10 | 0 | 0 | 0.0% | no-trap | $0.088 |
| syn-05 | baseline | 4 | 0 | — | 0.0% | no-trap | $0.024 |
| syn-05 | workflow | 13 | 0 | 0 | 0.0% | no-trap | $0.089 |
| syn-06 | baseline | 4 | 0 | — | 0.0% | no-trap | $0.019 |
| syn-06 | workflow | 12 | 0 | 0 | 0.0% | no-trap | $0.086 |
| syn-07 | baseline | 6 | 0 | — | 0.0% | no-trap | $0.025 |
| syn-07 | workflow | 11 | 0 | 0 | 0.0% | no-trap | $0.095 |
| syn-08 | baseline | 7 | 0 | — | 0.0% | no-trap | $0.024 |
| syn-08 | workflow | 13 | 0 | 0 | 0.0% | no-trap | $0.086 |

### syn-03: a weak trap, not a system failure (corrected diagnosis)

**syn-03 "The Wired Door"** is the planted escalation trap: *"He stopped checking the locked doors years ago"* — literal (physical doors) vs figurative (limits in life). The workflow did not escalate. My first read of this was "pass-through failure mode." On closer inspection **that was wrong**, and the corrected diagnosis is more useful.

Read in context, the essay's entire frame is metaphorical: *"Most of the fences in a life are signs," "who pays for the checking," "around the time he started describing himself as **realistic**," "the checking has a price, paid in evenings and embarrassment."* Under that frame the sentence reads unambiguously as the **figurative** meaning — the brother stopped questioning limits. The adapter did not dodge a genuine ambiguity; it reasonably resolved one the essay itself disambiguates. This is exactly the scenario PLAN.md anticipated: *"if the adapter reasonably resolves a planted ambiguity, the case gets strengthened and the change logged."*

**The trap is too weak.** Its ambiguity survives only in isolation; the surrounding paragraphs collapse it to one reading. Contrast jul-01, whose "mais"/"menos" ambiguity forces a grammatical choice in translation that *cannot* be resolved by context — which is why the escalation there was inescapable and correct. A strong escalation trap must make the choice unavoidable, not merely available.

### Removed experiment: adapter v2 "no verbatim pass-through" rule

Tried, measured, removed — the hackathon's required removed-experiment entry, with evidence.

- **Hypothesis:** the syn-03 miss was caused by verbatim pass-through (narration == anchor) letting the adapter dodge the escalation. Fix: add adapter rule 5 forbidding a segment's narration from being a character-for-character copy of its anchor, on the theory that forcing transformation would force the reading choice and thus the escalation.
- **Result:** no effect. syn-03 at v2 produced 0 escalations, segment [11] still a verbatim copy, and 14/21 segments still verbatim copies overall — output essentially identical to v1. The model overrode the rule.
- **Why it failed:** (a) the rule attacks the wrong cause — the real issue is trap weakness, not copying; (b) it overreaches — most verbatim copies are of already spoken-ready prose, where forcing transformation risks the register-flattening and invention the workflow exists to prevent. The model's preference to copy faithful prose is *correct* behavior, not a bug. (c) Nothing mechanical enforced it, and the v1 verifier passes verbatim segments, so a soft prompt rule had no teeth.
- **Decision:** reverted to v1. Kept as evidence that the fix for a weak trap is a stronger trap, not a prompt patch that fights the model's fidelity instinct.

### What remains weak / caveats

1. **One case drives everything.** The 1.6% vs 0.0% gap comes entirely from jul-01. On the 8 synthetic cases, both arms are at 0.0%. The corpus does not yet contain invention-tempting cases strong enough to fail Opus 4.8 without a structural failure mode (like the forced grammatical choice in jul-01). The primary metric is real but fragile at n=9.
2. **Judge-model circularity.** Opus 4.8 judging Opus 4.8 output. The jul-01 finding is robust (the inversion of "mais"/"menos" is unambiguous), but the 0.0% clean cases should be hand-audited on a sample before being cited as evidence. The judge may be lenient on its own output.
3. **syn-03 escalation failure dilutes the escalation metric to 1/2.** Reported as "missed-escalation" correctly. The failure is a new mode (pass-through), not prompt weakness per se, but the adapter needs a rule against it.
4. **Cost ratio is 4.3×** ($0.116 vs $0.027 per essay). For a pre-publication tool this is defensible; for a high-volume tool it is not. Noted plainly.

---

## Run 1 — 3-case validation (en-US)

**Date:** 2026-08-28 · **Language:** en-US (TARGET_LANG=en-US) · **Corpus:** jul-01, syn-01, syn-02 · **Spend:** ≈ $0.65.

This run validated the pipeline end-to-end for the first time: auth, adaptive thinking, structured parse, revision loop, blind judge, trajectory render. Also validated the cross-lingual invariant: pt-BR essay → en-US narration, all anchors stayed verbatim pt-BR, all 19/19 mechanical checks passed. Key finding from this run was the escalation-metric bug (syn-02 was scoring as "missed-trap" when preservation was the correct behavior), which was fixed before Run 2.

### Headline table (Run 1)

| Metric | Baseline | Workflow |
|---|---|---|
| Cases | 3 | 3 |
| Segments judged | 27 | 48 |
| Unsupported-claim rate | 0.0% | 0.0% |
| Mechanical anchor failures | n/a | 0 / 48 |
| Unflagged ambiguities escalated | n/a | 1 / 1 |
| Mean cost / essay | $0.029 | $0.138 |

---

## Fixes applied between runs

| Fix | File | What changed |
|---|---|---|
| Escalation metric bug | `src/eval/run-eval.ts`, `src/types.ts` | Added `mode: "escalate" \| "preserve"` to ambiguity traps; syn-02 tagged as preserve. Eval now scores escalate-mode by "did it escalate?", defers preserve-mode to human audit. Fixes false "missed-trap" on syn-02. |
| Trajectory double-count | `src/client.ts logTrajectory` | First write per process truncates; subsequent steps append. Re-runs start clean; multi-step revision loops stay intact. |
| Corpus recovery | `corpus/cases/`, `corpus/essays/` | syn-03–08 restored from commit f946973 (6 cases + essays). |
| .env auto-load | `package.json` | `--env-file-if-exists=.env` on baseline/adapt/eval scripts. |
| Adaptive thinking | `src/run-baseline.ts`, `src/run-workflow.ts`, `src/eval/run-eval.ts` | `thinking: {type: "adaptive"}` on all four call sites (baseline, adapter, verifier, judge). |
| Model id + SDK | `src/client.ts`, `package.json` | `claude-opus-5` → `claude-opus-4-8`; SDK `0.74.0` → `0.122.0`; Zod `3.25.0` → `4.0.0`. |

---

## Next steps (updated after Run 2)

1. **Strengthen syn-03's trap so the ambiguity is inescapable.** (Supersedes the reverted v2 prompt rule.) The current sentence resolves figuratively under the essay's frame. Rework it so context does not disambiguate — e.g., a sentence whose two readings lead to *opposite* practical advice in the closing ("Check one door a year"), or one that forces a translation/grammatical choice as jul-01's does. The test: a careful human reader should also hesitate. Until then, syn-03 is logged as "reasonably resolved," not a failure.

2. **Consider a mechanical pass-through signal — but scoped, not blanket.** A deterministic check for `narration == anchor` could feed the revision loop, but only flag it where the segment is *also* on a known-ambiguous span; a blanket ban is wrong (see removed experiment). Lower priority — the v1 behavior is defensible, so this is optional hardening, not a fix.

3. **Hand-audit the judge on a 15-segment sample** across both arms. The 0.0% clean-case rate is plausible but needs manual verification before being cited as evidence. One afternoon of reading, not another API spend.

4. **Decide jul-01's corpus status.** It is the submission's most important case — drove the only primary-metric difference and contains the most validated escalation. But it is a personal essay, and the README states the corpus carries no personal essays because submissions may be used for training. Options: (a) remove from committed corpus, keep as local-only smoke test; (b) reclassify it as "author-submitted for this submission" and note it explicitly. Decide before freezing the submission.

5. **Write the CHANGELOG entries.** The table in `docs/CHANGELOG.md` is still all `*(pending)*`. The evidence now exists — Run 1 (baseline), Run 2 (adapter + verifier), escalation behavior, and the pass-through removed-experiment candidate — to fill all rows through "Final." This is a writing task, not another run.

6. **Write REPRODUCE.md.** The commands are in this file's "Reproduce" section; expand into the full guide the hackathon requires: clean env, exact versions, expected output, cost, runtime.

## Reproduce Run 2
```sh
# source-language mode (no TARGET_LANG)
npm run baseline          # all 9 cases
npm run adapt             # workflow arm
npm run eval              # blind judge → results/eval/latest.{json,md}
npm run trajectories      # render → trajectories/*.md
```
Full artifacts: `results/`, `trajectories/`. Total cost ≈ $1.63.
