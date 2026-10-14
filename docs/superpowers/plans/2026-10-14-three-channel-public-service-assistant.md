# Three-channel public service assistant Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Turn the existing CIVIC / GUIDE prototype into one polished, source-backed public-service journey that works through the web app, a Chrome extension and an ElevenLabs phone agent, with every channel producing the same consented CitizenCaseBrief for a public-service worker.

**Architecture:** Keep the current Cloudflare Pages + Functions runtime and deterministic workflow registry. Add a shared brief builder at the backend boundary, make the guidance and handoff routes return compatible brief data, then make the web and extension render that brief while the phone agent consumes the same secured tools. Use the existing mock service adapter for the live demo and preserve a graceful no-credentials path.

**Tech Stack:** Cloudflare Pages Functions, vanilla HTML/CSS/ES modules, Chrome Manifest V3 side panel, ElevenLabs ConvAI widget/webhook tools, optional Workers AI wording pass, optional D1 audit, Node test runner, no new runtime dependencies.

**Spec:** docs/superpowers/specs/2026-10-14-three-channel-public-service-assistant-design.md

## Global Constraints

- The deterministic workflow registry is the source-backed contract; optional Workers AI may improve wording but must not invent requirements, deadlines or legal decisions.
- The three announced workflow families are primary: primary residence change, passport renewal/lost/urgent passport, and childcare subsidy/family benefit questions.
- German and English must be first-class on the web and extension surfaces; phone guidance must support the same language intent.
- The extension may send only explicit selection or a bounded visible-page excerpt from an Austrian government page; it must not read passwords, form values, cookies, hidden fields or account data.
- Every handoff must say that it is prepared, not submitted, until a real adapter explicitly confirms submission.
- ElevenLabs write-capable tools must continue to fail closed without ELEVENLABS_TOOL_SECRET.
- Raw citizen text must not be written to audit records.
- Keep PUBLIC_SERVICE_MODE=mock for the hackathon and make the no-provider local demo fully runnable.
- Keep the UI keyboard accessible, visibly focused, responsive, readable at mobile widths and respectful of prefers-reduced-motion.

## Review Focus

- Combined move + passport input must be surfaced as ambiguity or ranked workflows, never silently treated as one legal procedure. Pin in Task 1.
- Colloquial/noisy spelling such as “brauch Meldezettl” must still map to the right workflow or explain uncertainty. Pin in Task 1.
- Incomplete facts must appear as missing questions while preserving the original request. Pin in Task 1.
- Selected government-page context must be visible and bounded before sending. Pin in Task 4.
- Voice handoff without explicit confirmation or required fields must be rejected without calling the service adapter. Pin in Task 3.

---

### Task 1: Shared CitizenCaseBrief contract and announced workflow coverage

Files:
- Create: functions/_lib/brief.js
- Modify: functions/_lib/assistant.js
- Modify: functions/_lib/knowledge.js
- Test: tests/brief.test.mjs
- Modify: tests/assistant.test.mjs

Interfaces:
- Consumes understand(message, preferredLanguage) and localized workflow records.
- Produces buildCitizenCaseBrief(result, channel, fields), result.staffBrief, and explicit kinderbetreuung workflow coverage.

- [ ] Step 1: Write failing brief tests. Test that a residence request returns channel web, detectedService.id wohnsitz, missingQuestions, traceId, officialSources, submitted false and handoff status not_prepared. Test that a combined move/passport request returns detectedService null and human-review language. Test that “help with childcare costs” maps to kinderbetreuung in English.

Run: node --test tests/assistant.test.mjs tests/brief.test.mjs
Expected: FAIL because staffBrief, brief.js and kinderbetreuung do not exist.

- [ ] Step 2: Implement functions/_lib/brief.js. Export buildCitizenCaseBrief(result, channel = "web", fields = {}). Return the exact fields from the design spec: channel, originalRequest, language, detectedService, citizenGoal, plainLanguageSummary, factsProvided, missingQuestions, prerequisites, recommendedNextStep, officialSources, guardrails, handoff and traceId. Derive facts only from explicit fields, use workflow.fields for missing questions, and make fallback results human-reviewable with detectedService null. Never place secrets or hidden context in the brief.

