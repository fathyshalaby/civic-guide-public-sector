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
    sources: [{ label: "Wohnsitz anmelden", url: `${BASE}/themen/leben_in_oesterreich/auf_eigenen_beinen_stehen/Seite.170070.html`, authority: "oesterreich.gv.at", why: "Verfahrensbeschreibung und Frist" }],
    en: {
      label: "Register a new address",
      description: "Register a new address with the responsible registration office.",
      reply: "If you have moved, you need to register your new address with the responsible registration office. This is generally due within three days of moving in.",
      plainLanguage: ["You need a completed registration form.", "The accommodation provider must sign it.", "Bring an official photo ID."],
      questions: ["Will this be your main or secondary residence?", "Which municipality is the new address in?"],
      steps: ["Clarify the new address and residence type", "Have the registration form signed", "Submit it to the registration office"],
      fields: [{ id: "municipality", label: "Municipality of the new address", placeholder: "e.g. Vienna, Krems or Graz", type: "text" }, { id: "residenceType", label: "Residence type", placeholder: "Main residence or secondary residence", type: "text" }],
      sources: [{ label: "Register a new address", url: `${BASE}/en/themen/leben_in_oesterreich/auf_eigenen_beinen_stehen/Seite.170070.html`, authority: "oesterreich.gv.at", why: "Official procedure and deadline" }],
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
    keywords: ["familienbeihilfe", "familie", "kind", "kinderbeihilfe", "geburt", "finanzamt", "family allowance", "child benefit", "birth", "tax office"],
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
};

export function detectWorkflow(message) {
  const input = String(message || "").toLowerCase();
  const ranked = Object.values(WORKFLOWS).map((workflow) => ({ workflow, score: workflow.keywords.reduce((score, keyword) => score + (input.includes(keyword) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
  return ranked[0]?.score ? ranked[0].workflow : null;
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
