# SPARK research pack — public-service assistants to 2030

**Prepared for:** SPARK team  
**Challenge:** CH-03 — Digital Assistants: Evolution to 2030 (Public Sector)  
**Product concept:** CIVIC / GUIDE  
**Research type:** Directional desk research and product synthesis; Reddit and forum posts are qualitative signals, not representative prevalence data.

## Executive summary

The public-service problem is not that Austria has no digital services. Austria already has a broad catalogue, ID Austria, online transactions and the official `ida` chatbot. The recurring gap is the translation layer between a person’s life situation and the correct administrative path.

People do not usually begin with the name of a procedure. They say: “I moved,” “my passport is expiring,” “I cannot find the document,” or “what do I need for my child?” The system then expects them to know the responsible authority, legal terminology, authentication level, deadline, documents and appointment process.

The strongest product opportunity is therefore not “another chatbot.” It is a **source-backed service-navigation and handoff layer**:

1. understand colloquial German or English;
2. identify the likely service and expose uncertainty;
3. translate official language into a short, plain-language checklist;
4. ask only for the missing preparation facts;
5. point to the authoritative source;
6. prepare a human-reviewable brief without pretending to submit an application.

This positioning complements official portals and `ida`. It makes the existing public-service surface easier to use while preserving authority, consent and human responsibility.

## 1. Research question and process

### Core question

What prevents people from completing Austrian public-service journeys today, what patterns are visible in citizen discussions and international public-sector products, and what should SPARK build for the 2030 brief?

### Research process

| Step | What we examined | Output |
| --- | --- | --- |
| 1. Challenge extraction | CH-03 brief, deliverables and constraints | A testable product promise and evaluation map |
| 2. Official baseline | oesterreich.gv.at, ID Austria and `ida` terms | What already exists and what we must not claim to replace |
| 3. Citizen-signal scan | Reddit threads in r/Austria and r/AskAustria | Repeated friction hypotheses, language and emotional context |
| 4. International scan | Estonia, Singapore and UK government service practice | Patterns worth adapting, not copying blindly |
| 5. Synthesis | Pain → need → product response → guardrail | Personas, flows, MVP and 2030 direction |
| 6. Product validation | Existing CIVIC / GUIDE prototype and tests | A live proof that the main flows work across three channels |

### Evidence discipline

- Official government pages are the authority for deadlines, eligibility, fees and legal requirements.
- Reddit is useful for discovering language, confusion and unmet needs, but individual posts do not prove how common a problem is.
- International examples show patterns and design principles, not evidence that the same implementation will work in Austria.
- The prototype must label simulated handoffs, confidence and future integrations honestly.

## 2. What CH-03 actually asks for

The brief asks for a live 2030 public-service assistant that:

- understands unstructured or colloquial citizen input;
- explains administrative language in simple German and English;
- guides a person step by step through a service;
- is accessible to different population groups;
- offers a human contact as fallback;
- demonstrates one or two concrete cases such as passport renewal, change of residence or an application;
- includes a short strategy paper, working prototype or high-fidelity mockup, technical documentation and a repository with a 1–2 minute demo video.

The winning interpretation is an end-to-end journey, not a generic chat screen: **citizen language in → verified next step → useful, consented handoff out**.

## 3. Austria today: what is already available

### Official service surface

Austria already offers a broad digital-services catalogue covering residence registration, passports, certificates, ID Austria, appointments and links into services such as FinanzOnline, Meine SV, ELGA and AMS. The catalogue is the correct source of truth for the actual procedure.

This means CIVIC / GUIDE should not pretend to replace the official portal. It should make the portal understandable and help a person reach the right next step.

### ID Austria and connected services

ID Austria is a powerful identity and transaction layer. It can make some services genuinely fast: users report completing residence updates and other transactions on mobile, downloading documents and submitting receipts through connected services.

However, the identity layer can itself become the problem. Citizen discussions repeatedly show confusion about:

