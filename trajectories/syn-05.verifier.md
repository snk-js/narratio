# Trajectory — case `syn-05`, agent `verifier`

Model: `claude-opus-4-8`. 1 call(s): `verify-1`. Total cost: $0.0357.

**What happened in this run:** a single pass. The verifier returned `pass` on the first round, so the revision loop never fired and no step needed feedback from a previous one.

Raw record (full requests/responses): `trajectories/raw/syn-05.verifier.jsonl`

---

## Step 1: `verify-1` — 2026-08-29T01:58:12.447Z

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

Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent. It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence ("I'm just going to move my car, this is my spot"). It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all.

This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought. The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a theft of time but a repudiation of the constitution. He has declared, in front of everyone, that the government does not exist for him. Every queue member feels the insult personally, because each of them has been paying taxes to that government since they arrived: standing when they could have pushed, waiting when they could have schemed.

Notice, too, how quickly the state forms. Three people at a bus stop are a crowd; four are a queue, and the fourth arrival can usually reconstruct the order of the first three without asking. We assemble these micro-nations dozens of times a day, ratify their laws by standing still, and dissolve them without ceremony the moment the bus arrives. No flags, no anthems, and yet I have seen men in expensive suits — men who negotiate for a living and would call patriotism sentimental — go visibly red defending the sovereignty of a sandwich line.

The queue is proof of something we rarely credit ourselves with: that ordinary people, unsupervised, will build fairness out of nothing but shared standing and mutual watching, and will pay real costs to maintain it. It is also proof of the fragility underneath. One unpunished violation and the constitution wobbles; two, and men who waited politely for twenty minutes begin edging forward, because no one keeps paying taxes to a government that has stopped existing. Order of this kind is not a possession. It is a practice, renewed by every person who joins the end of the line when no one would have stopped them doing otherwise.

---

ADAPTATION SEGMENTS:

[0] NARRATION: Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent.
    ANCHOR: Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent.

[1] NARRATION: It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence: "I'm just going to move my car, this is my spot."
    ANCHOR: It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence ("I'm just going to move my car, this is my spot").

[2] NARRATION: It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all.
    ANCHOR: It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all.

[3] NARRATION: This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought.
    ANCHOR: This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought.

[4] NARRATION: The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a theft of time but a repudiation of the constitution.
    ANCHOR: The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a the
… [3243 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"support":"supported","styleViolations":[],"explanation":"Verbatim from the essay's opening.","mustRevise":false},{"index":1,"support":"supported","styleViolations":[],"explanation":"Matches source; only punctuation of the parenthetical changed to a colon and quotes.","mustRevise":false},{"index":2,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":3,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":4,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":5,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":6,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":7,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":8,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":9,"support":"supported","styleViolations":[],"explanation":"Verbatim, distinctive phrasing preserved.","mustRevise":false},{"index":10,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":11,"support":"supported","styleViolations":[],"explanation":"Verbatim.","mustRevise":false},{"index":12,"support":"supported","styleViolations":[],"explanation":"Verbatim closing.","mustRevise":false}],"overall":"pass","summary":"The adaptation reproduces the essay essentially verbatim across all thirteen segments, preserving the author's distinctive phrasing and argument. No drift, invention, or style violations found."}

*usage: 3597 in / 707 out — $0.0357*

