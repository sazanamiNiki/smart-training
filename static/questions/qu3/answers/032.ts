import { ALPHABET_SIZE, decrypt, enCrypt, LOWERCASE_ALPHABET, Mode, UPPERCASE_ALPHABET } from '../constants';


const ALPHABET = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET;

/**
 * keyを参照しやすいMapへの変換処理を行う.
 * @param key 変換用のキー
 * @returns 変換後の対応する数値のMap
 */
const convertKeyMap = (key: string): Record<number, number> => {
  return [...key].reduce((m, s, i) => ({ ...m, [i]: LOWERCASE_ALPHABET.indexOf(s) }), {});
};

const getIndex = (textIndex: number, keyIndex: number): number => {
  // 大文字小文字の処理をスキップするために大文字の場合は+26して大文字のある番地に変換
  const added = ALPHABET_SIZE * Math.floor(textIndex / ALPHABET_SIZE);

  const shiftedIndex = textIndex % ALPHABET_SIZE + keyIndex;
  const newNormalizedIndex = (shiftedIndex % ALPHABET_SIZE + ALPHABET_SIZE) % ALPHABET_SIZE;

  return newNormalizedIndex + added;
};

/**
 * 中間処理を
 */
const logic: Record<Mode, typeof getIndex> = {
  [decrypt]: (textIndex, keyIndex) => getIndex(textIndex, (keyIndex + ALPHABET_SIZE) * -1),
  [enCrypt]: getIndex
};

export const main = (word: string, key: string, mode: Mode) => {
  const keyMap = convertKeyMap(key);
  let skipCount = 0;

  const strArr = [...word].map((char, index) => {
    if (!/^[a-zA-Z]+$/.test(char)) {
      skipCount++;
      return char;
    }

    const wordIndex = ALPHABET.indexOf(char);
    const keyIndex = keyMap[(index - skipCount) % Object.keys(keyMap).length];
    const charIndex = logic[mode](wordIndex, keyIndex);

    return ALPHABET.slice(charIndex, charIndex  + 1);
  });

  return strArr.join('');
};

main('Hello World!', 'key', 'encrypt');