import { SUFFIX_FOR_CONSONANTS, SUFFIX_FOR_VOWELS, VOWELS_LOWER } from "../constants";

const NOT_FOUND_INDEX = -1;

/**
 * 母音（y）込みのindexの返却を行う.
 *
 * @param sentence {string}
 */
const searchVowelIndex = (word: string): number => {
  const [minIndex] = VOWELS_LOWER
    .concat('y')
    .map((vowel) => word.toLowerCase().indexOf(vowel))
    .filter((index) => index !== NOT_FOUND_INDEX)
    .sort((a, b) => a - b);

  return minIndex ?? NOT_FOUND_INDEX;
};

/**
 * 文字列結合を行う.
 *
 * @param word {変換前の文字列}
 * @param addWord {追加する文字列} SUFFIX_FOR_VOWELS | SUFFIX_FOR_CONSONANTS + 戦闘の単語
 * @param headWord 結合時の先頭の単語
 * @returns 結合後の文字列
 */
const joinWord = (word: string, addWord: string, headWord: string = word) => {
  const lastAlphabetIndex = word.search(/[^a-zA-Z]/);
  const otherWord = lastAlphabetIndex === NOT_FOUND_INDEX
    ? ''
    : word.slice(lastAlphabetIndex, word.length);

  const convertWord = headWord.replace(otherWord || /$/, addWord + otherWord);
  const lowerConvertWord = convertWord.toLowerCase();

  if (/^[a-z]/.test(word)) {
    return lowerConvertWord;
  }

  return toUpper(lowerConvertWord);
};


/**
 * 頭文字の大文字変換を行う.
 *
 * @param word {string}
 * @returns 戦闘を大文字に変更した単語
 */
const toUpper = (word: string): string => {
  const [alphabet] = word.toLowerCase();
  return word.replace(alphabet, alphabet.toUpperCase());
};

/**
 * 母音始まりの単語の変換処理.
 *
 * @param word {string}
 * @returns 変換後の単語
 */
const convertWord = (word: string, index: number): string => {
  if (index === NOT_FOUND_INDEX) {
    return word;
  }

  // 0始まりはyのみなのでindex +1
  const splitWord = word.slice(index || index + 1, word.length);
  const addAlphabet = word.slice(0, index || index + 1);
  const addWord = addAlphabet + SUFFIX_FOR_CONSONANTS;

  return joinWord(word, addWord, splitWord);
};

/**
 * 英語の文章を受け取り、ピッグ・ラテンのルールに従って翻訳した文章を返す。
 *
 * @param {string} sentence - 翻訳したい英語の文章（大文字・小文字、句読点を含む場合がある）。
 * @returns {string} ピッグ・ラテンに翻訳された文章。
 */
export const main = (sentence: string) => {
  return sentence
    .split(' ')
    .map((word: string) => {
      const [fst] = word.toLowerCase();
      const vowelIndex = searchVowelIndex(word);

      return VOWELS_LOWER.includes(fst)
        ? joinWord(word, SUFFIX_FOR_VOWELS)
        : convertWord(word, vowelIndex);
    })
    .join(' ');
};

main('What is this?');
