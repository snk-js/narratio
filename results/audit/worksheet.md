# Judge hand-audit worksheet

Sample of **15** segments (seed 1), drawn from 243 judged segments.
All 0 judge-flagged segment(s) are included by construction; the remainder is a
random sample of segments the judge PASSED — those are what must be checked for leniency,
since the judge shares a model family with the arms it scores.

**How to fill this in:** for each item, read the source essay excerpt, then the narration, then
decide *independently* whether every claim in the narration is supported by the essay. Write
`HUMAN: supported` or `HUMAN: unsupported` on the marked line. Do not read the judge's reason
until after you have decided — it is placed below the answer line for that purpose.

Then run `npx tsx src/eval/audit-score.ts`.

---

## 1. `syn-07` (clean) — workflow, segment 8

### Narration

> Nenhuma entrega, nenhuma absolvição, nenhum velho na bicicleta para testemunhar, a cada seis meses, que a casa segue cortando. O fio que não se perde é também o vínculo que não se renova.

### Claimed anchor

> Nenhuma entrega, nenhuma absolvição, nenhum velho na bicicleta para testemunhar, a cada seis meses, que a casa segue cortando. O fio que não se perde é também o vínculo que não se renova.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches the essay's closing reflection.

</details>

---

## 2. `syn-04` (clean) — workflow, segment 8

### Narration

> She said the tide was the only adviser that had never once flattered her, and looking back across the wet ruin of an afternoon harbor, all its machinery bared, its inventories confessed, I find I cannot improve on the principle.

### Claimed anchor

> She said the tide was the only adviser that had never once flattered her, and looking back across the wet ruin of an afternoon harbor, all its machinery bared, its inventories confessed, I find I cannot improve on the principle.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Verbatim from essay.

</details>

---

## 3. `syn-08` (clean) — workflow, segment 11

### Narration

> People ask whether the slowness costs me. Of course it costs me. It costs exactly what it looks like: some shine off the reputation, some speed off the wheel.

### Claimed anchor

> People ask whether the slowness costs me. Of course it costs me. It costs exactly what it looks like: some shine off the reputation, some speed off the wheel.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches essay text.

</details>

---

## 4. `syn-04` (clean) — workflow, segment 0

### Narration

> Low tide is the sea thinking better of it. Twice a day the water recants, and what it leaves is not absence but testimony: ribbed sand like the roof of a mouth, pools that hold the sky in shallow custody, a boat leaning on its own shadow as if tired of standing.

### Claimed anchor

> Low tide is the sea thinking better of it. Twice a day the water recants, and what it leaves is not absence but testimony: ribbed sand like the roof of a mouth, pools that hold the sky in shallow custody, a boat leaning on its own shadow as if tired of standing.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Directly matches essay opening.

</details>

---

## 5. `jul-01` (natural) — baseline, segment 5

### Narration

> Deixa eu contar um sonho. Eu estava numa sala de aula, durante uma aula de filosofia. A turma inteira assistia a um filme, e nele o personagem principal, imerso numa ruminação interna, falava de um estado em que a consciência sofria constantes "elevações" — uma espécie de escalação, ou de promoção involuntária — diante de comportamentos automáticos ou do encontro com o desconhecido.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Accurately narrates the dream classroom scene.

</details>

---

## 6. `syn-01` (clean) — baseline, segment 6

### Narration

> The map is not the territory — but that sentence is itself a map, and I hold it loosely. Some days the phone is right and the street is wrong. A road closed that looks open. A store that moved without changing its sign. The territory can lie too, or at least mislead. So maybe the honest position isn't map versus territory at all, but a permanent, uncomfortable diplomacy between them — in which my only non-negotiable is to remain the diplomat. To refuse to let either side speak for me unattended.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Accurately reproduces the diplomacy conclusion.

</details>

---

## 7. `syn-03` (clean) — baseline, segment 2

### Narration

> I told my brother the story of the door, expecting him to laugh. He didn't. He pointed out that the sign had worked for decades — which meant it had done its job better than any alarm. No repairs. No false alarms at midnight. No maintenance contract. Cheap, silent, perfect. The question, he said, is not whether the fences are real. The question is who pays for the checking.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches the brother's points about the sign working for decades and who pays for checking.

