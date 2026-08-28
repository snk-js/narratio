# Improvement Changelog

The story of how this solution evolved, per the hackathon's required structure. One entry per meaningful experiment; each entry links the results run that produced its evidence. Entries marked **[removed]** were tried, measured, and taken out — kept here because what they taught matters.

Evaluation is identical across all entries: same corpus (`corpus/cases/`), same model, same judge config, same commands (`docs/REPRODUCE.md`).

| Stage | What we tried and why | Evidence | Decision / learning |
|---|---|---|---|
| Baseline | One well-written adaptation prompt to the same model the workflow uses — the honest version of what a writer would do today with a chat window | *(run pending)* | *(pending)* |
| Iteration 1 | Adapter emits verbatim source anchors per segment; mechanical string check | *(pending)* | *(pending)* |
| Iteration 2 | Adversarial verifier + bounded revision loop | *(pending)* | *(pending)* |
| Iteration 3 | Escalation as a first-class action, measured on planted ambiguities | *(pending)* | *(pending)* |
| *(candidate)* **[removed]** | Rhythm-polish second pass | *(pending)* | *(pending)* |
| Final | Combination of what survived | *(pending)* | *(pending)* |

---

## Entries

*(Each table row expands into a full entry here as runs complete: what/why, exact numbers, decision.)*

---

## Main failure mode

*(written from measured results at the end)*

## Hot take

*(final form written at the end; working thesis, to be confirmed or broken by the data: the most valuable output of an adaptation agent is sometimes a question, not an answer — agents that silently resolve source ambiguity produce fluent, wrong output that is expensive to detect downstream, so "escalate to human" must be a first-class action with its own success criteria, not an error path.)*
