import { error } from "./http.js";

export function requireToolSecret(request, env = {}) {
  const expected = String(env.ELEVENLABS_TOOL_SECRET || "").trim();
  if (!expected) {
    if (String(env.ALLOW_UNAUTHENTICATED_TOOLS || "").toLowerCase() === "true") return null;
    return error("Voice-Tool ist noch nicht konfiguriert.", 503);
  }
  const received = request.headers.get("x-elevenlabs-tool-secret") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return received === expected ? null : error("Voice tool nicht autorisiert.", 401);
}
