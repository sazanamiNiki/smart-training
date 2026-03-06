CREATE TABLE submissions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT    NOT NULL,
  email         TEXT    NOT NULL,
  qu_id         TEXT    NOT NULL,
  r2_code_key   TEXT    NOT NULL,
  r2_review_key TEXT,
  review_status TEXT    NOT NULL DEFAULT 'pending',
  submitted_at  TEXT    NOT NULL,
  reviewed_at   TEXT
);
