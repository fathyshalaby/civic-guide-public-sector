function confidenceLabel(confidence = 0) {
  return confidence >= 0.82 ? "high" : confidence >= 0.55 ? "medium" : "low";
}

export function buildCitizenCaseBrief(result, channel = "web", fields = {}) {
  const workflow = result.workflow;
  const explicitFields = Object.entries(fields || {})
    .filter(([key, value]) => key !== "originalMessage" && String(value || "").trim())
    .map(([label, value]) => ({ label, value: String(value).trim() }));
  const missingQuestions = workflow
    ? (workflow.fields || [])
      .filter((field) => !String(fields?.[field.id] || "").trim())
      .map((field) => ({ id: field.id, label: field.label, reason: field.placeholder || "Needed for the next step" }))
    : (result.questions || []).map((label, index) => ({ id: `question-${index + 1}`, label, reason: "Needed before a safe match can be made" }));
  const prerequisites = workflow
    ? (workflow.fields || []).map((field) => ({ label: field.label, status: String(fields?.[field.id] || "").trim() ? "known" : "missing" }))
    : [];
  return {
    channel,
    originalRequest: result.originalMessage || "",
    language: result.language,
    detectedService: workflow ? {
      id: workflow.id,
      label: workflow.label,
      confidence: confidenceLabel(result.confidence),
    } : null,
    citizenGoal: workflow?.description || result.reply,
    plainLanguageSummary: result.reply,
    factsProvided: explicitFields,
    missingQuestions,
    prerequisites,
    recommendedNextStep: workflow?.steps?.[0] || "Share this question with the responsible office",
    officialSources: result.sources || [],
    guardrails: {
      sourceBacked: Boolean(result.guardrails?.sourceBacked),
      legalDecision: false,
      submitted: false,
      humanReviewRequired: true,
    },
    handoff: {
      status: "not_prepared",
      consent: false,
      summary: workflow ? `${workflow.label}: ${result.reply}` : result.reply,
    },
    traceId: result.traceId,
  };
}
