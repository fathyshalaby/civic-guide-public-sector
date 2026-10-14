import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { understand } from "../functions/_lib/assistant.js";

const cases = [
  ["colloquial residence", "Bin umgezogen, brauch Meldezettl", "de", "wohnsitz"],
  ["passport expired", "My passport has expired and I need a new one", "en", "reisepass"],
  ["childcare subsidy", "Is there help with kindergarten costs?", "en", "kinderbetreuung"],
];

for (const [name, input, language, intent] of cases) {
  test(name, () => {
    const result = understand(input, language);
    assert.equal(result.intent, intent);
    assert.ok(result.sources[0].url.includes("oesterreich.gv.at"));
    assert.ok(result.traceId);
    assert.equal(result.staffBrief.guardrails.submitted, false);
  });
}

test("unknown tax change stays with human review", () => {
  const result = understand("Change my tax assessment", "en");
  assert.equal(result.intent, "unknown");
  assert.equal(result.humanHandoff, true);
  assert.equal(result.staffBrief.detectedService, null);
  assert.equal(result.staffBrief.guardrails.submitted, false);
});

test("combined move and passport request stays transparent", () => {
  const result = understand("I moved and my passport expired", "en");
  assert.equal(result.humanHandoff, true);
  assert.equal(result.staffBrief.detectedService, null);
  assert.match(result.staffBrief.plainLanguageSummary, /more than one|clarify/i);
});

test("evaluation document maps every rubric weight to product and test evidence", async () => {
  const document = await readFile(new URL("../docs/EVALUATION.md", import.meta.url), "utf8");
  for (const weight of ["35%", "25%", "20%", "10%"] ) assert.match(document, new RegExp(weight));
  assert.match(document, /CitizenCaseBrief/);
  assert.match(document, /Chrome extension/i);
  assert.match(document, /phone|WhatsApp/i);
});
