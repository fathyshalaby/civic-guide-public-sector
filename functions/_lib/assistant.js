import { detectWorkflow, getWorkflow } from "./knowledge.js";

function traceId() { return globalThis.crypto?.randomUUID?.() || `civic-${Date.now().toString(36)}`; }

function normalizeLanguage(language) { return language === "en" ? "en" : "de"; }

function fallback(message, language = "de") {
  if (language === "en") return {
    language,
    intent: "unknown",
    confidence: 0.18,
    reply: "I don't want to make up an answer. Tell me whether this is about residence, ID Austria, parking or family allowance.",
    plainLanguage: ["I can pass the question to a responsible person.", "If it is urgent, please use the official government website."],
    questions: ["Which topic best matches your question?"],
    workflow: null,
    sources: [{ label: "oesterreich.gv.at", url: "https://www.oesterreich.gv.at/en/", authority: "oesterreich.gv.at", why: "Official starting point for Austrian public services" }],
    humanHandoff: true,
    guardrails: { sourceBacked: true, legalDecision: false, humanReviewRequired: true },
    traceId: traceId(),
    originalMessage: message,
  };
  return {
    language,
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

export function understand(message, preferredLanguage = "de") {
  const input = String(message || "").trim();
  const language = normalizeLanguage(preferredLanguage);
  const workflow = detectWorkflow(input);
  if (!workflow) return fallback(input, language);
  const localized = getWorkflow(workflow.id, language);
  const matchedSignals = workflow.keywords.filter((keyword) => input.toLowerCase().includes(keyword));
  return { language, intent: workflow.id, confidence: Math.min(0.98, 0.66 + matchedSignals.length * 0.08), matchedSignals, reply: localized.reply, plainLanguage: localized.plainLanguage, questions: localized.questions, workflow: { id: workflow.id, label: localized.label, description: localized.description, steps: localized.steps, fields: localized.fields }, sources: localized.sources, humanHandoff: false, guardrails: { sourceBacked: true, legalDecision: false, humanReviewRequired: true }, traceId: traceId(), originalMessage: input };
}

export async function improveWithWorkersAI(result, message, env = {}) {
  if (env.USE_WORKERS_AI !== "true" || !env.AI?.run) return result;
  try {
    const targetLanguage = result.language === "en" ? "English" : "German";
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt: `You are a careful Austrian public-service assistant. Rewrite the answer below in plain ${targetLanguage}. Never invent laws, deadlines or requirements. Return only JSON with keys reply, plainLanguage (array), questions (array).\nUser: ${String(message).slice(0, 1200)}\nKnown answer: ${JSON.stringify({ reply: result.reply, plainLanguage: result.plainLanguage, questions: result.questions })}` });
    const parsed = JSON.parse(response.response || response.result || "{}");
    if (parsed.reply && Array.isArray(parsed.plainLanguage) && Array.isArray(parsed.questions)) return { ...result, ...parsed, aiEnhanced: true };
  } catch { /* deterministic answer remains the safe fallback */ }
  return result;
}
