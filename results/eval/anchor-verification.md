# Anchor verification — zero API calls

Generated 2026-08-29T07:37:05.395Z.

Every segment the workflow produced must carry a quote of the source passage it derives from,
appearing **verbatim** in that essay. This check is `String.includes` after normalizing quotes,
dashes, whitespace and case; it runs offline and requires neither a model nor credentials.

**Result: 164 / 164 anchors valid, 0 failure(s).**

| Case | Segments | Valid | Status |
|---|---|---|---|
| `jul-01` | 20 | 20 | all valid |
| `syn-01` | 18 | 18 | all valid |
| `syn-02` | 12 | 12 | all valid |
| `syn-03` | 15 | 15 | all valid |
| `syn-04` | 10 | 10 | all valid |
| `syn-05` | 13 | 13 | all valid |
| `syn-06` | 12 | 12 | all valid |
| `syn-07` | 11 | 11 | all valid |
| `syn-08` | 13 | 13 | all valid |
| `syn-09` | 11 | 11 | all valid |
| `syn-10` | 16 | 16 | all valid |
| `syn-11` | 13 | 13 | all valid |

No failures. Every claim in every workflow narration traces to a verbatim span of its source essay.
