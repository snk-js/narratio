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

## The human checkpoint, captured

**[`jul-01.adapter.md`](jul-01.adapter.md) records a real suspension.** Its step sequence is
`adapt → resolve`: the adapter raised an escalation on the essay's opening sentence, the run halted,
a person answered in the studio, and the `resolve` step carries that answer in its input. The
matching verifier trajectory runs `verify-1 → verify-final`, re-checking the adaptation after the
answer was applied. [`syn-02`](syn-02.adapter.md) records a second such run.

The resulting artifact is [`results/workflow/jul-01.studio.json`](../results/workflow/jul-01.studio.json),
where `humanAnswers` holds what the author said, `escalationsForHuman` is empty because the question
was resolved, and `approvalBlocked` is false. Studio runs are written to `<id>.studio.json` so an
interactive session never overwrites the batch artifacts the evaluation depends on.

**What these trajectories do not contain:** a `revise-N` step. The verifier returned `pass` on the
first round for every case in the corpus, so the automatic revision loop never engaged. The loop is
implemented (`src/workflow.ts`, capped at two rounds) and its feedback path is the same one visible
in the `resolve` step — a prior pass's output plus structured criticism, fed back as input. No case
in this corpus has needed it.

To reproduce a checkpoint yourself:

```bash
npm run studio          # → http://localhost:4321, pick jul-01, Run, answer the question
npm run trajectories    # re-render
```
