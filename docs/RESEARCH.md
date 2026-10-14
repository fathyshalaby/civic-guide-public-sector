# Public-sector challenge research

## What the hackathon platform asks for

The CH-03 brief asks for a live 2030 public-service assistant that can:

- understand colloquial citizen input;
- translate administrative language into plain German and English;
- guide a citizen step by step through a service;
- work for different access needs and keep a human fallback;
- demonstrate one or two concrete services;
- ship with a strategy paper, technical notes, repository and a 1–2 minute
  demo video.

The platform deadline is **15 October 2026 at 09:00 Europe/Vienna**. The
submission form requires a title, summary and reachable repository URL; a live
demo, video and pitch deck are optional links. The team is SPARK and the track
is CH-03.

## Existing official landscape

The official Austrian catalogue already exposes a broad surface: residence
registration, passport services, ID Austria, certificates, online appointment
booking, Mein Amt, FinanzOnline, Meine SV, ELGA, AMS and other authority
portals. This means the product should not pretend to replace the government
portal. Its job is to make the existing surface understandable and navigable.

The catalogue also embeds **ida**, the official Austrian chatbot. Its visible
terms say that it uses publicly available information, works without human
intervention, can produce hallucinations and is only an initial, non-binding
information service.

That creates a clear product wedge for CIVIC / GUIDE:

| Existing surface | CIVIC / GUIDE adds |
| --- | --- |
| Search and service pages | A contextual explanation of the page the citizen is looking at |
| Open-ended initial information | A small, source-backed workflow with ordered next steps |
| No human intervention in the chatbot terms | Explicit confidence, human fallback and structured handoff |
| Primarily web portal interaction | Web, voice, phone/WhatsApp agent and a browser side panel |
| Legal/administrative vocabulary | Citizen language, German/English and read-aloud support |

## Anchor use cases

### Residence registration

The official English residence page says that registration, deregistration and
change of status can be completed online in some circumstances, that a
confirmation is immediately available for download, and that ID Austria or EU
Login plus age-of-majority requirements apply. It also warns that the person
must already be registered in Austria and that registration has legal
consequences.

This is a strong demo because the user intent is naturally colloquial (“I
moved”) while the official path contains a deadline, requirements and a
responsible office.

### Passport renewal

The official passport page points to passport-related services and separate
information for reissuance, minors, urgent requests, lost or stolen passports
and applying at municipal offices. The right answer depends on the case, so the
assistant should explain the decision tree and source rather than claim a
single universal checklist.

This is a strong second demo because it shows cautious branching and avoids
the unsafe promise that an AI has completed a legal or identity process.

## Product decision

Position CIVIC / GUIDE as a **service-navigation layer**, not a replacement
for IDA or an autonomous government agent:

1. Capture the citizen's words or the explicit text they select on a government
   page.
2. Match to a small, auditable workflow pack.
3. Explain what the official source means in plain language.
4. Ask only for the missing preparation details.
5. Show the source, confidence and human-review boundary.
6. Prepare a structured handoff only after explicit confirmation.

## What we will not claim in the demo

- We do not submit a real government application.
- We do not make an eligibility or legal decision.
- We do not scrape or read form values through the extension.
- A mock case number means “handoff prepared”, not “application accepted”.
- The official source remains the authority for current deadlines, fees and
  legal requirements.

## Sources checked

- [CH-03 public-sector track](https://hackathon.feodos.at/tracks/01a13750-fcc9-7000-9f16-2787ab9700f0)
- [Austrian digital-services catalogue](https://www.oesterreich.gv.at/en/formsearch)
- [Austrian public services](https://www.oesterreich.gv.at/en/landingpages)
- [Residence registration](https://www.oesterreich.gv.at/en/landingpages/meldewesen)
- [Passport Online Services](https://www.oesterreich.gv.at/en/landingpages/reisepass)
- [IDA chatbot terms](https://www.oesterreich.gv.at/de/landingpages/chatbot-ida/nutzungsbedingungen)
