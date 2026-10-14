# CIVIC / GUIDE

## The public-service process translator

`CIVIC / GUIDE` accepts the way people actually describe their lives, maps the request to a small set of verified Austrian public-service workflows, explains the next step in plain German, and prepares a human-safe handoff.

The important distinction is deliberate: this is not another open-ended government chatbot and it does not make a legal decision. It turns `citizen language → official workflow → clear next action`, with source evidence and explicit consent before a write-capable integration is called.

## What the demo proves

1. A citizen types or speaks: `Ich bin umgezogen. Was muss ich jetzt erledigen?`
2. The system identifies the likely workflow, confidence and matched language signals.
3. It gives a plain-language answer and shows the official source behind it.
4. It asks only for missing workflow information such as municipality or residence type.
5. It prepares a structured handoff only after the citizen confirms.
6. A deterministic demo case ID is returned. A real public-service API can be connected through `functions/_lib/services.js`.

The product has three deliverables but one engine: the web app is the flagship
journey, the Chrome extension explains official text in context, and the
ElevenLabs phone/WhatsApp agent uses the same guarded tools. All three produce
a `CitizenCaseBrief` for a human worker. See
[`docs/TEAM-PITCH-BRIEF.md`](docs/TEAM-PITCH-BRIEF.md) for the team story and
[`docs/PHONE-AGENT.md`](docs/PHONE-AGENT.md) for the live voice setup.

The product is intentionally honest about uncertainty. Unknown requests go to a human-handoff state instead of receiving an invented answer.

## Channels

### Browser

```bash
npm install
npm run dev
```

The browser supports German and English speech input where the browser exposes Web Speech Recognition. The language toggle localizes the interface, sends the selected language to the workflow engine and keeps the source-backed flow intact. `Vorlesen` uses ElevenLabs when configured and falls back to browser speech synthesis.

### One ElevenLabs Agent: web, phone and WhatsApp

The backend already exposes two webhook tools:

- `POST /api/voice-guidance` — read-only classification and guidance.
- `POST /api/voice-submit` — prepares a case only with `confirm: true` and all required fields.

Create the agent with a system prompt along these lines:

```text
Du bist CIVIC / GUIDE, ein vorsichtiger österreichischer Amtsweg-Wegweiser.
Sprich einfaches Deutsch. Erfinde keine Fristen, Gesetze oder Voraussetzungen.
Nutze civic_guidance für jede Sachauskunft. Frage nur eine fehlende Information
auf einmal. Sage niemals, dass ein Antrag erledigt oder eingereicht wurde, wenn
das Tool dies nicht ausdrücklich bestätigt. Bevor du prepare_civic_case nutzt,
lies alle Angaben zusammenfassend vor und hole ein klares Ja.
Bei geringer Sicherheit oder sensiblen Rechts-, Sozial- oder Gesundheitsfragen
übergib an einen Menschen.
```

Configure `civic_guidance` as a POST webhook to `/api/voice-guidance` with a `message` string. Configure `prepare_civic_case` as a POST webhook to `/api/voice-submit` with `workflow`, `fields`, `confirm` and optional `traceId`. Set the same `ELEVENLABS_TOOL_SECRET` in the agent webhook header and Pages environment.

The write-capable tools fail closed until `ELEVENLABS_TOOL_SECRET` is configured. For a throwaway local demo only, set `ALLOW_UNAUTHENTICATED_TOOLS=true`; never use that setting in a deployed environment.

ElevenLabs signed conversations are available through `GET /api/conversation-url`; the adapter is in `functions/_lib/elevenlabs.js`.

Use the same agent everywhere:

1. For web, use the signed conversation URL or an ElevenLabs widget.
2. For phone, import a purchased Twilio number in the ElevenLabs Phone Numbers section and assign the agent.
3. For WhatsApp, import the WhatsApp Business account in ElevenLabs, assign the agent, and enable messaging and optional voice-note responses.

There is no custom Twilio or WhatsApp conversation server in this repo.
ElevenLabs owns the conversation state, turn-taking, voice notes, phone routing
and WhatsApp session lifecycle; Cloudflare owns the source-backed workflow
logic and exposes the two secure tools. The exact agent prompt, payloads and
fallback transcript are in [`docs/PHONE-AGENT.md`](docs/PHONE-AGENT.md).