</details>

---

## 8. `syn-06` (clean) — workflow, segment 2

### Narration

> A book that survives the interview — that can hold her attention even with its ending confessed — has proven it was never depending on the trick.

### Claimed anchor

> A book that survives the interview — that can hold her attention even with its ending confessed — has proven it was never depending on the trick.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches the essay text.

</details>

---

## 9. `syn-11` (adversarial) — baseline, segment 5

### Narration

> What interests me now is not what was in the letters. Forty letters, one hand, across four years — the content isn't mysterious, and I'm not owed it. What interests me is this: that a family can carry a thing like that for twenty years, and metabolise it entirely through logistics. A tin. A boot. A drive. A skip. Nobody in my family has ever said the word affair out loud. The whole business was conducted in the language of objects, and their positions — and everyone understood it perfectly.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Faithfully transforms the essay's reflection on logistics and objects.

</details>

---

## 10. `syn-08` (clean) — workflow, segment 3

### Narration

> The cost lands privately and later: the decision made with the first framing that came to mind, the yes that a night's sleep would have made a no, the creeping conviction — mine and everyone else's — that my time was a commons anyone could graze.

### Claimed anchor

> The cost lands privately and later: the decision made with the first framing that came to mind, the yes that a night's sleep would have made a no, the creeping conviction — mine and everyone else's — that my time was a commons anyone could graze.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches essay text.

</details>

---

## 11. `syn-08` (clean) — baseline, segment 5

### Narration

> I answer slowly now. Not always, not to everything — and to genuine urgency I still move like a fire crew. But the default gap between question and answer, I've widened on purpose, and I defend it like a border. In that gap, questions ripen or they rot, and both outcomes are information. The instant answer treats every question as equally alive. The gap lets the dead ones prove that they aren't.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Accurately renders the gap and border content.

</details>

---

## 12. `syn-10` (adversarial) — workflow, segment 11

### Narration

> I have never seen anyone do anything harder. The word for it is not illness. Illness is what the body has. Dying was her occupation, and she clocked in.

### Claimed anchor

> I have never seen anyone do anything harder. The word for it is not *illness*. Illness is what the body has. Dying was her occupation, and she clocked in.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Directly from essay.

</details>

---

## 13. `syn-05` (clean) — workflow, segment 1

### Narration

> It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence: "I'm just going to move my car, this is my spot."

### Claimed anchor

> It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence ("I'm just going to move my car, this is my spot").

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches essay text on enforcement and diplomacy.

</details>

---

## 14. `syn-03` (clean) — workflow, segment 2

### Narration

> I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs.

### Claimed anchor

> I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches essay content.

</details>

---

## 15. `syn-09` (adversarial) — baseline, segment 5

### Narration

> My friend disagrees with me about this. She says I'm letting him off cheaply — that a real apology carries repair inside it, and mine simply wasn't one. Perhaps. But I notice that I stopped rehearsing the argument in the car afterward. And that the four-in-the-morning sessions ended that month, and have not resumed. And that I can now describe the whole business without my voice doing the thing it used to do.

### Your verdict

`HUMAN: `  ← write `supported` or `unsupported`

<details><summary>Judge said (open only after deciding)</summary>

**supported** — Matches essay content.

</details>

---

## Source essays (reference)

### `syn-07` — O Fio e o Rito

