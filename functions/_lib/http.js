export function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(message, status = 400, details) {
  return json({ ok: false, error: message, ...(details ? { details } : {}) }, { status });
}
