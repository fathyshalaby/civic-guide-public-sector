export async function onRequest(context) {
  const response = await context.next(); const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff"); headers.set("referrer-policy", "no-referrer"); headers.set("permissions-policy", "microphone=(self)");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