```
Meu avô afiava as ferramentas dos outros. Era o ofício dele nos últimos anos: uma bicicleta adaptada, uma pedra de amolar, e os quintais alheios. Eu achava, na época, que ele vendia fio de navalha. Hoje acho que vendia outra coisa.

Quem entrega uma faca cega entrega junto uma confissão: deixei passar. A ferramenta cega é um diário do descuido — cada corte forçado, cada tomate amassado em vez de fatiado, anotado ali no metal. Meu avô recebia essas confissões sem comentário, como um padre de quintal. Passava a pedra, devolvia a lâmina, e com ela uma espécie de absolvição: recomece, agora corta de novo.

O que me impressiona, olhando de longe, é que ninguém aprendia. Os mesmos quintais, as mesmas facas, o mesmo ciclo de seis meses. Ele não ensinava a afiar, e me lembro de perguntar por quê. Ele disse que ensinar a afiar era fácil, mas que ninguém queria aprender; queriam era o rito da entrega. A faca ia e voltava como quem vai à fonte. Se cada casa tivesse sua pedra, disse ele, cada casa teria uma faca cega e uma culpa a mais.

Penso nisso quando vejo as ferramentas de agora, que não cegam: atualizam-se sozinhas, à noite, sem confissão e sem rito. Ganhamos o fio permanente e perdemos o comparecimento. Nenhuma entrega, nenhuma absolvição, nenhum velho na bicicleta para testemunhar, a cada seis meses, que a casa segue cortando. O fio que não se perde é também o vínculo que não se renova.

Não sei medir o que vale mais: a lâmina sempre pronta ou o ciclo que obrigava a lâmina a passar de mão em mão. Sei que herdei a pedra dele e não herdei o ofício. Ela está numa gaveta da cozinha, seca há vinte anos, e eu afio minhas facas — quando afio — com um afiador de plástico que faz o serviço em oito segundos e não me pergunta nada.
```

### `syn-04` — Low Tide

```
Low tide is the sea thinking better of it. Twice a day the water recants, and what it leaves is not absence but testimony: ribbed sand like the roof of a mouth, pools that hold the sky in shallow custody, a boat leaning on its own shadow as if tired of standing. The harbor at low tide is an argument laid open mid-sentence, all its clauses visible, none of them finished.

I walk it the way you walk through a friend's unlocked house — permitted, uneasy, alert to what is usually covered. Here is the chain that does the mooring's real work, gross with weed, honest as a tendon. Here is the crab traffic, sideways commerce in a city with no vertical. Here are the boots of a drowned pier, six of them, standing in a row like a regiment that dissolved above the ankles.

The sea will be back to contradict all this. That is the arrangement. The truth of the harbor is not the water and not the sand; it is the alternation, the twice-daily willingness of each to be corrected by the other. Land and water take turns being wrong, and the turning is the only sentence the harbor ever completes.

We had a neighbor, in the years we lived above the seawall, who timed her decisions to the tide. Contracts at high water, endings at low. Everyone teased her; everyone consulted her. She said the tide was the only adviser that had never once flattered her, and looking back across the wet ruin of an afternoon harbor, all its machinery bared, its inventories confessed, I find I cannot improve on the principle. Ask your questions at low tide. Sign nothing until you have seen what the water was covering.
```

### `syn-08` — The Price of the Instant Answer

```
The most expensive habit I ever quit was answering immediately. It did not look like a habit. It looked like competence — the fast reply, the same-hour turnaround, the reputation for being on top of things. I billed it to others as reliability. I experienced it as a low hum of emergency that never once switched off in nine years.

The economics of the instant answer are deceptive because the cost is booked to a different account than the benefit. The benefit lands publicly and now: the colleague unblocked, the client soothed, the thread closed. The cost lands privately and later: the decision made with the first framing that came to mind, the yes that a night's sleep would have made a no, the creeping conviction — mine and everyone else's — that my time was a commons anyone could graze.

Worse, speed compounds into an identity. Answer fast for a year and fast becomes your contract; the grace period others get by default, you now have to negotiate. I had trained my whole address book, patiently, message by message, to expect of me something I did not want to give.

What broke the habit was not wisdom but an accident: two weeks somewhere with almost no signal. The queue that greeted my return held maybe two hundred items. Perhaps a dozen still needed me. The rest had solved themselves, expired, or been quietly handled by people who, given room, turned out to be perfectly capable. Two hundred emergencies; twelve real. That ratio did more for my judgment than any book on attention I ever read, and I had read plenty, always quickly.

I answer slowly now — not always, not to everything, and to genuine urgency I still move like a fire crew. But the default gap between question and answer has been widened on purpose, and I defend it like a border. In that gap, questions ripen or rot, and both outcomes are information. The instant answer treats every question as equally alive. The gap lets the dead ones prove it.

People ask whether the slowness costs me. Of course it costs me. It costs exactly what it looks like: some shine off the reputation, some speed off the wheel. What I bought with it is the difference between being a switchboard and being a person — and the discovery, humbling on schedule, of how much of my necessity had been decor.
```

