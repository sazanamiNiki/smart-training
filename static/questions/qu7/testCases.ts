
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
    input: TEST_PIG,
    expected: 'igpay',
    reason: '先頭の子音 "p" が末尾に移動し "ay" が付加されるかを確認する。',
  },
  {
    name: 'ルール1: 子音群で始まる単語',
    input: TEST_SMILE,
    expected: 'ilesmay',
    reason: '先頭の子音群 "sm" が正しく末尾に移動し "ay" が付加されるかを確認する。',
  },
  {
    name: 'ルール1: "y"が母音扱いされる単語',
    input: TEST_RHYTHM,
    expected: 'ythmrhay',
    reason: '子音群 "rh" だけが末尾に移動し、"y"が単語の先頭に残るかを確認する。',
  },
  {
    name: 'ルール1: "y"が子音群として扱われる単語',
    input: TEST_YELLOW,
    expected: 'ellowyay',
    reason: '先頭の "y" が子音群として扱われ、末尾に移動するかを確認する。',
  },
  {
    name: 'ルール2: 母音で始まる単語',
    input: TEST_APPLE,
    expected: 'appleway',
    reason: '母音で始まる単語の末尾に "way" が正しく付加されるかを確認する。',
  },
  {
    name: 'ルール3: 大文字化の維持 (子音)',
    input: TEST_PIG_CAPITAL,
    expected: 'Igpay',
    reason: '元の大文字化が変換後の単語の先頭に正しく反映されるかを確認する (Pig -> Igpay)。',
  },
  {
    name: 'ルール3: 大文字化の維持 (母音)',
    input: TEST_APPLE_CAPITAL,
    expected: 'Appleway',
    reason: '母音で始まる単語の場合、大文字化がそのまま維持されるかを確認する (Apple -> Appleway)。',
  },
  {
    name: 'ルール4: 句読点の維持 (子音)',
    input: TEST_PIG_PUNCTUATION,
    expected: 'igpay!',
    reason: '単語末尾の句読点が、変換後の単語の末尾に正しく維持されるかを確認する (pig! -> igpay!)。',
  },
  {
    name: 'ルール4: 句読点の維持 (子音群)',
    input: TEST_SMILE_PUNCTUATION,
    expected: 'ilesmay.',
    reason: '子音群を持つ単語でも、末尾の句読点が正しく維持されるかを確認する。',
  },
  {
    name: 'ルール4: 句読点の維持 (母音)',
    input: TEST_APPLE_PUNCTUATION,
    expected: 'appleway,',
    reason: '母音で始まる単語でも、末尾の句読点が正しく維持されるかを確認する。',
  },
  {
    name: 'ルール5: 複数の単語を含む文章 (総合)',
    input: TEST_SENTENCE_1,
    expected: 'Ellohay, orldway!',
    reason: '文章全体（大文字、句読点、スペース区切り）が正しく単語ごとに変換されるかを確認する総合テスト。',
  },
  {
    name: 'ルール5: 複数の単語を含む文章 (総合2)',
    input: TEST_SENTENCE_2,
    expected: 'Atwhay isway isthay?',
    reason: '子音群("Wh", "th")と母音("is")が混在する文章を正しく変換できるかを確認する。',
  },
    {
    name: 'ルール5: "y"が母音扱いの単語 (総合3)',
    input: TEST_SENTENCE_3,
    expected: 'Ythmrhay!',
    reason: '大文字化、"y"の母音扱い（子音群がRhのみ）、句読点の維持がすべて同時に正しく処理されるかを確認する。',
  },
  {
    name: 'エッジケース: 空文字列',
    input: TEST_EMPTY,
    expected: '',
    reason: '入力が空文字列の場合に、エラーなく空文字列が返されるかを確認する。',
  },
];
