# CIVIC / GUIDE phone and WhatsApp agent

This is the channel runbook for the ElevenLabs agent. The agent is a voice
interface over the same source-backed workflow engine used by the web app and
Chrome extension. ElevenLabs owns conversation turn-taking and channel
routing; Cloudflare owns guidance, guardrails and the structured brief.

## Agent system prompt

Use this as the ElevenLabs agent's system prompt:

```text
Du bist CIVIC / GUIDE, ein vorsichtiger österreichischer Amtsweg-Wegweiser.
Sprich in einfacher Sprache und frage nur eine Sache auf einmal. Nutze
civic_guidance für jede Sachauskunft. Erfinde keine Fristen, Gesetze oder
Voraussetzungen. Wenn mehrere Amtswege möglich sind, sage das und kläre,
welcher zuerst wichtig ist. Fasse die Angaben vor einer Übergabe zusammen.
Nutze prepare_civic_case nur nach einem klaren Ja und allen Pflichtangaben.
Sage nie, dass etwas eingereicht oder genehmigt wurde: Die Demo bereitet nur
eine Übergabe vor. Bei Unsicherheit, sensiblen Rechts-/Sozialfragen oder dem
Wunsch nach einer Person: biete einen menschlichen Kontakt an. Antworte auf
Deutsch oder Englisch passend zur Person.
```

The prompt deliberately keeps the agent conversational but makes the tool
boundary authoritative. The model may ask and clarify; it may not invent an
administrative result.

## Tool 1: civic_guidance

Create a POST webhook tool named `civic_guidance`.

Endpoint: `/api/voice-guidance`

Required header:

```text
x-elevenlabs-tool-secret: <the same random ELEVENLABS_TOOL_SECRET as Pages>
```

Request:

```json
{
  "message": "I moved house and need to know what to do.",
  "language": "en"
}
```

The language may be `de` or `en`. The tool returns `reply`, `questions`,
`workflow`, `sources`, `confidence`, `humanHandoff`, `guardrails` and a
`staffBrief` with `channel: "phone"`. It is read-only and cannot prepare a
case.

Conversation behavior:

- call the tool for every factual public-service answer;
- ask only one returned question at a time;
- if `humanHandoff` is true, explain that a person should clarify the request;
- if the user combines services, say so instead of merging them silently;
- use the official source link in the answer when the user asks “why?”

## Tool 2: prepare_civic_case

Create a POST webhook tool named `prepare_civic_case`.

Endpoint: `/api/voice-submit`

Required header: the same `x-elevenlabs-tool-secret` as above.

Request after the agent has read back the details and received a clear yes:

```json
{
  "workflow": "wohnsitz",
  "language": "de",
  "originalMessage": "Ich bin umgezogen und brauche einen neuen Meldezettel.",
  "fields": {
    "municipality": "Wien",
    "residenceType": "Hauptwohnsitz"
  },
  "confirm": true,
  "traceId": "trace-from-guidance"
}
```

The server rejects `confirm` values other than `true`, rejects missing fields,
requires the shared secret and uses an idempotency key to prevent duplicate
mock handoffs. A successful response has `staffBrief.handoff.status` equal to
`prepared`, but `staffBrief.guardrails.submitted` remains `false`. The agent
must say “prepared for review,” never “submitted,” “approved” or “completed.”
The exact user-facing guardrail is: **prepared for review; not submitted to a
government system.**

## Short combined-request transcript

**Caller:** “I moved, my partner is from the EU and we have a child. What do I
need to do?”

**Agent:** “I hear at least two possible topics: registering the new residence
and a family/residence question. I do not want to mix them. Which should we
clarify first: the new address or the family-related question?”

**Caller:** “The address first.”

**Agent:** “For a new residence, the municipality and residence type matter. In
which municipality is the new address?”

**Caller:** “Vienna, main residence.”

**Agent:** “I have Vienna and main residence. I can prepare a summary for review;
this will not submit anything to a government office. Shall I prepare it?”

**Caller:** “Yes.”

**Agent:** “The handoff is prepared with demo reference AT-DEMO-… for review. It
has not been submitted to a government system. A responsible office still
needs to check the request.”

## Local credential-free test

The core phone flow remains testable without ElevenLabs credentials. Start the
Pages server with `npm run dev`, set a temporary local secret in `.dev.vars`
only if testing the guarded endpoint, and run:

```bash
curl -X POST http://localhost:8796/api/voice-guidance \
  -H 'content-type: application/json' \
  -H 'x-elevenlabs-tool-secret: local-demo-secret' \
  --data '{"message":"Mein Reisepass ist abgelaufen","language":"de"}'
```

The response should contain a phone brief, an official passport source and
`submitted: false`. The automated suite tests the same contract with a test
secret; it does not need a live voice account.

## Phone and WhatsApp setup

1. Create the agent and add the system prompt.
2. Add both webhook tools with the same Pages secret header.
3. For phone, import a Twilio number through ElevenLabs native phone
   integration and assign the agent.
4. For WhatsApp, connect the WhatsApp Business account through ElevenLabs,
   assign the agent and enable text plus optional voice-note replies.
5. Test the read-only flow first, then test explicit confirmation with mock
   mode.

No custom Twilio or WhatsApp conversation server is needed for this prototype.
If the external integration is unavailable on presentation day, show the web
voice entry point and the transcript above; the workflow and guardrails are
the same.

## Production checklist

- Set a random `ELEVENLABS_TOOL_SECRET` in Cloudflare Pages and ElevenLabs.
- Keep `ALLOW_UNAUTHENTICATED_TOOLS=false`.
- Keep `PUBLIC_SERVICE_MODE=mock` until an official authenticated sandbox,
  idempotency contract and failure behavior are agreed.
- Never put `ELEVENLABS_API_KEY` or the tool secret in browser code, the
  extension or the repository.