- Basic versus Full Function;
- the relationship between ID Austria, Digitales Amt, FinanzOnline and other portals;
- activation, TANs, telephone-number login and upgrade steps;
- unclear technical errors and uncertainty about whether a failed-looking action actually worked;
- the difference between a digital document, a registration record and a certificate with a fee.

The product implication is important: we can guide people toward ID Austria, but we must not access their account, ask for credentials or imply that authentication succeeded.

### `ida`, the existing official chatbot

Austria’s official catalogue already presents `ida` as an initial information service using publicly available information. Its terms explicitly acknowledge that answers can contain errors and that the service is non-binding and not a substitute for a responsible authority.

That is not a reason to compete on “more AI.” It is a reason to differentiate on:

| Existing `ida`/portal pattern | CIVIC / GUIDE contribution |
| --- | --- |
| Open-ended information | A small, auditable workflow with ordered next steps |
| Search and service pages | Contextual explanation of the page or passage the person is seeing |
| Generic answer | Missing-fact questions that prepare the next interaction |
| No implied case artefact | A structured `CitizenCaseBrief` for human review |
| Mostly web interaction | Web, browser side panel and voice/phone/WhatsApp-ready entry points |
| Information only | Information plus visible confidence, consent and escalation boundary |

## 4. Citizen pain signals from Reddit and forums

These are qualitative signals. We use them to choose hypotheses and demo scenarios, not to claim statistical incidence.

### Pain A — People know the life event, not the procedure

Newcomers and residents describe “I moved,” “I need a Meldezettel,” or “I need to fix my papers,” while the official system requires distinctions between initial registration, change of address, deregistration, registration certificate, residence status and the responsible office.

The Meldezettel discussions also surface practical details that are easy to miss: the accommodation provider’s signature, the three-day registration rule and the difference between Austrian registration and the separate EU registration certificate for longer stays.

**Need:** start with the person’s situation, then reveal the correct procedure and the one fact that changes the path.

### Pain B — The instructions are correct but not actionable

People often ask basic questions such as where to download a document, which office handles it, what to bring and whether an online step really completed. The problem is not always missing information; it is that information is distributed across pages, terminology and portals.

**Need:** convert official prose into a short checklist with source links, prerequisites and a clear next action.

### Pain C — Identity and authentication vocabulary creates a second bureaucracy

The ID Austria discussions show frustration with Basic/Full Function, Digitales Amt, FinanzOnline, telephone-number login, TANs and upgrade requirements. One recurring pattern is that a user has already taken a step but cannot tell whether the issue is their account, the authority, the app or a handoff between systems.

**Need:** explain the difference between identity, authorization and the public-service transaction in plain language; never ask the assistant to handle credentials.

### Pain D — Appointment discovery is a major part of the journey

One community-built site exists specifically to monitor available ID Austria appointments across Viennese locations. The accompanying discussion describes users repeatedly checking multiple offices, giving up after finding no availability and assuming a government page was broken.

**Need:** make the appointment step explicit, explain what the appointment is for and prepare the user with the right documents before they search or call. A future official integration could add availability; the hackathon prototype should keep this as a transparent link or simulated adapter.

### Pain E — Digital services can work well and still feel fragmented

Positive threads report that mobile residence registration, health reimbursements and baby-document preparation can be fast when the right service is known. The same discussions mention unclear error messages, inconsistent handoffs and physical exceptions where a digital ID is not accepted.

**Need:** acknowledge success and show the user which part is digital, which part is still physical and what to do if the system gives an ambiguous result.

### Pain F — Fees and document types are easy to misunderstand

Threads about Meldebestätigung and ZMR extracts show confusion about why similar-sounding documents have different fees and why a new address registration can be free while a certificate or extract costs money.

**Need:** distinguish “registration,” “confirmation,” “certificate” and “downloaded proof” instead of collapsing them into “the Meldezettel.” Fees must always come from the current official source.

### Pain G — Language, newcomer status and stress amplify every ambiguity

The recurring emotional context is not just inconvenience. People are worried about deadlines, fines, residence status, missing documents, landlords and whether they will be understood at an office. Limited German makes a technically correct page much harder to act on.

