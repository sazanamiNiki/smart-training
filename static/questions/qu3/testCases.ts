
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export const testCases = [
  {
    name: 'エンコード: 小文字・大文字・スペース・記号が混在するケース',
    input: ['key', 'Hello World!', 'encrypt'],
    expected: 'Rijvs Uyvjn!',
  },
  {
    name: 'エンコード: 大文字とスペースのみのケース',
    input: ['lemon', 'ATTACK AT DAWN', 'encrypt'],
    expected: 'LXFOPV EF RNHR',
  },
  {
    name: 'エンコード: アルファベットが末尾で循環するケース (Zの次がAになる)',
    input: ['cde', 'XYZ', 'encrypt'],
    expected: 'ZBD',
  },
  {
    name: 'エンコード: 鍵が平文より長いケース',
    input: ['secret', 'HI', 'encrypt'],
    expected: 'ZM',
  },
  {
    name: 'エンコード: 平文が空文字列のケース',
    input: ['key', '', 'encrypt'],
    expected: '',
  },
  {
    name: 'エンコード: 数字や記号が変化しないことを確認するケース',
    input: ['a', 'Test 123 Go!', 'encrypt'],
    expected: 'Test 123 Go!',
  },
  {
    name: 'エンコード: 純粋な各文字',
    input: ['key', `${LOWERCASE_ALPHABET} ${UPPERCASE_ALPHABET}`, 'encrypt'],
    expected: 'kfanidqlgtojwrmzupcxsfavid YLGBOJERMHUPKXSNAVQDYTGBWJ',
  },
  {
    name: 'デコード: 小文字・大文字・スペース・記号が混在するケース',
    input: ['key', 'Rijvs Uyvjn!', 'decrypt'],
    expected: 'Hello World!',
  },
  {
    name: 'デコード: 大文字とスペースのみのケース',
    input: ['lemon', 'LXFOPV EF RNHR', 'decrypt'],
    expected: 'ATTACK AT DAWN',
  },
  {
    name: 'デコード: アルファベットが末尾で循環するケース (Zの次がAになる)',
    input: ['cde', 'ZBD', 'decrypt'],
    expected: 'XYZ',
  },
  {
    name: 'デコード: 鍵が平文より長いケース',
    input: ['secret', 'ZM', 'decrypt'],
    expected: 'HI',
  },
  {
    name: 'デコード: 平文が空文字列のケース',
    input: ['key', '', 'decrypt'],
    expected: '',
  },
  {
    name: 'デコード: 数字や記号が変化しないことを確認するケース',
    input: ['a', 'Test 123 Go!', 'decrypt'],
    expected: 'Test 123 Go!',
  },
  {
    name: 'デコード: 純粋な各文字',
    input: ['key', 'kfanidqlgtojwrmzupcxsfavid YLGBOJERMHUPKXSNAVQDYTGBWJ', 'decrypt'],
    expected: `${LOWERCASE_ALPHABET} ${UPPERCASE_ALPHABET}`,
  },
];

