import { challenge } from "/challenge.config.js";

const $ = (selector) => document.querySelector(selector);
const form = $("#assistant-form");
const message = $("#message");
const answerSection = $("#answer-section");
let state = { result: null };

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
    utterance.lang = challenge.language;
    window.speechSynthesis?.speak(utterance);
  }).catch(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = challenge.language;
    window.speechSynthesis?.speak(utterance);
  });
}

function setBusy(busy) {
  const button = form.querySelector("button[type=submit]");
  button.disabled = busy;
  button.innerHTML = busy ? `<span class="spinner"></span>ordne zu …` : `Nächsten Schritt zeigen <span>→</span>`;
}

function renderSources(sources = []) {
  return sources.map((source) => `<a href="${escape(source.url)}" target="_blank" rel="noreferrer"><span class="source-name">${escape(source.label)}</span><span class="source-meta">${escape(source.authority || "offizielle Quelle")} · ${escape(source.why || "Nachweis")}</span><span class="source-arrow">↗</span></a>`).join("");
}

function render(result) {
  state.result = result;
  answerSection.hidden = false;
  $("#confidence").textContent = `${Math.round(result.confidence * 100)}% sicher${result.aiEnhanced ? " · klarer formuliert" : ""}`;
  $("#answer-reply").textContent = result.reply;
  $("#plain-language").innerHTML = `<p class="micro-label">In klaren Worten</p>${(result.plainLanguage || []).map((item) => `<div class="plain-row"><span>✓</span><p>${escape(item)}</p></div>`).join("")}`;
  $("#questions").innerHTML = result.questions?.length ? `<p class="micro-label">Dafür brauche ich noch</p>${result.questions.map((item) => `<div class="question-row"><span>?</span><p>${escape(item)}</p></div>`).join("")}` : "";
  $("#match-signals").innerHTML = result.matchedSignals?.length ? `<p class="micro-label">Erkannte Hinweise</p><div class="signal-list">${result.matchedSignals.map((signal) => `<span>${escape(signal)}</span>`).join("")}</div>` : `<p class="micro-label">Sicherheitsmodus</p><p class="muted-note">Kein passender Vorgang erkannt — ich erfinde keine Antwort.</p>`;
  const guardrails = result.guardrails || {};
  $("#trust-banner").innerHTML = `<span class="trust-chip">${guardrails.sourceBacked ? "● quellenbasiert" : "○ Quelle prüfen"}</span><span>${guardrails.legalDecision ? "Rechtsentscheidung" : "keine Rechtsentscheidung"}</span><span>${guardrails.humanReviewRequired ? "menschliche Prüfung bleibt möglich" : "automatisiert"}</span>`;
  $("#trace-id").textContent = `trace ${result.traceId || "—"}`;

  const workflow = result.workflow;
  $("#workflow-label").textContent = workflow?.label || "Persönliche Auskunft";
  $("#workflow-description").textContent = workflow?.description || "Eine zuständige Person kann dich mit deiner konkreten Frage weiter begleiten.";
  $("#workflow-steps").innerHTML = (workflow?.steps || ["Anliegen zusammenfassen", "Zuständige Stelle finden", "Persönliche Übergabe"]).map((step) => `<li>${escape(step)}</li>`).join("");
  $("#workflow-note").textContent = workflow ? "Die folgenden Angaben helfen, eine sichere Übergabe vorzubereiten." : "Bei unklaren Anliegen bleibt die Antwort bewusst bei einer menschlichen Übergabe.";
  $("#start-workflow").hidden = !workflow || result.humanHandoff;
  $("#handoff-card").hidden = !result.humanHandoff;
  $("#sources").innerHTML = renderSources(result.sources);
  $("#submit-panel").hidden = true;
  answerSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function ask(text) {
  setBusy(true);
  try {
    const response = await fetch("/api/understand", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text }) });
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
  panel.innerHTML = `<div class="submit-copy"><p class="eyebrow">CIVIC DESK · 03</p><h3>Übergabe vorbereiten</h3><p>Diese Angaben helfen, deinen Vorgang für <strong>${escape(workflow.label)}</strong> zusammenzufassen. Es wird noch nichts an eine Behörde übermittelt.</p><div class="field-grid">${fields}</div><label class="confirmation-row"><input id="confirm-consent" type="checkbox" /><span>Ich habe die Angaben geprüft und möchte die Demo-Übergabe vorbereiten.</span></label><p id="submit-status" class="submit-status" role="status"></p></div><div class="submit-actions"><button id="cancel-submit" class="secondary-button" type="button">Zurück</button><button id="confirm-submit" class="primary-button" type="button">Ja, vorbereiten <span>↗</span></button></div>`;
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
    status.textContent = "Bitte bestätige zuerst, dass du die Angaben geprüft hast.";
    consent.focus();
    return;
  }
  const fields = { originalMessage: state.result.originalMessage };
  panel.querySelectorAll("[data-field]").forEach((input) => { fields[input.dataset.field] = input.value.trim(); });
  button.disabled = true;
  button.textContent = "wird vorbereitet …";
  try {
    const response = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ workflow: state.result.workflow.id, fields, traceId: state.result.traceId, confirm: true, idempotencyKey: globalThis.crypto?.randomUUID?.() }) });
    const data = await response.json();
    panel.innerHTML = response.ok ? `<div class="success-mark">✓</div><div><p class="eyebrow">übergabe vorbereitet</p><h3>Der nächste Schritt ist dokumentiert.</h3><p>Demo-Vorgangsnummer <strong>${escape(data.caseId || data.idempotencyKey)}</strong>. Im Live-Modus würde die Anfrage jetzt an das angeschlossene Service-System übergeben — erst nach dessen eigener Prüfung.</p><p class="trace-id">${escape(data.audit?.persisted ? "Audit-Ereignis gespeichert" : "Audit-Demo ohne Datenbankbindung")}</p></div>` : `<div><p class="eyebrow">nicht übermittelt</p><h3>Die Anfrage blieb bei dir.</h3><p>${escape(data.error || "Bitte versuche es erneut.")}</p>${data.details?.missing?.length ? `<p class="muted-note">Fehlt noch: ${escape(data.details.missing.join(", "))}</p>` : ""}</div><div class="submit-actions"><button id="close-submit" class="secondary-button" type="button">Schließen</button></div>`;
    $("#close-submit")?.addEventListener("click", () => { panel.hidden = true; });
  } catch (cause) {
    status.textContent = cause.message || "Bitte versuche es erneut.";
    button.disabled = false;
    button.textContent = "Ja, vorbereiten ↗";
  }
}