- [ ] Step 3: Attach briefs without breaking existing clients. Update understand() and fallback() in functions/_lib/assistant.js to return all current properties plus staffBrief: buildCitizenCaseBrief(result, "web"). Keep the existing response keys used by the web and extension.

- [ ] Step 4: Add the explicit childcare workflow. In functions/_lib/knowledge.js add kinderbetreuung with German and English labels, plain-language replies, questions, steps, fields and official oesterreich.gv.at sources. Include keywords for kinderbetreuung, kindergarten, krippe, hort, betreuungskosten, childcare, daycare, nursery and subsidy. Remove overlapping childcare keywords from familienbeihilfe so the challenge case has a deterministic match.

- [ ] Step 5: Improve deterministic noisy matching. Normalize punctuation, repeated whitespace and common typo-safe tokens such as meldezettl, reisepas and kindebetreuung before rankWorkflows(). Preserve equal-score ambiguity behavior.

- [ ] Step 6: Run tests and commit.

Run: npm test
Expected: All existing tests plus the new brief and childcare tests pass.

Commit: git add functions/_lib/brief.js functions/_lib/assistant.js functions/_lib/knowledge.js tests/assistant.test.mjs tests/brief.test.mjs && git commit -m "feat: add shared citizen case brief"

### Task 2: Make every backend channel return the same brief

Files:
- Modify: functions/api/understand.js
- Modify: functions/api/submit.js
- Modify: functions/api/voice-guidance.js
- Modify: functions/api/voice-submit.js
- Test: tests/api.test.mjs
- Modify: tests/security.test.mjs

Interfaces:
- Consumes buildCitizenCaseBrief(), understand(), submitCase() and the existing tool-secret guard.
- Produces channel-labelled staffBrief data; prepared status only after explicit confirmation and a successful adapter response.

- [ ] Step 1: Add route contract tests. Directly call the route handlers with Request objects. Assert that /api/understand returns result.staffBrief.channel web and rawMessageStored false; voice-guidance with the valid secret returns staffBrief.channel phone and submitted false; voice-submit with confirm false returns 409; missing required fields returns 422.

- [ ] Step 2: Add channel and bounded context to /api/understand. Read message, language, channel defaulting to web, and context. Accept only title, url, selection and visibleCopy; cap each value and the combined context; do not write context into audit metadata. Build the brief with the requested channel.

- [ ] Step 3: Return a phone brief from /api/voice-guidance. Keep the concise ElevenLabs keys reply, questions, intent, confidence, workflow, sources, guardrails and humanHandoff, and add staffBrief built with channel phone.

- [ ] Step 4: Return a prepared brief from /api/submit and /api/voice-submit. After submitCase succeeds, copy the prior brief with handoff.status prepared, handoff.consent true, guardrails.submitted false and a summary containing the mock case ID. Preserve idempotency and the current adapter response.

- [ ] Step 5: Extend security tests. Assert missing and wrong ElevenLabs secrets fail closed, a valid secret succeeds, and confirmation or field failures occur before the adapter can be called.

- [ ] Step 6: Run npm run check && npm test and commit with message feat: unify web extension and phone handoff APIs.

### Task 3: Make the web app the flagship judged journey

Files:
- Create: public/brief.js
- Modify: public/index.html
- Modify: public/app.js
- Modify: public/styles.css
- Test: tests/ui-contract.test.mjs

Interfaces:
- Consumes result.staffBrief and the prepared brief returned by /api/submit.
- Produces a visible “your words → official path → staff brief” journey with copy, print/PDF, bilingual labels and honest status.

Visual direction:
- Preserve the existing civic editorial palette: fog blue, deep civic blue, coral signal and paper white.
- Keep the live-agent card as the memorable object; make the request-to-brief transformation the second memorable moment.
- Keep Manrope for readable UI text and DM Mono only for status/trace metadata.
- Avoid generic gradients, decorative AI avatars and dashboard clutter.

- [ ] Step 1: Add a DOM contract test. Read public/index.html and assert stable IDs brief-section, brief-original, brief-service, brief-missing, brief-next-step, brief-sources, copy-brief, print-brief, brief-status and human-help.

