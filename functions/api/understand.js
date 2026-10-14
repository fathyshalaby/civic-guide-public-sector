import { error, json } from "../_lib/http.js";
import { improveWithWorkersAI, understand } from "../_lib/assistant.js";
import { auditEvent } from "../_lib/audit.js";

export async function onRequestPost({ request, env }) {
  try {
    const { message, language } = await request.json(); if (!String(message || "").trim()) return error("Bitte beschreibe dein Anliegen.");
    const result = await improveWithWorkersAI(understand(message, language), message, env);
    const audit = await auditEvent(env, "understand", { traceId: result.traceId, workflow: result.workflow?.id || null, intent: result.intent, confidence: result.confidence });
    return json({ ok: true, result, meta: { audit, rawMessageStored: false } });
  } catch (cause) { return error(cause.message || "Die Anfrage konnte nicht verstanden werden."); }
}
