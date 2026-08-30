# Trajectory — case `syn-01`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s): `adapt`. Total cost: $0.0655.

**What happened in this run:** a single pass. The verifier returned `pass` on the first round, so the revision loop never fired and no step needed feedback from a previous one.

Raw record (full requests/responses): `trajectories/raw/syn-01.adapter.jsonl`

---

## Step 1: `adapt` — 2026-08-29T01:56:20.837Z

### Agent instructions (system)

# Adapter agent — v1

You adapt a human-written essay into a narration script. The author's name goes on the result; your job is transformation, never authorship.

## Hard rules

1. **Nothing enters the narration that the essay does not say.** Adding material that is *true but absent from the essay* — a real citation, plausible context, a fact the author surely knows — is still invention. If the essay doesn't say it, you don't say it.
2. **Every segment carries an anchor**: a verbatim quote of the source passage the segment derives from, copied character-for-character from the essay. The anchor will be checked mechanically by string search — paraphrased or approximate anchors fail.
3. **No structural scaffolding.** No opening hook, no "in this essay/video", no recap, no concluding summary, no call to action. The narration ends where the essay ends.
4. **Ambiguity escalates; it is never silently resolved.** If a load-bearing passage admits more than one reading, do not pick one. Emit an escalation: quote the passage, state each reading neutrally, and ask the question a human must answer. Escalating on a genuinely ambiguous passage is a *success*, not a failure. Do not escalate trivia — only ambiguities that change what the narration would say.

## Craft rules

- Preserve the author's register and rhythm. You may break long written sentences into shorter spoken beats at moments of intensification; preserve long, breathing sentences elsewhere.
- Typographic fixes (obvious typos, doubled punctuation) are allowed; note them in the segment's `note`.
- Segment at natural narrative beats — where a listener needs a breath or the argument turns. Typical segments run one to three sentences.
- If you cut or reorder source material, say so in `note`.

## Output

Produce segments in order, covering the essay, each with: `index`, `narration`, `anchor` (verbatim source quote), optional `note`. Plus `escalations` (empty array if none — do not manufacture them).


## Language

Write the narration in the same language as the source essay.

### Input (user)

# Cartographic Dissent

There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate. The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.

We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute is a map. The calendar is a map. The salary band, the credit score, the diagnosis — maps, every one, and each of them claims a piece of jurisdiction over the terrain of a life. I do not think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts.

A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping, is territory. Everything else arrives pre-drawn.

I noticed this first in grief, which does not mean grief taught it to me. The maps for grief are unusually bad. People handed me schedules for it — stages, timelines, the gentle bureaucracy of condolence — and none of the schedules survived contact with a single Tuesday afternoon. The territory of loss is unmappable not because it is large but because it will not hold still. Every survey expires as it is completed.

What worries me is not that we use maps. A creature without maps is a creature without plans. What worries me is the direction of correction. When my phone and the street disagree, the street used to win instantly; now there is that pause. The pause is small, but pauses compound. Institutions are built out of compounded pauses — a bureaucracy is just a place where the map wins by default and the burden of proof has moved onto the territory.

I do not know what to do about this, and I distrust essays that know what to do. I only know the exercise that helps me: once a day, find one thing the map missed. The crack in the pavement shaped like a river delta. The neighbor's dog that has learned the exact hour of the mail. The way the light in the stairwell fails, every evening, in two stages rather than one. None of this is on any map, and noticing it is not a spiritual practice. It is cartographic dissent.

The map is not the territory, but that sentence is itself a map, and I hold it loosely. Some days the phone is right and the street is wrong — a road closed that looks open, a store that moved without changing its sign. The territory can lie too, or at least mislead. Perhaps the honest position is not map versus territory but a permanent, uncomfortable diplomacy between them, in which my only non-negotiable is to remain the diplomat — to refuse to let either side speak for me unattended.

I stand on the corner. The phone says turn left. The street says the left is gone. I look up, and for one second longer than last year, I check the phone again.

### Agent output

{"segments":[{"index":0,"narration":"There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate.","anchor":"There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate."},{"index":1,"narration":"The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.","anchor":"The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other."},{"index":2,"narration":"We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute is a map. The calendar is a map.","anchor":"We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute is a map. The calendar is a map."},{"index":3,"narration":"The salary band, the credit score, the diagnosis — maps, every one, and each of them claims a piece of jurisdiction over the terrain of a life.","anchor":"The salary band, the credit score, the diagnosis — maps, every one, and each of them claims a piece of jurisdiction over the terrain of a life."},{"index":4,"narration":"I do not think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts.","anchor":"I do not think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts."},{"index":5,"narration":"A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping, is territory. Everything else arrives pre-drawn.","anchor":"A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping, is territory. Everything else arrives pre-drawn."},{"index":6,"narration":"I noticed this first in grief, which does not mean grief taught it to me. The maps for grief are unusually bad.","anchor":"I noticed this first in grief, which does not mean grief taught it to me. The maps for grief are unusually bad."},{"index":7,"narration":"People handed me schedules for it — stages, timelines, the gentle bureaucracy of condolence — and none of the schedules survived contact with a single Tuesday afternoon.","anchor":"People handed me schedules for it — stages, timelines, the gentle bureaucracy of condolence — and none of the schedules survived contact with a single Tuesday afternoon."},{"index":8,"narration":"The territory of loss is unmappable not because it is large but because it will not hold still. Every survey expires as it is completed.","anchor":"The territory of loss is unmappable not because it is large but because it will not hold still. Every survey expires as it is completed."},{"index":9,"narration":"What worries me is not that we use maps. A creature without maps is a creature without plans. What worries me is the direction of correction.","anchor":"What worries me is not that we use maps. A creature without maps is a creature without plans. What worries me is the direction of correction."},{"index":10,"narration":"When my phone and the street disagree, the street used to win instantly; now there is that pause. The pause is small, but pauses compound.","anchor":"When my phone and the street disagree, the street used to win instantly; now there is that pause. The pause is small, but pauses compound."},{"index":11,"narration":"Institutions are built out of compounded pauses — a bureaucracy is just a place where the map wins by default and the burden of proof has moved onto the territory.","anchor":"Institutions are built out of compounded pauses — a
… [2609 chars truncated — full text in raw/]

*usage: 2402 in / 2141 out — $0.0655*

