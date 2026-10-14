import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost as understandPost } from "../functions/api/understand.js";
import { onRequestPost as voiceGuidancePost } from "../functions/api/voice-guidance.js";
import { onRequestPost as voiceSubmitPost } from "../functions/api/voice-submit.js";
import { onRequestPost as submitPost } from "../functions/api/submit.js";

function requestFor(body, headers = {}) {
  return new Request("https://civic.test/api", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

test("understand returns a web brief and does not store the raw message", async () => {
  const response = await understandPost({ request: requestFor({ message: "I moved house", language: "en" }), env: {} });
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.result.staffBrief.channel, "web");
  assert.equal(body.meta.rawMessageStored, false);
});

test("understand returns an extension brief with bounded page context", async () => {
  const response = await understandPost({ request: requestFor({
    message: "What does this mean?",
    language: "en",
    channel: "extension",
    context: { title: "Passport services", url: "https://www.oesterreich.gv.at/en/landingpages/reisepass", selection: "Renewal of a passport" },
  }), env: {} });
  const body = await response.json();
  assert.equal(body.result.staffBrief.channel, "extension");
  assert.equal(body.meta.rawMessageStored, false);
  assert.ok(body.result.originalMessage.length < 9000);
});

test("voice guidance returns a phone brief through the read-only tool", async () => {
  const response = await voiceGuidancePost({
    request: requestFor({ message: "My passport expired", language: "en" }, { "x-elevenlabs-tool-secret": "secret" }),
    env: { ELEVENLABS_TOOL_SECRET: "secret" },
  });
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.staffBrief.channel, "phone");
  assert.equal(body.guardrails.submitted, false);
});

test("voice submit cannot prepare a handoff without confirmation", async () => {
  const response = await voiceSubmitPost({
    request: requestFor({ workflow: "reisepass", fields: { caseType: "expired", municipality: "Wien" }, confirm: false }, { "x-elevenlabs-tool-secret": "secret" }),
    env: { ELEVENLABS_TOOL_SECRET: "secret", PUBLIC_SERVICE_MODE: "mock" },
  });
  assert.equal(response.status, 409);
});

test("voice submit rejects an incomplete confirmed handoff", async () => {
  const response = await voiceSubmitPost({
    request: requestFor({ workflow: "reisepass", fields: { caseType: "expired" }, confirm: true }, { "x-elevenlabs-tool-secret": "secret" }),
    env: { ELEVENLABS_TOOL_SECRET: "secret", PUBLIC_SERVICE_MODE: "mock" },
  });
  assert.equal(response.status, 422);
});

test("browser submit returns a prepared but not submitted brief", async () => {
  const response = await submitPost({
    request: requestFor({ workflow: "wohnsitz", fields: { municipality: "Wien", residenceType: "Hauptwohnsitz" }, confirm: true, traceId: "trace-test", idempotencyKey: "brief-test" }),
    env: { PUBLIC_SERVICE_MODE: "mock" },
  });
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.staffBrief.handoff.status, "prepared");
  assert.equal(body.staffBrief.handoff.consent, true);
  assert.equal(body.staffBrief.guardrails.submitted, false);
  assert.match(body.staffBrief.handoff.summary, /AT-DEMO-BRIEFTEST/);
});
