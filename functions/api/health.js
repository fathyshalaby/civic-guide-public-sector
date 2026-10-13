import { json } from "../_lib/http.js";

export async function onRequestGet({ env }) {
  const agentConfigured = Boolean(env.ELEVENLABS_AGENT_ID && env.ELEVENLABS_AGENT_ID !== "agent_replace-me");
  const apiConfigured = Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_API_KEY !== "replace-me");
  return json({
    ok: true,
    challenge: "public-sector-assistant",
    runtime: "cloudflare-pages",
    workersAI: env.USE_WORKERS_AI === "true" && Boolean(env.AI),
    auditDb: Boolean(env.AUDIT_DB),
    publicService: { mode: env.PUBLIC_SERVICE_MODE || (env.PUBLIC_SERVICE_API_BASE_URL ? "live" : "mock"), configured: Boolean(env.PUBLIC_SERVICE_API_BASE_URL) },
    elevenlabs: {
      configured: apiConfigured,
      agentConfigured,
      toolConfigured: Boolean(env.ELEVENLABS_TOOL_SECRET),
      whatsappReady: agentConfigured && apiConfigured,
    },
  });
}
