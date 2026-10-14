import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../extension/", import.meta.url);
const read = (name) => readFile(new URL(name, root), "utf8");

test("extension sends the shared channel and bounded context", async () => {
  const sidepanel = await read("sidepanel.js");
  assert.match(sidepanel, /channel:\s*["']extension["']/);
  assert.match(sidepanel, /selection/);
  assert.match(sidepanel, /visibleCopy/);
  assert.match(sidepanel, /slice\(0,\s*6000\)/);
  assert.match(sidepanel, /slice\(0,\s*3000\)/);
});

test("extension exposes a context review and shared brief output", async () => {
  const html = await read("sidepanel.html");
  for (const id of ["context-review", "context-preview", "brief-service", "brief-missing", "brief-next", "brief-sources", "copy-brief"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing #${id}`);
  }
  assert.match(html, /only the selected context|Nur der ausgewählte Kontext/i);
});

test("extension manifest keeps the side panel and Austrian government scope", async () => {
  const manifest = JSON.parse(await read("manifest.json"));
  assert.equal(manifest.manifest_version, 3);
  assert.ok(manifest.permissions.includes("sidePanel"));
  assert.ok(manifest.host_permissions.includes("https://*.gv.at/*"));
});

test("extension source does not scrape secrets or form values", async () => {
  const [content, sidepanel] = await Promise.all([read("content.js"), read("sidepanel.js")]);
  const source = `${content}\n${sidepanel}`;
  assert.doesNotMatch(source, /password|cookie|input\s*\[\s*value/i);
});
