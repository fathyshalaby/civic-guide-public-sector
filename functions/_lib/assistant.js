import { detectWorkflow } from "./knowledge.js";

function traceId() { return globalThis.crypto?.randomUUID?.() || `civic-${Date.now().toString(36)}`; }

function fallback(message) {
  return {
    intent: "unknown",
    confidence: 0.18,
    reply: "Ich möchte dir keine Auskunft erfinden. Sag mir bitte, ob es um Wohnsitz, ID Austria, Parken oder Familienbeihilfe geht.",
    plainLanguage: ["Ich kann die Anfrage an eine zuständige Person weitergeben.", "Wenn es dringend ist, nutze bitte die offizielle Behördenseite."],
    questions: ["Welches Thema passt am besten zu deiner Frage?"],
    workflow: null,
    sources: [{ label: "oesterreich.gv.at", url: "https://www.oesterreich.gv.at/", authority: "oesterreich.gv.at", why: "Official starting point for Austrian public services" }],
    humanHandoff: true,
    guardrails: { sourceBacked: true, legalDecision: false, humanReviewRequired: true },
    traceId: traceId(),
    originalMessage: message,
  };
}

export function understand(message) {
  const input = String(message || "").trim();
  const workflow = detectWorkflow(input);
  if (!workflow) return fallback(input);
  const matchedSignals = workflow.keywords.filter((keyword) => input.toLowerCase().includes(keyword));
  return { intent: workflow.id, confidence: Math.min(0.98, 0.66 + matchedSignals.length * 0.08), matchedSignals, reply: workflow.reply, plainLanguage: workflow.plainLanguage, questions: workflow.questions, workflow: { id: workflow.id, label: workflow.label, description: workflow.description, steps: workflow.steps, fields: workflow.fields }, sources: workflow.sources, humanHandoff: false, guardrails: { sourceBacked: true, legalDecision: false, humanReviewRequired: true }, traceId: traceId(), originalMessage: input };
}

export async function improveWithWorkersAI(result, message, env = {}) {
  if (env.USE_WORKERS_AI !== "true" || !env.AI?.run) return result;
  try {
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt: `You are a careful Austrian public-service assistant. Rewrite the answer below in plain German. Never invent laws, deadlines or requirements. Return only JSON with keys reply, plainLanguage (array), questions (array).\nUser: ${String(message).slice(0, 1200)}\nKnown answer: ${JSON.stringify({ reply: result.reply, plainLanguage: result.plainLanguage, questions: result.questions })}` });
    const parsed = JSON.parse(response.response || response.result || "{}");
    if (parsed.reply && Array.isArray(parsed.plainLanguage) && Array.isArray(parsed.questions)) return { ...result, ...parsed, aiEnhanced: true };
  } catch { /* deterministic answer remains the safe fallback */ }
  return result;
}
