export async function auditEvent(env = {}, event, metadata = {}) {
  if (!env.AUDIT_DB) return { persisted: false, reason: "AUDIT_DB not configured" };
  try {
    await env.AUDIT_DB.prepare("INSERT INTO audit_events (event, workflow, trace_id, metadata_json, created_at) VALUES (?, ?, ?, ?, datetime('now'))")
      .bind(event, metadata.workflow || null, metadata.traceId || null, JSON.stringify({ ...metadata, rawMessageStored: false }))
      .run();
    return { persisted: true };
  } catch (cause) {
    return { persisted: false, reason: cause.message || "audit write failed" };
  }
}
