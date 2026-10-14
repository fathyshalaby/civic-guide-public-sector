import { challenge } from "/challenge.config.js";
import { formatBrief, renderBrief } from "/brief.js";

const $ = (selector) => document.querySelector(selector);
const form = $("#assistant-form");
const message = $("#message");
const answerSection = $("#answer-section");
let state = { result: null };
let currentLanguage = "de";
let agentConnected = false;

const locale = {
  de: {
    secureLabel: "sichere demo", status: "status", heroEyebrow: "Digital Assistants · Evolution bis 2030", heroTitle: "Verwaltung,<br /><em>verständlich.</em>", heroLede: "Erzähl, was passiert ist. CIVIC / GUIDE übersetzt deine Worte in den richtigen Amtsweg, erklärt ihn verständlich und zeigt, was als Nächstes wirklich zu tun ist.", principleListen: "01 / zuhören", principleMap: "02 / einordnen", principleHandoff: "03 / übergeben", demoReady: "demo bereit", agentQuote: "„Ich bin umgezogen. Was muss ich jetzt erledigen?“", agentResult: "Wohnsitz anmelden", agentMeta: "2 Rückfragen · 3 klare Schritte", voiceLaunch: "Mit dem Guide sprechen", agentFootnote: "Jede Antwort bleibt nachvollziehbar. Keine Entscheidung ohne dich.", evidencePlain: "klare Sprache", evidenceSource: "offizielle Quelle", evidenceHandoff: "menschliche Übergabe", deskTitle: "Womit kann ich helfen?", deskTime: "Heute · online", exampleMove: "Ich bin umgezogen.", exampleMoveTag: "Wohnsitz anmelden →", examplePassport: "Mein Reisepass ist abgelaufen.", examplePassportTag: "Pass erneuern →", exampleIdentity: "Wie bekomme ich eine ID Austria?", exampleIdentityTag: "Digitale Identität →", messageLabel: "Dein Anliegen", messagePlaceholder: "Beschreibe dein Anliegen in deinen eigenen Worten …", voiceInput: "Spracheingabe", nextStep: "Nächsten Schritt zeigen", answerTitle: "Das ist der nächste Schritt.", readAloud: "Vorlesen", yourPath: "dein amtsweg", prepareHandoff: "Übergabe vorbereiten", humanLoopTitle: "Hier bleibt ein Mensch im Loop.", humanLoopBody: "Das Anliegen ist nicht eindeutig genug für eine sichere Zuordnung. Nutze die Quelle oder gib diese Zusammenfassung an eine zuständige Stelle weiter.", traceable: "nachvollziehbar", officialSources: "Offizielle Quellen", briefTitle: "Für die zuständige Stelle vorbereitet.", copyBrief: "Zusammenfassung kopieren", printBrief: "Drucken / PDF", footerChallenge: "public sector challenge", footerTrust: "plain language · human oversight", plainWords: "In klaren Worten", needsMore: "Dafür brauche ich noch", recognized: "Erkannte Hinweise", safeMode: "Sicherheitsmodus", safeModeBody: "Kein passender Vorgang erkannt — ich erfinde keine Antwort.", sourceBacked: "● quellenbasiert", noLegal: "keine Rechtsentscheidung", humanReview: "menschliche Prüfung bleibt möglich", confidence: "sicher", demoInserted: "Beispiel eingesetzt — du kannst es jetzt sprechen oder senden", agentConnected: "agent verbunden", openConversation: "Gespräch öffnen", listening: "ich höre zu …", understood: "verstanden", micUnavailable: "Mikrofon nicht verfügbar", ordering: "ordne zu …", workflowNote: "Die folgenden Angaben helfen, eine sichere Übergabe vorzubereiten.", preparing: "wird vorbereitet …", consentError: "Bitte bestätige zuerst, dass du die Angaben geprüft hast.", handoffTitle: "Übergabe vorbereiten", handoffBody: "Diese Angaben helfen, deinen Vorgang zusammenzufassen. Es wird noch nichts an eine Behörde übermittelt.", consent: "Ich habe die Angaben geprüft und möchte die Demo-Übergabe vorbereiten.", back: "Zurück", prepare: "Ja, vorbereiten", prepared: "Übergabe vorbereitet", documented: "Der nächste Schritt ist dokumentiert.", demoCase: "Demo-Vorgangsnummer", liveNote: "Im Live-Modus würde die Anfrage jetzt an das angeschlossene Service-System übergeben — erst nach dessen eigener Prüfung.", auditDemo: "Audit-Demo ohne Datenbankbindung"
  },
  en: {
    secureLabel: "safe demo", status: "status", heroEyebrow: "Digital Assistants · Evolution to 2030", heroTitle: "Public services,<br /><em>understood.</em>", heroLede: "Tell us what happened. CIVIC / GUIDE turns your words into the right public-service path, explains it clearly and shows what to do next.", principleListen: "01 / listen", principleMap: "02 / map", principleHandoff: "03 / hand over", demoReady: "demo ready", agentQuote: "“I moved house. What do I need to do now?”", agentResult: "Register a new address", agentMeta: "2 questions · 3 clear steps", voiceLaunch: "Speak with the Guide", agentFootnote: "Every answer shows its source. Nothing is decided without you.", evidencePlain: "plain language", evidenceSource: "official source", evidenceHandoff: "human handoff", deskTitle: "How can I help?", deskTime: "Today · online", exampleMove: "I moved house.", exampleMoveTag: "Register a new address →", examplePassport: "My passport has expired.", examplePassportTag: "Renew a passport →", exampleIdentity: "How do I get ID Austria?", exampleIdentityTag: "Digital identity →", messageLabel: "Your question", messagePlaceholder: "Describe your question in your own words …", voiceInput: "Voice input", nextStep: "Show the next step", answerTitle: "Here is the next step.", readAloud: "Read aloud", yourPath: "your public-service path", prepareHandoff: "Prepare handoff", humanLoopTitle: "A person stays in the loop.", humanLoopBody: "This question is not clear enough for a safe match. Use the source or share this summary with the responsible office.", traceable: "traceable", officialSources: "Official sources", briefTitle: "Prepared for the responsible office.", copyBrief: "Copy summary", printBrief: "Print / PDF", footerChallenge: "public sector challenge", footerTrust: "plain language · human oversight", plainWords: "In clear words", needsMore: "I still need", recognized: "Signals found", safeMode: "Safety mode", safeModeBody: "No matching process was found — I will not make up an answer.", sourceBacked: "● source-backed", noLegal: "not a legal decision", humanReview: "human review remains possible", confidence: "confidence", demoInserted: "Example inserted — you can speak or send it now", agentConnected: "agent connected", openConversation: "Open conversation", listening: "listening …", understood: "understood", micUnavailable: "Microphone unavailable", ordering: "matching …", workflowNote: "These details help prepare a safe handoff.", preparing: "preparing …", consentError: "Please confirm that you checked the information first.", handoffTitle: "Prepare handoff", handoffBody: "These details help summarize your request. Nothing is sent to a public office yet.", consent: "I checked the information and want to prepare the demo handoff.", back: "Back", prepare: "Yes, prepare", prepared: "Handoff prepared", documented: "The next step is documented.", demoCase: "Demo case number", liveNote: "In live mode, the request would now be handed to the connected service system — only after its own review.", auditDemo: "Demo audit without database binding"
  }
};