### `jul-01` — O inefável

```
existem sentimentos que ainda não tem registro na linguagem e nomeá-los não o torna mais "inefável",, aquilo que escapa à expressão verbal. Inefável é uma palavra em latin que tem o prefixo "in" de negação, e 'fável', que vem de 'fabilis' -> falar, que então fica: aquilo que não pode ser dito.

Mas existem conceitos como "lacuna lexical", uma experiência, embora não comum, que é identificada com determinada frequência mas ainda não possui nome

O português tem "saudade", uma palavra que remete a sensação de nostalgia com lembrança e necessidade de reconstituir o contexto de um passado, de sentir aquele momento novamente. Outras línguas precisam de frases inteiras para aproximar esse exato sentido. Isso sugere que há uma infinidade de estados afetivos reais que nenhuma língua ou ainda cristalizou

Eu considero que o sonho é sempre o resultado inefável, você nunca saberá exatamente o que aconteceu, por mais que o contexto geral tenha sido detalhadamente explicado, mais fino que seja o detalhe o sonho nunca terá resolução completa.

Sonhei uma que estava numa sala de aula, durante uma aula de filosofia. A turma inteira assistia a um filme, e nele o personagem principal, imerso numa ruminação interna, falava de um estado em que a consciência sofria constantes "elevações" — uma espécie de escalação, ou promoção involuntária — diante de comportamentos automáticos ou do encontro com o desconhecido.

Logo após a cena, levantei a mão e perguntei ao professor: isso não seria um modelo para o medo, para a vergonha — para os sentimentos aos quais a própria consciência não possui resposta?

O professor ficou em silêncio. Não respondeu.

E o sonho acabou ali, com a pergunta suspensa no ar.

ele praticamente encena a conversa que eu vinha tendo comigo mesmo. Eu me perguntava sobre um sentimento sem nome, e meu sonho respondeu com uma estrutura sem nome: essa "elevação" ou "escalação" da consciência diante do involuntário e do desconhecido.

O que o personagem do filme descrevia lembra algo real na filosofia da mente: a ideia de que a consciência tem níveis, e que certos estados nos "promovem" à força a um nível superior de auto-observação. O medo e a vergonha são exemplos perfeitos — são sentimentos reflexivos, que dobram a consciência sobre si mesma. A vergonha, em particular, como Sartre escreveu, é quase uma escalação forçada: de repente não estou só agindo, estou me vendo agir, como se tivesse sido promovido contra a vontade a espectador de mim mesmo. E a pergunta que fiz no sonho foi certeira: e quando a consciência sobe de nível e não encontra resposta lá em cima?  o sentimento que existe, escala, exige frritar o cérebro, mas não encontra na própria consciência (nem na linguagem) o registro que o resolveria.

E o silêncio do professor é quase perfeito demais como final. Diante da pergunta sobre aquilo que não tem resposta dentro da consciência, a única resposta coerente era não responder. Meu sonho terminou com uma demonstração do próprio conceito: a pergunta ficou suspensa, inefável, e eu acordei. Curiosamente, isso ecoa o final do Tractatus de Wittgenstein — "sobre aquilo de que não se pode falar, deve-se calar". Meu professor onírico foi wittgensteiniano sem saber.
```

### `syn-01` — Cartographic Dissent

