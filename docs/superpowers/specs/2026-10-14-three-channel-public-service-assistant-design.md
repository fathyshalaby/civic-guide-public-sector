# CIVIC / GUIDE: Three-channel public service assistant

## Status

Approved direction from the product discussion; implementation review pending.

## Brief alignment

The official challenge asks for a functional 2030 public-service assistant that can:

- understand unstructured and colloquial citizen input;
- translate administrative language into plain German and English;
- guide a citizen through a public-service workflow;
- support accessibility across age, language and digital-literacy differences;
- provide a human fallback;
- handle the announced flows (passport renewal, primary-residence change and childcare subsidy questions);
- survive noisy, incomplete and combined requests;
- identify intent, verify prerequisites and produce structured administrative output;
- demonstrate both citizen value and reduced workload for public administration.

The prototype will therefore be judged by a single through-line: **citizen language in, verified next step and useful staff handoff out**. The website, extension and phone agent are three entry points to the same workflow, not three separate products.

## Product promise

> CIVIC / GUIDE turns “I need to sort out my papers” into a clear, source-backed next step for the citizen and a concise, consented brief for the public-service worker.

The product complements official portals and IDA. It does not pretend to be the authority, make a legal decision, submit a form, or access private accounts. Every consequential action remains with the citizen and the responsible office.

## Target personas

### 1. Citizen who is stuck

An Austrian resident, newcomer, older person or digitally less confident user who knows their life event but not the official service name. They can type, speak, or select confusing text on an official page. They need simple language, an answer in German or English, and an escape hatch to a human.

### 2. Public-service worker

An employee who receives incomplete, repetitive requests. They need the citizen's words, likely service, facts already supplied, missing questions and a safe recommended next step without trusting an opaque AI decision.

### 3. Service owner / municipality

The organisation that wants fewer avoidable contacts and better-prepared appointments while keeping official sources, human review and privacy boundaries intact.

## Three deliverables

### A. CIVIC / GUIDE web app

Primary demo surface and accessibility baseline.

Flow:

1. Citizen chooses German or English and types or speaks their situation.
2. Assistant identifies one likely service or shows a transparent ambiguity state.
3. Assistant explains the relevant official process in plain language, with source links and confidence.
4. Assistant asks only the missing questions needed for the next step.
5. Citizen reviews and consents to a structured staff brief.
6. The app displays a copyable brief, human fallback and explicit “not submitted” state.

Demo paths:

- “Mein Reisepass läuft bald ab. Was brauche ich?”
- “Ich bin umgezogen, aber mein Partner ist EU-Bürger und wir haben ein Kind.”
- “Welche Unterstützung gibt es für die Kinderbetreuung?”

### B. CIVIC / GUIDE Chrome extension

An in-context assistant for `*.gv.at` pages. The user can select confusing official text or request limited visible page context. The extension explains the passage, translates it into plain language, or creates the same staff brief without leaving the government website.

Privacy boundary:

- send only explicit selection or a clearly bounded visible-page excerpt;
- never read passwords, form values, hidden fields, cookies or account data;
- show exactly what context will be sent before the request;
- keep the same source and uncertainty presentation as the web app.

The extension is the innovation bridge between “the portal already exists” and “the user can actually understand it.”

### C. CIVIC / GUIDE phone agent

An ElevenLabs conversational agent using the same guidance and brief tools as the web app. The caller can speak naturally, switch between German and English, answer one question at a time, ask to repeat, or request a person.

Conversation contract:

- use the read-only guidance tool for every substantive answer;
- ask one missing question at a time;
- read back the brief before preparing it;
- require explicit confirmation before creating a handoff;
- never claim that a government application was submitted;
- route uncertainty, sensitive cases or frustration to a human.

Phone is an optional live channel in the demo; the core judging path remains fully runnable without provider credentials.

## Shared case contract

All channels produce the same `CitizenCaseBrief` shape:

```js
{
  channel: "web" | "extension" | "phone",
  originalRequest: string,
  language: "de" | "en",
  detectedService: {
    id: string,
    label: string,
    confidence: "high" | "medium" | "low"
  },
  citizenGoal: string,
  plainLanguageSummary: string,
  factsProvided: [{ label: string, value: string }],
  missingQuestions: [{ id: string, label: string, reason: string }],
  prerequisites: [{ label: string, status: "known" | "missing" | "check" }],
  recommendedNextStep: string,
  officialSources: [{ label: string, url: string }],
  guardrails: {
    sourceBacked: true,
    legalDecision: false,
    submitted: false,
    humanReviewRequired: true
  },
  handoff: {
    status: "not_prepared" | "prepared",
    consent: boolean,
    summary: string
  },
  traceId: string
}
```