const examples = {
  de: { move: "Ich bin umgezogen. Was muss ich jetzt erledigen?", passport: "Mein Reisepass ist abgelaufen. Was muss ich tun?", identity: "Wie bekomme ich eine ID Austria?" },
  en: { move: "I moved house. What do I need to do now?", passport: "My passport has expired. What do I need to do?", identity: "How do I get ID Austria?" },
};

function t(key) { return locale[currentLanguage][key] || key; }

function applyLocale() {
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
  $("#hero-title").innerHTML = t("heroTitle");
  message.placeholder = t("messagePlaceholder");
  document.querySelectorAll("[data-example-key]").forEach((button) => { button.dataset.example = examples[currentLanguage][button.dataset.exampleKey]; });
  const toggle = $("#language-toggle");
  toggle.textContent = currentLanguage === "de" ? "EN" : "DE";
  toggle.setAttribute("aria-label", currentLanguage === "de" ? "Switch to English" : "Auf Deutsch wechseln");
  if (agentConnected) $("#agent-status").textContent = t("agentConnected");
  const widget = $("#agent-widget-slot elevenlabs-convai");
  if (widget) {
    widget.setAttribute("action-text", t("voiceLaunch"));
    widget.setAttribute("start-call-text", currentLanguage === "de" ? "Gespräch starten" : "Start conversation");
    widget.setAttribute("end-call-text", currentLanguage === "de" ? "Gespräch beenden" : "End conversation");
    widget.setAttribute("listening-text", currentLanguage === "de" ? "Civic Guide hört zu …" : "Civic Guide is listening …");
    widget.setAttribute("speaking-text", currentLanguage === "de" ? "Civic Guide antwortet …" : "Civic Guide is speaking …");
  }
}

