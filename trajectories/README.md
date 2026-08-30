# Agent trajectories

Deliverable 04. Every API call this system has ever made is logged at the moment it happens —
`src/client.ts` funnels all four agents through one `logTrajectory` call, so these are a record
rather than a reconstruction.

| | |
|---|---|
| `raw/<case>.<agent>.jsonl` | One JSON object per call: full request (including the system prompt), full response, token usage, cost, timestamp |
| `<case>.<agent>.md` | The same content rendered readable, with the loop structure labelled |

**Coverage:** 4 agents × 12 cases = 48 trajectories.

| Agent | Role |
|---|---|
| `baseline` | The comparison arm — one prompt, one call |
| `adapter` | Drafts narration segments with verbatim source anchors; raises escalations |
| `verifier` | Adversarial critic; returns line-referenced verdicts that drive revision |
| `judge` | Blind evaluator, scores both arms without knowing which produced which text |

## How to read one

Start with [`jul-01.adapter.md`](jul-01.adapter.md) — the case that produced the headline result.
Its output contains the escalation the workflow raised on the exact sentence the baseline
inverted. Then [`jul-01.verifier.md`](jul-01.verifier.md) shows that escalation being carried into
the critic's input under `ESCALATIONS ON RECORD`.

Each rendered file opens with a **What happened in this run** line stating whether the revision
loop fired and whether a human checkpoint occurred. Individual steps are labelled:

- `adapt` — the first draft
- `revise-N` — **exists because the previous pass failed review.** Its input carries the verifier's
  verdicts and any mechanical anchor failures verbatim; that is the feedback that shaped it
- `resolve` — **human checkpoint.** The run was suspended until a person answered; their answer
  appears in the input and changes the artifact
- `verify-final` — re-verification after the author's answer was applied

## What the current committed set does and does not show

**Present:** every agent's instructions and outputs, escalations raised by the adapter and passed
into the verifier, per-call cost and token usage, and the judge's per-segment verdicts.

**Absent, and worth stating plainly:** none of these twelve batch runs contains a `revise-N` or a
`resolve` step. The verifier returned `pass` on the first round for every case, so the revision loop
never engaged, and batch mode records escalations without blocking on them. The loops are
implemented and exercised — see `src/workflow.ts` and the studio — and the committed batch runs
simply never needed them.

To capture both on this corpus, run one case interactively and answer its question:

```bash
npm run studio          # → http://localhost:4321, pick jul-01, Run, answer the question
npm run trajectories    # re-render; jul-01.adapter.md now carries `adapt → resolve`
```
