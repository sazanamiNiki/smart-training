CREATE TABLE aggregate_reviews (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT    NOT NULL,
  r2_review_key TEXT    NOT NULL,
  created_at    TEXT    NOT NULL
);
