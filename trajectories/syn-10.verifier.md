# Trajectory — case `syn-10`, agent `verifier`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0423.

Raw record (full requests/responses): `trajectories/raw/syn-10.verifier.jsonl`

---

## Step: verify-1 — 2026-08-29T02:58:25.791Z

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

My aunt was dying for eleven years.

I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me. They offer *she was ill for eleven years*, or *she had been dying for a long time*, and they mean it kindly — they are smoothing what sounds like a mistake. It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.

The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her. Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was *doing* — a question that had stopped meaning anything.

She noticed. She had, she said, outlived her own funeral. The casseroles came and were eaten and did not come again. The cousin who flew in from Lisbon flew in twice more and then stopped flying in. Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long the shape gives out and people quietly return to their lives, which is not a cruelty, only arithmetic.

What she was left with was the work. Every morning she got up and did the thing again, and there was no audience left for it, and it was not building toward anything, and it took eleven years. I have never seen anyone do anything harder. The word for it is not *illness*. Illness is what the body has. Dying was her occupation, and she clocked in.

Near the end — the real end, the one that finally took — she told me she had stopped being frightened around year six and had never got it back. Not courage, she said. Attrition. You cannot sustain terror for six years any more than you can sustain a sprint; the body files it away and gets on with the morning. She said this as though confessing to something shameful, and I have thought since that it was the most enviable thing anyone has ever told me.

She was dying for eleven years. She was also, in the same eleven years, doing the crossword, quarrelling about politics, and teaching my daughter to lie convincingly at cards. Both sentences are true, and only one of them gets corrected.

---

ADAPTATION SEGMENTS:

[1] NARRATION: My aunt was dying for eleven years.
    ANCHOR: My aunt was dying for eleven years.

[2] NARRATION: I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me.
    ANCHOR: I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me.

[3] NARRATION: They offer she was ill for eleven years, or she had been dying for a long time, and they mean it kindly — they are smoothing what sounds like a mistake.
    ANCHOR: They offer *she was ill for eleven years*, or *she had been dying for a long time*, and they mean it kindly — they are smoothing what sounds like a mistake.
    NOTE: Italic markers in source rendered as plain speech.

[4] NARRATION: It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.
    ANCHOR: It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.

[5] NARRATION: The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her.
    ANCHOR: The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her.

[6] NARRATION: Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was doing — a question that had stopp
… [3619 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":1,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the opening line.","mustRevise":false},{"index":2,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":3,"support":"supported","styleViolations":[],"explanation":"Verbatim except italics rendered as plain text, which is acceptable.","mustRevise":false},{"index":4,"support":"supported","styleViolations":[],"explanation":"Verbatim match retaining the distinctive gardening image.","mustRevise":false},{"index":5,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":6,"support":"supported","styleViolations":[],"explanation":"Verbatim except italics on 'doing' rendered plain.","mustRevise":false},{"index":7,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":8,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":9,"support":"supported","styleViolations":[],"explanation":"Verbatim match preserving the grief/arithmetic phrasing.","mustRevise":false},{"index":10,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":11,"support":"supported","styleViolations":[],"explanation":"Verbatim except italics on 'illness' rendered plain.","mustRevise":false},{"index":12,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":13,"support":"supported","styleViolations":[],"explanation":"Verbatim match preserving the attrition/sprint phrasing.","mustRevise":false},{"index":14,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":15,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the source.","mustRevise":false},{"index":16,"support":"supported","styleViolations":[],"explanation":"Verbatim match with the closing line.","mustRevise":false}],"overall":"pass","summary":"The adaptation is essentially a verbatim reproduction of the source essay, with the only change being italic markers rendered as plain speech (flagged in notes). No drift, invention, or style violations detected across all sixteen segments."}

*usage: 3758 in / 939 out — $0.0423*