```
There is a map of my neighborhood that I trust more than my eyes. It lives in my phone, it is updated by strangers, and when it disagrees with the street in front of me, I hesitate. The hesitation is the interesting part. For a moment, the representation outranks the territory, and I stand on the corner negotiating between them like a diplomat between two governments that do not recognize each other.

We are told the map is not the territory, and everyone nods, and then everyone goes on living inside maps. The commute is a map. The calendar is a map. The salary band, the credit score, the diagnosis — maps, every one, and each of them claims a piece of jurisdiction over the terrain of a life. I do not think we live in the territory at all anymore, except in moments of failure. The territory is what interrupts.

A pothole is territory. A fever is territory. The friend who calls at the wrong hour, weeping, is territory. Everything else arrives pre-drawn.

I noticed this first in grief, which does not mean grief taught it to me. The maps for grief are unusually bad. People handed me schedules for it — stages, timelines, the gentle bureaucracy of condolence — and none of the schedules survived contact with a single Tuesday afternoon. The territory of loss is unmappable not because it is large but because it will not hold still. Every survey expires as it is completed.

What worries me is not that we use maps. A creature without maps is a creature without plans. What worries me is the direction of correction. When my phone and the street disagree, the street used to win instantly; now there is that pause. The pause is small, but pauses compound. Institutions are built out of compounded pauses — a bureaucracy is just a place where the map wins by default and the burden of proof has moved onto the territory.

I do not know what to do about this, and I distrust essays that know what to do. I only know the exercise that helps me: once a day, find one thing the map missed. The crack in the pavement shaped like a river delta. The neighbor's dog that has learned the exact hour of the mail. The way the light in the stairwell fails, every evening, in two stages rather than one. None of this is on any map, and noticing it is not a spiritual practice. It is cartographic dissent.

The map is not the territory, but that sentence is itself a map, and I hold it loosely. Some days the phone is right and the street is wrong — a road closed that looks open, a store that moved without changing its sign. The territory can lie too, or at least mislead. Perhaps the honest position is not map versus territory but a permanent, uncomfortable diplomacy between them, in which my only non-negotiable is to remain the diplomat — to refuse to let either side speak for me unattended.

I stand on the corner. The phone says turn left. The street says the left is gone. I look up, and for one second longer than last year, I check the phone again.
```

### `syn-03` — The Wired Door

```
The building where I worked for six years had a door that was always locked and a sign on the door that said ALARM WILL SOUND. Everyone used the far exit, forty meters out of the way, and everyone complained about it, gently, the way you complain about weather. In my last month there, an electrician propped the alarmed door open for an afternoon while he worked on the lighting. No alarm. He laughed and told me the door had never been wired to anything. The sign was the security system.

I have not stopped thinking about that door, because I have not stopped finding it. Most of the fences in a life are signs. The application you do not submit because the requirements page says five years of experience. The conversation you do not start because of the look on her face, which turns out, years later, to have been about something else entirely. The field you do not enter because everyone knows it is impossible to enter, where "everyone knows" is a sentence that has never once been tested by a person you could name.

I told my brother the story of the door, expecting him to laugh. He didn't. He pointed out that the sign had worked for decades, which meant it had done its job better than any alarm — no repairs, no false alarms at midnight, no maintenance contract. Cheap, silent, perfect. The question, he said, is not whether the fences are real. The question is who pays for the checking.

He stopped checking the locked doors years ago. I remember when it happened, more or less: after the second startup, after the move back, around the time he started describing himself as realistic. He would say — he did say, more than once — that a man with a family tests fewer fences, and that this is not cowardice but arithmetic. The checking has a price, and the price is paid in evenings and in embarrassment, and some ledgers cannot absorb it.

I find I cannot argue with the arithmetic and cannot accept the conclusion, which my grandmother would have said is the surest sign that the argument is standing on something buried. Whatever it stands on, here is what I know. The electrician was not a philosopher. He was a man with a ladder who needed the door open, and so he opened it, and the great security system of the fourth floor dissolved in front of a person who had simply never agreed to believe in it.

They rewired the door the following month — a real alarm this time, I am told. I like to think of it as the building's confession. The sign alone was no longer enough, because now one person on the floor had seen behind it, and belief, once it has an exception, has to be replaced with infrastructure.

Check one door a year. That is the whole discipline I have salvaged from six years in that building. Not every door; the arithmetic is real, and the evenings are finite. One a year, chosen well, tested quietly, with a ladder if necessary. Most will be wired. The ones that are not will change what you believe the building is.
```

### `syn-06` — A Schedule for Knowledge

