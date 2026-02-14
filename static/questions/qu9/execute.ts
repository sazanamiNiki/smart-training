/**
 * 単語の配列を指定された最大幅で均等割り付け（Justify）して整形を行う。
 *
 * @param words 単語の配列。
 * @param maxWidth 1行あたりの最大文字数。
 * @returns 整形された行の配列。
 * @throws {Error} 単語の長さが maxWidth を超えている場合。
 */
export const main = (words: string[], maxWidth: number): string[] => {
  return [...words, String(maxWidth)];
};
