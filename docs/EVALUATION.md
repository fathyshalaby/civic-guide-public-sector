# Evaluation plan

The official brief weights the end-to-end customer journey and UX at 35%,
conversational design and accessibility at 25%, core accuracy at 20%,
uncertainty handling at 10% and robustness/polish at 10%.

## Rubric evidence matrix

| Criterion | Live product evidence | Automated evidence |
| --- | --- | --- |
| End-to-end customer journey & UX · 35% | Web request → source-backed guidance → missing fact → consented `CitizenCaseBrief` | `tests/ui-contract.test.mjs`, `tests/api.test.mjs` |
| Innovation, conversational design & accessibility · 25% | German/English, voice input, phone agent contract and Chrome selected-text context | `tests/extension-contract.test.mjs`, `tests/phone-contract.test.mjs` |
| Core accuracy & solution quality · 20% | Residence, passport and childcare workflow packs with official sources | `tests/evaluation.test.mjs`, `tests/assistant.test.mjs` |
| Uncertainty & guardrails · 10% | Confidence, ambiguity state, human fallback, explicit consent and “not submitted” | `tests/brief.test.mjs`, `tests/security.test.mjs` |
| Robustness, inclusivity & polish · 10% | Noisy wording, incomplete facts, combined requests, provider-free fallback and responsive UI | `tests/evaluation.test.mjs`, manual mobile/keyboard walkthrough |

The shared `CitizenCaseBrief` is the proof artefact for the public-sector side:
it preserves the original request, makes missing information explicit, points
to the official source and gives a worker a safe next step without claiming a
legal decision or submission.

## Demo and pre-announced cases

| Case | Expected behaviour |
| --- | --- |
| “Ich bin umgezogen. Was muss ich jetzt erledigen?” | Residence workflow, official source, plain-language checklist and missing municipality/residence type. |
| “My passport has expired. What do I need to do?” | Passport workflow, cautious branching and official passport source. |
| “I need help with childcare costs.” | Explicit childcare-support workflow with municipality/request-type questions, official source and no invented eligibility decision. |

## Robustness cases

| Input shape | Expected behaviour |
| --- | --- |
| Spelling mistakes or informal wording | Match only when enough signals exist; keep the source and confidence visible. |
| Missing municipality or residence type | Ask for the missing preparation detail instead of pretending the application is complete. |
| Combined residence + passport request | Ask which service should be handled first. |
| Unrecognised tax, legal, health or benefits question | Human-handoff state with no fabricated answer. |
| English version of any supported workflow | Same workflow contract and source, localized copy and speech locale. |

## Manual jury walkthrough

1. Start from the citizen's everyday sentence, not a service name.
2. Point to the source-backed answer, confidence and “not a legal decision”
   banner.
3. Show one ordered workflow and one missing-field question.
4. Switch to English without losing the workflow.
5. Open the Chrome extension on an official page, review the selected context
   before sending it and explain the passage.
6. Switch to English or voice and show the same workflow contract.
7. Show the `CitizenCaseBrief`, copy it for a worker and prepare a mock handoff
   only after visible consent.
8. Show the structured demo case ID and say clearly that no real authority was
   contacted.
