import test from "node:test";
import assert from "node:assert/strict";
import { understand } from "../functions/_lib/assistant.js";

test("maps colloquial relocation question to a transparent workflow", () => {
  const result = understand("Ich bin umgezogen und brauche einen neuen Meldezettel.");
  assert.equal(result.intent, "wohnsitz");
  assert.equal(result.workflow.label, "Wohnsitz anmelden");
  assert.deepEqual(result.workflow.fields.map((field) => field.id), ["municipality", "residenceType"]);
  assert.ok(result.sources[0].url.includes("oesterreich.gv.at"));
  assert.equal(result.guardrails.legalDecision, false);
  assert.ok(result.traceId);
  assert.equal(result.humanHandoff, false);
});

test("does not invent an answer for an unknown request", () => {
  const result = understand("Kannst du meinen Steuerbescheid ändern?");
  assert.equal(result.intent, "unknown");
  assert.equal(result.humanHandoff, true);
  assert.equal(result.guardrails.humanReviewRequired, true);
  assert.ok(result.questions.length > 0);
});

test("serves the same verified workflow in English", () => {
  const result = understand("I moved house and need to register my new address.", "en");
  assert.equal(result.language, "en");
  assert.equal(result.intent, "wohnsitz");
  assert.equal(result.workflow.label, "Register a new address");
  assert.match(result.reply, /moved|address/i);
  assert.equal(result.workflow.fields[0].label, "Municipality of the new address");
  assert.ok(result.sources[0].authority === "oesterreich.gv.at");
});

test("maps the challenge's passport use case to a cautious official workflow", () => {
  const result = understand("Mein Reisepass ist abgelaufen. Wie kann ich ihn erneuern?");
  assert.equal(result.intent, "reisepass");
  assert.equal(result.workflow.label, "Pass erneuern");
  assert.deepEqual(result.workflow.fields.map((field) => field.id), ["caseType", "municipality"]);
  assert.match(result.sources[0].url, /oesterreich\.gv\.at\/de\/landingpages\/reisepass$/);
  assert.equal(result.guardrails.legalDecision, false);
});

test("stops and asks when one message combines equally strong service intents", () => {
  const result = understand("I changed my address and my passport needs attention. What should I do first?", "en");
  assert.equal(result.intent, "unknown");
  assert.equal(result.humanHandoff, true);
  assert.equal(result.confidence, 0.34);
  assert.match(result.reply, /more than one possible service/i);
  assert.deepEqual(result.matchedSignals, ["address"]);
});

test("recognizes the brief's childcare-subsidy style wording", () => {
  const result = understand("I need help with childcare costs for my child.", "en");
  assert.equal(result.intent, "kinderbetreuung");
  assert.equal(result.workflow.label, "Find childcare support");
  assert.equal(result.humanHandoff, false);
});

test("keeps typo-tolerant matching deterministic for a colloquial residence request", () => {
  const result = understand("Bin umgezogen, brauch Meldezettl");
  assert.equal(result.intent, "wohnsitz");
  assert.equal(result.humanHandoff, false);
});
