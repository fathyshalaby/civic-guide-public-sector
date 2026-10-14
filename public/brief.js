function escape(value) {
  const node = document.createElement("span");
  node.textContent = value ?? "";
  return node.innerHTML;
}

function label(copy, key, fallback) { return copy[key] || fallback; }

export function formatBrief(result, copy = {}) {
  const brief = result?.staffBrief || result || {};
  const service = brief.detectedService;
  const lines = [
    label(copy, "title", "CIVIC / GUIDE case brief"),
    `${label(copy, "status", "Status")}: ${brief.handoff?.status === "prepared" ? label(copy, "prepared", "Prepared for review") : label(copy, "review", "Ready to review")}`,
    `${label(copy, "original", "Original request")}: ${brief.originalRequest || "—"}`,
    `${label(copy, "service", "Likely service")}: ${service ? `${service.label} (${service.confidence})` : label(copy, "human", "Human review")}`,
    `${label(copy, "summary", "Plain-language summary")}: ${brief.plainLanguageSummary || "—"}`,
  ];
  if (brief.factsProvided?.length) lines.push(`${label(copy, "facts", "Facts provided")}:`, ...brief.factsProvided.map((fact) => `- ${fact.label}: ${fact.value}`));
  if (brief.missingQuestions?.length) lines.push(`${label(copy, "missing", "Still needed")}:`, ...brief.missingQuestions.map((question) => `- ${question.label} — ${question.reason}`));
  lines.push(`${label(copy, "next", "Recommended next step")}: ${brief.recommendedNextStep || "—"}`);
  if (brief.officialSources?.length) lines.push(`${label(copy, "sources", "Official sources")}:`, ...brief.officialSources.map((source) => `- ${source.label}: ${source.url}`));
  lines.push(`${label(copy, "guardrail", "Guardrail")}: ${label(copy, "notSubmitted", "Prepared for review; not submitted to a government system.")}`);
  if (brief.traceId) lines.push(`Trace: ${brief.traceId}`);
  return lines.join("\n");
}

export function renderBrief(result, copy = {}) {
  const brief = result?.staffBrief || result || {};
  const service = brief.detectedService;
  const statusPrepared = brief.handoff?.status === "prepared";
  const facts = brief.factsProvided || [];
  const missing = brief.missingQuestions || [];
  const sources = brief.officialSources || [];
  return {
    original: `<p class="micro-label">${escape(label(copy, "original", "Original request"))}</p><p class="brief-quote">“${escape(brief.originalRequest || "—")}”</p>`,
    service: `<p class="micro-label">${escape(label(copy, "service", "Likely service"))}</p><h3>${escape(service?.label || label(copy, "human", "Human review"))}</h3><p>${escape(service ? `${label(copy, "confidence", "Confidence")}: ${service.confidence}` : label(copy, "humanBody", "A responsible person should clarify this request before any next step."))}</p><p class="brief-summary">${escape(brief.plainLanguageSummary || "—")}</p>`,
    missing: `<p class="micro-label">${escape(missing.length ? label(copy, "missing", "Still needed") : label(copy, "facts", "Facts provided"))}</p>${missing.length ? missing.map((question) => `<div class="brief-row"><span>?</span><p><strong>${escape(question.label)}</strong><small>${escape(question.reason)}</small></p></div>`).join("") : facts.length ? facts.map((fact) => `<div class="brief-row"><span>✓</span><p><strong>${escape(fact.label)}</strong><small>${escape(fact.value)}</small></p></div>`).join("") : `<p class="brief-muted">${escape(label(copy, "noFacts", "No personal facts have been added yet."))}</p>`}`,
    next: `<p class="micro-label">${escape(label(copy, "next", "Recommended next step"))}</p><p class="brief-next">${escape(brief.recommendedNextStep || "—")}</p><p class="brief-muted">${escape(label(copy, "humanReview", "Human review remains part of this path."))}</p>`,
    sources: sources.length ? `<div><p class="micro-label">${escape(label(copy, "sources", "Official sources"))}</p>${sources.map((source) => `<a class="brief-source" href="${escape(source.url)}" target="_blank" rel="noreferrer"><span>${escape(source.label)}</span><small>${escape(source.authority || "oesterreich.gv.at")} · ${escape(source.why || "Official source")}</small></a>`).join("")}</div>` : "",
    status: statusPrepared ? label(copy, "prepared", "Prepared for review") : label(copy, "review", "Ready to review"),
    statusClass: statusPrepared ? "is-prepared" : "is-review",
    humanHelp: `${escape(label(copy, "notSubmitted", "Prepared for review; not submitted to a government system."))} · ${escape(brief.traceId ? `trace ${brief.traceId}` : "")}`,
  };
}
