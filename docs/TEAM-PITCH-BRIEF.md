# CIVIC / GUIDE — team and pitch brief

## What we are building

**CIVIC / GUIDE turns everyday citizen language into a clear, source-backed public-service next step and a consented brief that a public-service worker can actually use.**

The citizen does not need to know the name of a legal procedure. They can say:

> “Ich bin umgezogen und mein Reisepass ist bald abgelaufen. Was muss ich jetzt tun?”

CIVIC / GUIDE identifies the likely service, detects that two workflows are involved, asks the highest-value clarifying question, explains the official process in plain German or English, and prepares a human-readable handoff. It never pretends that an application was submitted or that eligibility was decided.

## Why this is the right public-sector problem

The official IDA assistant already proves that conversational access to verified government information is valuable. The opportunity is the moment where people still get stuck:

- they describe a life event, not a procedure name;
- official pages use administrative language that is hard to act on;
- a single request can combine residence, passport, family or identity questions;
- missing facts are discovered late, causing back-and-forth and wasted appointments;
- many people need English, voice input, a browser-side explanation or a human fallback.

Our wedge is **“get unstuck, not just informed.”** CIVIC / GUIDE complements the official portal and IDA by translating the citizen’s situation into the next safe action and a worker-ready intake summary.

## Three deliverables, one engine

### 1. Web app — the flagship journey

The citizen types or speaks. The app responds with plain-language guidance, official sources, confidence, missing facts, a next step and a consented staff brief.

### 2. Chrome extension — help where the confusion happens

On an Austrian government page, the citizen selects an administrative passage. The extension shows exactly what will be sent, explains the passage, maps it to a workflow and creates the same staff brief. It never reads passwords, form values, cookies or hidden fields.

### 3. Phone agent — inclusive access

An ElevenLabs agent supports natural German/English conversation, asks one missing question at a time, reads back the brief and asks for a clear yes before preparing a handoff. The same guarded Cloudflare tools power web, phone and future WhatsApp access.

## The shared output: CitizenCaseBrief

Every channel produces:

- the citizen’s original words;
- the likely service and confidence;
- a plain-language summary;
- facts already provided;
- missing questions and why they matter;
- prerequisites and the recommended next step;
- official sources;
- human-review and “not submitted” guardrails;
- a trace ID for auditability.

This is the bridge between citizen experience and public administration. The assistant is not the decision-maker; it makes the next human or official step better prepared.

## Demo story for judges

1. Start with a colloquial combined request in German: move + expired passport.
2. Show that CIVIC / GUIDE refuses to silently merge the processes and asks what should be handled first.
3. Run the residence or passport flow: explain the process, show the official source and the missing municipality/residence detail.
4. Switch to English or use voice to demonstrate accessibility without changing the workflow engine.
5. Open the official passport page in the extension, select a confusing sentence and ask for an explanation.
6. Show the same case as a structured brief for a public-service worker.
7. Confirm the handoff and show a demo case ID with the explicit status: **prepared for review, not submitted to a government system**.

## How the product scores against the brief

| Judging criterion | What we show |
| --- | --- |
| End-to-end journey · 35% | citizen language → intent → plain explanation → missing fact → consented staff brief |
| Conversational design/accessibility · 25% | German/English, voice input, phone path, browser context, one question at a time |
| Accuracy · 20% | small auditable workflow registry with official sources for residence, passport and childcare support |
| Uncertainty/guardrails · 10% | confidence, ambiguity detection, source links, no legal decision, human fallback, no fake submission |
| Robustness/polish · 10% | noisy input, incomplete facts, combined requests, provider-free deterministic demo, responsive UI |

## Technical story in one minute

```text
Web app ───────┐
Chrome panel ──┼──> Cloudflare Pages Functions
Phone agent ──┘       ├─ deterministic source-backed workflows
                      ├─ shared CitizenCaseBrief
                      ├─ guarded guidance + handoff tools
                      └─ mock adapter / future official API
```

