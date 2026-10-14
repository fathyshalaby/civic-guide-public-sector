export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(context.env) });
  }
  const response = await context.next(); const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff"); headers.set("referrer-policy", "no-referrer"); headers.set("permissions-policy", "microphone=(self)");
  for (const [key, value] of Object.entries(corsHeaders(context.env))) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function corsHeaders(env = {}) {
  return {
    "access-control-allow-origin": env.CORS_ORIGIN || "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, authorization, x-elevenlabs-tool-secret",
    "access-control-max-age": "86400",
  };
}
