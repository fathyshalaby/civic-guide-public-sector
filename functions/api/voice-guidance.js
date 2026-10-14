import { auditEvent } from "../_lib/audit.js";
import { improveWithWorkersAI, understand } from "../_lib/assistant.js";
import { error, json } from "../_lib/http.js";
import { requireToolSecret } from "../_lib/tool-auth.js";

// Read-only ElevenLabs tool: classify a citizen's words and return an answer
// that the agent can speak. It never creates or submits a public-service case.
export async function onRequestPost({ request, env }) {
  const unauthorized = requireToolSecret(request, env);
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json();
    const message = String(body.message || body.query || "").trim();
    if (!message) return error("Bitte übergib die Frage der Bürgerin oder des Bürgers.", 422);
    const result = await improveWithWorkersAI(understand(message, body.language), message, env);
    const audit = await auditEvent(env, "voice_guidance", { traceId: result.traceId, workflow: result.workflow?.id || null, intent: result.intent, confidence: result.confidence, channel: "elevenlabs" });
    return json({
      ok: true,
      traceId: result.traceId,
      reply: result.reply,
      questions: result.questions,
      intent: result.intent,
      confidence: result.confidence,
      workflow: result.workflow,
      sources: result.sources,
      guardrails: result.guardrails,
      humanHandoff: result.humanHandoff,
      audit: { persisted: audit.persisted },
    });
  } catch (cause) {
    return error(cause.message || "Die Voice-Anfrage konnte nicht verstanden werden.");
  }
}