- [ ] Step 2: Create public/brief.js. Export formatBrief(result, language) for clipboard text and renderBrief(result, copy) for DOM-safe HTML. Render the original request, service/confidence, facts, missing questions, next step, official sources, trace ID, human review and “not submitted.” Use textContent or the existing escape helper for citizen values.

- [ ] Step 3: Add the brief section to public/index.html after the existing answer/source area. Include the required IDs, a review/prepared status, copy button, print button and human-help live status. Route visible strings through the existing locale object.

- [ ] Step 4: Integrate the brief into public/app.js. Render the unprepared brief after guidance. Render the prepared brief after /api/submit. Copy the plain-text format, show a temporary copied state, and use window.print() for print/PDF. Keep the consent step before prepared status.

- [ ] Step 5: Add a compact evidence line near the hero/desk boundary linking to plain language, official source and human handoff. It must make the judging criteria legible without fabricating metrics.

- [ ] Step 6: Style desktop, mobile, keyboard focus and print states in public/styles.css. Make missing questions and “prepared / not submitted” states visually unmistakable. Keep reduced-motion behavior and add polite live regions.

- [ ] Step 7: Run npm run check && npm test and manually verify:
  1. residence example gives answer, source, missing questions and an unprepared brief;
  2. consent prepares a mock case and changes the brief status;
  3. copy and print controls work;
  4. English mode localizes labels and keeps source-backed workflow;
  5. unknown flow keeps human fallback visible.

- [ ] Step 8: Commit with message feat: make citizen case brief the flagship web journey.

### Task 4: Make the Chrome extension a credible in-context companion

Files:
- Modify: extension/sidepanel.html
- Modify: extension/sidepanel.js
- Modify: extension/sidepanel.css
- Modify: extension/content.js
- Modify: extension/README.md
- Test: tests/extension-contract.test.mjs

Interfaces:
- Consumes /api/understand with message, language, channel extension and bounded context.
- Produces explicit context preview, source-backed explanation, the same staff brief, copy action and privacy boundary.

- [ ] Step 1: Add contract tests. Assert the side panel sends channel extension, uses selection or bounded visibleCopy, contains brief hooks and never contains password/cookie scraping or input-value scraping. Assert manifest keeps sidePanel and *.gv.at permissions.

- [ ] Step 2: Add a pre-send “What will be sent” review block. Show title, URL, selected text or bounded excerpt and character count. Require an explicit Use this context action when context exists.

- [ ] Step 3: Send structured bounded context. Request shape:
  message: question.trim(),
  language,
  channel: "extension",
  context: { title: first 200 chars, url: first 500, selection: first 6000, visibleCopy: first 3000 }.
  If selection exists, do not also send large page text.

- [ ] Step 4: Render service, original request, next step, missing questions, sources and “not submitted” using DOM-safe operations. Copy the same plain-text brief format.

- [ ] Step 5: Manually verify on https://www.oesterreich.gv.at/en/landingpages/reisepass: selection is visible before sending, passport workflow is detected, source opens, and no form data is collected. Verify a non-gv.at page explains that official context is unavailable.

- [ ] Step 6: Document the 20-second judge flow and privacy boundary, run node --test tests/extension-contract.test.mjs && npm run check && npm test, then commit feat: add in-context civic guide handoff.

### Task 5: Package the ElevenLabs phone/WhatsApp path safely

Files:
- Create: docs/PHONE-AGENT.md
- Modify: README.md
- Modify: docs/TECHNICAL.md
- Modify: docs/DEMO-SCRIPT.md
- Modify: .dev.vars.example
- Test: tests/phone-contract.test.mjs

Interfaces:
- Consumes /api/voice-guidance, /api/voice-submit and ELEVENLABS_TOOL_SECRET.
- Produces copy-pasteable agent prompt, webhook schemas, local mock test path and truthful phone/WhatsApp fallback.

- [ ] Step 1: Add documentation contract tests for both webhook paths, confirm true, ELEVENLABS_TOOL_SECRET, German/English behavior, human escalation and not-submitted language. Assert .dev.vars.example contains an empty secret variable.

