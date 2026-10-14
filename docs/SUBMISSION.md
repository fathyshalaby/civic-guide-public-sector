# Platform submission draft

## Title

**CIVIC / GUIDE — The public-service process translator**

## Summary

CIVIC / GUIDE is a source-backed public-service assistant for people who do
not know the official name of the procedure they need. A citizen can describe
what happened in everyday German or English, speak to the ElevenLabs agent,
or select confusing text on an Austrian government page through the Chrome
side panel. The system maps the request to a small, auditable workflow,
explains the official information in plain language, shows its source and
asks only for the missing preparation details. Our two demo journeys are
residence registration and passport renewal. Unknown, ambiguous or sensitive
requests stop safely and offer a human handoff. The prototype runs on
Cloudflare Pages/Functions with optional Workers AI, uses ElevenLabs for the
conversation channel, and returns an idempotent mock case only after visible
citizen consent. No real authority is contacted in the demo.

## Links to add before hand-in

- Repository: `https://github.com/fathyshalaby/civic-guide-public-sector`
- Live demo: `<Cloudflare Pages URL>`
- Demo video: `<public 1–2 minute video URL>`
- Pitch deck: `<optional public deck URL>`

## One-line pitch

**CIVIC / GUIDE does not ask citizens to find another chatbot; it follows them
to the exact government page where they get stuck.**

## Three proof points for the jury

1. Citizen language becomes a source-backed workflow, not a generic answer.
2. The browser, voice and future phone/WhatsApp channels share one guarded
   handoff contract.
3. The assistant visibly handles uncertainty: it cites, asks, pauses and keeps
   a human in the loop.
