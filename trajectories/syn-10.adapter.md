# Trajectory — case `syn-10`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s): `adapt`. Total cost: $0.0871.

**What happened in this run:** a single pass. The verifier returned `pass` on the first round, so the revision loop never fired and no step needed feedback from a previous one.

Raw record (full requests/responses): `trajectories/raw/syn-10.adapter.jsonl`

---

## Step 1: `adapt` — 2026-08-29T02:58:15.910Z

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

# Eleven Years

My aunt was dying for eleven years.

I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me. They offer *she was ill for eleven years*, or *she had been dying for a long time*, and they mean it kindly — they are smoothing what sounds like a mistake. It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.

The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her. Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was *doing* — a question that had stopped meaning anything.

She noticed. She had, she said, outlived her own funeral. The casseroles came and were eaten and did not come again. The cousin who flew in from Lisbon flew in twice more and then stopped flying in. Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long the shape gives out and people quietly return to their lives, which is not a cruelty, only arithmetic.

What she was left with was the work. Every morning she got up and did the thing again, and there was no audience left for it, and it was not building toward anything, and it took eleven years. I have never seen anyone do anything harder. The word for it is not *illness*. Illness is what the body has. Dying was her occupation, and she clocked in.

Near the end — the real end, the one that finally took — she told me she had stopped being frightened around year six and had never got it back. Not courage, she said. Attrition. You cannot sustain terror for six years any more than you can sustain a sprint; the body files it away and gets on with the morning. She said this as though confessing to something shameful, and I have thought since that it was the most enviable thing anyone has ever told me.

She was dying for eleven years. She was also, in the same eleven years, doing the crossword, quarrelling about politics, and teaching my daughter to lie convincingly at cards. Both sentences are true, and only one of them gets corrected.

### Agent output

{"segments":[{"index":1,"narration":"My aunt was dying for eleven years.","anchor":"My aunt was dying for eleven years."},{"index":2,"narration":"I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me.","anchor":"I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me."},{"index":3,"narration":"They offer she was ill for eleven years, or she had been dying for a long time, and they mean it kindly — they are smoothing what sounds like a mistake.","anchor":"They offer *she was ill for eleven years*, or *she had been dying for a long time*, and they mean it kindly — they are smoothing what sounds like a mistake.","note":"Italic markers in source rendered as plain speech."},{"index":4,"narration":"It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.","anchor":"It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden."},{"index":5,"narration":"The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her.","anchor":"The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her."},{"index":6,"narration":"Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was doing — a question that had stopped meaning anything.","anchor":"Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was *doing* — a question that had stopped meaning anything.","note":"Italic markers on 'doing' rendered as plain speech."},{"index":7,"narration":"She noticed. She had, she said, outlived her own funeral.","anchor":"She noticed. She had, she said, outlived her own funeral."},{"index":8,"narration":"The casseroles came and were eaten and did not come again. The cousin who flew in from Lisbon flew in twice more and then stopped flying in.","anchor":"The casseroles came and were eaten and did not come again. The cousin who flew in from Lisbon flew in twice more and then stopped flying in."},{"index":9,"narration":"Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long the shape gives out and people quietly return to their lives, which is not a cruelty, only arithmetic.","anchor":"Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long the shape gives out and people quietly return to their lives, which is not a cruelty, only arithmetic."},{"index":10,"narration":"What she was left with was the work. Every morning she got up and did the thing again, and there was no audience left for it, and it was not building toward anything, and it took eleven years.","anchor":"What she was left with was the work. Every morning she got up and did the thing again, and there was no audience left for it, and it was not building toward anything, and it took eleven years."},{"index":11,"narration":"I have never seen anyone do anything harder. The word for it is not illness. Illness is what the body has. Dying was her occupation, and she clocked in.","anchor":"I have never seen anyone do anything harder. The word for it is not *illness*. Illness is what the body has. Dying was her occupation, and she clocked in.","note":"Italic markers on 'illness' rendered as plain speech."},{"index":12,"narration":"Near the end — the real end, the one that finally took — she told me she had stopped being frightened around year six and had never got it back.","anchor":"Nea
… [1412 chars truncated — full text in raw/]

*usage: 2210 in / 3043 out — $0.0871*

