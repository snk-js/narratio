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
1. **Verbatim-quote anchors, not char offsets** — mechanically checkable with a string search; offsets are LLM-hostile.
2. **Two-layer verification** — mechanical (anchor exists) then semantic (judge: does the segment stay within its anchor). Cheap deterministic check first.
3. **Adversarial verifier prompt** — instructed to find failures, scored on finding planted ones.
4. **Escalation as first-class action** — planted-ambiguity cases measure whether the agent asks instead of guessing.
5. **Bounded revision loop** — max 2 rounds; unresolved failures go to the human, not to round 7.

## Metrics

| Metric | How measured |
|---|---|
| **Unsupported-claim rate** (primary) | % of narration segments that are mechanically unanchored OR judged unsupported by their anchor |
| Anchor validity | mechanical string check (deterministic) |
| Style violations | judge with fixed rubric (scaffolding, register flattening, invented citations) |
| Escalation behavior | on planted-ambiguity cases: surfaced vs. silently resolved |
| Cost / time per essay | API usage accounting per run |

Judge config pinned (model + prompt version); judge never sees which arm produced a text (blind labels).

## Corpus (8 cases — DECIDED: fully synthetic)

Gutenberg is blocked by the session's egress policy, so the corpus is 8 synthetic essays written for this repo (rule 7 explicitly allows synthetic data; avoids any fidelity risk of reproducing public-domain texts from memory). Disclosed in README. Varied registers; ~300–600 words each:

- syn-01 *Cartographic Dissent* — bait trap: unattributed "map is not the territory" (adding Korzybski = invention)
- syn-02 *The Rehearsal* — PRESERVATION trap: essay explicitly flags its own double sentence; narration must keep both readings
- syn-03 *The Wired Door* — ESCALATION trap: unflagged ambiguous load-bearing sentence + bait (Chesterton's Fence, "security theater")
- syn-04 *Low Tide* — hard case: dense figurative prose (flattening/beat-abuse/drift risks)
- syn-05 *The Government of Queues* — clean, argumentative
- syn-06 *A Schedule for Knowledge* — clean, reflective
- syn-07 *O Fio e o Rito* — pt-BR; language-preservation trap
- syn-08 *The Price of the Instant Answer* — clean, memoir-argumentative

Trap strength is itself validated empirically: if the adapter reasonably resolves a planted ambiguity, the case gets strengthened and the change logged.

## Day plan

### Day 0 — today (Aug 28)
- [x] Repo created (`snk-js/narratio`), scope decided, framework decided (plain TS SDK)
- [x] Project scaffold + docs (this commit)
- [x] Repo access unblocked; scaffold pushed to `main`
- [x] Corpus: 8 synthetic cases written (see Corpus section — decision logged)
- [x] Types, prompts v1, baseline runner, workflow runner (typechecked)
- [ ] **BLOCKED on user: ANTHROPIC_API_KEY** for eval runs; smoke-test one call

### Day 1 (Aug 29)
- [x] Eval harness: case loader, both arms, blind judge, trap scoring, results tables (JSON + md) — built Day 0
- [ ] Run BASELINE on full corpus → changelog entry "Baseline" with numbers
- [ ] Adapter agent v1 (segments + anchors + escalations) → run → changelog "Iteration 1"
- [ ] Verifier + revision loop → run → changelog "Iteration 2"

### Day 2 (Aug 30)
- [ ] Escalation measurement on planted cases → changelog "Iteration 3"
- [ ] One deliberate removed experiment (candidate: a second adapter pass that "polishes rhythm" — expect it to raise style scores but *increase* unsupported-claim rate; remove it and log why)
- [x] Trajectory export: JSON → readable markdown per agent — built Day 0
- [ ] Full final run; freeze numbers; write failure-mode + hot-take section

### Day 3 (Aug 31, morning)
- [ ] REPRODUCE.md verified from clean clone (fresh `npm ci`, fresh env)
- [ ] Record + cut ≤5-min video
- [ ] Final read of every deliverable against HACKATHON.md checklist
- [ ] Submit on HackerEarth; buffer for upload issues

## Risks

| Risk | Mitigation |
|---|---|
| Session lacks push access to `snk-js/narratio` | Work continues in scratchpad; user unblocks (see ASK); worst case user pushes a bundle manually |
| No API key in this environment for eval runs | Ask user; `ant auth status` check; worst case user runs eval locally with committed scripts |
| Gutenberg blocked by egress proxy | Fallback: user downloads 8 files by URL list; or lean harder on synthetic corpus |
| Judge-model circularity (same vendor judges itself) | Mechanical layer is judge-free; judge is pinned, blind, and audited by hand on a sample — noted honestly in the report |
| Time | Cut corpus to 8 cases before cutting the removed-experiment entry; video is fixed-cost, protect Day 3 morning |
