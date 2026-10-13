import { error, json } from "../_lib/http.js";
import { signedUrl } from "../_lib/elevenlabs.js";

export async function onRequestGet({ env }) {
  try {
    if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_AGENT_ID || env.ELEVENLABS_API_KEY === "replace-me") return json({ ok: true, mode: "browser", url: null });
    return json({ ok: true, mode: "elevenlabs", url: await signedUrl(env) });
  } catch (cause) { return error(cause.message || "Voice agent nicht verfügbar."); }
}
