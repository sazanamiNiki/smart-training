import {
  SUFFIX_FOR_CONSONANTS,
  SUFFIX_FOR_VOWELS,
  VOWELS_LOWER,
} from '../constants';

/**
 * 渡された文字列のどこが大文字か、記号の有無を精査し、素の単語に整形する関数
 * @param {string} sentence - 翻訳したい英語の文章（大文字・小文字、句読点を含む場合がある）
 * @returns {object} - 単語ごとの記号一覧配列・単語ごとの先頭から何番目の文字が大文字かの情報を格納したオブジェクト
 */
const checkSentence = (sentence: string) => {
  const words = sentence.split(' ');

  const uppercaseIndexes: number[][] = [];
  const punctuations: string[][] = [];

  words.forEach((word) => {
    const indexes: number[] = [];
    const punctuation: string[] = [];
    [...word].forEach((char, i) => {
      if (char.match(/^[A-Z]+$/)) {
        indexes.push(i);
      }
      if (/[,.!?]/.test(char)) {
        punctuation.push(char);
      }
    });

    uppercaseIndexes.push(indexes);
    punctuations.push(punctuation);
  });

  return {
    punctuations,
    uppercaseIndexes,
  };
};

/**
 * 単語一つ一つに対して翻訳処理をする関数
 * @param {string[]} words - 句読点をなくし小文字変換後の単語の配列
 * @returns {string[]} - 翻訳後の文字列の配列
 */
const translateWords = (words: string[]) => {
  const translatedWords = words.reduce((acc, word) => {
    if (new RegExp(`[${VOWELS_LOWER.join('')}]`).test(word.slice(0, 1))) {
      acc.push(`${word}${SUFFIX_FOR_VOWELS}`);
    } else {
      // 先頭のyは末尾に移動させたいため
      let moveChars = word.startsWith('y') ? 'y' : '';
      for (const char of [...word]) {
        if (new RegExp(`[${VOWELS_LOWER.join('')}y]`).test(char)) break;

        moveChars += char;
      }
      acc.push(
        `${word.replace(moveChars, '')}${moveChars}${SUFFIX_FOR_CONSONANTS}`
      );
    }

    return acc;
  }, [] as string[]);

  return translatedWords;
};

/**
 * 英語の文章を受け取り、ピッグ・ラテンのルールに従って翻訳した文章を返す。
 * @param {string} sentence - 翻訳したい英語の文章（大文字・小文字、句読点を含む場合がある）。
 * @returns {string} ピッグ・ラテンに翻訳された文章。
 */
export const main = (sentence: string) => {
  const { punctuations, uppercaseIndexes } = checkSentence(sentence);

  const allLowercaseWords = sentence
    .toLowerCase()
    .split(/[,.!?\s]+/)
    .filter(Boolean);
  const translatedWords = translateWords(allLowercaseWords);

  const result = translatedWords
    .map((word, i) => {
      const chars = Array.from(word);
      uppercaseIndexes[i].forEach(
        (index) => (chars[index] = chars[index].toUpperCase())
      );
      chars.push(...punctuations[i]);

      return chars.join('');
    })
    .join(' ');

  return result;
};

main('pig');