function escape(value) {
  const node = document.createElement("span");
  node.textContent = value ?? "";
  return node.innerHTML;
}

function speak(text) {
  return fetch("/api/tts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  }).then(async (response) => {
    if (response.headers.get("content-type")?.includes("audio")) {
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      await audio.play();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === "en" ? "en-US" : challenge.language;
    window.speechSynthesis?.speak(utterance);
  }).catch(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === "en" ? "en-US" : challenge.language;
    window.speechSynthesis?.speak(utterance);
  });
}

function setBusy(busy) {
  const button = form.querySelector("button[type=submit]");
  button.disabled = busy;
  button.innerHTML = busy ? `<span class="spinner"></span>${t("ordering")}` : `${t("nextStep")} <span>→</span>`;
}

function renderSources(sources = []) {
  return sources.map((source) => `<a href="${escape(source.url)}" target="_blank" rel="noreferrer"><span class="source-name">${escape(source.label)}</span><span class="source-meta">${escape(source.authority || "offizielle Quelle")} · ${escape(source.why || "Nachweis")}</span><span class="source-arrow">↗</span></a>`).join("");
}

function briefCopy() {
  return {
    title: "CIVIC / GUIDE case brief",
    status: currentLanguage === "de" ? "Status" : "Status",
    prepared: t("prepared"),
    review: currentLanguage === "de" ? "Bereit zur Prüfung" : "Ready to review",
    original: currentLanguage === "de" ? "Originalanliegen" : "Original request",
    service: currentLanguage === "de" ? "Wahrscheinlicher Amtsweg" : "Likely service",
    confidence: t("confidence"),
    human: currentLanguage === "de" ? "Menschliche Klärung" : "Human review",
    humanBody: currentLanguage === "de" ? "Eine zuständige Person sollte dieses Anliegen vor dem nächsten Schritt klären." : "A responsible person should clarify this request before the next step.",
    summary: currentLanguage === "de" ? "Zusammenfassung in klaren Worten" : "Plain-language summary",
    facts: currentLanguage === "de" ? "Angaben vorhanden" : "Facts provided",
    missing: t("needsMore"),
    next: currentLanguage === "de" ? "Empfohlener nächster Schritt" : "Recommended next step",
    sources: t("officialSources"),
    humanReview: t("humanReview"),
    noFacts: currentLanguage === "de" ? "Noch keine persönlichen Angaben ergänzt." : "No personal facts have been added yet.",
    notSubmitted: currentLanguage === "de" ? "Für die Prüfung vorbereitet; noch nicht an eine Behörde übermittelt." : "Prepared for review; not submitted to a government system.",
  };
}