### Chrome extension: CIVIC GUIDE on government pages

The `extension/` folder contains a Manifest V3 Chrome side panel and a small
in-page launcher for Austrian government domains such as `*.gv.at`. A citizen
can select official text and ask CIVIC / GUIDE to explain it, switch language,
or start a guided workflow. The extension sends only the explicit selection or
an explicitly requested, limited page context; it does not read form values,
password fields or silently scrape whole pages.

Load it locally from `chrome://extensions` with Developer mode → Load unpacked
→ select `extension/`. Set the side-panel API URL to the deployed Pages URL;
it defaults to `http://localhost:8796` for local development. See
`extension/README.md` for the Chrome Web Store and production checklist.

## Cloudflare setup

1. Create a Pages project and deploy the repository root.
2. Add an optional Workers AI binding named `AI`.
3. Create a D1 database and apply `migrations/0001_audit_events.sql`.
4. Bind the database to Pages as `AUDIT_DB`.
5. Add secrets from `.dev.vars.example` in the Pages environment.

```bash
npx wrangler d1 create summit-sprint-public-sector-audit
npx wrangler d1 execute summit-sprint-public-sector-audit --remote --file=migrations/0001_audit_events.sql
npm run deploy
```

The audit table records event type, workflow, trace ID and non-sensitive metadata. The `civic_cases` table gives mock handoffs stable, idempotent case IDs when D1 is bound. It deliberately stores `rawMessageStored: false` rather than citizen text.

## GitHub and production deployment

The repository includes a CI workflow at `.github/workflows/ci.yml`. It runs syntax checks and tests on every push and pull request. Create a Cloudflare Pages project connected to this repository, set the Pages environment variables from `.dev.vars.example`, bind `AUDIT_DB`, and use `npm run deploy` for a manual deployment.

For the first real pilot, keep `PUBLIC_SERVICE_MODE=mock` until the target municipality or public-service sandbox provides an authenticated submission contract. The product is then ready to switch the adapter to `live` without changing the citizen-facing flow.

## Environment variables

Copy `.dev.vars.example` to `.dev.vars` for local work. The important variables are:

```text
USE_WORKERS_AI=false
ELEVENLABS_API_KEY=replace-me
ELEVENLABS_AGENT_ID=agent_replace-me
ELEVENLABS_TOOL_SECRET=
PUBLIC_SERVICE_MODE=mock
PUBLIC_SERVICE_API_BASE_URL=
PUBLIC_SERVICE_API_TOKEN=
```

Keep `PUBLIC_SERVICE_MODE=mock` for the event unless a real sandbox endpoint and authentication contract are supplied. Never claim a government action happened merely because the demo adapter returned a case ID.

## Current workflow knowledge

The deterministic knowledge layer contains small, auditable examples for:

- residence registration (`Wohnsitz anmelden`);
- passport renewal and lost/urgent passport guidance (`Pass erneuern`);
- ID Austria setup;
- parking permissions;
- Familienbeihilfe information.

Each workflow contains its plain-language answer, questions, required preparation fields, ordered steps and official source URLs. Add new challenge-day workflows in `functions/_lib/knowledge.js`, not inside the UI.

## Product boundary and future work

The first version is a safe guidance and handoff layer around existing Austrian services such as `oesterreich.gv.at`, the official IDA chatbot, ID Austria and municipal systems. It complements the portal instead of claiming to replace it. The next credible extensions are:

- upload a government letter and explain it in plain language;
- municipality-specific workflow packs and appointment deep links;
- a staff console that receives a structured conversation summary;
- explicit representation and Once-Only consent flows;
- source versioning, freshness checks and an evaluation set of real citizen questions;
- a real authenticated public-service sandbox adapter.

## Checks

```bash
npm run check
npm test
```

Useful official context: [Austrian digital administration](https://www.bundeskanzleramt.gv.at/agenda/digitalisierung/verwaltung.html), [oesterreich.gv.at digital services](https://www.oesterreich.gv.at/de/formsearch), [ida](https://www.oesterreich.gv.at/.syndication?pageId=a519388b-69ce-49e3-b388-a393caf9911a), [Cloudflare Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [ElevenLabs webhook tools](https://elevenlabs.io/docs/eleven-agents/customization/tools/webhook-tools), and [ElevenLabs Twilio integration](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration/).
