import test from "node:test";
import assert from "node:assert/strict";
import { submitCase } from "../functions/_lib/services.js";

test("mock handoffs derive a stable case id from the idempotency key", async () => {
  const first = await submitCase("wohnsitz", { municipality: "Wien" }, { PUBLIC_SERVICE_MODE: "mock" }, "same-key");
  const second = await submitCase("wohnsitz", { municipality: "Wien" }, { PUBLIC_SERVICE_MODE: "mock" }, "same-key");
  assert.equal(first.caseId, "AT-DEMO-SAMEKEY");
  assert.equal(second.caseId, first.caseId);
  assert.equal(first.status, "received");
});
