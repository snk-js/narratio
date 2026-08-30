# 0001 — README restructure, and three stale facts corrected

**Branch:** `claude/readme-restructure`
**Date:** 2026-08-30
**Scope:** documentation only. No source, prompt, corpus, or results file was changed.

> This directory holds **one entry per pull request** to this repository. It is separate from
> [`docs/CHANGELOG.md`](../CHANGELOG.md), which is the *improvement changelog* — deliverable 01 of
> the hackathon submission, tracking how the solution itself evolved.

## Why

The README carried the whole submission's first impression while still reading as a draft: the
personal timeline, the install steps, the flow, and the rubric answers were interleaved, the
summary of what the project *is* sat at the bottom under a heading called "Summarization", and one
command was documented with the wrong argument. Three factual claims had also gone stale as the
corpus grew.

## What changed

### Structure

Reordered into the sequence a reader actually needs, with each concern in one place instead of two:

1. What this is, in three sentences, plus the *narratio* gloss and the hackathon line
2. **How I got here** — the origin story, from essay-to-video assembly to the four-layer narration
   workflow, kept in the author's voice and made grammatical
3. **The example that started it** — the `mais`/`menos` inversion and its bilingual table
4. **Install** — requirements, clone, key, studio, consolidated into one block
5. **The main flow** — the six steps, each with its command adjacent to it
6. **Verify the claims yourself, for free** — the three zero-credential commands, now grouped, plus
   the headline result table
7. Rubric answers: who has this problem, what bottleneck, does it solve it well, can it be reproduced
8. Rule 2 before/during boundary
9. Repository map, with `docs/` entries linked

Removed the duplicated `npm run studio` invocation (it appeared twice), folded the orphaned
"technical mechanism" heading into step 2 where its content belongs, and promoted the trailing
"Summarization" paragraph to the top of the page as the opening definition.

### Facts corrected

| Claim | Was | Now |
|---|---|---|
| Anchor validity | `124 / 124` in `README.md`, `docs/CHANGELOG.md`, `docs/REPRODUCE.md` | **`164 / 164` across twelve cases**, matching the committed [`results/eval/anchor-verification.md`](../../results/eval/anchor-verification.md) and a fresh `npm run verify-anchors` |
| Adapter invocation | `npm run adapt -- name-of-your-file-essay-without.json` | `npm run adapt -- jul-01` — the script takes a **case id**, not a filename (`src/run-workflow.ts`) |
| Corpus size in the free-check comment | unstated | "across 12 cases", so a reproducer can tell at a glance whether their total should match |

The `124` figure predated the last three corpus cases. A judge following
[`docs/REPRODUCE.md`](../REPRODUCE.md) would have seen `164` where the guide promised `124` and had
to decide whether the discrepancy meant a broken reproduction.

## What did not change

Every measured claim, every number in the results tables, the trap-check verdicts, the cost figures,
and the rule 2 boundary. The `2/4` versus `0/4` headline, the zero-escalation finding on `syn-11`,
and the honest reporting of the two traps that left the baseline unbroken are all carried over
verbatim.

## Verification

```bash
npm run verify-anchors   # 164 / 164 anchors valid, 0 failure(s) — zero API calls
npm run trap-check       # baseline 2/4 corrupted, workflow 0/4 — zero API calls
```
