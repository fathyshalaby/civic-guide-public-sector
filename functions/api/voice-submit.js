import { auditEvent } from "../_lib/audit.js";
import { error, json } from "../_lib/http.js";
import { getWorkflow, missingFields } from "../_lib/knowledge.js";
import { submitCase } from "../_lib/services.js";
import { requireToolSecret } from "../_lib/tool-auth.js";
import { buildCitizenCaseBrief, markBriefPrepared } from "../_lib/brief.js";
import { understand } from "../_lib/assistant.js";

// Write-capable ElevenLabs tool. The agent must collect the required fields
// and receive an explicit confirm=true before this endpoint does anything.
export async function onRequestPost({ request, env }) {
  const unauthorized = requireToolSecret(request, env);
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    if (body.confirm !== true) return error("Bitte frage zuerst ausdrücklich nach der Zustimmung.", 409);
    const workflow = getWorkflow(body.workflow);
    if (!workflow) return error("Dieser Vorgang ist noch nicht verfügbar.", 422);
    const fields = body.fields || {};
    const missing = missingFields(workflow.id, fields);
    if (missing.length) return error("Für die Vorbereitung fehlen noch Angaben.", 422, { missing, questions: workflow.questions });
    const idempotencyKey = String(body.idempotencyKey || globalThis.crypto.randomUUID());
    const result = await submitCase(workflow.id, fields, env, idempotencyKey);
    const audit = await auditEvent(env, "voice_prepare_case", { traceId: body.traceId || null, workflow: workflow.id, idempotencyKey, mode: result.mode, channel: "elevenlabs" });
    const language = body.language === "en" ? "en" : "de";
    const originalMessage = String(body.originalMessage || fields.originalMessage || workflow.label);
    let guidance = understand(originalMessage, language);
    if (guidance.workflow?.id !== workflow.id) guidance = understand(workflow.label, language);
    const staffBrief = markBriefPrepared(buildCitizenCaseBrief(guidance, "phone", fields), result);
    return json({ ok: true, traceId: body.traceId || null, idempotencyKey, staffBrief, audit: { persisted: audit.persisted }, ...result });
  } catch (cause) {
    return error(cause.message || "Der Vorgang konnte nicht vorbereitet werden.");
  }
}
