# Trajectory — case `syn-03`, agent `verifier`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0502.

Raw record (full requests/responses): `trajectories/raw/syn-03.verifier.jsonl`

---

## Step: verify-1 — 2026-08-29T01:57:25.713Z

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

The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND. Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather. In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm. He laughed and told me the door had never been wired to anything. The sign was the security system.

I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs. The application you do not submit because the requirements page says five years of experience. The conversation you do not start because of the look on her face, which turns out, years later, to have been about something else entirely. The field you do not enter because everyone knows it is impossible to enter, where "everyone knows" is a sentence that has never once been tested by a person you could name.

I told my brother the story of the door, expecting him to laugh. He didn't. He pointed out that the sign had worked for decades, which meant it had done its job better than any alarm — no repairs, no false alarms at midnight, no maintenance contract. Cheap, silent, perfect. The question, he said, is not whether the fences are real. The question is who pays for the checking.

He stopped checking the locked doors years ago. I remember when it happened, more or less: after the second startup, after the move back, around the time he started describing himself as realistic. He would say — he did say, more than once — that a man with a family tests fewer fences, and that this is not cowardice but arithmetic. The checking has a price, and the price is paid in evenings and in embarrassment, and some ledgers cannot absorb it.

I find I cannot argue with the arithmetic and cannot accept the conclusion, which my grandmother would have said is the surest sign that the argument is standing on something buried. Whatever it stands on, here is what I know. The electrician was not a philosopher. He was a man with a ladder who needed the door open, and so he opened it, and the great security system of the fourth floor dissolved in front of a person who had simply never agreed to believe in it.

They rewired the door the following month — a real alarm this time, I am told. I like to think of it as the building's confession. The sign alone was no longer enough, because now one person on the floor had seen behind it, and belief, once it has an exception, has to be replaced with infrastructure.

Check one door a year. That is the whole discipline I have salvaged from six years in that building. Not every door; the arithmetic is real, and the evenings are finite. One a year, chosen well, tested quietly, with a ladder if necessary. Most will be wired. The ones that are not will change what you believe the building is.

---

ADAPTATION SEGMENTS:

[0] NARRATION: The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND.
    ANCHOR: The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND.

[1] NARRATION: Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather.
    ANCHOR: Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather.

[2] NARRATION: In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm.
    ANCHOR: In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm.

[3] NARRATION: He laughed and told me the door had never been wired to anything. The sign was the security system.
    ANCHOR: He laughe
… [5551 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"support":"supported","styleViolations":[],"explanation":"Verbatim from the opening line.","mustRevise":false},{"index":1,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":2,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":3,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":4,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":5,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":6,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":7,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":8,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":9,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":10,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":11,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":12,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":13,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":14,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":15,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":16,"support":"supported","styleViolations":[],"explanation":"Verbatim match, including 'fourth floor'.","mustRevise":false},{"index":17,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":18,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":19,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":20,"support":"supported","styleViolations":[],"explanation":"Verbatim match.","mustRevise":false},{"index":21,"support":"supported","styleViolations":[],"explanation":"Verbatim match, essay's closing lines.","mustRevise":false}],"overall":"pass","summary":"The adaptation is a verbatim reproduction of the source essay, segmented sentence-by-sentence. Every anchor matches its narration exactly, with no additions, drift, or invention. No style violations detected."}

*usage: 4244 in / 1160 out — $0.0502*