**Need:** German/English parity, read-aloud/voice entry, short sentences, one question at a time and a human fallback.

## 5. User research themes → design requirements

| Research theme | User need | Product response | Guardrail |
| --- | --- | --- | --- |
| Life event, not legal label | “Tell me what this is called and what I do next.” | Colloquial intent matching and workflow cards | Show confidence and ask when intent is ambiguous |
| Distributed information | “Give me the shortest safe path.” | Ordered steps, prerequisites and official sources | Do not invent missing rules or dates |
| ID Austria confusion | “Explain which identity step matters.” | Plain-language explanation and link to official help | Never collect credentials or access accounts |
| Appointment friction | “Tell me what the appointment is for.” | Preparation checklist and official booking link | No fabricated availability |
| Language/accessibility | “Let me use the channel I can manage.” | German/English, voice, browser context, readable UI | Preserve the same evidence and workflow across channels |
| Fear of making a mistake | “Let me check before anything consequential happens.” | Explicit consent and reviewable brief | Prepared is not submitted |
| Complex combined requests | “Help me separate the problems.” | Ranked workflows and one clarifying question | Never silently merge legal processes |
| Need for a human | “Give me somewhere to go when the system cannot answer.” | Human fallback and staff-ready summary | Escalate instead of hallucinating |

## 6. Personas

### Persona 1 — The newcomer

**Situation:** Recently moved to Austria; speaks conversational English or informal German; does not know the government vocabulary.  
**Goal:** Register the address, understand what is urgent and avoid a wasted appointment.  
**Frictions:** Meldezettel versus registration certificate, landlord signature, ID Austria setup, unfamiliar offices.  
**Success:** Can explain the situation in their own words and leave with a bilingual checklist, source and next step.

### Persona 2 — The time-poor resident

**Situation:** Has a life event, little time and a half-remembered government page.  
**Goal:** Resolve the task correctly on the first attempt.  
**Frictions:** Long pages, scattered links, unclear terminology, multiple services in one question.  
**Success:** Receives the correct workflow, answers only high-value questions and arrives prepared.

### Persona 3 — The digitally excluded or accessibility-dependent user

**Situation:** Prefers voice, needs read-aloud support, has low digital confidence or cannot comfortably use a dense portal.  
**Goal:** Understand and complete the same process without being pushed into a second-class channel.  
**Frictions:** Small text, long forms, confusing authentication and no obvious human route.  
**Success:** Uses voice/phone or a simple interface and receives the same source-backed answer and handoff.

### Persona 4 — The public-service colleague

**Situation:** Handles repetitive first-contact questions and incomplete appointments.  
**Goal:** See what the citizen is asking, what is known, what is missing and what has been consented to.  
**Frictions:** Repeated explanations, missing context, unclear confidence and unstructured phone notes.  
**Success:** Receives a concise `CitizenCaseBrief` and can take over without trusting an opaque autonomous decision.

### Persona 5 — The service owner

**Situation:** Owns a municipality or agency journey with high clarification volume.  
**Goal:** Improve completion and reduce avoidable contacts without losing legal or operational control.  
**Frictions:** Legacy systems, changing source content, fragmented channels and privacy constraints.  
**Success:** Can add a verified workflow pack, monitor source versions and replace the mock handoff adapter with an approved integration.

## 7. Current-state journeys

### Current journey A — Change of residence

1. A person moves and searches using informal language.
2. Search results mix Meldezettel, residence registration, registration certificate and local office pages.
3. The user discovers that the form, signature, deadline, identity level and responsible office depend on context.
4. They either submit incomplete information, search several pages, book the wrong appointment or call an office for clarification.
5. The public-service colleague repeats the same explanation and asks for missing details.

### Current journey B — Passport renewal or loss

1. The person says their passport is expiring, lost or urgently needed.
2. The correct path depends on urgency, location, nationality, age and whether it is a renewal or loss report.
3. Official information is accurate but distributed across branches and office-specific instructions.
4. The user is unsure which documents and appointment type apply.
5. The office receives an incomplete question or the user arrives unprepared.

