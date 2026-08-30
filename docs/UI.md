# Review UI — design

The workflow's output is a draft plus a list of decisions a human must make. Until now that arrived
as JSON, which is fine for a machine and hostile to the person whose name goes on the text. This
document specifies the review surface: what the writer sees, in what order, and why.

**Two surfaces, because reviewing a finished run and watching one happen are different jobs:**

| | `npm run report` | `npm run studio` |
|---|---|---|
| What it is | A single self-contained HTML file built from committed results | A local server that runs the real workflow live |
| Needs a key | No — opens over `file://`, works offline | Yes — it executes the workflow |
| Good for | Reviewing a finished run; a judge auditing claims for free | Watching stages execute, and answering the agent when it stops |
| The checkpoint | Shown as a record of what was asked | **Genuinely blocks** — the run suspends until you answer |

The studio exists because a checkpoint that never suspends anything is a claim the architecture
fails to enforce. In `studio`, `askHuman` parks the run on an unresolved promise; nothing advances
until a person posts an answer, and that answer is fed back into a final adapter pass so it changes
the artifact. Rules 4 and 5 ask for human approval *before* the consequential action, and control
flow is the only honest way to demonstrate it.

---

## Who is using this, and in what state of mind

The writer has already written the essay. They are now deciding whether to put their name on a
machine's rendering of it. Their scarce resource is **attention**, and the thing they most want to
avoid is re-reading their own essay line by line against the draft.

So the interface has one job: **direct attention to the places that need it, and earn trust for the
places that don't.**

## The inversion the UI exists to deliver

| Without the tool | With the tool |
|---|---|
| Read 100% of the narration against 100% of the essay | Read the flagged segments; trust the verified ones |
| No idea which sentence to doubt | Every doubt is located and quoted |
| Ambiguity already resolved, invisibly | Ambiguity presented as a question you answer |

## Main flow — the writer's path

```mermaid
flowchart TD
    A["I have an essay<br/>I want narrated"] --> B["run the workflow"]
    B --> C{"Open the review page"}
    C --> D["Verdict banner:<br/>N segments verified,<br/>M need you,<br/>K questions open"]

    D --> E{"Any open questions?"}
    E -->|yes| F["Answer them first —<br/>they block approval"]
    E -->|no| G["Read only the flagged segments"]
    F --> G

    G --> H{"Flagged segment:<br/>is the critic right?"}
    H -->|"yes, it drifted"| I["Edit the narration<br/>or send back for revision"]
    H -->|"no, false alarm"| J["Dismiss with a note<br/>→ becomes a style-profile rule"]
    I --> K
    J --> K["All flags resolved"]

    K --> L["Approve"]
    L --> M["Narration + provenance record<br/>ready to record"]

    style D fill:#e8eef7,stroke:#4a6fa5
    style F fill:#f7ecd9,stroke:#b8860b
    style L fill:#e3f0e3,stroke:#3f7d3f
```

## What the writer sees per segment

```mermaid
flowchart LR
    subgraph SEG["One narration segment"]
        N["Narration text<br/>(what will be spoken)"]
        A["Its source anchor<br/>(verbatim quote from the essay)"]
        S["Status"]
    end

    S --> V{"Which status?"}
    V -->|"verified"| V1["Quiet. Collapsed by default.<br/>Anchor confirmed by string match,<br/>critic found nothing."]
    V -->|"flagged"| V2["Expanded. Critic's verdict shown<br/>with the exact words that convict."]
    V -->|"escalated"| V3["Blocking card. Both readings,<br/>the question, and an answer box."]

    N -.->|"click"| H["Highlights the anchor<br/>in the essay panel"]
    A -.->|"click"| H

    style V1 fill:#eef3ee,stroke:#7a9a7a
    style V2 fill:#f7ecd9,stroke:#b8860b
    style V3 fill:#f7e3e3,stroke:#a55
```

## The escalation moment — the product's centre

```mermaid
sequenceDiagram
    participant W as Writer
    participant UI as Review page
    participant A as Adapter agent

    A->>UI: "This sentence has two readings.<br/>Which did you mean?"
    Note over UI: Approval is blocked<br/>while this is open
    UI->>W: Shows the source sentence verbatim,<br/>reading A, reading B, and the question
    W->>UI: Picks a reading (or writes a third)
    UI->>W: Records the answer with the run
    Note over W,UI: The answer is reusable — it is a fact<br/>about how this author writes, and it<br/>seeds the style profile for next time
```

