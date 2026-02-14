/**
 * １行ごとに余白の調整を行う.
 * @param maxWidth {文字数}
 * @returns 余白の調整後の文字列
 */
const convertWords = (maxWidth: number) => (word: string): string => {
    const text = word.replaceAll(',', '');
    const count = word.length - text.length - 1;
    // 一単語の場合は末尾に余白を入れて終了
    if (count === 0) {
      return text.padEnd(maxWidth, ' ');
    }

    const diffLen = maxWidth - text.length;
    const padding = Math.floor(diffLen / count);
    if (diffLen % count === 0) {
      return word.replaceAll(',', ''.padStart(padding, ' ')).slice(0, maxWidth);
    } else {
      return Array.from(new Array(count)).reduce((str, _, index) => {
        return str.replace(',', ''.padStart(index  < diffLen % count ? padding + 1 : padding));
      }, word)
        .slice(0, maxWidth);
    }
};

const lastRowConvert = (word: string, maxWidth: number) => {
  return word.replaceAll(',', ' ').padEnd(maxWidth, ' ');
};

/**
 * 単語の配列を指定された最大幅で均等割り付け（Justify）して整形を行う。
 *
 * @param words 単語の配列。
 * @param maxWidth 1行あたりの最大文字数。
 * @returns 整形された行の配列。
 * @throws {Error} 単語の長さが maxWidth を超えている場合。
 */
export const main = (words: string[], maxWidth: number): string[] => {
  words.forEach((word) => {
    if (word.length > maxWidth) {
    throw new Error(`Word "${word}" (length ${word.length}) exceeds maxWidth (${maxWidth})`);
  }
  });

  const word = words.join(',');
  if (word.length < maxWidth) {
    return [lastRowConvert(word, maxWidth)];
  }

  const regex = new RegExp(`.{0,${maxWidth}},`, 'g');
  const convert = convertWords(maxWidth);
  const lastRow = word.replaceAll(regex, '');

  return word.match(regex)?.map(convert).concat(lastRowConvert(lastRow, maxWidth)) ?? [];
};
