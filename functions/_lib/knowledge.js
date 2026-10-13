const BASE = "https://www.oesterreich.gv.at";

export const WORKFLOWS = {
  wohnsitz: {
    id: "wohnsitz",
    label: "Wohnsitz anmelden",
    description: "Eine neue Adresse beim zuständigen Meldeamt melden.",
    keywords: ["wohnsitz", "umgezogen", "umzug", "adresse", "meldezettel", "anmelden", "hauptwohnsitz", "nebenwohnsitz"],
    reply: "Wenn du umgezogen bist, musst du deinen neuen Wohnsitz beim zuständigen Meldeamt anmelden. Das erledigst du grundsätzlich innerhalb von drei Tagen nach dem Einzug.",
    plainLanguage: ["Du brauchst einen ausgefüllten Meldezettel.", "Die Unterkunftgeberin oder der Unterkunftgeber muss unterschreiben.", "Nimm einen amtlichen Lichtbildausweis mit."],
    questions: ["Ist es ein Haupt- oder Nebenwohnsitz?", "In welcher Gemeinde liegt die neue Adresse?"],
    steps: ["Neue Adresse und Wohnsitzart klären", "Meldezettel unterschreiben lassen", "Beim Meldeamt einreichen"],
    fields: [{ id: "municipality", label: "Gemeinde der neuen Adresse", placeholder: "z. B. Wien, Krems oder Graz", type: "text" }, { id: "residenceType", label: "Wohnsitzart", placeholder: "Hauptwohnsitz oder Nebenwohnsitz", type: "text" }],
    sources: [{ label: "Wohnsitz anmelden", url: `${BASE}/themen/leben_in_oesterreich/auf_eigenen_beinen_stehen/Seite.170070.html`, authority: "oesterreich.gv.at", why: "Verfahrensbeschreibung und Frist" }],
  },
  idAustria: {
    id: "id-austria",
    label: "ID Austria einrichten",
    description: "Digitale Amtswege mit einer sicheren digitalen Identität nutzen.",
    keywords: ["id austria", "digitale identität", "handy signatur", "digital unterschreiben", "amtsweg online"],
    reply: "Mit der ID Austria kannst du dich bei vielen digitalen Amtswegen sicher anmelden und Dokumente digital signieren.",
    plainLanguage: ["Du brauchst ein kompatibles Smartphone.", "Für die Registrierung ist eine einmalige Identitätsprüfung nötig.", "Danach kannst du digitale Services online nutzen."],
    questions: ["Hast du bereits eine Handy-Signatur oder ID Austria?", "Brauchst du Hilfe bei der Registrierung?"],
    steps: ["Status deiner ID Austria prüfen", "Identität einmalig bestätigen", "Digitalen Amtsweg starten"],
    fields: [{ id: "status", label: "Dein aktueller Status", placeholder: "Noch keine ID Austria / Handy-Signatur / ID Austria vorhanden", type: "text" }],
    sources: [{ label: "ID Austria", url: `${BASE}/id-austria.html`, authority: "oesterreich.gv.at", why: "Offizielle Registrierung und Nutzung" }],
  },
  parken: {
    id: "parken",
    label: "Parkberechtigung finden",
    description: "Herausfinden, welche Parkberechtigung für dich passt.",
    keywords: ["parken", "parkpickerl", "parkausweis", "parkberechtigung", "kurzparkzone", "behindertenparkplatz"],
    reply: "Welche Parkberechtigung du brauchst, hängt von Gemeinde, Zone und deiner Situation ab. Ich kann den passenden nächsten Schritt vorbereiten, aber die zuständige Stelle muss den Antrag prüfen.",
    plainLanguage: ["Prüfe zuerst die Gemeinde und die konkrete Parkzone.", "Für Bewohnerparken brauchst du meist einen Hauptwohnsitz und einen Nachweis zum Fahrzeug.", "Besondere Berechtigungen haben zusätzliche Voraussetzungen."],
    questions: ["In welcher Gemeinde möchtest du parken?", "Geht es um Bewohnerparken oder eine besondere Berechtigung?"],
    steps: ["Gemeinde und Zone bestimmen", "Voraussetzungen prüfen", "Antrag bei der zuständigen Stelle einreichen"],
    fields: [{ id: "municipality", label: "Gemeinde", placeholder: "z. B. Wien oder Klosterneuburg", type: "text" }, { id: "permitType", label: "Art der Berechtigung", placeholder: "Bewohnerparken oder besondere Berechtigung", type: "text" }],
    sources: [{ label: "Parken in Österreich", url: `${BASE}/themen/mobilitaet/parken.html`, authority: "oesterreich.gv.at", why: "Grundinformation zu Parkberechtigungen" }],
  },
  familienbeihilfe: {
    id: "familienbeihilfe",
    label: "Familienbeihilfe prüfen",
    description: "Den nächsten Schritt für eine Familienbeihilfe-Anfrage klären.",
    keywords: ["familienbeihilfe", "familie", "kind", "kinderbeihilfe", "geburt", "finanzamt"],
    reply: "Die Familienbeihilfe wird in Österreich grundsätzlich über das Finanzamt Österreich abgewickelt. Ich kann dir die Voraussetzungen und den nächsten Schritt in verständlicher Form zeigen.",
    plainLanguage: ["Die Leistung hängt unter anderem von Wohnsitz und Haushaltszugehörigkeit ab.", "Für manche Fälle wird die Familienbeihilfe automatisch geprüft.", "Bei Änderungen solltest du die zuständige Stelle informieren."],
    questions: ["Geht es um einen neuen Antrag oder um eine Änderung?", "Für welches Kind möchtest du die Information?"],
    steps: ["Art deiner Anfrage bestimmen", "Persönliche Voraussetzungen prüfen", "Antrag oder Änderung einreichen"],
    fields: [{ id: "requestType", label: "Art deiner Anfrage", placeholder: "Neuer Antrag, Änderung oder Frage zu einer bestehenden Leistung", type: "text" }],
    sources: [{ label: "Familienbeihilfe", url: `${BASE}/themen/familie_und_partnerschaft/finanzielle_unterstuetzungen/Seite.080710.html`, authority: "oesterreich.gv.at", why: "Offizielle Leistungsinformation" }],
  },
};

export function detectWorkflow(message) {
  const input = String(message || "").toLowerCase();
  const ranked = Object.values(WORKFLOWS).map((workflow) => ({ workflow, score: workflow.keywords.reduce((score, keyword) => score + (input.includes(keyword) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
  return ranked[0]?.score ? ranked[0].workflow : null;
}

export function getWorkflow(id) { return Object.values(WORKFLOWS).find((workflow) => workflow.id === id) || null; }

export function missingFields(id, fields = {}) {
  const workflow = getWorkflow(id);
  if (!workflow) return ["workflow"];
  return workflow.fields.filter((field) => !String(fields[field.id] || "").trim()).map((field) => field.id);
}
