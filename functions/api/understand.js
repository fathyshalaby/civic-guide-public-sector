import { error, json } from "../_lib/http.js";
import { improveWithWorkersAI, understand } from "../_lib/assistant.js";
import { auditEvent } from "../_lib/audit.js";
import { buildCitizenCaseBrief } from "../_lib/brief.js";

function channelName(channel) {
  return ["web", "extension", "phone"].includes(channel) ? channel : "web";
}

function boundedContext(context = {}) {
  const safe = {};
  for (const key of ["title", "url", "selection", "visibleCopy"]) {
    if (typeof context[key] === "string") safe[key] = context[key].slice(0, key === "selection" ? 6000 : key === "visibleCopy" ? 3000 : key === "url" ? 500 : 200);
  }
  return safe;
}

function composeMessage(message, context) {
  const safe = boundedContext(context);
  const parts = [String(message || "").trim()];
  if (safe.title) parts.push(`Official page: ${safe.title}`);
  if (safe.url) parts.push(`URL: ${safe.url}`);
  if (safe.selection) parts.push(`Selected text: ${safe.selection}`);
  else if (safe.visibleCopy) parts.push(`Visible page context: ${safe.visibleCopy}`);
  return parts.join("\n\n").slice(0, 9000);
}

export async function onRequestPost({ request, env }) {
  try {
    const { message, language, channel, context } = await request.json(); if (!String(message || "").trim()) return error("Bitte beschreibe dein Anliegen.");
    const composedMessage = composeMessage(message, context);
    const result = await improveWithWorkersAI(understand(composedMessage, language), composedMessage, env);
    const staffBrief = buildCitizenCaseBrief(result, channelName(channel));
    const audit = await auditEvent(env, "understand", { traceId: result.traceId, workflow: result.workflow?.id || null, intent: result.intent, confidence: result.confidence });
    return json({ ok: true, result: { ...result, staffBrief }, meta: { audit, rawMessageStored: false } });
  } catch (cause) { return error(cause.message || "Die Anfrage konnte nicht verstanden werden."); }
}
