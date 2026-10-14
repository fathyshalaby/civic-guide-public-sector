const $ = (selector) => document.querySelector(selector);
const COPY = {
  de: { eyebrow: "CIVIC GUIDE · IM BROWSER", title: "Was bedeutet diese Amtsseite?", intro: "Markiere einen Abschnitt oder beschreibe, wobei du festhängst. Ich erkläre ihn in klaren Worten und zeige den nächsten sicheren Schritt.", noContext: "Noch keine Seite ausgewählt", usePage: "Kontext prüfen und verwenden", questionLabel: "Deine Frage", placeholder: "z. B. Was muss ich hier vorbereiten?", privacy: "Nur der ausgewählte Kontext wird gesendet.", privacyDetail: "Nur dieser sichtbare, ausgewählte Kontext wird gesendet. Keine Formulare oder Kontodaten.", reviewLabel: "Was wird gesendet?", officialOnly: "Offizieller Seitenkontext ist nur auf *.gv.at verfügbar. Deine Frage bleibt trotzdem nutzbar.", ask: "Erklären", answerEyebrow: "CIVIC GUIDE · ANTWORT", briefEyebrow: "CIVIC DESK · BRIEF", copy: "Antwort kopieren", copyBrief: "Brief kopieren", copied: "Kopiert", openSource: "Quelle öffnen ↗", settings: "Verbindung", apiLabel: "CIVIC API URL", save: "Speichern", plain: "In klaren Worten", needs: "Dafür brauche ich noch", next: "Nächster sicherer Schritt", sources: "Offizielle Quellen", service: "Wahrscheinlicher Amtsweg", summary: "Zusammenfassung", notSubmitted: "Für die Prüfung vorbereitet; noch nicht an eine Behörde übermittelt.", review: "Bereit zur Prüfung", prepared: "Übergabe vorbereitet", noContextTitle: "Öffne eine österreichische Behördenseite.", pageContext: "Seitenkontext bereit", error: "Die Antwort konnte nicht geladen werden." },
  en: { eyebrow: "CIVIC GUIDE · IN THE BROWSER", title: "What does this government page mean?", intro: "Select a passage or describe where you are stuck. I will explain it in plain language and show the next safe step.", noContext: "No page selected yet", usePage: "Review and use context", questionLabel: "Your question", placeholder: "e.g. What do I need to prepare here?", privacy: "Only the selected context is sent.", privacyDetail: "Only this visible, selected context is sent. No forms or account data.", reviewLabel: "What will be sent?", officialOnly: "Official page context is only available on *.gv.at. Your question can still be answered.", ask: "Explain", answerEyebrow: "CIVIC GUIDE · ANSWER", briefEyebrow: "CIVIC DESK · BRIEF", copy: "Copy answer", copyBrief: "Copy brief", copied: "Copied", openSource: "Open source ↗", settings: "Connection", apiLabel: "CIVIC API URL", save: "Save", plain: "In clear words", needs: "I still need", next: "Next safe step", sources: "Official sources", service: "Likely service", summary: "Summary", notSubmitted: "Prepared for review; not submitted to a government system.", review: "Ready to review", prepared: "Handoff prepared", noContextTitle: "Open an Austrian government page.", pageContext: "Page context ready", error: "The answer could not be loaded." },
};
let language = "de";
let context = {};
let contextApproved = false;
let lastResult = null;

function t(key) { return COPY[language][key] || key; }
function escapeHtml(value) { const node = document.createElement("span"); node.textContent = value ?? ""; return node.innerHTML; }
function isOfficialUrl(url) { try { return /(^|\.)gv\.at$/.test(new URL(url).hostname); } catch { return false; } }

function applyLocale() {
  document.documentElement.lang = language === "de" ? "de" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  $("#language-toggle").textContent = language === "de" ? "EN" : "DE";
  $("#language-toggle").setAttribute("aria-label", language === "de" ? "Auf Englisch wechseln" : "Switch to German");
  $("#question").placeholder = t("placeholder");
  $("#privacy-note").textContent = t("privacy");
}

async function getActiveContext() {
  const saved = await chrome.storage.session.get("civicContext");
  if (saved.civicContext?.title || saved.civicContext?.selection) return saved.civicContext;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return {};
  try { return await chrome.tabs.sendMessage(tab.id, { type: "collect-context" }); } catch { return { title: tab.title || "", url: tab.url || "" }; }
}

function showContext(next, approved = false) {
  context = next || {};
  const hasContext = Boolean(context.selection || context.visibleCopy || context.title);
  const official = !context.url || isOfficialUrl(context.url);
  contextApproved = Boolean(approved && official);
  $("#context-label").textContent = hasContext ? t("pageContext") : t("noContext");
  $("#context-title").textContent = context.title || t("noContextTitle");
  const link = $("#context-link");
  link.hidden = !context.url;
  link.href = context.url || "#";
  link.textContent = context.url || "";
  $("#context-review").hidden = !hasContext;
  const visible = context.selection || context.visibleCopy || context.title || "";
  $("#context-preview").textContent = visible;
  $("#context-count").textContent = `${visible.length} ${language === "de" ? "Zeichen" : "characters"}`;
  $("#context-warning").textContent = context.url && !official ? t("officialOnly") : "";
  if (context.selection && !$("#question").value.trim()) $("#question").value = language === "de" ? "Kannst du mir diesen Abschnitt erklären?\n\n" : "Can you explain this passage?\n\n";
}

function boundedContext() {
  const official = !context.url || isOfficialUrl(context.url);
  if (!official) return {};
  return {
    title: String(context.title || "").slice(0, 200),
    url: String(context.url || "").slice(0, 500),
    selection: String(context.selection || "").slice(0, 6000),
    visibleCopy: String(context.selection ? "" : context.visibleCopy || "").slice(0, 3000),
  };
}

