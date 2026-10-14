# Platform submission draft

## Title

**CIVIC / GUIDE — The public-service process translator**

## Summary

CIVIC / GUIDE is a source-backed public-service assistant for people who do
not know the official name of the procedure they need. A citizen can describe
what happened in everyday German or English on the web, select confusing text
on an Austrian government page through the Chrome side panel, or speak to the
ElevenLabs phone/WhatsApp agent. All three deliverables use one workflow
engine and produce a `CitizenCaseBrief`: original request, likely service,
known facts, missing information, recommended next step and official source.
The prototype covers residence registration, passport renewal and childcare
support. Unknown, ambiguous or sensitive requests stop safely and offer a
human handoff. Cloudflare Pages/Functions keeps the source-backed logic and
guarded tools, ElevenLabs provides the conversation channel, and the mock
adapter returns an idempotent prepared case only after visible citizen
consent. No real authority is contacted in the demo.

## Links to add before hand-in

- Repository: `https://github.com/fathyshalaby/civic-guide-public-sector`
- Live demo: `<Cloudflare Pages URL>`
- Demo video: `<public 1–2 minute video URL>`
- Pitch deck: `<optional public deck URL>`

## One-line pitch

**CIVIC / GUIDE turns the way citizens describe their lives into a clear next
step—and a brief a public-service worker can use.**

## Three proof points for the jury

1. Citizen language becomes a source-backed workflow, not a generic answer.
2. Web, Chrome extension and phone/WhatsApp share one guarded
   `CitizenCaseBrief` contract.
3. The assistant visibly handles uncertainty: it cites, asks, pauses and keeps
   a human in the loop.
