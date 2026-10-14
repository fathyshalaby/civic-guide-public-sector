# Evaluation plan

The official brief weights the end-to-end customer journey and UX at 35%,
conversational design and accessibility at 25%, core accuracy at 20%,
uncertainty handling at 10% and robustness/polish at 10%.

## Demo and pre-announced cases

| Case | Expected behaviour |
| --- | --- |
| “Ich bin umgezogen. Was muss ich jetzt erledigen?” | Residence workflow, official source, plain-language checklist and missing municipality/residence type. |
| “My passport has expired. What do I need to do?” | Passport workflow, cautious branching and official passport source. |
| “I need help with childcare costs.” | Family-benefit workflow or an explicit clarification, never an invented eligibility decision. |

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
5. Open the browser extension on an official page and explain selected text.
6. Prepare a mock handoff only after the visible consent step.
7. Show the structured demo case ID and say clearly that no real authority was
   contacted.
