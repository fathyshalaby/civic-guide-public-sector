const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";
export async function speech(text, env = {}) {
  if (!env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY === "replace-me") return { configured: false };
  const voice = env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "content-type": "application/json", accept: "audio/mpeg" }, body: JSON.stringify({ text: String(text || "").slice(0, 1200), model_id: env.ELEVENLABS_MODEL || "eleven_multilingual_v2" }) });
  if (!response.ok) throw new Error(`ElevenLabs returned ${response.status}`);
  return { configured: true, response };
}
export async function signedUrl(env = {}) {
  if (!env.ELEVENLABS_API_KEY || !env.ELEVENLABS_AGENT_ID || env.ELEVENLABS_API_KEY === "replace-me") return null;
  const url = new URL("https://api.elevenlabs.io/v1/convai/conversation/get-signed-url"); url.searchParams.set("agent_id", env.ELEVENLABS_AGENT_ID);
  const response = await fetch(url, { headers: { "xi-api-key": env.ELEVENLABS_API_KEY } }); if (!response.ok) throw new Error("Unable to create conversation URL."); return response.json();
}