function showBrief(result) {
  const brief = result?.staffBrief;
  if (!brief) return;
  const section = $("#brief-section");
  const rendered = renderBrief(result, briefCopy());
  section.hidden = false;
  $("#brief-original").innerHTML = rendered.original;
  $("#brief-service").innerHTML = rendered.service;
  $("#brief-missing").innerHTML = rendered.missing;
  $("#brief-next-step").innerHTML = rendered.next;
  $("#brief-sources").innerHTML = rendered.sources;
  $("#brief-status").textContent = rendered.status;
  $("#brief-status").className = `brief-status ${rendered.statusClass}`;
  $("#human-help").textContent = rendered.humanHelp;
}

function render(result) {
  state.result = result;
  answerSection.hidden = false;
  $("#confidence").textContent = `${Math.round(result.confidence * 100)}% ${t("confidence")}${result.aiEnhanced ? (currentLanguage === "de" ? " · klarer formuliert" : " · clarified") : ""}`;
  $("#answer-reply").textContent = result.reply;
  $("#plain-language").innerHTML = `<p class="micro-label">${t("plainWords")}</p>${(result.plainLanguage || []).map((item) => `<div class="plain-row"><span>✓</span><p>${escape(item)}</p></div>`).join("")}`;
  $("#questions").innerHTML = result.questions?.length ? `<p class="micro-label">${t("needsMore")}</p>${result.questions.map((item) => `<div class="question-row"><span>?</span><p>${escape(item)}</p></div>`).join("")}` : "";
  $("#match-signals").innerHTML = result.matchedSignals?.length ? `<p class="micro-label">${t("recognized")}</p><div class="signal-list">${result.matchedSignals.map((signal) => `<span>${escape(signal)}</span>`).join("")}</div>` : `<p class="micro-label">${t("safeMode")}</p><p class="muted-note">${t("safeModeBody")}</p>`;
  const guardrails = result.guardrails || {};
  $("#trust-banner").innerHTML = `<span class="trust-chip">${guardrails.sourceBacked ? t("sourceBacked") : (currentLanguage === "de" ? "○ Quelle prüfen" : "○ check source")}</span><span>${guardrails.legalDecision ? (currentLanguage === "de" ? "Rechtsentscheidung" : "legal decision") : t("noLegal")}</span><span>${guardrails.humanReviewRequired ? t("humanReview") : (currentLanguage === "de" ? "automatisiert" : "automated")}</span>`;
  $("#trace-id").textContent = `trace ${result.traceId || "—"}`;

  const workflow = result.workflow;
  $("#workflow-label").textContent = workflow?.label || "Persönliche Auskunft";
  $("#workflow-description").textContent = workflow?.description || "Eine zuständige Person kann dich mit deiner konkreten Frage weiter begleiten.";
  $("#workflow-steps").innerHTML = (workflow?.steps || ["Anliegen zusammenfassen", "Zuständige Stelle finden", "Persönliche Übergabe"]).map((step) => `<li>${escape(step)}</li>`).join("");
  $("#workflow-note").textContent = workflow ? t("workflowNote") : (currentLanguage === "de" ? "Bei unklaren Anliegen bleibt die Antwort bewusst bei einer menschlichen Übergabe." : "For unclear questions, the answer stays with a human handoff.");
  $("#start-workflow").hidden = !workflow || result.humanHandoff;
  $("#handoff-card").hidden = !result.humanHandoff;
  $("#sources").innerHTML = renderSources(result.sources);
  $("#submit-panel").hidden = true;
  showBrief(result);
  answerSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function ask(text) {
  setBusy(true);
  try {
    const response = await fetch("/api/understand", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text, language: currentLanguage }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    render(data.result);
  } catch (cause) {
    answerSection.hidden = false;
    $("#answer-reply").textContent = cause.message || "Bitte versuche es noch einmal.";
  } finally {
    setBusy(false);
  }
}

function showSubmitPanel() {
  const workflow = state.result?.workflow;
  if (!workflow) return;
  const panel = $("#submit-panel");
  const fields = (workflow.fields || []).map((field) => `<label class="field-control"><span>${escape(field.label)}</span><input data-field="${escape(field.id)}" type="${escape(field.type || "text")}" placeholder="${escape(field.placeholder || "")}" autocomplete="off" /></label>`).join("");
  panel.hidden = false;
  panel.innerHTML = `<div class="submit-copy"><p class="eyebrow">CIVIC DESK · 03</p><h3>${t("handoffTitle")}</h3><p>${t("handoffBody")} <strong>${escape(workflow.label)}</strong>.</p><div class="field-grid">${fields}</div><label class="confirmation-row"><input id="confirm-consent" type="checkbox" /><span>${t("consent")}</span></label><p id="submit-status" class="submit-status" role="status"></p></div><div class="submit-actions"><button id="cancel-submit" class="secondary-button" type="button">${t("back")}</button><button id="confirm-submit" class="primary-button" type="button">${t("prepare")} <span>↗</span></button></div>`;
  $("#cancel-submit").addEventListener("click", () => { panel.hidden = true; });
  $("#confirm-submit").addEventListener("click", submitCase);
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
  panel.querySelector("input")?.focus();
}

async function submitCase() {
  const panel = $("#submit-panel");
  const button = $("#confirm-submit");
  const consent = $("#confirm-consent");
  const status = $("#submit-status");
  if (!consent.checked) {
    status.textContent = t("consentError");
    consent.focus();
    return;
  }
  const fields = { originalMessage: state.result.originalMessage };
  panel.querySelectorAll("[data-field]").forEach((input) => { fields[input.dataset.field] = input.value.trim(); });
  button.disabled = true;
  button.textContent = t("preparing");
  try {
    const response = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ workflow: state.result.workflow.id, fields, language: currentLanguage, traceId: state.result.traceId, confirm: true, idempotencyKey: globalThis.crypto?.randomUUID?.() }) });
    const data = await response.json();
    if (response.ok && data.staffBrief) {
      state.result = { ...state.result, staffBrief: data.staffBrief };
      showBrief(state.result);
    }
    panel.innerHTML = response.ok ? `<div class="success-mark">✓</div><div><p class="eyebrow">${t("prepared")}</p><h3>${t("documented")}</h3><p>${t("demoCase")} <strong>${escape(data.caseId || data.idempotencyKey)}</strong>. ${t("liveNote")}</p><p class="trace-id">${escape(data.audit?.persisted ? (currentLanguage === "de" ? "Audit-Ereignis gespeichert" : "Audit event stored") : t("auditDemo"))}</p></div>` : `<div><p class="eyebrow">${currentLanguage === "de" ? "nicht übermittelt" : "not submitted"}</p><h3>${currentLanguage === "de" ? "Die Anfrage blieb bei dir." : "The request stayed with you."}</h3><p>${escape(data.error || (currentLanguage === "de" ? "Bitte versuche es erneut." : "Please try again."))}</p>${data.details?.missing?.length ? `<p class="muted-note">${currentLanguage === "de" ? "Fehlt noch" : "Still needed"}: ${escape(data.details.missing.join(", "))}</p>` : ""}</div><div class="submit-actions"><button id="close-submit" class="secondary-button" type="button">${t("back")}</button></div>`;
    $("#close-submit")?.addEventListener("click", () => { panel.hidden = true; });
  } catch (cause) {
    status.textContent = cause.message || "Bitte versuche es erneut.";
    button.disabled = false;
    button.textContent = `${t("prepare")} ↗`;
  }
}

