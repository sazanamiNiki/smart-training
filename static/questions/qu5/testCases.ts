
import { VISA_CARD, MASTER_CARD, AMEX_CARD, ACTIVE_CARD, NONACTIVE_CARD } from './constants';

export const testCases = [
  {
    name: 'Visaとして正しく判定されるケース',
    input: [123, '4242 4242 4242 4242'],
    expected: VISA_CARD,
  },
  {
    name: 'Mastercardとして正しく判定されるケース',
    input: [101, '5123 4567 8901 2346'],
    expected: MASTER_CARD,
  },
  {
    name: 'American Expressとして正しく判定されるケース',
    input: [200, '3779-863184-30142'],
    expected: AMEX_CARD,
  },
  {
    name: 'Luhnチェックは成功するが、ブランド判定はされないケース',
    input: [10, '79927398713'],
    expected: ACTIVE_CARD,
  },
  {
    name: 'Luhnチェックで失敗するケース (チェックディジットが不正)',
    input: [55, '4242 4242 4242 4243'],
    expected: NONACTIVE_CARD,
  }
];
