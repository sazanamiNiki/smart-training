
const TEST_PIG = 'pig';
const TEST_SMILE = 'smile';
const TEST_RHYTHM = 'rhythm';
const TEST_APPLE = 'apple';
const TEST_YELLOW = 'yellow';

const TEST_PIG_CAPITAL = 'Pig';
const TEST_APPLE_CAPITAL = 'Apple';

const TEST_PIG_PUNCTUATION = 'pig!';
const TEST_SMILE_PUNCTUATION = 'smile.';
const TEST_APPLE_PUNCTUATION = 'apple,';

const TEST_SENTENCE_1 = 'Hello, world!';
const TEST_SENTENCE_2 = 'What is this?';
const TEST_SENTENCE_3 = 'Rhythm!';
const TEST_EMPTY = '';

export const testCases = [
  {
    name: 'ルール1: 単純な子音で始まる単語',
    input: [TEST_PIG],
    expected: 'igpay',
  },
  {
    name: 'ルール1: 子音群で始まる単語',
    input: [TEST_SMILE],
    expected: 'ilesmay',
  },
  {
    name: 'ルール1: "y"が母音扱いされる単語',
    input: [TEST_RHYTHM],
    expected: 'ythmrhay',
  },
  {
    name: 'ルール1: "y"が子音群として扱われる単語',
    input: [TEST_YELLOW],
    expected: 'ellowyay',
  },
  {
    name: 'ルール2: 母音で始まる単語',
    input: [TEST_APPLE],
    expected: 'appleway',
  },
  {
    name: 'ルール3: 大文字化の維持 (子音)',
    input: [TEST_PIG_CAPITAL],
    expected: 'Igpay',
  },
  {
    name: 'ルール3: 大文字化の維持 (母音)',
    input: [TEST_APPLE_CAPITAL],
    expected: 'Appleway',
  },
  {
    name: 'ルール4: 句読点の維持 (子音)',
    input: [TEST_PIG_PUNCTUATION],
    expected: 'igpay!',
  },
  {
    name: 'ルール4: 句読点の維持 (子音群)',
    input: [TEST_SMILE_PUNCTUATION],
    expected: 'ilesmay.',
  },
  {
    name: 'ルール4: 句読点の維持 (母音)',
    input: [TEST_APPLE_PUNCTUATION],
    expected: 'appleway,',
  },
  {
    name: 'ルール5: 複数の単語を含む文章 (総合)',
    input: [TEST_SENTENCE_1],
    expected: 'Ellohay, orldway!',
  },
  {
    name: 'ルール5: 複数の単語を含む文章 (総合2)',
    input: [TEST_SENTENCE_2],
    expected: 'Atwhay isway isthay?',
  },
  {
    name: 'ルール5: "y"が母音扱いの単語 (総合3)',
    input: [TEST_SENTENCE_3],
    expected: 'Ythmrhay!',
  },
  {
    name: 'エッジケース: 空文字列',
    input: [TEST_EMPTY],
    expected: '',
  },
];
