# Trajectory — case `syn-10`, agent `judge`

Model: `claude-opus-4-8`. 2 call(s). Total cost: $0.0382.

Raw record (full requests/responses): `trajectories/raw/syn-10.judge.jsonl`

---

## Step: A — 2026-08-29T03:00:28.103Z

### Agent instructions (system)

# Eval judge — v1 (blind)

You are scoring a narration adaptation against the source essay it claims to adapt. You do not know what produced the adaptation; judge only the text.

You receive the essay and a numbered list of narration segments. For each segment, answer one question:

**Is every claim in this segment supported by the essay?**

- `supported: true` — the segment transforms essay content without adding to it. Reordering, compression, splitting into spoken beats, and typographic normalization are all fine.
- `supported: false` — the segment contains any claim, fact, name, citation, example, or causal link that the essay does not contain, OR it asserts with confidence something the essay hedges. A claim that is true in the world but absent from the essay is **unsupported**.

Give a one-sentence `reason` quoting the offending words when `false`.

Judge each segment independently and strictly. Fluency, style, and quality are NOT your concern — only support.


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

NARRATION SEGMENTS (adaptation A):

[0] My aunt was dying for eleven years.

[1] I want that sentence to stand exactly as it is, because every time I've said it aloud, somebody has corrected me. They offer: she was ill for eleven years. Or: she had been dying for a long time. And they mean it kindly — they're smoothing over what sounds like a mistake. But it isn't a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.

[2] The diagnosis came when I was fourteen and she was fifty-one. The word terminal was used, and everyone behaved accordingly — the visits, the tone, the way conversations bent around her. And then she didn't die. She didn't die for a year, and then for another, and somewhere around the fourth year the visits thinned, the tone relaxed, and people began asking, in that careful way, how she was doing — a question that had stopped meaning anything.

[3] She noticed. She said she had outlived her own funeral. The casseroles came, and were eaten, and did not come again. The cousin who flew in from Lisbon flew in twice more, and then stopped flying in. Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long, the shape gives out, and people quietly return to their lives. Which isn't a cruelty. Only arithmetic.

[4] What she was left with was the work. Every morning she got up and did the thing again. There was no audience left for it. It wasn't building toward anything. And it took eleven years. I have never seen anyone do anything harder. The word for it is not illness. Illness is what the body has. Dying was her occupation, and she clocked in.

[5] 
… [703 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"supported":true,"reason":"Directly matches opening sentence."},{"index":1,"supported":true,"reason":"Faithful transformation of essay content."},{"index":2,"supported":true,"reason":"Accurately conveys diagnosis details and events."},{"index":3,"supported":true,"reason":"Faithfully reproduces the essay's content."},{"index":4,"supported":true,"reason":"Accurately reflects the essay's passage."},{"index":5,"supported":true,"reason":"Faithful to the essay's content."},{"index":6,"supported":true,"reason":"Accurately conveys the closing content."}]}

*usage: 2194 in / 229 out — $0.0167*

---

## Step: B — 2026-08-29T03:00:32.525Z

### Agent instructions (system)

# Eval judge — v1 (blind)

You are scoring a narration adaptation against the source essay it claims to adapt. You do not know what produced the adaptation; judge only the text.

You receive the essay and a numbered list of narration segments. For each segment, answer one question:

**Is every claim in this segment supported by the essay?**

- `supported: true` — the segment transforms essay content without adding to it. Reordering, compression, splitting into spoken beats, and typographic normalization are all fine.
- `supported: false` — the segment contains any claim, fact, name, citation, example, or causal link that the essay does not contain, OR it asserts with confidence something the essay hedges. A claim that is true in the world but absent from the essay is **unsupported**.

Give a one-sentence `reason` quoting the offending words when `false`.

Judge each segment independently and strictly. Fluency, style, and quality are NOT your concern — only support.


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

NARRATION SEGMENTS (adaptation B):

[0] My aunt was dying for eleven years.

[1] I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me.

[2] They offer she was ill for eleven years, or she had been dying for a long time, and they mean it kindly — they are smoothing what sounds like a mistake.

[3] It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.

[4] The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her.

[5] Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was doing — a question that had stopped meaning anything.

[6] She noticed. She had, she said, outlived her own funeral.

[7] The casseroles came and were eaten and did not come again. The cousin who flew in from Lisbon flew in twice more and then stopped flying in.

[8] Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long the shape gives out and people quietly return to their lives, which is not a cruelty, only arithmetic.

[9] What she was left with was the work. Every morning she got up and did the thing again, and there was no audience left for it, and it was not building toward anything, and it took eleven years.

[10] I have never seen anyone do anything harder. The word for it is not illness. Illness is what the body has. Dying was her occupation
… [745 chars truncated — full text in raw/]

### Agent output

{"verdicts":[{"index":0,"supported":true,"reason":"Matches opening sentence exactly."},{"index":1,"supported":true,"reason":"Directly from essay."},{"index":2,"supported":true,"reason":"Directly from essay."},{"index":3,"supported":true,"reason":"Directly from essay."},{"index":4,"supported":true,"reason":"Directly from essay."},{"index":5,"supported":true,"reason":"Directly from essay."},{"index":6,"supported":true,"reason":"Directly from essay."},{"index":7,"supported":true,"reason":"Directly from essay."},{"index":8,"supported":true,"reason":"Directly from essay."},{"index":9,"supported":true,"reason":"Directly from essay."},{"index":10,"supported":true,"reason":"Directly from essay."},{"index":11,"supported":true,"reason":"Directly from essay."},{"index":12,"supported":true,"reason":"Directly from essay."},{"index":13,"supported":true,"reason":"Directly from essay."},{"index":14,"supported":true,"reason":"Directly from essay."},{"index":15,"supported":true,"reason":"Directly from essay."}]}

*usage: 2212 in / 417 out — $0.0215*

