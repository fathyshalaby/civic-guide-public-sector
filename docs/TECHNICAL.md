# CIVIC / GUIDE — Technical documentation

## Runtime

The product is a Cloudflare Pages application with Pages Functions. The
browser is a dependency-light HTML/CSS/JavaScript client. The backend keeps
the public-service knowledge and integration secrets off the client.

```text
Browser / ElevenLabs Agent
          │
          ├── POST /api/understand       read-only guidance
          ├── GET  /api/conversation-url signed ElevenLabs web conversation
          ├── POST /api/tts              optional ElevenLabs speech output
          ├── POST /api/voice-guidance   guarded read-only agent tool
          └── POST /api/voice-submit     guarded, consent-gated handoff tool
                         │
                 knowledge.js + service adapter
                         │
                 mock mode or authenticated public API
                         │
                         D1 audit + idempotent demo cases
```

The Chrome Manifest V3 extension is a thin client on the same read-only
`/api/understand` route. It only sends explicit selected text or a small,
user-requested page context from an Austrian government domain. It never reads
form values, password inputs or hidden page content.

All three channels produce the same `CitizenCaseBrief`: original request,
detected service and confidence, plain-language summary, known facts, missing
questions, recommended next step, official sources and explicit handoff
guardrails. The web and extension render it for a citizen/worker; the phone
agent receives it through the secured ElevenLabs tools.

## Safety boundary

`functions/_lib/knowledge.js` is the source-backed workflow registry. The
assistant does not call a general model to invent public-service facts. An
optional Workers AI pass may improve wording, but the deterministic workflow,
sources, fields and guardrails remain the contract.

The write-capable routes require `ELEVENLABS_TOOL_SECRET`. They accept a case
only when the agent sends `confirm: true` and all required workflow fields are
present. The browser has a separate visible confirmation checkbox.

The event guide makes Workers AI and the Agents SDK available as optional
building blocks. We keep them optional in the prototype: Pages and Functions
provide the stable runtime, while the workflow registry remains auditable even
when model or provider calls are unavailable.

## Channels

The browser uses the ElevenLabs ConvAI web component when an agent ID or
server-issued signed URL is available. Phone and WhatsApp use the native
ElevenLabs integrations, so the repository does not need separate channel
state machines. All channels call the same guidance and handoff tools.

ElevenLabs owns conversation state and channel routing. Cloudflare Pages
Functions own source-backed classification, bounded context handling, consent
checks and the mock/live service adapter. If ElevenLabs credentials are absent,
the web and extension remain fully usable and the phone contract can be tested
with signed local requests.

## Data handling

Audit events store workflow, trace ID, channel, confidence and operational
metadata. Citizen text is not stored by the audit helper. When D1 is enabled,
mock cases are stored with a stable idempotency key so retries do not create
duplicate handoffs.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

Keep `PUBLIC_SERVICE_MODE=mock` locally. Run `npm run check && npm test` before
opening a pull request.

## Production checklist

- Add `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID` and a random
  `ELEVENLABS_TOOL_SECRET` to the Pages environment.
- Configure both ElevenLabs webhook tools with the shared secret.
- Bind D1 as `AUDIT_DB` and apply `migrations/0001_audit_events.sql`.
- Add the allowed domain in ElevenLabs before using the widget.
- Keep `ALLOW_UNAUTHENTICATED_TOOLS=false`.
- Connect a real public-service sandbox only after its authentication,
  idempotency and failure contract are agreed.
- Run the evaluation cases in `docs/EVALUATION.md` against noisy, incomplete
  and combined requests before changing the workflow registry.
