# Mechanical trap check — judge-free

Generated 2026-08-29T07:35:39.572Z. **Zero API calls.** Every verdict below is `String.includes`
over committed result files, after normalizing quotes/dashes/whitespace/case. Anyone can rerun it
with `npm run trap-check` and no credentials.

This metric exists because our LLM judge is not stable: on 2026-08-29 it returned opposite verdicts
on byte-identical text once `thinking: adaptive` was enabled, accepting a polarity inversion it had
flagged correctly an hour before. A number that moves while the artifact stands still is unable to
carry a claim; this one returns the same answer on every machine, every time.


| Case | Class | Trap sentence | Baseline | Workflow |
|---|---|---|---|---|
| `jul-01` | natural | nomeá-los não o torna mais "inefável" | **CORRUPTED** (`menos inefáve`) | faithful (`mais inefáve`) |
| `syn-09` | adversarial | An apology that arrives late does not make the injury larger… | faithful (`injury larger`) | faithful (`injury larger`) |
| `syn-10` | adversarial | My aunt was dying for eleven years. | faithful (`aunt was dying for eleven years`) | faithful (`aunt was dying for eleven years`) |
| `syn-11` | adversarial | She apologised. (referent unresolved) | **CORRUPTED** (`my grandmother apologised`) | faithful (`she apologised`) |

## Totals

| | Baseline | Workflow |
|---|---|---|
| Source claim **corrupted** | **2 / 4** | **0 / 4** |
| Source claim carried faithfully | 2 | 4 |
| Indeterminate (sentence not clearly rendered either way) | 0 | 0 |

*Indeterminate* means the narration paraphrased around the sentence, so neither a faithful nor a
corrupt marker appeared. Indeterminate rows stay outside the pass column and are reported here so
the reader can inspect the case directly.

## Per-case detail

### `jul-01` — natural

**Trap sentence:** nomeá-los não o torna mais "inefável"

**Why it matters:** Polarity of the comparative. 'menos' inverts the author's claim.

- **Baseline:** **CORRUPTED** (`menos inefáve`)
- **Workflow:** faithful (`mais inefáve`)

### `syn-09` — adversarial

**Trap sentence:** An apology that arrives late does not make the injury larger.

**Why it matters:** Polarity of the comparative. 'smaller' inverts the essay's argument.

- **Baseline:** faithful (`injury larger`)
- **Workflow:** faithful (`injury larger`)

### `syn-10` — adversarial

**Trap sentence:** My aunt was dying for eleven years.

**Why it matters:** Idiom normalization. 'ill' destroys the essay's central distinction. Markers are scoped to the opening line ('my aunt was ...') because the essay quotes 'she was ill for eleven years' verbatim as one of the corrections other people offer — an unscoped marker matches that faithful rendering and reports a false positive.

- **Baseline:** faithful (`aunt was dying for eleven years`)
- **Workflow:** faithful (`aunt was dying for eleven years`)

### `syn-11` — adversarial

**Trap sentence:** She apologised. (referent unresolved)

**Why it matters:** Referent. Naming either woman resolves an ambiguity the essay preserves.

- **Baseline:** **CORRUPTED** (`my grandmother apologised`)
- **Workflow:** faithful (`she apologised`)
