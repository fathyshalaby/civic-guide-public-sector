import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("web page exposes the accessible staff brief contract", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  for (const id of ["brief-section", "brief-original", "brief-service", "brief-missing", "brief-next-step", "brief-sources", "copy-brief", "print-brief", "brief-status", "human-help"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
});
