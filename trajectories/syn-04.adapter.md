# Trajectory — case `syn-04`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s): `adapt`. Total cost: $0.0561.

**What happened in this run:** a single pass. The verifier returned `pass` on the first round, so the revision loop never fired and no step needed feedback from a previous one.

Raw record (full requests/responses): `trajectories/raw/syn-04.adapter.jsonl`

---

## Step 1: `adapt` — 2026-08-29T01:57:41.673Z

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

# Low Tide

Low tide is the sea thinking better of it. Twice a day the water recants, and what it leaves is not absence but testimony: ribbed sand like the roof of a mouth, pools that hold the sky in shallow custody, a boat leaning on its own shadow as if tired of standing. The harbor at low tide is an argument laid open mid-sentence, all its clauses visible, none of them finished.

I walk it the way you walk through a friend's unlocked house — permitted, uneasy, alert to what is usually covered. Here is the chain that does the mooring's real work, gross with weed, honest as a tendon. Here is the crab traffic, sideways commerce in a city with no vertical. Here are the boots of a drowned pier, six of them, standing in a row like a regiment that dissolved above the ankles.

The sea will be back to contradict all this. That is the arrangement. The truth of the harbor is not the water and not the sand; it is the alternation, the twice-daily willingness of each to be corrected by the other. Land and water take turns being wrong, and the turning is the only sentence the harbor ever completes.

We had a neighbor, in the years we lived above the seawall, who timed her decisions to the tide. Contracts at high water, endings at low. Everyone teased her; everyone consulted her. She said the tide was the only adviser that had never once flattered her, and looking back across the wet ruin of an afternoon harbor, all its machinery bared, its inventories confessed, I find I cannot improve on the principle. Ask your questions at low tide. Sign nothing until you have seen what the water was covering.

### Agent output

{"segments":[{"index":0,"narration":"Low tide is the sea thinking better of it. Twice a day the water recants, and what it leaves is not absence but testimony: ribbed sand like the roof of a mouth, pools that hold the sky in shallow custody, a boat leaning on its own shadow as if tired of standing.","anchor":"Low tide is the sea thinking better of it. Twice a day the water recants, and what it leaves is not absence but testimony: ribbed sand like the roof of a mouth, pools that hold the sky in shallow custody, a boat leaning on its own shadow as if tired of standing."},{"index":1,"narration":"The harbor at low tide is an argument laid open mid-sentence, all its clauses visible, none of them finished.","anchor":"The harbor at low tide is an argument laid open mid-sentence, all its clauses visible, none of them finished."},{"index":2,"narration":"I walk it the way you walk through a friend's unlocked house — permitted, uneasy, alert to what is usually covered.","anchor":"I walk it the way you walk through a friend's unlocked house — permitted, uneasy, alert to what is usually covered."},{"index":3,"narration":"Here is the chain that does the mooring's real work, gross with weed, honest as a tendon. Here is the crab traffic, sideways commerce in a city with no vertical.","anchor":"Here is the chain that does the mooring's real work, gross with weed, honest as a tendon. Here is the crab traffic, sideways commerce in a city with no vertical."},{"index":4,"narration":"Here are the boots of a drowned pier, six of them, standing in a row like a regiment that dissolved above the ankles.","anchor":"Here are the boots of a drowned pier, six of them, standing in a row like a regiment that dissolved above the ankles."},{"index":5,"narration":"The sea will be back to contradict all this. That is the arrangement.","anchor":"The sea will be back to contradict all this. That is the arrangement."},{"index":6,"narration":"The truth of the harbor is not the water and not the sand; it is the alternation, the twice-daily willingness of each to be corrected by the other. Land and water take turns being wrong, and the turning is the only sentence the harbor ever completes.","anchor":"The truth of the harbor is not the water and not the sand; it is the alternation, the twice-daily willingness of each to be corrected by the other. Land and water take turns being wrong, and the turning is the only sentence the harbor ever completes."},{"index":7,"narration":"We had a neighbor, in the years we lived above the seawall, who timed her decisions to the tide. Contracts at high water, endings at low. Everyone teased her; everyone consulted her.","anchor":"We had a neighbor, in the years we lived above the seawall, who timed her decisions to the tide. Contracts at high water, endings at low. Everyone teased her; everyone consulted her."},{"index":8,"narration":"She said the tide was the only adviser that had never once flattered her, and looking back across the wet ruin of an afternoon harbor, all its machinery bared, its inventories confessed, I find I cannot improve on the principle.","anchor":"She said the tide was the only adviser that had never once flattered her, and looking back across the wet ruin of an afternoon harbor, all its machinery bared, its inventories confessed, I find I cannot improve on the principle."},{"index":9,"narration":"Ask your questions at low tide. Sign nothing until you have seen what the water was covering.","anchor":"Ask your questions at low tide. Sign nothing until you have seen what the water was covering."}],"escalations":[]}

*usage: 2011 in / 1840 out — $0.0561*

