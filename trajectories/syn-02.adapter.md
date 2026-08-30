# Trajectory — case `syn-02`, agent `adapter`

Model: `claude-opus-4-8`. 1 call(s). Total cost: $0.0645.

Raw record (full requests/responses): `trajectories/raw/syn-02.adapter.jsonl`

---

## Step: adapt — 2026-08-29T22:24:25.608Z

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

# The Rehearsal

My grandmother rehearsed her own funeral the way other people rehearse job interviews. She would narrate it at the kitchen table, unprompted, between the coffee and the bread: who would cry too much, who would cry too little, which cousin would arrive late and blame the traffic, what the priest would get wrong about her. She did this for thirty years. She outlived two of the priests.

As a child I found it morbid. As a teenager I found it embarrassing. It took me until my own first rehearsals — lying awake drafting the speech for a crisis that never came — to understand that she was not predicting anything. The rehearsal does not aim at the future. It aims at the unbearable present, and it works by borrowing the future's authority.

This is the part I keep turning over. A rehearsed catastrophe is a domesticated one. You cannot control whether the flood comes, but you can control the drill, and the drill is real in a way the flood is not yet. The body performing the drill learns something true: where the exits are, what the first sentence of the terrible phone call should be. That the flood, when it comes, ignores the drill entirely — arrives by a different door, requires a different sentence — does not make the drill useless. It makes it a ritual, which is a different kind of useful.

I want to be careful here, because there are two ways to read what she was doing, and I genuinely do not know which is true. She rehearsed because she could not stop. The sentence sits flat on the page and refuses to choose: the rehearsal as compulsion, a thing that gripped her and would not let go — or the rehearsal as the one thing that made stopping possible, the nightly discharge that let her put death down and sleep. Compulsion or medicine. Thirty years at the kitchen table and I cannot tell you which, and I suspect she could not have told you either.

What I can tell you is what the rehearsals did to us, the audience. They wore the terror smooth. By the time the real funeral came — and it came wrong, of course, on a Tuesday, in a month she had never once chosen for it — we had heard the story so many times that grief had somewhere to sit. The room was strange but the furniture was familiar. We knew our roles even as we failed to perform them.

I rehearse now. Small things: difficult conversations, the moment of being found out for crimes I have not committed, the eulogy for people in perfect health. I no longer call it morbid. I call it the maintenance of furniture — keeping a place for the unbearable to sit, against the day it finally, punctually, arrives.

### Agent output

{"segments":[{"index":0,"narration":"My grandmother rehearsed her own funeral the way other people rehearse job interviews. She would narrate it at the kitchen table, unprompted, between the coffee and the bread: who would cry too much, who would cry too little, which cousin would arrive late and blame the traffic, what the priest would get wrong about her.","anchor":"My grandmother rehearsed her own funeral the way other people rehearse job interviews. She would narrate it at the kitchen table, unprompted, between the coffee and the bread: who would cry too much, who would cry too little, which cousin would arrive late and blame the traffic, what the priest would get wrong about her."},{"index":1,"narration":"She did this for thirty years. She outlived two of the priests.","anchor":"She did this for thirty years. She outlived two of the priests."},{"index":2,"narration":"As a child I found it morbid. As a teenager I found it embarrassing. It took me until my own first rehearsals — lying awake drafting the speech for a crisis that never came — to understand that she was not predicting anything.","anchor":"As a child I found it morbid. As a teenager I found it embarrassing. It took me until my own first rehearsals — lying awake drafting the speech for a crisis that never came — to understand that she was not predicting anything."},{"index":3,"narration":"The rehearsal does not aim at the future. It aims at the unbearable present, and it works by borrowing the future's authority.","anchor":"The rehearsal does not aim at the future. It aims at the unbearable present, and it works by borrowing the future's authority."},{"index":4,"narration":"This is the part I keep turning over. A rehearsed catastrophe is a domesticated one. You cannot control whether the flood comes, but you can control the drill, and the drill is real in a way the flood is not yet.","anchor":"This is the part I keep turning over. A rehearsed catastrophe is a domesticated one. You cannot control whether the flood comes, but you can control the drill, and the drill is real in a way the flood is not yet."},{"index":5,"narration":"The body performing the drill learns something true: where the exits are, what the first sentence of the terrible phone call should be. That the flood, when it comes, ignores the drill entirely — arrives by a different door, requires a different sentence — does not make the drill useless. It makes it a ritual, which is a different kind of useful.","anchor":"The body performing the drill learns something true: where the exits are, what the first sentence of the terrible phone call should be. That the flood, when it comes, ignores the drill entirely — arrives by a different door, requires a different sentence — does not make the drill useless. It makes it a ritual, which is a different kind of useful."},{"index":6,"narration":"I want to be careful here, because there are two ways to read what she was doing, and I genuinely do not know which is true. She rehearsed because she could not stop.","anchor":"I want to be careful here, because there are two ways to read what she was doing, and I genuinely do not know which is true. She rehearsed because she could not stop."},{"index":7,"narration":"The sentence sits flat on the page and refuses to choose: the rehearsal as compulsion, a thing that gripped her and would not let go — or the rehearsal as the one thing that made stopping possible, the nightly discharge that let her put death down and sleep. Compulsion or medicine.","anchor":"The sentence sits flat on the page and refuses to choose: the rehearsal as compulsion, a thing that gripped her and would not let go — or the rehearsal as the one thing that made stopping possible, the nightly discharge that let her put death down and sleep. Compulsion or medicine."},{"index":8,"narration":"Thirty years at the kitchen table and I cannot tell you which, and I suspect she could not have told you either.","anchor":"Thirty years at the kitchen table and
… [1723 chars truncated — full text in raw/]

*usage: 2294 in / 2121 out — $0.0645*

