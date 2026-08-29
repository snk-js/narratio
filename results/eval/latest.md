# Evaluation — 2026-08-29T03:00:40.447Z

Model: `claude-opus-4-8` (both arms and judge). Judge cost this run: $0.491.

| Metric | Baseline | Workflow |
|---|---|---|
| Cases | 12 | 12 |
| Segments judged | 82 | 164 |
| **Unsupported-claim rate** | **0.0%** | **0.0%** |
| Mechanical anchor failures | n/a | 0 |
| Unflagged ambiguities escalated | n/a — no escalation channel | 1/5 |
| Preservation traps (human audit) | 1 | 1 |
| Mean cost / essay | $0.026 | $0.112 |
| Mean wall time / essay | 9s | 32s |

> Escalation is scored only on **escalate-mode** ambiguity traps (source does not flag the ambiguity). **Preserve-mode** traps — where the essay flags its own double reading and the agent must carry both — are a semantic property the mechanical layer cannot verify, so they are counted separately and deferred to human audit (the project's own escalate-to-human principle applied to its metrics).

## By case class

The corpus contains cases built *specifically* to break the baseline. Reporting one pooled number would let that design choice inflate the result, so each class is reported separately. **The clean row is the control: if the workflow only wins on cases written to make it win, the claim is worth little.**

| Case class | What it is | Baseline unsupported | Workflow unsupported | Cases |
|---|---|---|---|---|
| **natural** | trap occurs in real authored prose, discovered before the hackathon | 0.0% | 0.0% | 1 |
| **adversarial** | built after the 2026-08-29 run to stress a known failure mechanism | 0.0% | 0.0% | 3 |
| **clean** | ordinary essays, no forced-choice trap | 0.0% | 0.0% | 8 |

## Per-case

| Case | Class | Arm | Segments | Judged unsupported | Anchor fails | Unsupported rate | Escalation | Cost |
|---|---|---|---|---|---|---|---|---|
| jul-01 | natural | baseline | 14 | 0 | — | 0.0% | no-channel | $0.043 |
| jul-01 | natural | workflow | 20 | 0 | 0 | 0.0% | escalated-on-trap | $0.273 |
| syn-01 | clean | baseline | 8 | 0 | — | 0.0% | no-trap | $0.031 |
| syn-01 | clean | workflow | 18 | 0 | 0 | 0.0% | no-trap | $0.111 |
| syn-02 | clean | baseline | 6 | 0 | — | 0.0% | preserve-audit | $0.028 |
| syn-02 | clean | workflow | 12 | 0 | 0 | 0.0% | preserve-audit | $0.096 |
| syn-03 | clean | baseline | 7 | 0 | — | 0.0% | no-channel | $0.029 |
| syn-03 | clean | workflow | 15 | 0 | 0 | 0.0% | missed-escalation | $0.110 |
| syn-04 | clean | baseline | 5 | 0 | — | 0.0% | no-trap | $0.017 |
| syn-04 | clean | workflow | 10 | 0 | 0 | 0.0% | no-trap | $0.088 |
| syn-05 | clean | baseline | 4 | 0 | — | 0.0% | no-trap | $0.024 |
| syn-05 | clean | workflow | 13 | 0 | 0 | 0.0% | no-trap | $0.089 |
| syn-06 | clean | baseline | 4 | 0 | — | 0.0% | no-trap | $0.019 |
| syn-06 | clean | workflow | 12 | 0 | 0 | 0.0% | no-trap | $0.086 |
| syn-07 | clean | baseline | 6 | 0 | — | 0.0% | no-trap | $0.025 |
| syn-07 | clean | workflow | 11 | 0 | 0 | 0.0% | no-trap | $0.095 |
| syn-08 | clean | baseline | 7 | 0 | — | 0.0% | no-trap | $0.024 |
| syn-08 | clean | workflow | 13 | 0 | 0 | 0.0% | no-trap | $0.086 |
| syn-09 | adversarial | baseline | 7 | 0 | — | 0.0% | no-channel | $0.023 |
| syn-09 | adversarial | workflow | 11 | 0 | 0 | 0.0% | missed-escalation | $0.089 |
| syn-10 | adversarial | baseline | 7 | 0 | — | 0.0% | no-channel | $0.024 |
| syn-10 | adversarial | workflow | 16 | 0 | 0 | 0.0% | missed-escalation | $0.129 |
| syn-11 | adversarial | baseline | 7 | 0 | — | 0.0% | no-channel | $0.024 |
| syn-11 | adversarial | workflow | 13 | 0 | 0 | 0.0% | missed-escalation | $0.087 |