## Reviewer's path for a judge with no credentials

```mermaid
flowchart LR
    J["Judge clones the repo"] --> R["npm run report"]
    R --> P["report.html — offline, no API key"]
    P --> P1["Headline: baseline vs workflow"]
    P --> P2["Per-case: essay beside narration,<br/>anchors highlighted"]
    P --> P3["The two corruptions, quoted<br/>side by side with the source"]
    J --> V["npm run verify-anchors<br/>npm run trap-check"]
    V --> C["Same numbers, derived independently,<br/>zero API calls"]

    style C fill:#e3f0e3,stroke:#3f7d3f
```

---

## Layout

Two panes, source on the left and narration on the right, because that is the comparison the writer
is actually making. A status banner sits above both.

```
┌──────────────────────────────────────────────────────────────────────┐
│  jul-01 · O inefável            18 verified · 2 flagged · 1 question  │
│  [ Overview ]  [ jul-01 ]  [ syn-09 ]  [ syn-10 ]  [ syn-11 ]  …     │
├────────────────────────────────┬─────────────────────────────────────┤
│  SOURCE ESSAY                  │  NARRATION                          │
│                                │                                     │
│  existem sentimentos que       │  ① Existem sentimentos que ainda    │
│  ainda não tem registro na     │     não têm registro na linguagem.  │
│  linguagem e ▓nomeá-los não    │     ✓ verified                      │
│  o torna mais "inefável"▓,,    │                                     │
│  aquilo que escapa à           │  ⚠ QUESTION — blocks approval       │
│  expressão verbal…             │     "nomeá-los não o torna mais     │
│                                │      inefável" has two readings:    │
│  ▓ highlighted = the anchor    │      A) naming fails to dissolve…   │
│    of the selected segment     │      B) lacking a name fails to…    │
│                                │     [ A ] [ B ] [ neither: ____ ]   │
└────────────────────────────────┴─────────────────────────────────────┘
```

**Design rules, each earning its place:**

1. **Verified segments collapse.** They are the majority and the whole point is that you skip them.
   Showing them at full weight would recreate the read-everything problem in a nicer font.
2. **Clicking a segment highlights its anchor in the essay.** This is the provenance claim made
   tangible: the writer sees the exact words their narration came from.
3. **Escalations are cards, not annotations, and they sit above the fold.** They block approval, so
   they cannot be styled as advice.
4. **The critic quotes the convicting words.** A verdict without evidence is an opinion.
5. **Colour carries meaning and never carries it alone.** Every state has a text label, so the page
   works in greyscale and for colour-blind readers.
6. **Dismissing a false alarm asks for one line of reasoning.** That line is the seed of a style
   rule, which is how the system learns this author.

## Live run — what the studio shows

```mermaid
sequenceDiagram
    participant W as Writer
    participant UI as Studio (browser)
    participant S as Server
    participant AG as Agents

    W->>UI: pick a case, press Run
    UI->>S: POST /api/run
    S-->>UI: SSE stream opens
    AG->>S: adapter drafting…
    S-->>UI: stage: adapter (running)
    AG->>S: segments + anchors
    S-->>UI: segments render, anchors clickable
    Note over S: mechanical check — no model
    S-->>UI: stage: anchor-check done (n/n valid)
    AG->>S: verifier verdicts
    S-->>UI: flagged segments expand with the convicting words

    AG->>S: escalation raised
    S-->>UI: stage: human-checkpoint BLOCKED
    Note over S,AG: the run is suspended on an<br/>unresolved promise — nothing advances
    UI->>W: shows the sentence, both readings, the question
    W->>UI: picks a reading, or writes their own
    UI->>S: POST /api/answer
    Note over S: promise resolves, the run continues
    AG->>S: final pass applying the author's answer
    S-->>UI: stage: done — ready to approve
```

## Scope for the hackathon build

In: the static report (overview, per-case two-pane review, anchor highlighting, inline critic
verdicts, escalation cards, baseline-vs-workflow diff on trap sentences) and the live studio
(streamed stages, clickable anchors as they arrive, a blocking checkpoint that resumes on an
answer, running cost).

Out: editing narration in the browser, multi-user anything, and authentication — the studio binds
to localhost and is a single-operator tool. Studio runs are written to
`results/workflow/<id>.studio.json` so an interactive session never overwrites the committed
batch artifacts the evaluation depends on.
