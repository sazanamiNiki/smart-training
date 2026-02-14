import {
  DATA_BASIC,
  DATA_UNEVEN_SPACES,
  DATA_SINGLE_WORDS,
  DATA_LAST_LINE_MULTI,
  DATA_ERROR_OVER_LENGTH
} from './constants';


export const testCases = [
  {
    name: '正常系: 基本的な割り付け（均等・左寄せ・最終行）',
    words: DATA_BASIC.words,
    maxWidth: DATA_BASIC.maxWidth,
    expected: DATA_BASIC.expected
  },
  {
    name: '正常系: スペースが割り切れない場合（左側の隙間を広くする）',
    words: DATA_UNEVEN_SPACES.words,
    maxWidth: DATA_UNEVEN_SPACES.maxWidth,
    expected: DATA_UNEVEN_SPACES.expected
  },
  {
    name: '正常系: 1行に1単語のみの場合（右側をスペースで埋める）',
    words: DATA_SINGLE_WORDS.words,
    maxWidth: DATA_SINGLE_WORDS.maxWidth,
    expected: DATA_SINGLE_WORDS.expected
  },
  {
    name: '正常系: 最終行に複数単語がある場合（左寄せ・単語間スペース1）',
    words: DATA_LAST_LINE_MULTI.words,
    maxWidth: DATA_LAST_LINE_MULTI.maxWidth,
    expected: DATA_LAST_LINE_MULTI.expected
  },
  {
    name: '異常系: 単語の長さがmaxWidthを超えている場合',
    words: DATA_ERROR_OVER_LENGTH.words,
    maxWidth: DATA_ERROR_OVER_LENGTH.maxWidth,
    expectedError: `Word "Hello" (length 5) exceeds maxWidth (3)`
  }
];