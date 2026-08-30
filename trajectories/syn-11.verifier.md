# Trajectory — case `syn-11`, agent `verifier`

Model: `claude-opus-4-8`. 1 call(s): `verify-1`. Total cost: $0.0369.

**What happened in this run:** a single pass. The verifier returned `pass` on the first round, so the revision loop never fired and no step needed feedback from a previous one.

Raw record (full requests/responses): `trajectories/raw/syn-11.verifier.jsonl`

---

## Step 1: `verify-1` — 2026-08-29T02:58:48.318Z

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

The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about. There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one.

My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months. I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means *do not.*

Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid nothing, and my mother came home and poured a drink and sat in the kitchen with her coat still on.

I have never asked for a transcript of those four minutes. I was twenty-six and busy being certain about things, and by the time I stopped being certain, one of them was dead and the other had stopped discussing it. What I have instead is the shape of the afternoon: the drive out, the four minutes, the coat.

The tin went back on top of the wardrobe and then, after the funeral, into a skip. My mother made that decision alone and told me afterward, in a sentence engineered to close the topic, which it did.

What interests me now is not what was in the letters. Forty letters in one hand across four years — the content is not mysterious, and I am not owed it. What interests me is that a family can carry a thing like that for twenty years and metabolise it entirely through logistics: a tin, a boot, a drive, a skip. Nobody in my family has ever said the word *affair* aloud. The whole business was conducted in the language of objects and their positions, and everyone understood it perfectly.

I think this is more common than the alternative. We tell ourselves that families either talk about things or repress them, but there is a third mode, and it is the one most people actually live in: the thing is fully known, never stated, and managed by moving objects around. The tin on the wardrobe was not a secret. It was an agreement.

---

ADAPTATION SEGMENTS:

[0] NARRATION: The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about.
    ANCHOR: The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about.

[1] NARRATION: There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one.
    ANCHOR: There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one.

[2] NARRATION: My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months.
    ANCHOR: My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months.

[3] NARRATION: I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means do not.
    ANCHOR: I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means *do not.*
    NOTE: Removed italic markup around 'do not' for spoken narration.

[4] NARRATION: Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid nothing, and my mother came home and poured a drink and sat in the kitchen with her coat still on.
    ANCHOR: Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid no
… [3098 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source opening.","mustRevise":false},{"index":1,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":2,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":3,"support":"supported","styleViolations":[],"explanation":"Verbatim except for justified removal of italic markup for spoken narration.","mustRevise":false},{"index":4,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":5,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":6,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":7,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":8,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":9,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":10,"support":"supported","styleViolations":[],"explanation":"Verbatim except for justified removal of italic markup around 'affair'.","mustRevise":false},{"index":11,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of source text.","mustRevise":false},{"index":12,"support":"supported","styleViolations":[],"explanation":"Exact reproduction of the source's closing lines.","mustRevise":false}],"overall":"pass","summary":"The adaptation reproduces the source essay essentially verbatim across all segments, with the only deviations being justified removal of italic markup for spoken narration. No inventions, drift, or style violations found."}

*usage: 3493 in / 778 out — $0.0369*

