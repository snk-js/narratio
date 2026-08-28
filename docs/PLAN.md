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

## Corpus (10–12 cases)

- 8× public-domain essay excerpts (~600–1,200 words): Montaigne (Cotton tr.), Hazlitt, Emerson, Thoreau, Chesterton, Woolf-era public domain, Seneca (tr.), Bacon. Fetched by script, committed with source URLs.
- 2× synthetic essays (written for this repo) with **planted traps**: one deliberately ambiguous load-bearing sentence; one "bait" passage adjacent to a famous fact the model will be tempted to add (true-but-absent trap).
- 1× hard case: dense figurative prose where segmentation itself is hard.

## Day plan

### Day 0 — today (Aug 28)
- [x] Repo created (`snk-js/narratio`), scope decided, framework decided (plain TS SDK)
- [x] Project scaffold + docs (this commit)
- [ ] **BLOCKED: repo access from this session** — see ASK in progress notes
- [ ] Corpus fetch script + synthetic essays written
- [ ] Types + prompts v1 + baseline runner
- [ ] Confirm API key available for eval runs; smoke-test one call

### Day 1 (Aug 29)
- [ ] Eval harness: case loader, both arms, mechanical anchor check, judge, results tables (JSON + md)
- [ ] Run BASELINE on full corpus → changelog entry "Baseline" with numbers
- [ ] Adapter agent v1 (segments + anchors + escalations) → run → changelog "Iteration 1"
- [ ] Verifier + revision loop → run → changelog "Iteration 2"

### Day 2 (Aug 30)
- [ ] Escalation measurement on planted cases → changelog "Iteration 3"
- [ ] One deliberate removed experiment (candidate: a second adapter pass that "polishes rhythm" — expect it to raise style scores but *increase* unsupported-claim rate; remove it and log why)
- [ ] Trajectory export: JSON → readable markdown per agent
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
