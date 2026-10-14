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
