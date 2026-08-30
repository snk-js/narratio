# The layers, and the instruments that audit them

Two questions this document answers, both with diagrams: **what the workflow does to an essay**, and
**how each claim about it gets checked**. [`docs/UI.md`](UI.md) covers the same system from the
writer's point of view; this one is the mechanism.

---

## 1. Two arms, one evaluation

Every claim in this repository is a comparison. The baseline is a fair one — the same model, the same
essays, one well-written prompt, which is the honest version of what a writer does today in a chat
window.

```mermaid
flowchart LR
    E["Essay<br/><i>corpus/essays/</i>"] --> B
    E --> W

    subgraph B["BASELINE ARM"]
        B1["One prompt, one call<br/><i>npm run baseline</i>"]
    end

    subgraph W["WORKFLOW ARM"]
        W1["Four layers<br/><i>npm run adapt</i>"]
    end

    B1 --> BR["<i>results/baseline/*.json</i>"]
    W1 --> WR["<i>results/workflow/*.json</i>"]

    BR --> INS["Audit instruments<br/>deterministic + model-based"]
    WR --> INS
    INS --> REP["<i>results/report.html</i><br/>offline, no credentials"]
```

The judge never learns which arm produced which text, and the deterministic instruments never see a
model at all.

---

## 2. The four layers

```mermaid
flowchart TD
    S["Source essay<br/>plus its case metadata"] --> A

    A["<b>LAYER 1 — Adapter agent</b><br/>drafts narration in segments;<br/>every segment must carry a verbatim<br/>quote of the passage it came from"]

    A --> M

    M{"<b>LAYER 2 — Mechanical anchor check</b><br/>is that quote present in the essay?<br/><i>String.includes</i> after normalization<br/>zero model judgment · zero cost"}

    M -->|"anchor missing"| FB["Failing segment indexes<br/>collected as feedback"]
    M -->|"anchor found"| V

    V["<b>LAYER 3 — Adversarial verifier</b><br/>hunts invention, drift past the anchor,<br/>scaffolding, register flattening;<br/>returns line-referenced verdicts"]

    FB --> V

    V --> D{"any mustRevise verdict<br/>or mechanical failure?"}

    D -->|"yes, and rounds remain"| REV["<b>Bounded revision</b><br/>adapter re-runs with the verdicts<br/>and the failure list as input<br/><i>maximum 2 rounds</i>"]
    REV --> M

    D -->|"no"| ESC
    D -->|"yes, rounds exhausted"| ESC

    ESC{"<b>LAYER 4 — Human checkpoint</b><br/>any open escalation?"}

    ESC -->|"none"| OUT
    ESC -->|"one or more"| BLOCK["<b>RUN SUSPENDED</b><br/>parked on an unresolved promise<br/>until a person answers"]

    BLOCK --> ANS["Author's answer"]
    ANS --> RES["Adapter <i>resolve</i> pass<br/>the answer changes the artifact"]
    RES --> VF["Re-verification"]
    VF --> OUT

    OUT["Narration · provenance record<br/>· any question still open<br/><i>approval blocked while one is open</i>"]
```

Three properties worth naming, because they are the design:

- **Layer 2 comes before Layer 3 on purpose.** The cheapest, most certain check runs first, so the
  expensive judgment call only ever runs on segments that already have valid provenance.
- **The loop is capped at two rounds.** Whatever a critic and an adapter cannot settle between them
  in two passes is a question for a person, not material for round seven.
- **Escalations are sticky across the automatic loop.** No human has answered during those rounds, so
  a question raised in round one cannot legitimately vanish in round two. If a revise pass drops one,
  it is re-attached before the checkpoint.

---

## 3. The audit instruments

The word for these in the project is *instruments*, and the distinction that matters is which ones
involve a model. Everything on the left runs offline, on committed files, for free.

```mermaid
flowchart TD
    R["Committed run artifacts<br/><i>results/baseline/ · results/workflow/</i>"]

    R --> DET
    R --> MOD

    subgraph DET["DETERMINISTIC — zero API calls, zero credentials"]
        direction TB
        D1["<i>npm run verify-anchors</i><br/>every anchor present in its essay?"]
        D2["<i>npm run trap-check</i><br/>did each arm carry the author's<br/>claim, or corrupt it?"]
    end

    subgraph MOD["MODEL-BASED — needs an API key"]
        direction TB
        J1["<i>npm run eval</i><br/>blind judge, both arms,<br/>faithfulness and register"]
    end

    D1 --> C1["<b>164 / 164 anchors valid</b><br/>trusts no model at all"]
    D2 --> C2["<b>Baseline 2/4 corrupted,<br/>workflow 0/4</b><br/>the headline claim"]
    J1 --> C3["Per-case rates for what<br/>strings are unable to measure"]

    C3 --> AUD["<i>npm run audit</i> → human worksheet →<br/><i>npm run audit:score</i><br/><b>the judge is itself audited</b>"]

    C1 --> REP["<i>npm run report</i><br/>→ results/report.html"]
    C2 --> REP
    AUD --> REP
```

