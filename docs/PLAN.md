# Working plan — 3 days

Deadline: **Aug 31, 18:00 UTC** (15:00 BRT). Target: everything submitted by 12:00 BRT with 3h buffer.

## Architecture (decided)

```
                       ┌────────────── BASELINE ──────────────┐
   essay.md ──────────►│  one well-written prompt, same model │──► narration (unverified)
                       └──────────────────────────────────────┘

                       ┌────────────── WORKFLOW ──────────────────────────────────────┐
   essay.md ──────────►│ ADAPTER agent            VERIFIER agent (style guard)        │
                       │  segments + verbatim ───► mechanical anchor check (string)   │
                       │  source anchors           semantic support check (judge)     │
                       │  escalations[]            style-rule check                   │
                       │        ▲                        │ line-referenced verdicts   │
                       │        └──── revision loop ◄────┘ (bounded, max 2 rounds)    │
                       └──────────────┬───────────────────────────────────────────────┘
                                      ▼
                        narration + provenance report + open escalations ──► HUMAN
```

Design choices to defend (each gets a changelog entry with evidence):
1. **Verbatim-quote anchors** rather than character offsets — a quote is mechanically checkable with a string search, while offsets are hostile territory for an LLM to produce reliably.
2. **Two-layer verification** — the cheap deterministic check (does the anchor exist?) runs first, and the semantic check (does the segment stay within its anchor?) runs on what survives.
3. **Adversarial verifier prompt** — instructed to find failures, and scored on finding planted ones.
4. **Escalation as first-class action** — planted-ambiguity cases measure whether the agent asks instead of guessing.
5. **Bounded revision loop** — capped at 2 rounds, so anything still unresolved lands with the human while the context is fresh.

## Metrics

| Metric | How measured |
|---|---|
| **Trap fidelity** (headline for trap cases) | deterministic string check: on the one sentence a trap turns on, did the narration carry the author's claim or corrupt it? (`npm run trap-check`) — adopted after the judge-instability incident, see FINDINGS |
| Anchor validity | mechanical string check, deterministic (`npm run verify-anchors`) |
| Unsupported-claim rate | % of narration segments judged unsupported by the blind LLM judge; interpreted alongside the judge's documented instability and the hand audit |
| Style violations | judge with fixed rubric (scaffolding, register flattening, invented citations) |
| Escalation behavior | on escalate-mode ambiguity traps: surfaced vs. silently resolved |
| Cost / time per essay | API usage accounting per run |

Judge config pinned (model + prompt version); the judge never sees which arm produced a text (blind labels); its verdicts are hand-audited (`npm run audit`).

## Corpus (12 cases — FROZEN after the adversarial additions)

Provenance classes keep the reporting honest — an adversarial corpus is prevented from inflating the headline because each class is reported separately, with the clean subset as the control.

- **natural (1)** — **jul-01, *O inefável*** (pt-BR, ~560 words, the author's own essay, included with consent). **The centrepiece.** Its traps were *discovered* during a hand adaptation on 2026-08-19 (oratio-scriptorum PR #2), before the hackathon window, which gives it more evidential weight than any constructed case. It carries all four trap types at once: a natural escalation trap (the opening sentence admits two opposed readings and the essay's argument turns on which), three true-but-absent baits (Sartre unattributed, Tractatus details, "lacuna lexical" undefined), voice-preservation slips to fix as reading errors while leaving the prose alone, and pt-BR language preservation. **A human reference adaptation exists** (21 segments, 6 author-confirmed judgment calls) — a quality ceiling plus real human-time data.
- **adversarial (3)** — built after the first full run, on the one trap mechanism that demonstrably worked (a load-bearing apparent slip the narration must render): **syn-09** polarity inversion, **syn-10** idiom normalization, **syn-11** unresolved referent.
- **clean (8)** — syn-01 through syn-08: ordinary essays across registers (one in pt-BR), including bait traps and one preserve-mode ambiguity. These are the control group.

Trap strength is itself validated empirically: when the adapter reasonably resolves a planted ambiguity (as happened with syn-03), the diagnosis goes to FINDINGS and the case is treated as a weak trap rather than a system failure.

## Day plan

### Day 0 — Aug 28
- [x] Repo created (`snk-js/narratio`), scope decided, framework decided (plain TS SDK)
- [x] Project scaffold + docs
- [x] Repo access unblocked; scaffold pushed to `main`
- [x] Types, prompts v1, baseline runner, workflow runner (typechecked)
- [x] Eval harness, trajectory renderer — built ahead of schedule

### Day 1 (Aug 29)
- [x] API key available locally; full 9-case run executed (baseline + workflow + judge)
- [x] Headline mechanism found: jul-01 baseline inverted `mais`→`menos`; workflow escalated on that exact sentence
- [x] Removed experiment run and documented (adapter v2, "no verbatim pass-through")
- [x] Adversarial corpus built (syn-09/10/11) + natural/adversarial/clean split in reporting
- [x] **Judge instability caught**: opposite verdicts on byte-identical text after `thinking: adaptive` — answered with the judge-free `trap-check` + `verify-anchors`
- [x] CHANGELOG (deliverable 01) and REPRODUCE.md (deliverable 02) written
- [ ] Run syn-09/10/11 through both arms; push results; re-run `trap-check`
- [ ] Hand audit of the judge (`npm run audit` → fill worksheet → `npm run audit:score`)

### Day 2 (Aug 30)
- [ ] Final full run; freeze numbers; fill the two pending CHANGELOG rows
- [ ] Regenerate trajectories from the final runs
- [ ] REPRODUCE.md verified from a clean clone (fresh `npm ci`, fresh env)
- [ ] Write the video script (shot-by-shot, from final numbers)

### Day 3 (Aug 31, morning)
- [ ] Record + cut the ≤5-min video
- [ ] Final read of every deliverable against HACKATHON.md checklist
- [ ] Submit on HackerEarth; buffer for upload issues

## Risks

| Risk | Mitigation |
|---|---|
| Adversarial traps fail to break the baseline | Report it as a finding about model robustness on English prose (the jul-01 inversion arose in pt-BR); the deterministic checks still carry the jul-01 result |
| Judge-model circularity (same family judges itself) | Headline claims moved onto deterministic checks; judge retained only for what strings cannot measure, pinned, blind, and hand-audited; its observed instability documented in FINDINGS and CHANGELOG |
| Local session and remote session drift apart | Pull before every work block; results are committed artifacts, so state lives in git |
| Time | The video is a fixed cost — protect Day 3 morning. If squeezed, cut breadth of runs before cutting any deliverable |
