
import { VISA_CARD, MASTER_CARD, AMEX_CARD, ACTIVE_CARD, NONACTIVE_CARD } from './constants';

export const testCases = [
  {
    name: 'Visaとして正しく判定されるケース',
    cardNumber: '4242 4242 4242 4242',
    key: 123,
    expected: VISA_CARD,
  },
  {
    name: 'Mastercardとして正しく判定されるケース',
    cardNumber: '5123 4567 8901 2346',
    key: 101,
    expected: MASTER_CARD,
  },
  {
    name: 'American Expressとして正しく判定されるケース',
    cardNumber: '3779-863184-30142',
    key: 200,
    expected: AMEX_CARD,
  },
  {
    name: 'Luhnチェックは成功するが、ブランド判定はされないケース',
    cardNumber: '79927398713',
    key: 10,
    expected: ACTIVE_CARD,
  },
  {
    name: 'Luhnチェックで失敗するケース (チェックディジットが不正)',
    cardNumber: '4242 4242 4242 4243',
    key: 55,
    expected: NONACTIVE_CARD,
  }
];