**Why the split exists.** On 2026-08-29 the judge returned opposite verdicts on byte-identical text:
it correctly flagged the `jul-01` polarity inversion at 02:00, and passed the same committed artifact
at 03:00 after adaptive thinking was enabled on it. The text never changed. A number that moves while
the artifact stands still is unable to carry a claim, so the headline claims were moved onto the
deterministic instruments and the judge was kept for what strings cannot see — with a hand audit
attached to it.

The failure mode this project was built to catch appeared inside its own measurement. That is the
strongest evidence in the repository for why the deterministic layer has to exist.

---

## 4. Auditing the judge

The judge runs on the same model family as the arms it scores, which is a circularity that has to be
disclosed and measured rather than argued away.

```mermaid
sequenceDiagram
    participant S as npm run audit
    participant W as results/audit/worksheet.md
    participant H as Human reviewer
    participant C as npm run audit:score

    S->>S: seeded PRNG selects every flagged segment<br/>plus a random sample of passed ones
    S->>W: writes source essay, narration,<br/>and the judge's verdict behind a fold
    Note over W: the human verdict column is blank
    H->>W: reads the segment first, records<br/>AGREE / DISAGREE, then opens the fold
    W->>C: filled worksheet
    C->>C: computes human–judge agreement rate
    Note over C: the rate is the confidence interval<br/>on every judge-derived number
```

The judge's verdict is hidden behind a fold so the reviewer forms an opinion before seeing it. The
sample is seeded, so a second person drawing the same sample gets the same segments.

---

## 5. Inside the trap check

The trap check decides one question per trap case: for the single sentence that trap turns on, did
each arm render the author's claim or overwrite it? It also validates its own markers first, because
a check being deterministic guarantees a stable answer rather than a correct one.

```mermaid
flowchart TD
    T["Trap definition in the case metadata<br/><i>faithful markers · corrupt markers</i>"]

    T --> SV{"does a corrupt marker occur<br/>verbatim in the source essay itself?"}

    SV -->|"yes"| DQ["<b>Marker disqualified</b><br/>reported in the output —<br/>it would fire on faithful quotation"]
    SV -->|"no"| USE["Marker admitted"]

    DQ --> USE2["Scoring proceeds<br/>on the remaining markers"]
    USE --> SCORE
    USE2 --> SCORE

    SCORE{"search the arm's narration<br/>after normalizing quotes,<br/>dashes, whitespace, case"}

    SCORE -->|"corrupt marker present"| X["<b>CORRUPTED</b>"]
    SCORE -->|"faithful marker present"| OK["<b>faithful</b>"]
    SCORE -->|"neither"| IND["<b>indeterminate</b><br/>narration paraphrased around it —<br/>counted outside the pass column"]
```

Self-validation was added after a real false positive. The check first reported `syn-10` corrupted in
both arms; both arms were faithfully quoting the essay's own line about the corrections other people
offer, and the marker `ill for eleven years` occurs verbatim in the source. The markers are now scoped
to the opening line, and any marker that fires on its own essay is disqualified and reported rather
than silently dropped.

---

## 6. Turning single observations into rates

Every headline number in this repository currently rests on **one sample per arm**. The sampler that
converts observations into rates is built and wired; running it at n≥5 is a matter of spend, and the
reporting says which mode produced a given table.

```mermaid
flowchart LR
    N["<i>npm run repeat -- 5</i>"] --> LOOP

    subgraph LOOP["for each of N runs"]
        direction TB
        R1["run both arms over the corpus"] --> TAG["artifacts written under<br/><i>NARRATIO_RUN_TAG</i>"]
    end

    LOOP --> SC["<i>npm run repeat:score</i>"]
    SC --> OUT["<b>per-case rates</b><br/>corrupted k of N · escalated k of N"]

    OUT --> HON["at N = 1 the table reports<br/><b>1/1 and 0/1</b> — an observation,<br/>not yet a reliability rate"]
```

---

## Where each claim lives

| Claim | Instrument | Model involved | Cost |
|---|---|---|---|
| Every narration traces to a verbatim span of its source | `npm run verify-anchors` | none | free |
| The author's claim survived, or was corrupted | `npm run trap-check` | none | free |
| The human checkpoint genuinely suspends the run | `src/workflow.ts` + `npm run studio` | n/a | free to inspect |
| Faithfulness and register rates on ordinary prose | `npm run eval` | judge | ~$2.15 full corpus |
| How far the judge can be trusted | `npm run audit` → `audit:score` | none, after sampling | free |
| Reliability of any of the above across runs | `npm run repeat` → `repeat:score` | both arms | ~$3 at n=5 |
