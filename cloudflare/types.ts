/** Cloudflare Worker binding types. */
export interface Env {
  DB: D1Database;
  REVIEW_STORAGE: R2Bucket;
  // 'local' | 'dev' | 'production'
  ENVIRONMENT: string;
  // production環境で使用
  ANTHROPIC_API_KEY: string;
  // local環境で使用
  GEMINI_API_KEY: string;
  // 全環境で使用
  GAS_WEBHOOK_URL: string;
}

/** D1 submissions table record. */
export interface Submission {
  id: number;
  user_id: string;
  email: string;
  qu_id: string;
  r2_code_key: string;
  r2_review_key: string | null;
  review_status: 'pending' | 'completed' | 'failed';
  submitted_at: string;
  reviewed_at: string | null;
}

/** D1 aggregate_reviews table record. */
export interface AggregateReview {
  id: number;
  user_id: string;
  r2_review_key: string;
  created_at: string;
}

/** Response type for GET /mypage. */
export interface MyPageResponse {
  submissions: Submission[];
  aggregateReview: AggregateReview | null;
}
