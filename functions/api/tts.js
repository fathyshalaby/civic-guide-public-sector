import { error, json } from "../_lib/http.js";
import { speech } from "../_lib/elevenlabs.js";

export async function onRequestPost({ request, env }) {
  try {
    const { text } = await request.json(); if (!String(text || "").trim()) return error("Text fehlt.");
    if (!env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY === "replace-me") return json({ ok: true, mode: "browser" });
    const result = await speech(text, env); return new Response(result.response.body, { headers: { "content-type": "audio/mpeg", "cache-control": "no-store" } });
  } catch (cause) { return error(cause.message || "Sprachausgabe nicht verfügbar."); }
}
