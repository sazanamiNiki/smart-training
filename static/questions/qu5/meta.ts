import type { ProblemMeta } from '../../../src/types';

export const meta: ProblemMeta = {
  id: 'encrypted-credit-card-number-checker',
  title: '暗号化されたクレジットカード番号の検証 💳',
  mode: 'create',
  description: 'XOR暗号で暗号化されたクレジットカード番号を復号し、その番号がLuhnアルゴリズムのルールに則って有効かどうか、さらにどのカードブランドに属するかを判定する `main` を実装してください。',
  functionName: 'main',
};
