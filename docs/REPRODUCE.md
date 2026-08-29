# Reproduction guide

Written for someone starting from a clean machine, assuming zero prior context.

There are two paths. **Path A is free and credential-less**: it re-verifies the central claims directly from artifacts already committed to this repo. **Path B** re-runs the agents from scratch and costs about $2.

---

## Requirements

| | |
|---|---|
| **Node** | ≥ 20 (developed on v22.22.2) |
| **npm** | ≥ 10 |
| **OS** | any — plain Node, without native dependencies, GPU, or Docker |
| **API key** | **Path A: none.** Path B: an Anthropic API key with access to `claude-opus-4-8` |
| **Network** | Path A: none after clone. Path B: api.anthropic.com |
| **Data** | Nothing to download. All 12 essays are committed in `corpus/` |

```bash
git clone https://github.com/snk-js/narratio
cd narratio
npm install          # ~20s, no build step
npm run typecheck    # optional; expects clean exit
```

---

## Path A — verify the claims for free (no API key, ~30 seconds)

Both of this submission's strongest claims are deterministic, so a reader can check them with a model entirely out of the loop.

### A1. Mechanical trap check — did the source claim survive?

```bash
npm run trap-check
```

**What it does:** for each trap case, takes the one sentence the trap turns on and asks, by
string matching over the committed narration, whether each arm carried the author's claim or
corrupted it. The only processing is normalization of quotes, dashes, whitespace and case.

**Expected output** (`results/eval/trap-check.md`), on the committed results:

```
| Case     | Class   | Baseline               | Workflow             |
| jul-01   | natural | CORRUPTED (menos ...)  | faithful (mais ...)  |
```

The baseline rendered *"nomeá-los não os torna **menos** inefáveis"* where the essay says
*"não o torna **mais** inefável"* — the polarity of the author's claim, reversed. The workflow
carried it faithfully, and it escalated the sentence to the author rather than choosing a reading on its own.

Cases whose arms have not been run print `— not run` rather than a verdict.

### A2. Anchor validity — is every claim traceable?

```bash
npm run verify-anchors
```

**What it does:** for every segment the workflow produced across every case, confirms the
segment's claimed source anchor appears **verbatim** in the source essay.

**Expected output:** `124 / 124 anchors valid, 0 failure(s)` on the committed results (the total tracks the corpus as runs are added). Any
failure prints the case, segment index, and the offending anchor.

Of everything in this submission, this claim stands entirely on its own: verifying it requires trusting zero models — ours, the judge's, or yours.

---

## Path B — re-run everything (~$2, ~15 minutes)

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Run the two arms, then the evaluation. Both arms receive the same essays and the same task;
the differences between them are documented in `README.md` § Fair comparison.

```bash
npm run baseline     # arm 1: one prompt per essay      → results/baseline/
npm run adapt        # arm 2: the full workflow          → results/workflow/
npm run eval         # blind LLM judge over both arms    → results/eval/latest.{md,json}
npm run trap-check   # deterministic trap fidelity       → results/eval/trap-check.md
npm run trajectories # readable agent transcripts        → trajectories/*.md
```

Single case instead of the whole corpus:

```bash
npm run baseline -- jul-01
npm run adapt    -- jul-01
```

### Expected cost and runtime

Measured on the 12-case corpus, `claude-opus-4-8`, adaptive thinking on all agents:

| Step | Wall time | Cost |
|---|---|---|
| `baseline` (12 essays) | ~2 min | ~$0.31 |
| `adapt` (12 essays) | ~7 min | ~$1.34 |
| `eval` (24 judgings) | ~5 min | ~$0.49 |
| `trap-check`, `verify-anchors`, `trajectories` | seconds | $0.00 |
| **Total** | **~15 min** | **~$2.15** |

Per-essay: baseline ~$0.026 / 9s; workflow ~$0.112 / 32s. Every result file records its own
`usage` block, so these figures are re-derivable rather than remembered.

### What you should see

- `results/eval/latest.md` — headline table plus per-case rows, split into **natural /
  adversarial / clean** case classes. The clean subset is the control.
- `results/eval/trap-check.md` — the judge-free result described in Path A.
- `results/workflow/*.json` — per case: segments with anchors, the verifier's verdicts, revision
  rounds, escalations left open for the author.
- `trajectories/*.md` — every API call, readable: agent instructions → output → the feedback that
  shaped the next step.

---

## Expect the LLM judge to vary between runs; expect the mechanical checks to return identical answers

**This section documents a measured finding.** On 2026-08-29 the judge returned **opposite
verdicts on byte-identical text**: it correctly flagged the `mais`/`menos` inversion at 02:00,
then passed the same baseline artifact at 03:00 after `thinking: adaptive` was enabled on the
judge. The text never changed.

So on a re-run of Path B, expect `results/eval/latest.md` to differ in places. Judge verdicts are
model output and carry model variance — a fact this project treats as evidence for its own thesis
(see `docs/CHANGELOG.md` § Main failure mode).

**Path A is immune to that variance.** `trap-check` and `verify-anchors` are string operations
over committed files, and they return the same answer on every machine, every time, forever. If you
only reproduce one thing from this repository, reproduce those.

---

## Human-in-the-loop steps (no API calls)

The workflow's output is a draft accompanied by a list of things a human must decide — the human
checkpoint is a stage of the system. Two commands support it.

```bash
npm run audit        # sample judged segments into a worksheet
# fill in the HUMAN: lines in results/audit/worksheet.md
npm run audit:score  # agreement rate, leniency vs over-strictness
```

`audit` includes every judge-flagged segment plus a seeded random sample of *passed* ones (that is
where leniency hides), and keeps the judge's verdict behind a fold so you decide first. The seed
is printed, so a given sample is reproducible: `npx tsx src/eval/audit-sample.ts 15 7`.

---

## Repository layout

```
corpus/essays/   the 12 source essays
corpus/cases/    per-essay metadata: language, case class, trap definitions
prompts/         every instruction that shapes an agent, versioned
src/             arms, evaluation, deterministic checks
results/         committed outputs of every run
trajectories/    raw JSONL per API call + rendered markdown
docs/            plan, findings, changelog, this guide
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| `No such file: results/baseline/<id>.json` | that case's arm has not been run — `npm run baseline -- <id>` |
| `unparseable output` from an agent | a structured-output parse failed; re-run that single case |
| `trap-check` prints `— not run` | expected for cases whose arms are absent from `results/` |
| Costs differ from the table | model pricing or thinking behavior changed; each result file carries its own measured `usage` |
