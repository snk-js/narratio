# Trajectory — case `syn-11`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0506.

Raw record (full requests/responses): `trajectories/raw/syn-11.adapter.jsonl`

---

## Step: adapt — 2026-08-29T02:58:39.693Z

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

# The Biscuit Tin

The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about. There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one.

My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months. I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means *do not.*

Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid nothing, and my mother came home and poured a drink and sat in the kitchen with her coat still on.

I have never asked for a transcript of those four minutes. I was twenty-six and busy being certain about things, and by the time I stopped being certain, one of them was dead and the other had stopped discussing it. What I have instead is the shape of the afternoon: the drive out, the four minutes, the coat.

The tin went back on top of the wardrobe and then, after the funeral, into a skip. My mother made that decision alone and told me afterward, in a sentence engineered to close the topic, which it did.

What interests me now is not what was in the letters. Forty letters in one hand across four years — the content is not mysterious, and I am not owed it. What interests me is that a family can carry a thing like that for twenty years and metabolise it entirely through logistics: a tin, a boot, a drive, a skip. Nobody in my family has ever said the word *affair* aloud. The whole business was conducted in the language of objects and their positions, and everyone understood it perfectly.

I think this is more common than the alternative. We tell ourselves that families either talk about things or repress them, but there is a third mode, and it is the one most people actually live in: the thing is fully known, never stated, and managed by moving objects around. The tin on the wardrobe was not a secret. It was an agreement.

### Agent output

{"segments":[{"index":0,"narration":"The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about.","anchor":"The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about."},{"index":1,"narration":"There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one.","anchor":"There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one."},{"index":2,"narration":"My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months.","anchor":"My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months."},{"index":3,"narration":"I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means do not.","anchor":"I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means *do not.*","note":"Removed italic markup around 'do not' for spoken narration."},{"index":4,"narration":"Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid nothing, and my mother came home and poured a drink and sat in the kitchen with her coat still on.","anchor":"Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid nothing, and my mother came home and poured a drink and sat in the kitchen with her coat still on."},{"index":5,"narration":"I have never asked for a transcript of those four minutes. I was twenty-six and busy being certain about things, and by the time I stopped being certain, one of them was dead and the other had stopped discussing it.","anchor":"I have never asked for a transcript of those four minutes. I was twenty-six and busy being certain about things, and by the time I stopped being certain, one of them was dead and the other had stopped discussing it."},{"index":6,"narration":"What I have instead is the shape of the afternoon: the drive out, the four minutes, the coat.","anchor":"What I have instead is the shape of the afternoon: the drive out, the four minutes, the coat."},{"index":7,"narration":"The tin went back on top of the wardrobe and then, after the funeral, into a skip. My mother made that decision alone and told me afterward, in a sentence engineered to close the topic, which it did.","anchor":"The tin went back on top of the wardrobe and then, after the funeral, into a skip. My mother made that decision alone and told me afterward, in a sentence engineered to close the topic, which it did."},{"index":8,"narration":"What interests me now is not what was in the letters. Forty letters in one hand across four years — the content is not mysterious, and I am not owed it.","anchor":"What interests me now is not what was in the letters. Forty letters in one hand across four years — the content is not mysterious, and I am not owed it."},{"index":9,"narration":"What interests me is that a family can carry a thing like that for twenty years and metabolise it entirely through logistics: a tin, a boot, a drive, a skip.","anchor":"What interests me is that a family can carry a thing like that for twenty years and metabolise it entirely through logistics: a tin, a boot, a drive, a skip."},{"index":10,"narration":"Nobody in my family has ever said the word affair aloud. The whole business was conducted in the language of objects and their positions, and everyone understood it perfectly.","anchor":"Nobody in my family has ever
… [995 chars truncated — full text in raw/]

*usage: 2150 in / 1593 out — $0.0506*