- [ ] Step 2: Write docs/PHONE-AGENT.md with the exact system prompt: simple German/English, one question at a time, use civic_guidance for factual answers, no invented laws or deadlines, clarify combined intents, summarize before handoff, use prepare_civic_case only after a clear yes and required fields, never claim submitted/approved, and offer human help when uncertain or sensitive.

- [ ] Step 3: Document request/response JSON for both tools, ElevenLabs header configuration, native phone/WhatsApp setup, and the credential-free local path. Include a short transcript for a combined move + EU-partner + child request.

- [ ] Step 4: Update README and docs/TECHNICAL.md to describe three deliverables and one shared workflow engine. State precisely that ElevenLabs owns channel conversation state while Cloudflare owns source-backed workflow logic and guarded tools.

- [ ] Step 5: Run node --test tests/phone-contract.test.mjs && npm run check && npm test and commit docs: package safe phone and whatsapp agent path.

### Task 6: Build the rubric evidence pack

Files:
- Create: tests/evaluation.test.mjs
- Modify: docs/EVALUATION.md
- Modify: docs/STRATEGY.md
- Modify: docs/SUBMISSION.md
- Modify: docs/DEMO-SCRIPT.md
- Modify: package.json only if test discovery needs it

- [ ] Step 1: Add a rubric matrix mapping 35% journey/UX, 25% innovation/accessibility, 20% accuracy, 10% guardrails and 10% robustness to exact screens and tests.

- [ ] Step 2: Add evaluation tests for:
  residence: “Bin umgezogen, brauch Meldezettl” → wohnsitz;
  passport: “My passport has expired and I need a new one” → reisepass;
  childcare: “Is there help with kindergarten costs?” → kinderbetreuung;
  unknown tax change → unknown/human handoff;
  combined move + passport → transparent ambiguity.
  Assert every known result has an official source and trace ID, and mock briefs never report submitted true.

- [ ] Step 3: Rewrite docs/DEMO-SCRIPT.md as a 90-second sequence: colloquial combined request, clarification, announced workflow, extension selected-text explanation, bilingual/voice switch, staff brief copy, explicit prepared/not-submitted handoff. Add one sentence mapping each moment to a rubric criterion.

- [ ] Step 4: Update strategy and submission copy with the specific promise: reduce avoidable back-and-forth by translating life events into source-backed next steps and worker-ready handoffs. Name citizen personas, public-sector buyer, IDA boundary, mock/live adapter path and all three deliverables.

- [ ] Step 5: Run npm run check && npm test && git diff --check and commit docs: align evaluation evidence with hackathon rubric.

### Task 7: Final local review and GitHub readiness

Files:
- Inspect: git status, git log, .github/workflows/ci.yml and wrangler.toml
- Modify only verified README commands if needed

- [ ] Step 1: Start the local demo with npm install and npm run dev. Verify http://localhost:8796/ loads without blocking console errors.

- [ ] Step 2: Check that strategy, technical docs, demo script, evaluation, phone instructions, extension instructions, repository setup, test commands and the brief artifacts are linked from README.

- [ ] Step 3: Search for overclaims with:
  rg -n "submitted|filed|approved|guarantee|legal decision|rawMessage|password|cookie" README.md docs functions public extension
  Ensure every claim matches mock behavior, source boundary and consent behavior.

- [ ] Step 4: Run npm run check && npm test && git diff --check. Report exact test count, current commit, local URL and any external setup still required.

- [ ] Step 5: Push only after GitHub authentication is refreshed for the workflow scope:
  gh auth refresh -h github.com -s workflow
  git push origin master
  Do not claim the remote is updated until the push returns success.

## Plan self-review

- Spec coverage: the brief, announced cases, all three channels, accessibility, guardrails, technical setup and proof of work are each assigned to named tasks.
- Placeholder scan: there are no TBD/TODO steps; provider credentials are explicitly optional with a local fallback.
- Type consistency: buildCitizenCaseBrief(result, channel, fields) creates staffBrief; prepared responses update handoff.status without changing guardrails.submitted; web and extension use the same named fields.
- Review focus coverage: combined ambiguity, noisy input, incomplete facts, bounded extension context and voice confirmation each have a named test task.
- Scope check: this remains one product built around one backend contract; it adds no framework, database, telephony server or arbitrary form scraper.

