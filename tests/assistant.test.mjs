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