### Current journey C — ID Austria problem

1. The user sees a Basic/Full Function, TAN or app error.
2. They search across ID Austria, Digitales Amt, FinanzOnline and authority pages.
3. They cannot tell whether the failure is an account state, a technical issue or a service-specific requirement.
4. They call or visit an office without a structured explanation of what already happened.

## 8. Proposed future-state journey: CIVIC / GUIDE

1. **Start with the life event.** The user types, speaks or selects confusing official text.
2. **Understand safely.** The system identifies one or more likely workflows and shows confidence.
3. **Disambiguate.** If the request combines a move and passport issue, the system says so and asks which to handle first.
4. **Explain plainly.** The user sees a short summary, ordered steps and what each document or identity step is for.
5. **Ask only what matters.** Municipality, residence type, urgency or request type are collected one at a time; no password, form value or hidden page data is needed.
6. **Show evidence.** Each workflow includes the official Austrian source and a “check current requirements” link.
7. **Prepare, do not pretend.** The user reviews a staff-ready brief and explicitly consents before a simulated handoff is created.
8. **Keep a human in the loop.** Unknown, sensitive or low-confidence requests become a human fallback instead of an invented answer.

### Shared output: `CitizenCaseBrief`

- original request;
- language and channel;
- detected service and confidence;
- plain-language summary;
- facts already provided;
- missing questions and why they matter;
- prerequisites and recommended next step;
- official sources;
- consent and “prepared, not submitted” guardrails;
- trace ID and a concise staff handoff.

## 9. Product channels and why each matters

### Web app — flagship

Best for the main judge journey: colloquial request → clarification → official source → staff brief. It makes the evidence and guardrails visible.

### Chrome extension — context at the point of confusion

The extension operates on an Austrian government page. The user selects a passage and sees exactly what will be sent. It explains the passage and maps it to the same workflow engine.

The extension must never read passwords, form values, cookies, hidden fields or personal account data. Its value is contextual understanding, not surveillance or scraping.

### Phone/WhatsApp-ready voice agent — inclusive access

The ElevenLabs agent lets a person explain the situation naturally, asks one question at a time, reads back the brief and requires an explicit yes before preparing a handoff. It uses the same guarded workflow tools as the web app, so voice is another front door, not a second source of truth.

## 10. International benchmarks

### Estonia — Bürokratt and the secure-agent direction

Estonia’s Information System Authority describes Bürokratt as a citizen-facing virtual assistant that understands everyday Estonian, helps find public-service information and directs the user to a customer-service representative when it gets stuck. Estonia is also developing a “reason reserve”/Aruait direction for the secure use of AI assistants across the public sector.

**Lesson for SPARK:** everyday language, cross-institution routing and an explicit human route are more valuable than a free-form answer generator. The 2030 layer needs governance and routing, not just model access.

### Singapore — Ask Jamie evolving into VICA/AskGov

Singapore’s GovTech team built Ask Jamie as a whole-of-government virtual assistant for common agency questions and later developed VICA as a conversational AI platform for government agencies. The original rationale was practical: a large share of agency website questions were general enquiries with repeatable answers. Ask Jamie also explored voice support.

**Lesson for SPARK:** start with high-volume, answerable journeys; centralise the conversational platform while letting agencies own their verified content; treat voice as a genuine access channel rather than a demo gimmick.

### United Kingdom — service standard and content design

The GOV.UK Service Manual is not a single chatbot, but it is a strong benchmark for public-service design. It explicitly says good services should help users complete the whole task, minimise steps, avoid dead ends, make human help straightforward, hide internal organisational structures, work across channels and be understandable to everyone. It also recommends short, direct interface copy and questions that users understand.

**Lesson for SPARK:** the assistant should be judged by task completion and reduced cognitive load, not how impressive its conversation sounds. Our one-question-at-a-time flow and human fallback directly reflect this principle.

### What not to copy

