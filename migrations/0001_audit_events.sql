CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  workflow TEXT,
  trace_id TEXT,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS audit_events_created_at_idx ON audit_events(created_at);
CREATE INDEX IF NOT EXISTS audit_events_workflow_idx ON audit_events(workflow);

CREATE TABLE IF NOT EXISTS civic_cases (
  idempotency_key TEXT PRIMARY KEY,
  case_id TEXT NOT NULL UNIQUE,
  workflow TEXT NOT NULL,
  fields_json TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS civic_cases_created_at_idx ON civic_cases(created_at);
