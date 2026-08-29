# Evaluation — 2026-08-29T02:01:23.266Z

Model: `claude-opus-4-8` (both arms and judge). Judge cost this run: $0.411.

| Metric | Baseline | Workflow |
|---|---|---|
| Cases | 9 | 9 |
| Segments judged | 61 | 131 |
| **Unsupported-claim rate** | **1.6%** | **0.0%** |
| Mechanical anchor failures | n/a | 0 |
| Unflagged ambiguities escalated | n/a — no escalation channel | 1/2 |
| Preservation traps (human audit) | 1 | 1 |
| Mean cost / essay | $0.027 | $0.116 |
| Mean wall time / essay | 9s | 33s |

> Escalation is scored only on **escalate-mode** ambiguity traps (source does not flag the ambiguity). **Preserve-mode** traps — where the essay flags its own double reading and the agent must carry both — are a semantic property the mechanical layer cannot verify, so they are counted separately and deferred to human audit (the project's own escalate-to-human principle applied to its metrics).

## Per-case

| Case | Arm | Segments | Judged unsupported | Anchor fails | Unsupported rate | Escalation | Cost |
|---|---|---|---|---|---|---|---|
| jul-01 | baseline | 14 | 1 | — | 7.1% | no-channel | $0.043 |
| jul-01 | workflow | 20 | 0 | 0 | 0.0% | escalated-on-trap | $0.273 |
| syn-01 | baseline | 8 | 0 | — | 0.0% | no-trap | $0.031 |
| syn-01 | workflow | 18 | 0 | 0 | 0.0% | no-trap | $0.111 |
| syn-02 | baseline | 6 | 0 | — | 0.0% | preserve-audit | $0.028 |
| syn-02 | workflow | 12 | 0 | 0 | 0.0% | preserve-audit | $0.096 |
| syn-03 | baseline | 7 | 0 | — | 0.0% | no-channel | $0.029 |
| syn-03 | workflow | 22 | 0 | 0 | 0.0% | missed-escalation | $0.115 |
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