function requestPayload(question) {
  return { message: question.trim(), language, channel: "extension", context: boundedContext() };
}

function renderBrief(result) {
  const brief = result.staffBrief || {};
  const service = brief.detectedService;
  const missing = brief.missingQuestions || [];
  const sources = brief.officialSources || [];
  $("#brief").hidden = false;
  $("#brief-status").textContent = brief.handoff?.status === "prepared" ? t("prepared") : t("review");
  $("#brief-service").innerHTML = `<p class="mini-label">${t("service")}</p><h3>${escapeHtml(service?.label || (language === "de" ? "Menschliche Klärung" : "Human review"))}</h3><p>${escapeHtml(brief.plainLanguageSummary || "")}</p>`;
  $("#brief-missing").innerHTML = `<p class="mini-label">${missing.length ? t("needs") : t("summary")}</p>${missing.length ? missing.map((item) => `<div class="brief-row"><span>?</span><p>${escapeHtml(item.label)}<small>${escapeHtml(item.reason)}</small></p></div>`).join("") : `<p>${escapeHtml((brief.factsProvided || []).map((item) => `${item.label}: ${item.value}`).join(" · ") || t("notSubmitted"))}</p>`}`;
  $("#brief-next").innerHTML = `<p class="mini-label">${t("next")}</p><p class="brief-next">${escapeHtml(brief.recommendedNextStep || "")}</p><p class="brief-muted">${t("notSubmitted")}</p>`;
  $("#brief-sources").innerHTML = sources.map((source) => `<a class="brief-source" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗<small>${escapeHtml(source.authority || "oesterreich.gv.at")}</small></a>`).join("");
}

function formatBrief(result) {
  const brief = result.staffBrief || {};
  const service = brief.detectedService?.label || (language === "de" ? "Menschliche Klärung" : "Human review");
  return [`${t("service")}: ${service}`, `${t("summary")}: ${brief.plainLanguageSummary || ""}`, `${t("next")}: ${brief.recommendedNextStep || ""}`, `${t("needs")}: ${(brief.missingQuestions || []).map((item) => item.label).join(", ") || "—"}`, t("notSubmitted"), `Trace: ${brief.traceId || "—"}`].join("\n");
}

function renderAnswer(result) {
  lastResult = result;
  const answer = $("#answer");
  answer.hidden = false;
  $("#confidence").textContent = `${Math.round(result.confidence * 100)}% ${t("confidence")}`;
  $("#reply").textContent = result.reply;
  $("#plain").innerHTML = `<p class="mini-label">${t("plain")}</p>${(result.plainLanguage || []).map((item) => `<div class="plain-row"><span>✓</span><p>${escapeHtml(item)}</p></div>`).join("")}`;
  $("#questions").innerHTML = result.questions?.length ? `<p class="mini-label">${t("needs")}</p>${result.questions.map((item) => `<div class="question-row"><span>?</span><p>${escapeHtml(item)}</p></div>`).join("")}` : "";
  $("#sources").innerHTML = (result.sources || []).map((source) => `<a class="source" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗<small>${escapeHtml(source.authority || "official source")} · ${escapeHtml(source.why || "")}</small></a>`).join("");
  const source = result.sources?.[0];
  $("#open-source").hidden = !source;
  if (source) $("#open-source").href = source.url;
  renderBrief(result);
  answer.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function ask(question) {
  if (context.url && isOfficialUrl(context.url) && !contextApproved) {
    $("#context-warning").textContent = language === "de" ? "Bitte prüfe zuerst den sichtbaren Kontext und klicke nochmals auf ‚Kontext prüfen und verwenden‘." : "Review the visible context first, then click ‘Review and use context’.";
    $("#use-page").focus();
    return;
  }
  const submit = $("#guide-form button[type=submit]");
  submit.disabled = true;
  submit.querySelector("[data-i18n]").textContent = language === "de" ? "wird erklärt …" : "explaining …";
  try {
    const base = (await chrome.storage.sync.get("apiBase")).apiBase || "http://localhost:8796";
    const response = await fetch(`${base.replace(/\/$/, "")}/api/understand`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(requestPayload(question)) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    renderAnswer(data.result);
  } catch (error) {
    $("#answer").hidden = false;
    $("#reply").textContent = error.message || t("error");
  } finally {
    submit.disabled = false;
    submit.querySelector("[data-i18n]").textContent = t("ask");
  }
}

$("#guide-form").addEventListener("submit", (event) => { event.preventDefault(); if ($("#question").value.trim()) ask($("#question").value); });
$("#use-page").addEventListener("click", async () => showContext(await getActiveContext(), true));
$("#language-toggle").addEventListener("click", () => { language = language === "de" ? "en" : "de"; applyLocale(); showContext(context, contextApproved); if (lastResult) renderBrief(lastResult); });
$("#copy").addEventListener("click", async () => { await navigator.clipboard?.writeText($("#reply").textContent); const original = t("copy"); $("#copy").textContent = t("copied"); setTimeout(() => { $("#copy").textContent = original; }, 1200); });
$("#copy-brief").addEventListener("click", async () => { if (!lastResult) return; await navigator.clipboard?.writeText(formatBrief(lastResult)); const button = $("#copy-brief"); button.textContent = t("copied"); setTimeout(() => { button.textContent = t("copyBrief"); }, 1200); });
$("#save-api").addEventListener("click", async () => { await chrome.storage.sync.set({ apiBase: $("#api-base").value.trim().replace(/\/$/, "") }); });

(async function init() {
  const saved = await chrome.storage.sync.get("apiBase");
  $("#api-base").value = saved.apiBase || "http://localhost:8796";
  applyLocale();
  showContext(await getActiveContext());
})();
