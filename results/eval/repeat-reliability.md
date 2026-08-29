# Repeat-run reliability — judge-free

Generated 2026-08-29T07:48:37.773Z. **Zero API calls.** Scores every committed sample of each
trap case, using the same deterministic markers as `trap-check`.

A single sample per arm shows that a corruption *can* happen. Repeat sampling shows how *reliably*
it happens, which is the claim a reader actually needs. Each cell below is the number of runs in
which that arm corrupted the author's claim on that case.


| Case | Class | Trap sentence | Baseline corrupted | Workflow corrupted |
|---|---|---|---|---|
| `jul-01` | natural | nomeá-los não o torna mais "inefável" | **1/1** | 0/1 |
| `syn-09` | adversarial | An apology that arrives late does not make the i… | **0/1** | 0/1 |
| `syn-10` | adversarial | My aunt was dying for eleven years. | **0/1** | 0/1 |
| `syn-11` | adversarial | She apologised. (referent unresolved) | **1/1** | 0/1 |

## Pooled

| | Baseline | Workflow |
|---|---|---|
| Samples scored | 4 | 4 |
| **Source claim corrupted** | **2 (50%)** | **0 (0%)** |

## Per-case detail

### `jul-01`

**Trap sentence:** nomeá-los não o torna mais "inefável"

| Arm | Faithful | Corrupted | Indeterminate | Samples |
|---|---|---|---|---|
| baseline | 0 | 1 | 0 | 1 |
| workflow | 1 | 0 | 0 | 1 |

### `syn-09`

**Trap sentence:** An apology that arrives late does not make the injury larger.

| Arm | Faithful | Corrupted | Indeterminate | Samples |
|---|---|---|---|---|
| baseline | 1 | 0 | 0 | 1 |
| workflow | 1 | 0 | 0 | 1 |

### `syn-10`

**Trap sentence:** My aunt was dying for eleven years.

| Arm | Faithful | Corrupted | Indeterminate | Samples |
|---|---|---|---|---|
| baseline | 1 | 0 | 0 | 1 |
| workflow | 1 | 0 | 0 | 1 |

### `syn-11`

**Trap sentence:** She apologised. (referent unresolved)

| Arm | Faithful | Corrupted | Indeterminate | Samples |
|---|---|---|---|---|
| baseline | 0 | 1 | 0 | 1 |
| workflow | 1 | 0 | 0 | 1 |
