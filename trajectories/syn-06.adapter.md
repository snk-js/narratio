# Trajectory — case `syn-06`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0533.

Raw record (full requests/responses): `trajectories/raw/syn-06.adapter.jsonl`

---

## Step: adapt — 2026-08-29T01:58:27.797Z

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

# A Schedule for Knowledge

I have a friend who reads last pages first. She says she is not spoiling the book; she is interviewing it. A book that survives the interview — that can hold her attention even with its ending confessed — has proven it was never depending on the trick. I have argued with her about this for a decade, and I have lost every argument, and I still cannot make myself do it.

My resistance interests me more than her method. What exactly do I think I am protecting? Not information: I forget most endings within a year, sometimes within a month, and reread them as a stranger. Not suspense in any respectable sense: I reread books whose endings I do know, and the rereading is often the better reading. What I am protecting, I think, is a sequence of selves. The person who reaches page two hundred not knowing is a different person from the one who reaches it knowing, and I want to have been the first person before I become the second.

This sounds precious until you notice how much of a life is arranged around the same principle. We could, most of us, find out early how many of our ambitions will pan out — the evidence is usually lying around by thirty-five, unread. We decline to run the numbers. We keep certain envelopes closed not because the contents are unknowable but because we are rationing who we have to become, and when. Ignorance, chosen carefully, is not the absence of knowledge. It is a schedule for it.

My friend would say I am romanticizing slowness, and that her way honors the book more: she gives her hours only to prose that can survive honesty. Perhaps both disciplines are real. Hers tests the book. Mine paces the reader. She interviews; I ripen. The one mistake, we agree, in our only settled treaty, is to do neither on purpose — to let endings arrive unchosen, information unscheduled, the selves succeeding one another with nobody keeping the calendar.

### Agent output

{"segments":[{"index":1,"narration":"I have a friend who reads last pages first. She says she is not spoiling the book; she is interviewing it.","anchor":"I have a friend who reads last pages first. She says she is not spoiling the book; she is interviewing it."},{"index":2,"narration":"A book that survives the interview — that can hold her attention even with its ending confessed — has proven it was never depending on the trick.","anchor":"A book that survives the interview — that can hold her attention even with its ending confessed — has proven it was never depending on the trick."},{"index":3,"narration":"I have argued with her about this for a decade, and I have lost every argument, and I still cannot make myself do it.","anchor":"I have argued with her about this for a decade, and I have lost every argument, and I still cannot make myself do it."},{"index":4,"narration":"My resistance interests me more than her method. What exactly do I think I am protecting?","anchor":"My resistance interests me more than her method. What exactly do I think I am protecting?"},{"index":5,"narration":"Not information: I forget most endings within a year, sometimes within a month, and reread them as a stranger.","anchor":"Not information: I forget most endings within a year, sometimes within a month, and reread them as a stranger."},{"index":6,"narration":"Not suspense in any respectable sense: I reread books whose endings I do know, and the rereading is often the better reading.","anchor":"Not suspense in any respectable sense: I reread books whose endings I do know, and the rereading is often the better reading."},{"index":7,"narration":"What I am protecting, I think, is a sequence of selves. The person who reaches page two hundred not knowing is a different person from the one who reaches it knowing, and I want to have been the first person before I become the second.","anchor":"What I am protecting, I think, is a sequence of selves. The person who reaches page two hundred not knowing is a different person from the one who reaches it knowing, and I want to have been the first person before I become the second."},{"index":8,"narration":"This sounds precious until you notice how much of a life is arranged around the same principle. We could, most of us, find out early how many of our ambitions will pan out — the evidence is usually lying around by thirty-five, unread. We decline to run the numbers.","anchor":"This sounds precious until you notice how much of a life is arranged around the same principle. We could, most of us, find out early how many of our ambitions will pan out — the evidence is usually lying around by thirty-five, unread. We decline to run the numbers."},{"index":9,"narration":"We keep certain envelopes closed not because the contents are unknowable but because we are rationing who we have to become, and when. Ignorance, chosen carefully, is not the absence of knowledge. It is a schedule for it.","anchor":"We keep certain envelopes closed not because the contents are unknowable but because we are rationing who we have to become, and when. Ignorance, chosen carefully, is not the absence of knowledge. It is a schedule for it."},{"index":10,"narration":"My friend would say I am romanticizing slowness, and that her way honors the book more: she gives her hours only to prose that can survive honesty.","anchor":"My friend would say I am romanticizing slowness, and that her way honors the book more: she gives her hours only to prose that can survive honesty."},{"index":11,"narration":"Perhaps both disciplines are real. Hers tests the book. Mine paces the reader. She interviews; I ripen.","anchor":"Perhaps both disciplines are real. Hers tests the book. Mine paces the reader. She interviews; I ripen."},{"index":12,"narration":"The one mistake, we agree, in our only settled treaty, is to do neither on purpose — to let endings arrive unchosen, information unscheduled, the selves succeeding one another with nobody keeping the calen
… [246 chars truncated — full text in raw/]

*usage: 2065 in / 1720 out — $0.0533*