form.addEventListener("submit", (event) => { event.preventDefault(); if (message.value.trim()) ask(message.value.trim()); });
document.querySelectorAll("[data-example-key]").forEach((button) => button.addEventListener("click", () => { message.value = button.dataset.example; message.focus(); }));
$("#read-button").addEventListener("click", () => { if (state.result) speak(state.result.reply); });
$("#start-workflow").addEventListener("click", showSubmitPanel);
$("#copy-brief").addEventListener("click", async () => {
  if (!state.result?.staffBrief) return;
  await navigator.clipboard?.writeText(formatBrief(state.result, briefCopy()));
  const button = $("#copy-brief");
  const original = t("copyBrief");
  button.textContent = currentLanguage === "de" ? "Kopiert" : "Copied";
  setTimeout(() => { button.textContent = original; }, 1400);
});
$("#print-brief").addEventListener("click", () => window.print());
$("#voice-launch").addEventListener("click", () => {
  const widget = $("#agent-widget-slot");
  if (!widget.hidden) {
    widget.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  message.value = examples[currentLanguage].move;
  message.focus();
  message.scrollIntoView({ behavior: "smooth", block: "center" });
  $("#listening-label").textContent = t("demoInserted");
});
$("#language-toggle").addEventListener("click", () => {
  const typed = message.value.trim() || state.result?.originalMessage || "";
  currentLanguage = currentLanguage === "de" ? "en" : "de";
  applyLocale();
  if (typed) ask(typed);
});
$("#health-button").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    alert(data.ok ? (currentLanguage === "de" ? `Online · ${data.workersAI ? "Workers AI aktiv" : "deterministische Demo"} · ${data.auditDb ? "Audit aktiv" : "Audit-Demo"} · ${data.elevenlabs.configured ? "ElevenLabs verbunden" : "Browser-Fallback"}` : `Online · ${data.workersAI ? "Workers AI active" : "deterministic demo"} · ${data.auditDb ? "audit active" : "demo audit"} · ${data.elevenlabs.configured ? "ElevenLabs connected" : "browser fallback"}`) : (currentLanguage === "de" ? "Status nicht verfügbar" : "Status unavailable"));
  } catch { alert(currentLanguage === "de" ? "Status nicht verfügbar" : "Status unavailable"); }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.interimResults = false;
  $("#voice-button").addEventListener("click", () => { recognition.lang = currentLanguage === "en" ? "en-US" : "de-AT"; recognition.start(); $("#listening-label").textContent = t("listening"); });
  recognition.onresult = (event) => { message.value = event.results[0][0].transcript; $("#listening-label").textContent = t("understood"); };
  recognition.onerror = () => { $("#listening-label").textContent = t("micUnavailable"); };
} else {
  $("#voice-button").disabled = true;
}

