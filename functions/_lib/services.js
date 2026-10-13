export async function submitCase(workflow, fields, env = {}, idempotencyKey) {
  if (!env.PUBLIC_SERVICE_API_BASE_URL || env.PUBLIC_SERVICE_MODE === "mock") {
    if (env.AUDIT_DB) {
      const existing = await env.AUDIT_DB.prepare("SELECT case_id, status, workflow, fields_json FROM civic_cases WHERE idempotency_key = ?").bind(idempotencyKey).first();
      if (existing) return { mode: "mock", caseId: existing.case_id, status: existing.status, workflow: existing.workflow, fields: JSON.parse(existing.fields_json) };
    }
    const caseId = `AT-DEMO-${idempotencyKey.replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase()}`;
    if (env.AUDIT_DB) {
      await env.AUDIT_DB.prepare("INSERT INTO civic_cases (idempotency_key, case_id, workflow, fields_json, status, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))")
        .bind(idempotencyKey, caseId, workflow, JSON.stringify(fields), "received")
        .run();
    }
    return { mode: "mock", caseId, status: "received", workflow, fields };
  }
  const url = `${env.PUBLIC_SERVICE_API_BASE_URL.replace(/\/$/, "")}${env.PUBLIC_SERVICE_SUBMIT_PATH || "/cases"}`;
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json", ...(env.PUBLIC_SERVICE_API_TOKEN ? { authorization: `Bearer ${env.PUBLIC_SERVICE_API_TOKEN}` } : {}), "x-idempotency-key": idempotencyKey }, body: JSON.stringify({ workflow, fields }) });
  if (!response.ok) throw new Error(`Public service returned ${response.status}`);
  return { mode: "live", ...(await response.json()) };
}
