import type { Problem } from '../../types';

const arrayMax: Problem = {
  id: 'arrayMax',
  title: '配列の最大値',
  description: '数値の配列を受け取り、その最大値を返す関数 `arrayMax` を実装してください。配列が空の場合は `null` を返してください。',
  mode: 'implement',
  functionName: 'arrayMax',
  initialCode: 'function arrayMax(nums: number[]): number | null {\n\n}',
  tests: [
    { input: [[1, 3, 2]], expected: 3 },
    { input: [[-1, -5, -2]], expected: -1 },
    { input: [[42]], expected: 42 },
    { input: [[]], expected: null },
  ],
};

export default arrayMax;
