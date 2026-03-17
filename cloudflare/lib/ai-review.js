import { AGGREGATE_REVIEW_SYSTEM_PROMPT, REVIEW_SYSTEM_PROMPT } from './constants.js';

/**
 * Call Gemini API to generate a code review.
 *
 * @param env - Worker environment bindings.
 * @param code - Submitted code.
 * @param quId - Question ID.
 * @returns Review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callGeminiAPI(env, code, quId) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: REVIEW_SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: `問題ID: ${quId}\n\n提出コード:\n\`\`\`typescript\n${code}\n\`\`\``,
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Call Claude Opus API to generate a code review.
 *
 * @param env - Worker environment bindings.
 * @param code - Submitted code.
 * @param quId - Question ID.
 * @returns Review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callClaudeAPI(env, code, quId) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 2048,
      system: REVIEW_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `問題ID: ${quId}\n\n提出コード:\n\`\`\`typescript\n${code}\n\`\`\``,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

/**
 * Generate a code review based on the current environment.
 *
 * @param env - Worker environment bindings.
 * @param code - Submitted code.
 * @param quId - Question ID.
 * @returns Review markdown string.
 * @throws {Error} If the API request fails.
 */
export async function generateReview(env, code, quId) {
  if (env.ENVIRONMENT === 'production') {
    return callClaudeAPI(env, code, quId);
  }
  return callGeminiAPI(env, code, quId);
}

/**
 * Call Gemini API to generate an aggregate code review.
 *
 * @param env - Worker environment bindings.
 * @param codesWithQuId - Array of { quId, code } for all submissions.
 * @returns Aggregate review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callGeminiAggregateAPI(env, codesWithQuId) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const codeSection = codesWithQuId.map(({ quId, code }) => `### 問題ID: ${quId}\n\`\`\`typescript\n${code}\n\`\`\``).join('\n\n');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: AGGREGATE_REVIEW_SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: `以下は同一ユーザーが複数の問題に提出したコードです。全体を通して評価してください。\n\n${codeSection}`,
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Call Claude Opus API to generate an aggregate code review.
 *
 * @param env - Worker environment bindings.
 * @param codesWithQuId - Array of { quId, code } for all submissions.
 * @returns Aggregate review markdown string.
 * @throws {Error} If the API request fails.
 */
async function callClaudeAggregateAPI(env, codesWithQuId) {
  const codeSection = codesWithQuId.map(({ quId, code }) => `### 問題ID: ${quId}\n\`\`\`typescript\n${code}\n\`\`\``).join('\n\n');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: AGGREGATE_REVIEW_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `以下は同一ユーザーが複数の問題に提出したコードです。全体を通して評価してください。\n\n${codeSection}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

/**
 * Generate an aggregate review from all user submissions.
 *
 * @param env - Worker environment bindings.
 * @param codesWithQuId - Array of { quId, code } for all submissions.
 * @returns Aggregate review markdown string.
 * @throws {Error} If the API request fails.
 */
export async function generateAggregateReview(env, codesWithQuId) {
  if (env.ENVIRONMENT === 'production') {
    return callClaudeAggregateAPI(env, codesWithQuId);
  }
  return callGeminiAggregateAPI(env, codesWithQuId);
}
