import { error, json } from "../_lib/http.js";
import { submitCase } from "../_lib/services.js";
import { getWorkflow, missingFields } from "../_lib/knowledge.js";
import { auditEvent } from "../_lib/audit.js";
import { buildCitizenCaseBrief, markBriefPrepared } from "../_lib/brief.js";
import { understand } from "../_lib/assistant.js";

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json(); if (body.confirm !== true) return error("Ein Vorgang darf erst nach ausdrücklicher Bestätigung übermittelt werden.", 409);
    if (!body.workflow) return error("Der Vorgangstyp fehlt.", 422);
    const workflow = getWorkflow(body.workflow);
    if (!workflow) return error("Dieser Vorgang ist noch nicht verfügbar.", 422);
    const missing = missingFields(body.workflow, body.fields || {});
    if (missing.length) return error("Für die Vorbereitung fehlen noch Angaben.", 422, { missing });
    const idempotencyKey = String(body.idempotencyKey || crypto.randomUUID());
    const result = await submitCase(body.workflow, body.fields || {}, env, idempotencyKey);
    const audit = await auditEvent(env, "prepare_case", { traceId: body.traceId || null, workflow: body.workflow, idempotencyKey, mode: result.mode });
    const language = body.language === "en" ? "en" : "de";
    const originalMessage = String(body.originalMessage || body.fields?.originalMessage || workflow.label);
    let guidance = understand(originalMessage, language);
    if (guidance.workflow?.id !== workflow.id) guidance = understand(workflow.label, language);
    const staffBrief = markBriefPrepared(buildCitizenCaseBrief(guidance, "web", body.fields || {}), result);
    return json({ ok: true, idempotencyKey, audit, staffBrief, ...result });
  } catch (cause) { return error(cause.message || "Der Vorgang konnte nicht übermittelt werden."); }
}
