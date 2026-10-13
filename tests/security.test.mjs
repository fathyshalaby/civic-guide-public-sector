import test from "node:test";
import assert from "node:assert/strict";
import { requireToolSecret } from "../functions/_lib/tool-auth.js";

test("voice tools fail closed when no shared secret is configured", async () => {
  const response = requireToolSecret(new Request("https://civic.test/api/voice-submit", { method: "POST" }), {});
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});

test("voice tools accept the configured ElevenLabs secret", () => {
  const response = requireToolSecret(
    new Request("https://civic.test/api/voice-guidance", { headers: { "x-elevenlabs-tool-secret": "test-secret" } }),
    { ELEVENLABS_TOOL_SECRET: "test-secret" },
  );
  assert.equal(response, null);
});
