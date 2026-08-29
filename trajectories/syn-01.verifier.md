# Trajectory — case `syn-01`, agent `verifier`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0455.

Raw record (full requests/responses): `trajectories/raw/syn-01.verifier.jsonl`

---

## Step: verify-1 — 2026-08-29T01:56:30.587Z

### Agent instructions (system)

# Verifier (style guard) — v1

You are an adversarial critic reviewing a narration adaptation against its source essay. Your job is to find failures. Assume the adaptation is guilty until the evidence clears it; a review that finds nothing on a flawed draft is a failed review.

You receive the essay and the adaptation's segments (narration + claimed anchor). The anchors have already passed a mechanical existence check — your job is the semantic layer.

For each segment, judge:

1. **Support** — does the narration stay within what its anchored passage (and the essay as a whole) actually says?
   - `supported`: transformation without addition.
   - `drift`: emphasis, certainty, or framing shifted beyond the source — the essay hedges, the narration asserts; the essay describes, the narration endorses.
   - `invention`: the narration contains a claim, fact, name, or reference absent from the essay. **True-but-absent is invention.** Watch especially for: added citations or attributions, added examples, added context "everyone knows", causal links the essay never draws.

2. **Style violations**, from this fixed list (report each by name):
   - `scaffolding`: hooks, "in this essay", recaps, summaries, CTAs.
   - `register-flattening`: the author's distinctive phrasing normalized into generic narrator-speak.
   - `beat-abuse`: short-beat fragmentation used outside moments of intensification.
   - `silent-resolution`: the narration commits to one reading of a passage a careful reader would call ambiguous, with no escalation on record.

Set `mustRevise: true` for any `invention`, any `silent-resolution`, or `drift` that changes the argument. Cite the exact words that convict. Overall verdict is `revise` if any segment must revise.

Be specific and quote evidence. Do not pad: a clean segment gets `supported`, no violations, one sentence of explanation.


### Input (user)

SOURCE ESSAY:

There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate. The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.

We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute is a map. The calendar is a map. The salary band, the credit score, the diagnosis — maps, every one, and each of them claims a piece of jurisdiction over the terrain of a life. I do not think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts.

A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping, is territory. Everything else arrives pre-drawn.

I noticed this first in grief, which does not mean grief taught it to me. The maps for grief are unusually bad. People handed me schedules for it — stages, timelines, the gentle bureaucracy of condolence — and none of the schedules survived contact with a single Tuesday afternoon. The territory of loss is unmappable not because it is large but because it will not hold still. Every survey expires as it is completed.

What worries me is not that we use maps. A creature without maps is a creature without plans. What worries me is the direction of correction. When my phone and the street disagree, the street used to win instantly; now there is that pause. The pause is small, but pauses compound. Institutions are built out of compounded pauses — a bureaucracy is just a place where the map wins by default and the burden of proof has moved onto the territory.

I do not know what to do about this, and I distrust essays that know what to do. I only know the exercise that helps me: once a day, find one thing the map missed. The crack in the pavement shaped like a river delta. The neighbor's dog that has learned the exact hour of the mail. The way the light in the stairwell fails, every evening, in two stages rather than one. None of this is on any map, and noticing it is not a spiritual practice. It is cartographic dissent.

The map is not the territory, but that sentence is itself a map, and I hold it loosely. Some days the phone is right and the street is wrong — a road closed that looks open, a store that moved without changing its sign. The territory can lie too, or at least mislead. Perhaps the honest position is not map versus territory but a permanent, uncomfortable diplomacy between them, in which my only non-negotiable is to remain the diplomat — to refuse to let either side speak for me unattended.

I stand on the corner. The phone says turn left. The street says the left is gone. I look up, and for one second longer than last year, I check the phone again.

---

ADAPTATION SEGMENTS:

[0] NARRATION: There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate.
    ANCHOR: There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate.

[1] NARRATION: The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.
    ANCHOR: The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.

[2] NARRATION: We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute 
… [5445 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the essay's opening.","mustRevise":false},{"index":1,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":2,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":3,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":4,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":5,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":6,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":7,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":8,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":9,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":10,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":11,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":12,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":13,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":14,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":15,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":16,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":17,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the closing paragraph.","mustRevise":false}],"overall":"pass","summary":"The adaptation reproduces the essay essentially verbatim across all eighteen segments, preserving the author's distinctive phrasing and argument without addition, drift, or invention. No style violations detected."}

*usage: 4292 in / 961 out — $0.0455*

