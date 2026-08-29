# Trajectory — case `syn-03`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0652.

Raw record (full requests/responses): `trajectories/raw/syn-03.adapter.jsonl`

---

## Step: adapt — 2026-08-29T01:57:13.595Z

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

# The Wired Door

The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND. Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather. In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm. He laughed and told me the door had never been wired to anything. The sign was the security system.

I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs. The application you do not submit because the requirements page says five years of experience. The conversation you do not start because of the look on her face, which turns out, years later, to have been about something else entirely. The field you do not enter because everyone knows it is impossible to enter, where "everyone knows" is a sentence that has never once been tested by a person you could name.

I told my brother the story of the door, expecting him to laugh. He didn't. He pointed out that the sign had worked for decades, which meant it had done its job better than any alarm — no repairs, no false alarms at midnight, no maintenance contract. Cheap, silent, perfect. The question, he said, is not whether the fences are real. The question is who pays for the checking.

He stopped checking the locked doors years ago. I remember when it happened, more or less: after the second startup, after the move back, around the time he started describing himself as realistic. He would say — he did say, more than once — that a man with a family tests fewer fences, and that this is not cowardice but arithmetic. The checking has a price, and the price is paid in evenings and in embarrassment, and some ledgers cannot absorb it.

I find I cannot argue with the arithmetic and cannot accept the conclusion, which my grandmother would have said is the surest sign that the argument is standing on something buried. Whatever it stands on, here is what I know. The electrician was not a philosopher. He was a man with a ladder who needed the door open, and so he opened it, and the great security system of the fourth floor dissolved in front of a person who had simply never agreed to believe in it.

They rewired the door the following month — a real alarm this time, I am told. I like to think of it as the building's confession. The sign alone was no longer enough, because now one person on the floor had seen behind it, and belief, once it has an exception, has to be replaced with infrastructure.

Check one door a year. That is the whole discipline I have salvaged from six years in that building. Not every door; the arithmetic is real, and the evenings are finite. One a year, chosen well, tested quietly, with a ladder if necessary. Most will be wired. The ones that are not will change what you believe the building is.

### Agent output

{"segments":[{"index":0,"narration":"The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND.","anchor":"The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND."},{"index":1,"narration":"Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather.","anchor":"Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather."},{"index":2,"narration":"In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm.","anchor":"In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm."},{"index":3,"narration":"He laughed and told me the door had never been wired to anything. The sign was the security system.","anchor":"He laughed and told me the door had never been wired to anything. The sign was the security system."},{"index":4,"narration":"I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs.","anchor":"I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs."},{"index":5,"narration":"The application you do not submit because the requirements page says five years of experience.","anchor":"The application you do not submit because the requirements page says five years of experience."},{"index":6,"narration":"The conversation you do not start because of the look on her face, which turns out, years later, to have been about something else entirely.","anchor":"The conversation you do not start because of the look on her face, which turns out, years later, to have been about something else entirely."},{"index":7,"narration":"The field you do not enter because everyone knows it is impossible to enter, where \"everyone knows\" is a sentence that has never once been tested by a person you could name.","anchor":"The field you do not enter because everyone knows it is impossible to enter, where \"everyone knows\" is a sentence that has never once been tested by a person you could name."},{"index":8,"narration":"I told my brother the story of the door, expecting him to laugh. He didn't.","anchor":"I told my brother the story of the door, expecting him to laugh. He didn't."},{"index":9,"narration":"He pointed out that the sign had worked for decades, which meant it had done its job better than any alarm — no repairs, no false alarms at midnight, no maintenance contract. Cheap, silent, perfect.","anchor":"He pointed out that the sign had worked for decades, which meant it had done its job better than any alarm — no repairs, no false alarms at midnight, no maintenance contract. Cheap, silent, perfect."},{"index":10,"narration":"The question, he said, is not whether the fences are real. The question is who pays for the checking.","anchor":"The question, he said, is not whether the fences are real. The question is who pays for the checking."},{"index":11,"narration":"He stopped checking the locked doors years ago. I remember when it happened, more or less: after the second startup, after the move back, around the time he started describing himself as realistic.","anchor":"He stopped checking the locked doors years ago. I remember when it happened, more or less: after the second startup, after the move back, around the time he started describing himself as realistic."},{"index":12,"narration":"He would say — he did say, more than once — that a man with a family tests fewer fences, and that this is not cowardice but arithmetic.","anchor":"He would say — he did say, more than once — that a man with a family tests fewer fences, and that this is not cowardice but arithmetic."},{"index":13,"narration":"Th
… [2759 chars truncated — full text in raw/]

*usage: 2357 in / 2135 out — $0.0652*

