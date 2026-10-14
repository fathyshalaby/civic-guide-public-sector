# CIVIC / GUIDE — Strategy paper

## Vision

By 2030, asking a public office for help should feel like explaining a
situation to a calm, well-informed person. CIVIC / GUIDE turns everyday words
into the next safe administrative step, while keeping official sources,
uncertainty and human responsibility visible.

## The problem

Public-service information is available, but it is often organised around
legal categories rather than the way people describe their lives. A person
who says “I moved and need to sort out my papers” may not know the name of the
procedure, the responsible office or which details matter. This creates
avoidable confusion, missed steps and unequal access for people with limited
German, low digital confidence, disabilities or little time.

## Primary personas

### The newcomer

Needs a short answer in German or English, can start with an informal voice
question and wants to know what to bring before contacting an office.

### The time-poor resident

Knows the life event but not the administrative vocabulary. Wants a reliable
checklist, the official source and a clear handoff instead of a long search.

### The public-service colleague

Needs a structured summary, trace ID and explicit citizen consent. The
assistant should reduce repetitive explanation, not make an unreviewable
decision or replace the responsible office.

## Value proposition

**We reduce avoidable back-and-forth by translating life events into
source-backed next steps and worker-ready handoffs.**

CIVIC / GUIDE listens to unstructured German or English, maps it to a small
source-backed workflow, explains the result in plain language and prepares a
human-reviewable handoff only after confirmation.

The same promise is available in three channels: the web app for the primary
journey, a Chrome extension for citizens who are already stuck on an official
page, and an ElevenLabs phone/WhatsApp agent for people who prefer or require
voice. The shared output is a `CitizenCaseBrief`, not a generic chat answer.

## Positioning against what already exists

Austria already offers a broad digital-services catalogue and the official
IDA chatbot. CIVIC / GUIDE is deliberately complementary: it is the
contextual, workflow-oriented layer that helps a citizen understand the page
they are already on. The differentiator is visible evidence and a safe
handoff, not a claim that the assistant can replace a public office.

## Product principles

1. **Explain before you act.** Every answer shows the next step and its source.
2. **Ask one useful question at a time.** Missing information becomes a small,
   understandable form instead of a bureaucratic wall.
3. **Never invent certainty.** Unknown or sensitive requests go to a human
   fallback.
4. **Consent is a visible step.** The assistant never implies that a request
   was submitted when it only prepared a handoff.
5. **Meet people where they are.** Browser, voice, phone and WhatsApp can use
   one ElevenLabs agent and the same guarded workflow tools.

## First use cases

- **Change of residence:** explain the registration deadline, required form,
  signature and photo ID; collect municipality and residence type.
- **Passport renewal:** branch between renewal, loss and urgent cases; point to
  the official passport service page and collect only the details needed to
  prepare a handoff.
- **Childcare support:** clarify the municipality and type of request, point to
  official financial-support information and never decide individual
  eligibility.

ID Austria, parking permits and family allowance remain additional workflow
packs so the architecture can adapt if the challenge emphasis changes.

## Who pays and why

The primary buyer is a municipality, public-service owner or implementation
partner responsible for high-volume citizen journeys. A pilot can begin with
one or two workflow packs and measure fewer avoidable clarification contacts,
better-prepared appointments and clearer escalation. A credible commercial
path is implementation of verified workflow packs plus a service-owner
subscription for source/version management, audit and handoff integration;
pricing should be validated with public-sector partners rather than invented
for the hackathon.

## What success looks like

- A first-time user can describe a problem without knowing the legal term.
- The user can switch between German and English without losing the flow.
- The answer has an official source, confidence signal and human fallback.
- A reviewer can see exactly what would be handed off and when consent was
  given.
- A municipality can replace the mock adapter with an authenticated service
  endpoint without changing the citizen experience.
