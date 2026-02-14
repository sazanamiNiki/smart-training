
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export const testCases = [
  {
    name: 'READMEの例：小文字・大文字・スペース・記号が混在するケース',
    text: 'Hello World!',
    key: 'key',
    expected: 'Rijvs Uyvjn!',
  },
  {
    name: 'READMEの例：大文字とスペースのみのケース',
    text: 'ATTACK AT DAWN',
    key: 'lemon',
    expected: 'LXFOPV EF RNHR',
  },
  {
    name: 'アルファベットが末尾で循環するケース (Zの次がAになる)',
    text: 'XYZ',
    key: 'cde',
    expected: 'ZBD',
  },
  {
    name: '鍵が平文より長いケース',
    text: 'HI',
    key: 'secret',
    expected: 'ZM',
  },
  {
    name: '平文が空文字列のケース',
    text: '',
    key: 'key',
    expected: '',
  },
  {
    name: '数字や記号が変化しないことを確認するケース',
    text: 'Test 123 Go!',
    key: 'a',
    expected: 'Test 123 Go!',
  },
  {
    name: '純粋な各文字',
    text: `${LOWERCASE_ALPHABET} ${UPPERCASE_ALPHABET}`,
    key: 'key',
    expected: 'kfanidqlgtojwrmzupcxsfavid YLGBOJERMHUPKXSNAVQDYTGBWJ',
  },
];