async function mountVoiceAgent() {
  let agentId = challenge.elevenLabsAgentId;
  let signedUrl = "";
  if (!agentId) {
    try {
      const response = await fetch("/api/conversation-url");
      const data = await response.json();
      signedUrl = data.url?.signed_url || data.url?.signedUrl || "";
    } catch { /* the text demo remains fully usable */ }
  }
  if (!agentId && !signedUrl) return;
  const slot = $("#agent-widget-slot");
  const widget = document.createElement("elevenlabs-convai");
  if (agentId) widget.setAttribute("agent-id", agentId);
  if (signedUrl) widget.setAttribute("signed-url", signedUrl);
  widget.setAttribute("variant", "expanded");
  widget.setAttribute("dismissible", "false");
  widget.setAttribute("action-text", t("voiceLaunch"));
  widget.setAttribute("start-call-text", currentLanguage === "de" ? "Gespräch starten" : "Start conversation");
  widget.setAttribute("end-call-text", currentLanguage === "de" ? "Gespräch beenden" : "End conversation");
  widget.setAttribute("listening-text", currentLanguage === "de" ? "Civic Guide hört zu …" : "Civic Guide is listening …");
  widget.setAttribute("speaking-text", currentLanguage === "de" ? "Civic Guide antwortet …" : "Civic Guide is speaking …");
  widget.setAttribute("avatar-orb-color-1", "#235d79");
  widget.setAttribute("avatar-orb-color-2", "#c86456");
  slot.appendChild(widget);
  slot.hidden = false;
  agentConnected = true;
  $("#agent-status").textContent = t("agentConnected");
  $("#voice-launch").innerHTML = `<span>◉</span> <span id="voice-launch-label">${t("openConversation")}</span>`;
}

applyLocale();
mountVoiceAgent();
