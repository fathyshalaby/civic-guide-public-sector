import test from "node:test";
import assert from "node:assert/strict";
import { understand } from "../functions/_lib/assistant.js";

test("creates a staff-ready residence brief without pretending to submit", () => {
  const result = understand("Ich bin umgezogen, was brauche ich für den Meldezettel?");
  assert.equal(result.staffBrief.channel, "web");
  assert.equal(result.staffBrief.detectedService.id, "wohnsitz");
  assert.equal(result.staffBrief.guardrails.submitted, false);
  assert.equal(result.staffBrief.handoff.status, "not_prepared");
  assert.match(result.staffBrief.originalRequest, /umgezogen/);
  assert.ok(result.staffBrief.missingQuestions.length >= 1);
  assert.ok(result.staffBrief.officialSources[0].url.includes("oesterreich.gv.at"));
  assert.ok(result.staffBrief.traceId);
});

test("preserves ambiguity for a combined move and passport request", () => {
  const result = understand("Ich bin umgezogen und mein Reisepass ist abgelaufen.", "de");
  assert.equal(result.staffBrief.detectedService, null);
  assert.equal(result.staffBrief.handoff.status, "not_prepared");
  assert.match(result.staffBrief.plainLanguageSummary, /mögliche|klären|Amtswege/i);
});
