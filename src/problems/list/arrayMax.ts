import type { Problem } from '../../types';

const arrayMax: Problem = {
  id: 'arrayMax',
  title: '配列の最大値',
  mode: 'fix',
  description: '数値配列から最大値を返す関数 `arrayMax` のバグを修正してください。',
  functionName: 'arrayMax',
  initialCode:
    'function arrayMax(arr: number[]): number {\n  let max = 0;\n  for (const n of arr) {\n    if (n > max) max = n;\n  }\n  return max;\n}',
  testCases: [
    { input: [[1, 3, 2]], expected: 3 },
    { input: [[-1, -3, -2]], expected: -1 },
    { input: [[5]], expected: 5 },
    { input: [[0, 0, 0]], expected: 0 },
  ],
};

export default arrayMax;