- Do not build one unrestricted national chatbot that claims authority for every service.
- Do not hide the source or confidence behind a polished conversational layer.
- Do not force every user into an authenticated digital identity flow before they can understand the process.
- Do not make voice a separate workflow engine with different rules.

## 11. The 2030 concept

By 2030, public services should be **life-event-first, channel-neutral and human-supervised**.

### 2030 experience principles

1. **Life-event-first:** “I moved” is a valid starting point; legal labels are revealed progressively.
2. **Evidence-first:** every consequential instruction has an official source and version/date context.
3. **Channel-neutral:** web, browser, voice, phone and messaging produce the same case contract.
4. **Consent-first:** explanation, preparation and submission are separate visible states.
5. **Human-supervised:** low confidence, exceptions and sensitive actions route to a person.
6. **Accessibility by default:** language, read-aloud, voice and simple structure are core, not add-ons.
7. **Federated ownership:** each authority owns its workflow facts; a shared layer handles discovery, explanation and handoff.
8. **Auditable AI:** the system records what source and workflow produced the guidance without storing unnecessary raw personal data.

### 2030 architecture

```text
Citizen channel
  web / browser / phone / WhatsApp
            ↓
  intent + language + accessibility layer
            ↓
  verified workflow registry owned by service providers
            ↓
  CitizenCaseBrief + consent + confidence + source/version
            ↓
  official transaction, appointment or human handoff
```

The assistant should not become a new government portal. It should become a trusted navigation and preparation layer that can hand control to the authoritative service at the right moment.

## 12. What we are building now

### MVP promise

> **CIVIC / GUIDE turns everyday citizen language into a clear, source-backed public-service next step and a consented brief a public-service worker can use.**

### MVP workflow packs

- change of residence / Meldezettel;
- passport renewal, loss and urgent cases;
- childcare support questions;
- supporting examples for ID Austria, parking permits and family allowance.

### Current implementation

- Cloudflare Pages/Functions live prototype;
- deterministic, source-backed workflow registry;
- German and English output;
- typo-tolerant colloquial matching;
- explicit combined-intent ambiguity handling;
- shared `CitizenCaseBrief` across web, extension and phone boundaries;
- browser extension limited to explicit selected text or bounded visible context;
- guarded voice guidance and handoff tools;
- mock adapter that proves the handoff boundary without claiming a real submission;
- tests for accuracy, ambiguity, security and channel parity.

### What remains future work

- verified workflow packs owned and versioned by municipalities/agencies;
- authenticated public-service adapters after government approval;
- appointment availability integrations;
- staff console with routing and service-level analytics;
- production ElevenLabs credentials and real phone/WhatsApp channel;
- evaluation with real citizens, newcomers, older people, accessibility users and public-service staff.

## 13. Pitch and demo implications

### Opening problem

“People do not speak procedure. They speak life events.”

Use: “I moved and my passport is expiring. What do I do?”

### Demo sequence

1. Enter the combined request in colloquial German.
2. Show the assistant separating residence and passport workflows rather than silently merging them.
3. Run the residence flow; show the official source, missing municipality/residence detail and ordered steps.
4. Switch to English or voice without changing the workflow.
5. Open an official government page in the extension and select one confusing sentence.
6. Show the same `CitizenCaseBrief` for a public-service colleague.
7. Confirm the mock handoff and show: **prepared for review — not submitted to a government system**.

### Claims to make

- “source-backed guidance”;
- “human-reviewable handoff”;
- “complements official portals and `ida`”;
- “same workflow across web, browser and voice”;
- “mock adapter proves the integration boundary.”

### Claims to avoid

- “the application was submitted”;
- “the assistant decides eligibility”;
- “we replace public employees”;
- “we access ID Austria accounts”;
- “the extension reads the entire government page.”

## 14. Validation plan after the hackathon

### Research questions