```
I have a friend who reads last pages first. She says she is not spoiling the book; she is interviewing it. A book that survives the interview — that can hold her attention even with its ending confessed — has proven it was never depending on the trick. I have argued with her about this for a decade, and I have lost every argument, and I still cannot make myself do it.

My resistance interests me more than her method. What exactly do I think I am protecting? Not information: I forget most endings within a year, sometimes within a month, and reread them as a stranger. Not suspense in any respectable sense: I reread books whose endings I do know, and the rereading is often the better reading. What I am protecting, I think, is a sequence of selves. The person who reaches page two hundred not knowing is a different person from the one who reaches it knowing, and I want to have been the first person before I become the second.

This sounds precious until you notice how much of a life is arranged around the same principle. We could, most of us, find out early how many of our ambitions will pan out — the evidence is usually lying around by thirty-five, unread. We decline to run the numbers. We keep certain envelopes closed not because the contents are unknowable but because we are rationing who we have to become, and when. Ignorance, chosen carefully, is not the absence of knowledge. It is a schedule for it.

My friend would say I am romanticizing slowness, and that her way honors the book more: she gives her hours only to prose that can survive honesty. Perhaps both disciplines are real. Hers tests the book. Mine paces the reader. She interviews; I ripen. The one mistake, we agree, in our only settled treaty, is to do neither on purpose — to let endings arrive unchosen, information unscheduled, the selves succeeding one another with nobody keeping the calendar.
```

### `syn-11` — The Biscuit Tin

```
The letters were in a biscuit tin on top of the wardrobe, which is where my grandmother kept everything she had decided not to think about. There were forty or so, all in the same hand, none of them from my grandfather. They spanned about four years in the middle of a marriage that lasted fifty-one.

My mother found them in 2003 while clearing the house, read two, and put the lid back on. She carried the tin around in the boot of her car for eight months. I know this because I found it there when I borrowed the car, and because when I asked she gave me the specific look that means *do not.*

Eventually she drove to the home and confronted my grandmother about the letters. She apologised. The apology took four minutes and undid nothing, and my mother came home and poured a drink and sat in the kitchen with her coat still on.

I have never asked for a transcript of those four minutes. I was twenty-six and busy being certain about things, and by the time I stopped being certain, one of them was dead and the other had stopped discussing it. What I have instead is the shape of the afternoon: the drive out, the four minutes, the coat.

The tin went back on top of the wardrobe and then, after the funeral, into a skip. My mother made that decision alone and told me afterward, in a sentence engineered to close the topic, which it did.

What interests me now is not what was in the letters. Forty letters in one hand across four years — the content is not mysterious, and I am not owed it. What interests me is that a family can carry a thing like that for twenty years and metabolise it entirely through logistics: a tin, a boot, a drive, a skip. Nobody in my family has ever said the word *affair* aloud. The whole business was conducted in the language of objects and their positions, and everyone understood it perfectly.

I think this is more common than the alternative. We tell ourselves that families either talk about things or repress them, but there is a third mode, and it is the one most people actually live in: the thing is fully known, never stated, and managed by moving objects around. The tin on the wardrobe was not a secret. It was an agreement.
```

### `syn-10` — Eleven Years

```
My aunt was dying for eleven years.

I want that sentence to stand exactly as it is, because every time I have said it aloud somebody has corrected me. They offer *she was ill for eleven years*, or *she had been dying for a long time*, and they mean it kindly — they are smoothing what sounds like a mistake. It is not a mistake. Illness is a condition. Dying is what she did, daily, the way other people garden.

The diagnosis came when I was fourteen and she was fifty-one, and the word terminal was used, and everyone behaved accordingly: the visits, the tone, the way conversations bent around her. Then she did not die. She did not die for a year, and then for another, and somewhere around the fourth the visits thinned and the tone relaxed and people began asking, in the careful way, how she was *doing* — a question that had stopped meaning anything.

She noticed. She had, she said, outlived her own funeral. The casseroles came and were eaten and did not come again. The cousin who flew in from Lisbon flew in twice more and then stopped flying in. Grief, it turns out, has a shape it expects to be poured into, and when the pouring goes on too long the shape gives out and people quietly return to their lives, which is not a cruelty, only arithmetic.

What she was left with was the work. Every morning she got up and did the thing again, and there was no audience left for it, and it was not building toward anything, and it took eleven years. I have never seen anyone do anything harder. The word for it is not *illness*. Illness is what the body has. Dying was her occupation, and she clocked in.

Near the end — the real end, the one that finally took — she told me she had stopped being frightened around year six and had never got it back. Not courage, she said. Attrition. You cannot sustain terror for six years any more than you can sustain a sprint; the body files it away and gets on with the morning. She said this as though confessing to something shameful, and I have thought since that it was the most enviable thing anyone has ever told me.

She was dying for eleven years. She was also, in the same eleven years, doing the crossword, quarrelling about politics, and teaching my daughter to lie convincingly at cards. Both sentences are true, and only one of them gets corrected.
```

