import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("phone agent documentation names the guarded shared tools", async () => {
  const doc = await readFile(new URL("../docs/PHONE-AGENT.md", import.meta.url), "utf8");
  assert.match(doc, /\/api\/voice-guidance/);
  assert.match(doc, /\/api\/voice-submit/);
  assert.match(doc, /["']?confirm["']?\s*:\s*true/);
  assert.match(doc, /ELEVENLABS_TOOL_SECRET/);
  assert.match(doc, /civic_guidance/);
  assert.match(doc, /prepare_civic_case/);
  assert.match(doc, /Deutsch|German/);
  assert.match(doc, /English|Englisch/);
  assert.match(doc, /human|Mensch/i);
  assert.match(doc, /not submitted|nicht.*übermittelt/i);
});

test("local environment leaves the phone tool secret empty by default", async () => {
  const vars = await readFile(new URL("../.dev.vars.example", import.meta.url), "utf8");
  assert.match(vars, /^ELEVENLABS_TOOL_SECRET=""$/m);
});
