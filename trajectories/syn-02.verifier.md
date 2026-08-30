# Trajectory — case `syn-02`, agent `verifier`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0390.

Raw record (full requests/responses): `trajectories/raw/syn-02.verifier.jsonl`

---

## Step: verify-1 — 2026-08-29T22:24:34.382Z

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

My grandmother rehearsed her own funeral the way other people rehearse job interviews. She would narrate it at the kitchen table, unprompted, between the coffee and the bread: who would cry too much, who would cry too little, which cousin would arrive late and blame the traffic, what the priest would get wrong about her. She did this for thirty years. She outlived two of the priests.

As a child I found it morbid. As a teenager I found it embarrassing. It took me until my own first rehearsals — lying awake drafting the speech for a crisis that never came — to understand that she was not predicting anything. The rehearsal does not aim at the future. It aims at the unbearable present, and it works by borrowing the future's authority.

This is the part I keep turning over. A rehearsed catastrophe is a domesticated one. You cannot control whether the flood comes, but you can control the drill, and the drill is real in a way the flood is not yet. The body performing the drill learns something true: where the exits are, what the first sentence of the terrible phone call should be. That the flood, when it comes, ignores the drill entirely — arrives by a different door, requires a different sentence — does not make the drill useless. It makes it a ritual, which is a different kind of useful.

I want to be careful here, because there are two ways to read what she was doing, and I genuinely do not know which is true. She rehearsed because she could not stop. The sentence sits flat on the page and refuses to choose: the rehearsal as compulsion, a thing that gripped her and would not let go — or the rehearsal as the one thing that made stopping possible, the nightly discharge that let her put death down and sleep. Compulsion or medicine. Thirty years at the kitchen table and I cannot tell you which, and I suspect she could not have told you either.

What I can tell you is what the rehearsals did to us, the audience. They wore the terror smooth. By the time the real funeral came — and it came wrong, of course, on a Tuesday, in a month she had never once chosen for it — we had heard the story so many times that grief had somewhere to sit. The room was strange but the furniture was familiar. We knew our roles even as we failed to perform them.

I rehearse now. Small things: difficult conversations, the moment of being found out for crimes I have not committed, the eulogy for people in perfect health. I no longer call it morbid. I call it the maintenance of furniture — keeping a place for the unbearable to sit, against the day it finally, punctually, arrives.

---

ADAPTATION SEGMENTS:

[0] NARRATION: My grandmother rehearsed her own funeral the way other people rehearse job interviews. She would narrate it at the kitchen table, unprompted, between the coffee and the bread: who would cry too much, who would cry too little, which cousin would arrive late and blame the traffic, what the priest would get wrong about her.
    ANCHOR: My grandmother rehearsed her own funeral the way other people rehearse job interviews. She would narrate it at the kitchen table, unprompted, between the coffee and the bread: who would cry too much, who would cry too little, which cousin would arrive late and blame the traffic, what the priest would get wrong about her.

[1] NARRATION: She did this for thirty years. She outlived two of the priests.
    ANCHOR: She did this for thirty years. She outlived two of the priests.

[2] NARRATION: As a child I found it morbid. As a teenager I found it embarrassing. It took me until my own first rehearsals — lying awake drafting the speech for a crisis that never came — to understand that she was not predicting anything.
    ANCHOR: As a child I found it morbid. As a teenager I found it embarrassing. It took me until my own first rehearsals — lying awake drafting the speech for a crisis that never came — to understand that she was not predicting anything.

[3] NARRATION: The rehearsal does not aim at the future
… [4226 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"support":"supported","styleViolations":[],"explanation":"Verbatim from the essay opening.","mustRevise":false},{"index":1,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":2,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":3,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":4,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":5,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":6,"support":"supported","styleViolations":[],"explanation":"Exact match to source, preserves the stated ambiguity.","mustRevise":false},{"index":7,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":8,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":9,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":10,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":11,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":12,"support":"supported","styleViolations":[],"explanation":"Exact match to source.","mustRevise":false},{"index":13,"support":"supported","styleViolations":[],"explanation":"Exact match to source ending.","mustRevise":false}],"overall":"pass","summary":"The adaptation reproduces the essay verbatim across all segments. No support drift, no invention, and none of the four style violations appear — including the delicate ambiguity in segments 6-8, which is preserved intact."}

*usage: 3902 in / 779 out — $0.0390*

