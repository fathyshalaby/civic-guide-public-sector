const $ = (selector) => document.querySelector(selector);
const COPY = {
  de: { eyebrow: "CIVIC GUIDE · IM BROWSER", title: "Was bedeutet diese Amtsseite?", intro: "Markiere einen Abschnitt oder beschreibe, wobei du festhängst. Ich erkläre ihn in klaren Worten und zeige den nächsten sicheren Schritt.", noContext: "Noch keine Seite ausgewählt", usePage: "Diese Seite als Kontext verwenden", questionLabel: "Deine Frage", placeholder: "z. B. Was muss ich hier vorbereiten?", privacy: "Nur der ausgewählte Kontext wird gesendet.", ask: "Erklären", answerEyebrow: "CIVIC GUIDE · ANTWORT", copy: "Zusammenfassung kopieren", copied: "Kopiert", openSource: "Quelle öffnen ↗", settings: "Verbindung", apiLabel: "CIVIC API URL", save: "Speichern", plain: "In klaren Worten", needs: "Dafür brauche ich noch", sourceBacked: "● quellenbasiert", noLegal: "keine Rechtsentscheidung", humanReview: "menschliche Prüfung bleibt möglich", confidence: "sicher", noContextTitle: "Öffne eine österreichische Behördenseite.", pageContext: "Seitenkontext bereit", error: "Die Antwort konnte nicht geladen werden." },
  en: { eyebrow: "CIVIC GUIDE · IN THE BROWSER", title: "What does this government page mean?", intro: "Select a passage or describe where you are stuck. I will explain it in plain language and show the next safe step.", noContext: "No page selected yet", usePage: "Use this page as context", questionLabel: "Your question", placeholder: "e.g. What do I need to prepare here?", privacy: "Only the selected context is sent.", ask: "Explain", answerEyebrow: "CIVIC GUIDE · ANSWER", copy: "Copy summary", copied: "Copied", openSource: "Open source ↗", settings: "Connection", apiLabel: "CIVIC API URL", save: "Save", plain: "In clear words", needs: "I still need", sourceBacked: "● source-backed", noLegal: "not a legal decision", humanReview: "human review remains possible", confidence: "confidence", noContextTitle: "Open an Austrian government page.", pageContext: "Page context ready", error: "The answer could not be loaded." },
};
const EXAMPLES = { de: "Kannst du mir erklären, was ich hier tun muss?", en: "Can you explain what I need to do here?" };
let language = "de";
let context = {};

function t(key) { return COPY[language][key] || key; }
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

function showContext(next) {
  context = next || {};
  const hasContext = Boolean(context.selection || context.visibleCopy || context.title);
  $("#context-label").textContent = hasContext ? t("pageContext") : t("noContext");
  $("#context-title").textContent = context.title || t("noContextTitle");
  const link = $("#context-link");
  link.hidden = !context.url;
  link.href = context.url || "#";
  link.textContent = context.url || "";
  $("#question").value = context.selection ? (language === "de" ? "Kannst du mir diesen Abschnitt erklären?\n\n" : "Can you explain this passage?\n\n") + context.selection : $("#question").value;
}

function contextPrompt(question) {
  const parts = [question.trim()];
  if (context.title) parts.push(`${language === "de" ? "Offizielle Seite" : "Official page"}: ${context.title}`);
  if (context.url) parts.push(`URL: ${context.url}`);
  if (context.selection) parts.push(`${language === "de" ? "Markierter Text" : "Selected text"}: ${context.selection}`);
  else if (context.visibleCopy) parts.push(`${language === "de" ? "Sichtbarer Seitenkontext" : "Visible page context"}: ${context.visibleCopy}`);
  return parts.join("\n\n").slice(0, 9000);
}

function renderAnswer(result) {
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
  answer.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function ask(question) {
  const submit = $("#guide-form button[type=submit]");
  submit.disabled = true;
  submit.querySelector("[data-i18n]").textContent = language === "de" ? "wird erklärt …" : "explaining …";
  try {
    const base = (await chrome.storage.sync.get("apiBase")).apiBase || "http://localhost:8796";
    const response = await fetch(`${base.replace(/\/$/, "")}/api/understand`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: contextPrompt(question), language }) });
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

function escapeHtml(value) { const node = document.createElement("span"); node.textContent = value ?? ""; return node.innerHTML; }

$("#guide-form").addEventListener("submit", (event) => { event.preventDefault(); if ($("#question").value.trim()) ask($("#question").value); });
$("#use-page").addEventListener("click", async () => showContext(await getActiveContext()));
$("#language-toggle").addEventListener("click", () => { language = language === "de" ? "en" : "de"; applyLocale(); showContext(context); });
$("#copy").addEventListener("click", async () => { await navigator.clipboard?.writeText($("#reply").textContent); const original = t("copy"); $("#copy").textContent = t("copied"); setTimeout(() => { $("#copy").textContent = original; }, 1200); });
$("#save-api").addEventListener("click", async () => { await chrome.storage.sync.set({ apiBase: $("#api-base").value.trim().replace(/\/$/, "") }); });

(async function init() {
  const saved = await chrome.storage.sync.get("apiBase");
  $("#api-base").value = saved.apiBase || "http://localhost:8796";
  applyLocale();
  showContext(await getActiveContext());
})();
