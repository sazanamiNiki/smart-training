/**
 * 正常系: 基本的な割り付け
 * - 均等割り振り
 * - 1単語のみの行（左寄せ）
 * - 最後の行（左寄せ）
 */
export const DATA_BASIC = {
  words: ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'],
  maxWidth: 16,
  expected: [
    'This    is    an',
    'example  of text',
    'justification.  '
  ]
};

/**
 * 正常系: スペースが均等に割り切れないケース
 * (Last Lineルールに邪魔させない)
 * 計算: 8 - 3(文字) = 5スペース。隙間2。 5/2 = 2 余り 1。左に3、右に2。
 */
export const DATA_UNEVEN_SPACES = {
  words: ["A", "B", "C", "DDDD"],
  maxWidth: 8,
  expected: [
    "A   B  C",
    "DDDD    "
  ]
};

/**
 * 正常系: 1行に1単語しか入らないケース
 */
export const DATA_SINGLE_WORDS = {
  words: ['One', 'Word', 'Per', 'Line'],
  maxWidth: 6,
  expected: [
    'One   ',
    'Word  ',
    'Per   ',
    'Line  '
  ]
};

/**
 * 正常系: 最終行が複数単語のケース
 * 要件: 均等割り付けせず、単語間スペース1で左寄せにする
 */
export const DATA_LAST_LINE_MULTI = {
  words: ['This', 'is', 'end'],
  maxWidth: 16,
  expected: [
    'This is end     '
  ]
};

/**
 * 異常系: 単語長がmaxWidthを超えているケース
 */
export const DATA_ERROR_OVER_LENGTH = {
  words: ['Hello', 'World'],
  maxWidth: 3,
};