form.addEventListener("submit", (event) => { event.preventDefault(); if (message.value.trim()) ask(message.value.trim()); });
document.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => { message.value = button.dataset.example; message.focus(); }));
$("#read-button").addEventListener("click", () => { if (state.result) speak(state.result.reply); });
$("#start-workflow").addEventListener("click", showSubmitPanel);
$("#voice-launch").addEventListener("click", () => {
  const widget = $("#agent-widget-slot");
  if (!widget.hidden) {
    widget.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  message.value = challenge.sample;
  message.focus();
  message.scrollIntoView({ behavior: "smooth", block: "center" });
  $("#listening-label").textContent = "Beispiel eingesetzt — du kannst es jetzt sprechen oder senden";
});
$("#health-button").addEventListener("click", async () => {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    alert(data.ok ? `Online · ${data.workersAI ? "Workers AI aktiv" : "deterministische Demo"} · ${data.auditDb ? "Audit aktiv" : "Audit-Demo"} · ${data.elevenlabs.configured ? "ElevenLabs verbunden" : "Browser-Fallback"}` : "Status nicht verfügbar");
  } catch { alert("Status nicht verfügbar"); }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "de-AT";
  recognition.interimResults = false;
  $("#voice-button").addEventListener("click", () => { recognition.start(); $("#listening-label").textContent = "ich höre zu …"; });
  recognition.onresult = (event) => { message.value = event.results[0][0].transcript; $("#listening-label").textContent = "verstanden"; };
  recognition.onerror = () => { $("#listening-label").textContent = "Mikrofon nicht verfügbar"; };
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
  widget.setAttribute("action-text", "Mit Civic Guide sprechen");
  widget.setAttribute("start-call-text", "Gespräch starten");
  widget.setAttribute("end-call-text", "Gespräch beenden");
  widget.setAttribute("listening-text", "Civic Guide hört zu …");
  widget.setAttribute("speaking-text", "Civic Guide antwortet …");
  widget.setAttribute("avatar-orb-color-1", "#235d79");
  widget.setAttribute("avatar-orb-color-2", "#c86456");
  slot.appendChild(widget);
  slot.hidden = false;
  $("#agent-status").textContent = "agent verbunden";
  $("#voice-launch").innerHTML = "<span>◉</span> Gespräch öffnen";
}

mountVoiceAgent();
