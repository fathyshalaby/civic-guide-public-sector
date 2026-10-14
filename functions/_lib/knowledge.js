const BASE = "https://www.oesterreich.gv.at";

export const WORKFLOWS = {
  wohnsitz: {
    id: "wohnsitz",
    label: "Wohnsitz anmelden",
    description: "Eine neue Adresse beim zuständigen Meldeamt melden.",
    keywords: ["wohnsitz", "umgezogen", "umzug", "adresse", "meldezettel", "anmelden", "hauptwohnsitz", "nebenwohnsitz", "moved", "move", "address", "register", "registration", "residence"],
    reply: "Wenn du umgezogen bist, musst du deinen neuen Wohnsitz beim zuständigen Meldeamt anmelden. Das erledigst du grundsätzlich innerhalb von drei Tagen nach dem Einzug.",
    plainLanguage: ["Du brauchst einen ausgefüllten Meldezettel.", "Die Unterkunftgeberin oder der Unterkunftgeber muss unterschreiben.", "Nimm einen amtlichen Lichtbildausweis mit."],
    questions: ["Ist es ein Haupt- oder Nebenwohnsitz?", "In welcher Gemeinde liegt die neue Adresse?"],
    steps: ["Neue Adresse und Wohnsitzart klären", "Meldezettel unterschreiben lassen", "Beim Meldeamt einreichen"],
    fields: [{ id: "municipality", label: "Gemeinde der neuen Adresse", placeholder: "z. B. Wien, Krems oder Graz", type: "text" }, { id: "residenceType", label: "Wohnsitzart", placeholder: "Hauptwohnsitz oder Nebenwohnsitz", type: "text" }],
    sources: [{ label: "Wohnsitz anmelden", url: `${BASE}/de/landingpages/meldewesen`, authority: "oesterreich.gv.at", why: "Offizielle Verfahrensbeschreibung und Frist" }],
    en: {
      label: "Register a new address",
      description: "Register a new address with the responsible registration office.",
      reply: "If you have moved, you need to register your new address with the responsible registration office. This is generally due within three days of moving in.",
      plainLanguage: ["You need a completed registration form.", "The accommodation provider must sign it.", "Bring an official photo ID."],
      questions: ["Will this be your main or secondary residence?", "Which municipality is the new address in?"],
      steps: ["Clarify the new address and residence type", "Have the registration form signed", "Submit it to the registration office"],
      fields: [{ id: "municipality", label: "Municipality of the new address", placeholder: "e.g. Vienna, Krems or Graz", type: "text" }, { id: "residenceType", label: "Residence type", placeholder: "Main residence or secondary residence", type: "text" }],
      sources: [{ label: "Residence registration", url: `${BASE}/en/landingpages/meldewesen`, authority: "oesterreich.gv.at", why: "Official procedure and requirements" }],
    },
  },
  reisepass: {
    id: "reisepass",
    label: "Pass erneuern",
    description: "Den nächsten sicheren Schritt für eine neue oder abgelaufene Reisedokumentation klären.",
    keywords: ["reisepass", "pass verlängern", "pass erneuern", "pass abgelaufen", "notpass", "passport", "passport renewal", "renew passport", "expired passport", "travel document"],
    reply: "Für einen neuen oder abgelaufenen Reisepass solltest du zuerst klären, welcher Fall vorliegt und welche Passbehörde zuständig ist. Die offizielle Seite führt dich zu den aktuellen Informationen für Neuausstellung, Verlust, Dringlichkeit und Minderjährige.",
    plainLanguage: ["Prüfe zuerst, ob es um Erneuerung, Verlust oder einen dringenden Pass geht.", "Zuständige Passbehörde, Unterlagen, Termin und Gebühren können vom Fall abhängen.", "Nutze die offizielle Pass-Seite als Checkliste, bevor du den Termin vorbereitest."],
    questions: ["Ist dein Pass abgelaufen, verloren oder brauchst du ihn dringend?", "In welcher Gemeinde möchtest du den Pass beantragen?"],
    steps: ["Fall und Reisedokument klären", "Zuständige Passbehörde und Unterlagen prüfen", "Termin oder Antrag vorbereiten"],
    fields: [{ id: "caseType", label: "Dein Pass-Fall", placeholder: "Erneuerung, Verlust oder dringend", type: "text" }, { id: "municipality", label: "Gemeinde", placeholder: "z. B. Wien, Graz oder Linz", type: "text" }],
    sources: [{ label: "Passport Online Services", url: `${BASE}/de/landingpages/reisepass`, authority: "oesterreich.gv.at", why: "Offizielle Informationen zu Pass-Services" }],
    en: {
      label: "Renew a passport",
      description: "Clarify the next safe step for a new or expired travel document.",
      reply: "For a new or expired passport, first clarify which situation applies and which passport authority is responsible. The official page guides you to current information for renewals, lost documents, urgent passports and minors.",
      plainLanguage: ["First check whether this is a renewal, a lost passport or an urgent request.", "The responsible authority, documents, appointment and fees can depend on your situation.", "Use the official passport page as a checklist before preparing the appointment."],
      questions: ["Has your passport expired, was it lost, or do you need it urgently?", "Which municipality do you want to apply in?"],
      steps: ["Clarify the document and situation", "Check the responsible passport authority and documents", "Prepare the appointment or application"],
      fields: [{ id: "caseType", label: "Your passport situation", placeholder: "Renewal, lost or urgent", type: "text" }, { id: "municipality", label: "Municipality", placeholder: "e.g. Vienna, Graz or Linz", type: "text" }],
      sources: [{ label: "Passport Online Services", url: `${BASE}/en/landingpages/reisepass`, authority: "oesterreich.gv.at", why: "Official passport service information" }],
    },
  },
  idAustria: {
    id: "id-austria",
    label: "ID Austria einrichten",
    description: "Digitale Amtswege mit einer sicheren digitalen Identität nutzen.",
    keywords: ["id austria", "digitale identität", "handy signatur", "digital unterschreiben", "amtsweg online", "digital identity", "digital signature", "sign documents", "online government"],
    reply: "Mit der ID Austria kannst du dich bei vielen digitalen Amtswegen sicher anmelden und Dokumente digital signieren.",
    plainLanguage: ["Du brauchst ein kompatibles Smartphone.", "Für die Registrierung ist eine einmalige Identitätsprüfung nötig.", "Danach kannst du digitale Services online nutzen."],
    questions: ["Hast du bereits eine Handy-Signatur oder ID Austria?", "Brauchst du Hilfe bei der Registrierung?"],
    steps: ["Status deiner ID Austria prüfen", "Identität einmalig bestätigen", "Digitalen Amtsweg starten"],
    fields: [{ id: "status", label: "Dein aktueller Status", placeholder: "Noch keine ID Austria / Handy-Signatur / ID Austria vorhanden", type: "text" }],
    sources: [{ label: "ID Austria", url: `${BASE}/id-austria.html`, authority: "oesterreich.gv.at", why: "Offizielle Registrierung und Nutzung" }],
    en: {
      label: "Set up ID Austria",
      description: "Use a secure digital identity for online public services.",
      reply: "With ID Austria, you can securely sign in to many online public services and digitally sign documents.",
      plainLanguage: ["You need a compatible smartphone.", "Registration requires a one-time identity check.", "After that, you can use digital services online."],
      questions: ["Do you already have Handy-Signatur or ID Austria?", "Do you need help with registration?"],
      steps: ["Check your current ID Austria status", "Confirm your identity once", "Start the online public service"],
      fields: [{ id: "status", label: "Your current status", placeholder: "No ID Austria / Handy-Signatur / ID Austria", type: "text" }],
      sources: [{ label: "ID Austria", url: `${BASE}/en/id-austria.html`, authority: "oesterreich.gv.at", why: "Official registration and usage information" }],
    },
  },
  parken: {
    id: "parken",
    label: "Parkberechtigung finden",
    description: "Herausfinden, welche Parkberechtigung für dich passt.",
    keywords: ["parken", "parkpickerl", "parkausweis", "parkberechtigung", "kurzparkzone", "behindertenparkplatz", "parking", "parking permit", "resident parking", "short-stay zone"],
    reply: "Welche Parkberechtigung du brauchst, hängt von Gemeinde, Zone und deiner Situation ab. Ich kann den passenden nächsten Schritt vorbereiten, aber die zuständige Stelle muss den Antrag prüfen.",
    plainLanguage: ["Prüfe zuerst die Gemeinde und die konkrete Parkzone.", "Für Bewohnerparken brauchst du meist einen Hauptwohnsitz und einen Nachweis zum Fahrzeug.", "Besondere Berechtigungen haben zusätzliche Voraussetzungen."],
    questions: ["In welcher Gemeinde möchtest du parken?", "Geht es um Bewohnerparken oder eine besondere Berechtigung?"],
    steps: ["Gemeinde und Zone bestimmen", "Voraussetzungen prüfen", "Antrag bei der zuständigen Stelle einreichen"],
    fields: [{ id: "municipality", label: "Gemeinde", placeholder: "z. B. Wien oder Klosterneuburg", type: "text" }, { id: "permitType", label: "Art der Berechtigung", placeholder: "Bewohnerparken oder besondere Berechtigung", type: "text" }],
    sources: [{ label: "Parken in Österreich", url: `${BASE}/themen/mobilitaet/parken.html`, authority: "oesterreich.gv.at", why: "Grundinformation zu Parkberechtigungen" }],
    en: {
      label: "Find a parking permit",
      description: "Find out which parking permit may fit your situation.",
      reply: "The right parking permit depends on the municipality, zone and your situation. I can prepare the next step, but the responsible office must check the application.",
      plainLanguage: ["Start by checking the municipality and the specific parking zone.", "Resident parking usually requires a main residence and proof related to the vehicle.", "Special permits have additional requirements."],
      questions: ["Which municipality do you want to park in?", "Is this resident parking or a special permit?"],
      steps: ["Identify the municipality and zone", "Check the requirements", "Submit the application to the responsible office"],
      fields: [{ id: "municipality", label: "Municipality", placeholder: "e.g. Vienna or Klosterneuburg", type: "text" }, { id: "permitType", label: "Permit type", placeholder: "Resident parking or special permit", type: "text" }],
      sources: [{ label: "Parking in Austria", url: `${BASE}/en/themen/mobilitaet/parken.html`, authority: "oesterreich.gv.at", why: "Official general parking information" }],
    },
  },
  familienbeihilfe: {
    id: "familienbeihilfe",
    label: "Familienbeihilfe prüfen",
    description: "Den nächsten Schritt für eine Familienbeihilfe-Anfrage klären.",
    keywords: ["familienbeihilfe", "familie", "kind", "kinderbeihilfe", "kinderbetreuungsgeld", "geburt", "finanzamt", "family allowance", "child benefit", "birth", "tax office"],
    reply: "Die Familienbeihilfe wird in Österreich grundsätzlich über das Finanzamt Österreich abgewickelt. Ich kann dir die Voraussetzungen und den nächsten Schritt in verständlicher Form zeigen.",
    plainLanguage: ["Die Leistung hängt unter anderem von Wohnsitz und Haushaltszugehörigkeit ab.", "Für manche Fälle wird die Familienbeihilfe automatisch geprüft.", "Bei Änderungen solltest du die zuständige Stelle informieren."],
    questions: ["Geht es um einen neuen Antrag oder um eine Änderung?", "Für welches Kind möchtest du die Information?"],
    steps: ["Art deiner Anfrage bestimmen", "Persönliche Voraussetzungen prüfen", "Antrag oder Änderung einreichen"],
    fields: [{ id: "requestType", label: "Art deiner Anfrage", placeholder: "Neuer Antrag, Änderung oder Frage zu einer bestehenden Leistung", type: "text" }],
    sources: [{ label: "Familienbeihilfe", url: `${BASE}/themen/familie_und_partnerschaft/finanzielle_unterstuetzungen/Seite.080710.html`, authority: "oesterreich.gv.at", why: "Offizielle Leistungsinformation" }],
    en: {
      label: "Check family allowance",
      description: "Clarify the next step for a family allowance question.",
      reply: "Family allowance in Austria is generally handled by the Austrian Tax Office. I can explain the requirements and prepare the next step in plain language.",
      plainLanguage: ["Eligibility depends, among other things, on residence and household situation.", "In some cases, family allowance is checked automatically.", "Tell the responsible office when your circumstances change."],
      questions: ["Is this a new application or a change?", "Which child is the question about?"],
      steps: ["Identify the type of request", "Check the personal requirements", "Submit an application or change"],
      fields: [{ id: "requestType", label: "Type of request", placeholder: "New application, change or question about an existing benefit", type: "text" }],
      sources: [{ label: "Family allowance", url: `${BASE}/en/themen/familie_und_partnerschaft/finanzielle_unterstuetzungen/Seite.080710.html`, authority: "oesterreich.gv.at", why: "Official benefit information" }],
    },
  },
  kinderbetreuung: {
    id: "kinderbetreuung",
    label: "Kinderbetreuung unterstützen lassen",
    description: "Den nächsten sicheren Schritt für eine Frage zu Kinderbetreuung und Betreuungskosten klären.",
    keywords: ["kinderbetreuung", "kindergarten", "krippe", "hort", "betreuungskosten", "childcare", "daycare", "nursery", "child care", "subsidy"],
    reply: "Bei Fragen zu Kinderbetreuung oder Betreuungskosten hängt der nächste Schritt von Wohnort, Betreuungsform und deiner persönlichen Situation ab. Ich zeige dir die offizielle Information und bereite die offenen Fragen für eine zuständige Stelle vor.",
    plainLanguage: ["Prüfe zuerst, um welche Betreuungsform und welche Gemeinde es geht.", "Unterstützungen können unterschiedliche Voraussetzungen und zuständige Stellen haben.", "Eine zuständige Stelle muss deinen konkreten Anspruch prüfen."],
    questions: ["In welcher Gemeinde findet die Kinderbetreuung statt?", "Geht es um einen neuen Antrag oder eine bestehende Unterstützung?"],
    steps: ["Gemeinde und Betreuungsform klären", "Offizielle Voraussetzungen prüfen", "Anfrage oder Antrag bei der zuständigen Stelle vorbereiten"],
    fields: [{ id: "municipality", label: "Gemeinde", placeholder: "z. B. Wien, Graz oder Linz", type: "text" }, { id: "requestType", label: "Art der Anfrage", placeholder: "Neuer Antrag, Änderung oder allgemeine Frage", type: "text" }],
    sources: [{ label: "Familie und finanzielle Unterstützung", url: `${BASE}/de/themen/familie_und_partnerschaft/finanzielle_unterstuetzungen/Seite.080710.html`, authority: "oesterreich.gv.at", why: "Offizielle Information zu finanzieller Unterstützung" }],
    en: {
      label: "Find childcare support",
      description: "Clarify the next safe step for a childcare or childcare-cost question.",
      reply: "For childcare or childcare-cost questions, the next step depends on the municipality, type of care and your situation. I will show the official information and prepare the open questions for the responsible office.",
      plainLanguage: ["First identify the municipality and type of childcare.", "Different support schemes can have different requirements and responsible offices.", "A responsible office must check your individual eligibility."],
      questions: ["Which municipality provides the childcare?", "Is this a new application or an existing support arrangement?"],
      steps: ["Clarify the municipality and type of care", "Check the official requirements", "Prepare the question or application for the responsible office"],
      fields: [{ id: "municipality", label: "Municipality", placeholder: "e.g. Vienna, Graz or Linz", type: "text" }, { id: "requestType", label: "Type of request", placeholder: "New application, change or general question", type: "text" }],
      sources: [{ label: "Family and financial support", url: `${BASE}/en/themen/familie_und_partnerschaft/finanzielle_unterstuetzungen/Seite.080710.html`, authority: "oesterreich.gv.at", why: "Official information about financial support" }],
    },
  },
};

function normalizeInput(message) {
  return String(message || "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\bmeldezettl\b/g, "meldezettel")
    .replace(/\breisepas\b/g, "reisepass")
    .replace(/\bkindebetreuung\b/g, "kinderbetreuung")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectWorkflow(message) {
  const ranked = rankWorkflows(message);
  return ranked[0]?.score ? ranked[0].workflow : null;
}

export function rankWorkflows(message) {
  const input = normalizeInput(message);
  return Object.values(WORKFLOWS)
    .map((workflow) => ({ workflow, score: workflow.keywords.reduce((score, keyword) => score + (input.includes(keyword) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score);
}

export function getWorkflow(id, language = "de") {
  const workflow = Object.values(WORKFLOWS).find((candidate) => candidate.id === id);
  if (!workflow) return null;
  if (language !== "en" || !workflow.en) return workflow;
  return { ...workflow, ...workflow.en, id: workflow.id, keywords: workflow.keywords };
}

export function missingFields(id, fields = {}) {
  const workflow = getWorkflow(id);
  if (!workflow) return ["workflow"];
  return workflow.fields.filter((field) => !String(fields[field.id] || "").trim()).map((field) => field.id);
}
