import type { Problem } from '../types';

export interface ValidationResult {
  id: string;
  valid: boolean;
  errors: string[];
}

export function validateProblem(problem: Problem): ValidationResult {
  const errors: string[] = [];

  if (!problem.id) errors.push('id が未定義です');
  if (!problem.title) errors.push('title が未定義です');
  if (!problem.readme) errors.push('readme が未定義です');
  if (!problem.functionName) errors.push('functionName が未定義です');
  if (!problem.initialCode) errors.push('initialCode が未定義です');
  if (!problem.testCases || problem.testCases.length === 0) {
    errors.push('testCases が空です');
  } else {
    for (const [i, tc] of problem.testCases.entries()) {
      if (!Array.isArray(tc.input)) errors.push(`testCases[${i}].input が配列ではありません`);
      if (!('expected' in tc)) errors.push(`testCases[${i}].expected が存在しません`);
    }
  }
  if (problem.functionName && problem.initialCode && !problem.initialCode.includes(problem.functionName)) {
    errors.push(`initialCode に functionName "${problem.functionName}" が含まれていません`);
  }

  return { id: problem.id ?? '(unknown)', valid: errors.length === 0, errors };
}

export function validateAllProblems(problems: Problem[]): ValidationResult[] {
  return problems.map(validateProblem);
}
