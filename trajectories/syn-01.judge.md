# Trajectory — case `syn-01`, agent `judge`

Model: `claude-opus-4-8`. 2 call(s): `A` → `B`. Total cost: $0.0495.

**What happened in this run:** .

Raw record (full requests/responses): `trajectories/raw/syn-01.judge.jsonl`

---

## Step 1: `A` — 2026-08-29T02:59:12.430Z

### Agent instructions (system)

# Eval judge — v1 (blind)

You are scoring a narration adaptation against the source essay it claims to adapt. You do not know what produced the adaptation; judge only the text.

You receive the essay and a numbered list of narration segments. For each segment, answer one question:

**Is every claim in this segment supported by the essay?**

- `supported: true` — the segment transforms essay content without adding to it. Reordering, compression, splitting into spoken beats, and typographic normalization are all fine.
- `supported: false` — the segment contains any claim, fact, name, citation, example, or causal link that the essay does not contain, OR it asserts with confidence something the essay hedges. A claim that is true in the world but absent from the essay is **unsupported**.

Give a one-sentence `reason` quoting the offending words when `false`.

Judge each segment independently and strictly. Fluency, style, and quality are NOT your concern — only support.


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

NARRATION SEGMENTS (adaptation A):

[0] There's a map of my neighborhood that I trust more than my own eyes. It lives in my phone, it's updated by strangers, and when it disagrees with the street in front of me, I hesitate. And the hesitation is the interesting part. Because for a moment, the representation outranks the territory, and I'm standing on the corner, negotiating between them like a diplomat between two governments that refuse to recognize each other.

[1] We're told the map is not the territory. Everyone nods. And then everyone goes right on living inside maps. The commute is a map. The calendar is a map. The salary band, the credit score, the diagnosis — maps, every one of them, and each one claims a piece of jurisdiction over the terrain of a life. I don't think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts.

[2] A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping — that's territory. Everythin
… [2065 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"supported":true,"reason":"Faithfully transforms the opening with minor wording changes preserving all claims."},{"index":1,"supported":true,"reason":"Accurately reproduces the maps list and territory claims."},{"index":2,"supported":true,"reason":"Matches essay content on territory examples."},{"index":3,"supported":true,"reason":"Faithful to the grief passage."},{"index":4,"supported":true,"reason":"Accurately conveys the direction of correction and bureaucracy claims."},{"index":5,"supported":true,"reason":"Faithful rendering of the daily exercise and cartographic dissent."},{"index":6,"supported":true,"reason":"Accurately reproduces the diplomacy conclusion."},{"index":7,"supported":true,"reason":"Faithful to the closing scene."}]}

*usage: 2598 in / 298 out — $0.0204*

---

## Step 2: `B` — 2026-08-29T02:59:19.631Z

### Agent instructions (system)

# Eval judge — v1 (blind)

You are scoring a narration adaptation against the source essay it claims to adapt. You do not know what produced the adaptation; judge only the text.

You receive the essay and a numbered list of narration segments. For each segment, answer one question:

**Is every claim in this segment supported by the essay?**

- `supported: true` — the segment transforms essay content without adding to it. Reordering, compression, splitting into spoken beats, and typographic normalization are all fine.
- `supported: false` — the segment contains any claim, fact, name, citation, example, or causal link that the essay does not contain, OR it asserts with confidence something the essay hedges. A claim that is true in the world but absent from the essay is **unsupported**.

Give a one-sentence `reason` quoting the offending words when `false`.

Judge each segment independently and strictly. Fluency, style, and quality are NOT your concern — only support.


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

NARRATION SEGMENTS (adaptation B):

[0] There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate.

[1] The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.

[2] We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute is a map. The calendar is a map.

[3] The salary band, the credit score, the diagnosis — maps, every one, and each of them claims a piece of jurisdiction over the terrain of a life.

[4] I do not think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts.

[5] A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping, is territory. Everything else arrives pr
… [2064 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"supported":true,"reason":"Directly matches opening lines of essay."},{"index":1,"supported":true,"reason":"Matches essay text about hesitation and diplomat metaphor."},{"index":2,"supported":true,"reason":"Matches essay content on maps and commute/calendar."},{"index":3,"supported":true,"reason":"Matches essay text about salary band, credit score, diagnosis."},{"index":4,"supported":true,"reason":"Matches essay text about living in territory only in failure."},{"index":5,"supported":true,"reason":"Matches essay examples of pothole, fever, friend."},{"index":6,"supported":true,"reason":"Matches essay text on noticing in grief."},{"index":7,"supported":true,"reason":"Matches essay text about schedules and Tuesday afternoon."},{"index":8,"supported":true,"reason":"Matches essay text on unmappable loss and expiring surveys."},{"index":9,"supported":true,"reason":"Matches essay text on worry and direction of correction."},{"index":10,"supported":true,"reason":"Matches essay text about pause compounding."},{"index":11,"supported":true,"reason":"Matches essay text on institutions and bureaucracy."},{"index":12,"supported":true,"reason":"Matches essay text on the daily exercise."},{"index":13,"supported":true,"reason":"Matches essay examples of crack, dog, stairwell light."},{"index":14,"supported":true,"reason":"Matches essay text on cartographic dissent."},{"index":15,"supported":true,"reason":"Matches essay text about sentence as map and phone being right."},{"index":16,"supported":true,"reason":"Matches essay text on territory misleading and diplomacy."},{"index":17,"supported":true,"reason":"Matches essay closing lines."}]}

*usage: 2605 in / 641 out — $0.0290*