The contract is intentionally administrative rather than model-centric. It gives the citizen a clear answer and the worker a usable intake artefact, while preserving the original words and showing what is still unknown.

## Workflow knowledge

The deterministic workflow registry remains the source of truth for the prototype. It will cover the three announced areas first:

1. primary residence registration / change of residence;
2. passport renewal, urgent, lost or stolen passport;
3. childcare subsidy information.

Existing ID Austria, parking and Familienbeihilfe knowledge can stay as supporting examples. Combined requests must produce either a ranked set of workflows or a clarifying question, never a silently merged legal answer.

Each workflow must provide:

- plain-language answer in German and English;
- official source URLs;
- ordered steps;
- prerequisites and missing fields;
- safe escalation conditions;
- test phrases covering colloquial, noisy and incomplete input.

## Experience and accessibility requirements

- German and English are first-class, not translated afterthoughts.
- Large readable type, strong contrast, visible focus states and keyboard operation.
- Every voice action has a text equivalent; every spoken answer can be read.
- Progressive disclosure: show the next decision, then details and sources.
- Avoid legal or AI jargon; preserve official terms in a secondary label where helpful.
- Always show source, confidence and whether an action was actually submitted.
- Human fallback is visible from every channel, not hidden after failure.

## Technical architecture

```text
web app ───────┐
Chrome panel ──┼─> shared /api/understand + workflow registry ─> CitizenCaseBrief
phone agent ──┘              │
                             ├─> /api/voice-guidance (read-only)
                             ├─> /api/voice-submit (explicit confirmation)
                             ├─> official source links
                             └─> mock handoff / future public-service adapter
```

Cloudflare Pages Functions remain the backend boundary. ElevenLabs is used only for the conversational voice layer and signed agent session; it does not become a second workflow engine. The mock service adapter remains the honest demo implementation until an authenticated government sandbox exists.

## Error and uncertainty design

- Unknown service: explain that the assistant is unsure, show the human fallback and preserve the original request.
- Multiple services: show the likely matches and ask which life event should be handled first.
- Missing facts: ask one question at a time and explain why it matters.
- Official-source conflict or stale knowledge: stop short of a definitive answer and direct the citizen to the responsible office.
- Provider/API failure: keep a deterministic local demo path and display a recoverable error, never a blank screen.
- Sensitive data: reject secrets and unnecessary identifiers; do not store raw citizen text in audit records.
- Submission language: use “prepared” or “ready to review,” never “filed” unless a real service adapter explicitly confirms it.

## Demo storyline and evidence

The 90-second story should be:

1. On the web app, a citizen describes a combined move/passport situation in colloquial German.
2. CIVIC / GUIDE separates the likely workflows, asks the highest-value missing question and cites the official source.
3. The citizen switches to English or uses voice and receives the same structured next step.
4. The extension opens an official page, the user selects an administrative sentence, and the extension explains it in context.
5. The phone agent reads back the same case brief and asks for confirmation before preparing a handoff.
6. The final screen shows the public-service worker's brief: original request, facts, missing information, next step, source and “not submitted.”

This explicitly demonstrates the brief's core tasks: intent identification, multi-step guidance, prerequisite checking, structured output, accessibility, ambiguity handling and human fallback.

## Acceptance criteria

### Required for the hackathon build

- Website handles the three announced workflow families in German and English.
- Website handles at least one combined request and one noisy/incomplete request.
- Website generates a copyable `CitizenCaseBrief` with source links and guardrails.
- Extension loads unpacked and creates a brief from selected official-page text.
- Phone agent configuration and secure webhook payloads are documented; local mock tools remain testable without credentials.
- All flows state clearly that no government action was submitted.
- `npm run check` and `npm test` pass.
- Strategy, technical documentation, demo script, repository and test evidence are up to date.

### Stretch if time remains

- live ElevenLabs widget session;
- phone number or WhatsApp routing through ElevenLabs;
- downloadable/printable brief;
- staff console mock showing incoming prepared handoffs;
- source freshness metadata and a small evaluation dashboard.

## Deliberate non-goals

- scraping or completing arbitrary government forms;
- accessing ID Austria or personal accounts;
- making eligibility, legal or benefits decisions;
- storing sensitive citizen profiles;
- building separate logic for each channel;
- adding a custom telephony or WhatsApp backend when ElevenLabs can own that integration.

## Self-review before implementation

The proposal is intentionally narrow enough for a hackathon: one deterministic knowledge layer, one shared output contract and three thin channel adapters. It directly maps to every evaluation criterion and keeps the phone integration optional rather than making external credentials a single point of failure. The main remaining risk is breadth across three surfaces; implementation should therefore finish the shared brief and web journey first, then make the extension and phone paths reuse it rather than inventing more features.