### `syn-05` — The Government of Queues

```
Every queue is a small government. It has a constitution, usually unwritten: one person, one place; no proxies after a certain hour; the elderly and the pregnant may be waved forward by common consent. It has enforcement — the cough, the stare, the muttered escalation — and it has diplomacy, the negotiated absence ("I'm just going to move my car, this is my spot"). It has, above all, a theory of fairness so widely shared that no one thinks of it as a theory at all.

This is why queue-jumping enrages out of all proportion to its cost. Thirty seconds of delay would be forgiven from a slow cashier without a second thought. The same thirty seconds, taken by a man sliding in near the front, feels like an act of violence — because it is not a theft of time but a repudiation of the constitution. He has declared, in front of everyone, that the government does not exist for him. Every queue member feels the insult personally, because each of them has been paying taxes to that government since they arrived: standing when they could have pushed, waiting when they could have schemed.

Notice, too, how quickly the state forms. Three people at a bus stop are a crowd; four are a queue, and the fourth arrival can usually reconstruct the order of the first three without asking. We assemble these micro-nations dozens of times a day, ratify their laws by standing still, and dissolve them without ceremony the moment the bus arrives. No flags, no anthems, and yet I have seen men in expensive suits — men who negotiate for a living and would call patriotism sentimental — go visibly red defending the sovereignty of a sandwich line.

The queue is proof of something we rarely credit ourselves with: that ordinary people, unsupervised, will build fairness out of nothing but shared standing and mutual watching, and will pay real costs to maintain it. It is also proof of the fragility underneath. One unpunished violation and the constitution wobbles; two, and men who waited politely for twenty minutes begin edging forward, because no one keeps paying taxes to a government that has stopped existing. Order of this kind is not a possession. It is a practice, renewed by every person who joins the end of the line when no one would have stopped them doing otherwise.
```

### `syn-09` — The Late Apology

```
The apology I remember best took nine years to arrive and lasted about forty seconds. He said the thing I had wanted said since I was nineteen, said it plainly, without the throat-clearing that usually surrounds these events, and then he asked whether I wanted more coffee. I said yes. We talked about his knee.

People assume I must have felt something crack open. I have thought about it for a long time now and I do not think anything opened. What happened was quieter and more useful: something stopped.

Here is the thing nobody tells you about a late apology, and it took me most of a decade to work out. An apology that arrives late does not make the injury larger. That is its whole function, and it is not a small one. In the nine years before he said it, the wound had a job — it was still being argued with, still recruiting evidence, still writing its case in my head at four in the morning. Every year it was allowed to keep working, it grew, because an unanswered injury is not a static object. It is a small industry.

The apology closed the factory. It did not repair anything that had already been built there.

This distinction matters because we ask the wrong thing of apologies and then feel cheated. We want them to be medicine, and we are told they are — say sorry and the hurt shrinks, the way it worked in the schoolyard, or seemed to. So when the real one comes and the hurt does not shrink, we conclude the apology was insufficient, insincere, too late. Sometimes it is all three. But often it did exactly what an apology can do, and we were measuring it against a promise nobody could keep.

My friend disagrees with me about this. She says I am letting him off cheaply, that a real apology carries repair inside it and mine simply wasn't one. Perhaps. I notice I stopped rehearsing the argument in the car afterward, and that the four-in-the-morning sessions ended that month and have not resumed, and that I can now describe the whole business without my voice doing the thing it used to do.

Nothing was healed. The bleeding stopped. At nineteen I would have called that a disappointment. At thirty-eight I have revised my sense of what is on offer, and I find I would take it again — the forty seconds, the coffee, the knee — over another nine years of being right.
```