- Can a newcomer name the next step without learning the legal term first?
- Does a user understand the difference between registration, confirmation and certificate?
- Does the assistant ask for the minimum useful facts?
- Does a public-service colleague trust the brief enough to use it as an intake summary?
- Does the user know exactly when the assistant has not submitted anything?
- Can a voice user recover from an ambiguous or combined request?

### Measures

- time to correct next step;
- first-attempt completion of the preparation checklist;
- number of clarification turns;
- rate of correct workflow selection;
- user-reported confidence and comprehension;
- handoff completeness;
- fallback rate for low-confidence cases;
- source freshness and workflow-owner review status.

### Test participants

- newcomer with limited German;
- Austrian resident with low digital confidence;
- older or accessibility-dependent user;
- time-poor parent or worker;
- municipal/public-service employee;
- service owner responsible for one high-volume journey.

## 15. Source log

### Hackathon and Austria

- [CH-03 public-sector track](https://hackathon.feodos.at/tracks/01a13750-fcc9-7000-9f16-2787ab9700f0)
- [Austrian digital-services catalogue](https://www.oesterreich.gv.at/en/formsearch)
- [Austrian public services](https://www.oesterreich.gv.at/en/landingpages)
- [Residence registration](https://www.oesterreich.gv.at/en/landingpages/meldewesen)
- [Passport Online Services](https://www.oesterreich.gv.at/en/landingpages/reisepass)
- [IDA chatbot terms](https://www.oesterreich.gv.at/de/landingpages/chatbot-ida/nutzungsbedingungen)

### Reddit/forum signals

- [Meldezettel visual guide for new arrivals — r/Austria](https://www.reddit.com/r/Austria/comments/1rb0flh/guide_i_made_a_simplified_visual_guide_to_the/)
- [ID Austria activation and terminology discussion — r/Austria](https://www.reddit.com/r/Austria/comments/1khlvvg)
- [Positive and negative digital-government experiences — r/Austria](https://www.reddit.com/r/Austria/comments/1u9zc4z/stand_der_digitalisierung_bin_richtig_positiv/)
- [ID Austria appointment availability tool — r/Austria](https://www.reddit.com/r/Austria/comments/1r3lfu6/hab_eine_seite_gebaut_die_alle_freien_idaustria/)
- [Late Meldezettel / missed deadline question — r/Austria](https://www.reddit.com/r/Austria/comments/14m00i4/registering_for_meldezettel_4_months_late_how/)
- [Downloading a Meldezettel from ID Austria — r/AskAustria](https://www.reddit.com/r/AskAustria/comments/1r764m6/how_do_i_download_my_meldezettel/)
- [Meldebestätigung fee confusion — r/Austria](https://www.reddit.com/r/Austria/comments/1pylh8o/geb%C3%BChren_meldebest%C3%A4tigung/)

### International benchmarks

- [Estonian Information System Authority — Bürokratt and AI](https://ria.ee/en/state-information-system/artificial-intelligence)
- [Bürokratt terms and cross-institution routing](https://www.kratid.ee/en/kasutustingimused)
- [Singapore GovTech — Ask Jamie](https://www.tech.gov.sg/technews/govtech-team-behind-ask-jamie-government-chatbot/)
- [Singapore GovTech — VICA conversational AI platform](https://www.tech.gov.sg/products-and-services/for-government-agencies/informational-services/vica/)
- [GOV.UK — designing good government services](https://www.gov.uk/service-manual/design/introduction-designing-government-services)
- [GOV.UK — service standard: make the service simple to use](https://www.gov.uk/service-manual/service-standard/point-4-make-the-service-simple-to-use)
- [GOV.UK — writing for user interfaces](https://www.gov.uk/service-manual/design/writing-for-user-interfaces)
- [GOV.UK — designing good questions](https://www.gov.uk/service-manual/design/designing-good-questions)

## Final synthesis

The insight is not “government needs a chatbot.” The insight is:

> **Government has information and transactions; people need a trusted translation layer between their life situation and the correct next step.**

SPARK wins by showing that layer end to end: colloquial request, source-backed explanation, accessible channel, explicit uncertainty, useful human handoff and a clear boundary around consequential action.
