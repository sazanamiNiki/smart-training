import type { Problem } from '../../types';

const sum: Problem = {
  id: 'sum',
  title: '二数の合計',
  description: '2つの数値を受け取り、その合計を返す関数 `sum` を実装してください。',
  mode: 'implement',
  functionName: 'sum',
  initialCode: 'function sum(a: number, b: number): number {\n\n}',
  tests: [
    { input: [1, 2], expected: 3 },
    { input: [0, 0], expected: 0 },
    { input: [-1, 1], expected: 0 },
    { input: [100, 200], expected: 300 },
  ],
};

export default sum;