Cloudflare keeps the public workflow logic and secrets at the edge. ElevenLabs supplies the conversational voice layer and can route the same agent to web, phone and WhatsApp. D1 is optional for audit and idempotent demo cases. A real government API is not required by the challenge; the mock adapter makes the handoff honest and repeatable.

## Suggested team split

These are suggested ownership lanes; confirm the actual assignment together.

- **Product/story:** keep the one-line promise, user personas, pitch narrative and judge flow coherent.
- **UX/accessibility:** test the web flow in German/English, keyboard/voice, readable type, human fallback and extension context preview.
- **Workflow/research:** verify official sources and maintain the residence, passport and childcare test phrases.
- **Extension/demo:** load the unpacked extension, test selected official text and prepare the short browser demo.
- **Voice/pitch assets:** configure the ElevenLabs prompt/tools if credentials are available, record the fallback transcript and produce the 1–2 minute walkthrough.

## Pitch-deck outline

### Slide 1 — People do not speak procedure

“I moved. My passport is expiring. What do I do?” is not a form name. It is the real input public services receive.

### Slide 2 — The gap

Official information can be correct and still be difficult to act on. The cost is confusion for citizens and repetitive, incomplete contacts for public employees.

### Slide 3 — The product

One verified public-service guide across web, browser and phone: understand, explain, prepare.

### Slide 4 — Live journey

Show the combined request, clarification, official source and brief. Keep the browser on the product; do not spend the pitch on architecture first.

### Slide 5 — The worker outcome

Show the brief as an artefact: original request, likely service, facts, missing information, next step, source and not-submitted state.

### Slide 6 — Why it is safe

Small source-backed workflow packs, confidence, explicit consent, human fallback, no account access, no hidden-page scraping and no invented legal decisions.

### Slide 7 — Why it can scale

Add a municipality-specific workflow pack or authenticated adapter without rebuilding the citizen experience. The same brief becomes an integration contract.

### Slide 8 — Pilot and business case

Pilot with a municipality or service owner on high-volume workflows. Value comes from fewer avoidable clarification contacts, better-prepared appointments and an auditable citizen experience. Revenue can combine a workflow-pack implementation with a service-owner platform subscription; validate pricing with public-sector partners rather than inventing a number for the hackathon.

### Slide 9 — The future state

By 2030, people should be able to start with their life situation, use the channel they can access, understand the official path and remain in control of every consequential action.

## Claims we must make carefully

Say:

- “source-backed guidance”;
- “handoff prepared for review”;
- “mock adapter proves the integration boundary”;
- “complements IDA and official portals”;
- “human review remains available.”

Do not say:

- “the application was submitted”;
- “the assistant decides eligibility”;
- “the AI replaces public employees”;
- “we access ID Austria accounts”;
- “the extension reads the whole government page.”

## Current build status

Implemented:

- Cloudflare Pages/Functions app and deterministic workflow registry;
- German/English residence, passport, ID Austria, parking, family and childcare guidance;
- typo-tolerant colloquial matching and combined-intent ambiguity;
- shared CitizenCaseBrief generation;
- web, extension and phone API boundaries;
- explicit confirmation and idempotent mock handoff;
- security and workflow tests.

Next build order:

1. render the brief as the flagship web outcome;
2. make the extension show context and the same brief;
3. package the ElevenLabs phone/WhatsApp setup;
4. run the judging matrix and record the clean demo.

## Team meeting checklist

Before presenting, everyone should be able to answer:

1. What problem are we solving? — translation from life-event language to an actionable public-service path.
2. Who benefits? — citizens first, public-service workers second, service owners third.
3. Why not just a chatbot? — the output is a verified next step and a structured human handoff, not a vague answer.
4. What happens when it is unsure? — it says so, asks a clarifying question or offers a human.
5. What is real today? — the live local product, source-backed workflows, extension boundary, guarded tools and mock handoff.
6. What is future work? — municipality packs, authenticated service adapters, staff console and native phone/WhatsApp credentials.
