# Trajectory — case `syn-05`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0536.

Raw record (full requests/responses): `trajectories/raw/syn-05.adapter.jsonl`

---

## Step: adapt — 2026-08-29T01:58:04.622Z

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

# The Government of Queues

Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent. It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence ("I'm just going to move my car, this is my spot"). It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all.

This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought. The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a theft of time but a repudiation of the constitution. He has declared, in front of everyone, that the government does not exist for him. Every queue member feels the insult personally, because each of them has been paying taxes to that government since they arrived: standing when they could have pushed, waiting when they could have schemed.

Notice, too, how quickly the state forms. Three people at a bus stop are a crowd; four are a queue, and the fourth arrival can usually reconstruct the order of the first three without asking. We assemble these micro-nations dozens of times a day, ratify their laws by standing still, and dissolve them without ceremony the moment the bus arrives. No flags, no anthems, and yet I have seen men in expensive suits — men who negotiate for a living and would call patriotism sentimental — go visibly red defending the sovereignty of a sandwich line.

The queue is proof of something we rarely credit ourselves with: that ordinary people, unsupervised, will build fairness out of nothing but shared standing and mutual watching, and will pay real costs to maintain it. It is also proof of the fragility underneath. One unpunished violation and the constitution wobbles; two, and men who waited politely for twenty minutes begin edging forward, because no one keeps paying taxes to a government that has stopped existing. Order of this kind is not a possession. It is a practice, renewed by every person who joins the end of the line when no one would have stopped them doing otherwise.

### Agent output

{"segments":[{"index":0,"narration":"Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent.","anchor":"Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent."},{"index":1,"narration":"It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence: \"I'm just going to move my car, this is my spot.\"","anchor":"It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence (\"I'm just going to move my car, this is my spot\")."},{"index":2,"narration":"It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all.","anchor":"It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all."},{"index":3,"narration":"This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought.","anchor":"This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought."},{"index":4,"narration":"The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a theft of time but a repudiation of the constitution.","anchor":"The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a theft of time but a repudiation of the constitution."},{"index":5,"narration":"He has declared, in front of everyone, that the government does not exist for him.","anchor":"He has declared, in front of everyone, that the government does not exist for him."},{"index":6,"narration":"Every queue member feels the insult personally, because each of them has been paying taxes to that government since they arrived: standing when they could have pushed, waiting when they could have schemed.","anchor":"Every queue member feels the insult personally, because each of them has been paying taxes to that government since they arrived: standing when they could have pushed, waiting when they could have schemed."},{"index":7,"narration":"Notice, too, how quickly the state forms. Three people at a bus stop are a crowd; four are a queue, and the fourth arrival can usually reconstruct the order of the first three without asking.","anchor":"Notice, too, how quickly the state forms. Three people at a bus stop are a crowd; four are a queue, and the fourth arrival can usually reconstruct the order of the first three without asking."},{"index":8,"narration":"We assemble these micro-nations dozens of times a day, ratify their laws by standing still, and dissolve them without ceremony the moment the bus arrives.","anchor":"We assemble these micro-nations dozens of times a day, ratify their laws by standing still, and dissolve them without ceremony the moment the bus arrives."},{"index":9,"narration":"No flags, no anthems, and yet I have seen men in expensive suits — men who negotiate for a living and would call patriotism sentimental — go visibly red defending the sovereignty of a sandwich line.","anchor":"No flags, no anthems, and yet I have seen men in expensive suits — men who negotiate for a living and would call patriotism sentimental — go visibly red defending the sovereignty of a sandwich line."},{"index":10,"narration":"The queue is proof of something we rarely credit ourselves with: that ordinary people, unsupervised, will build fairness out of nothing but shared standing and mutual watching, and will pay real costs to maintain it.","anchor":"The queue is proof of something we rarely credit ourselves with: that ordinary people, unsupe
… [1054 chars truncated — full text in raw/]

*usage: 2198 in / 1706 out — $0.0536*

