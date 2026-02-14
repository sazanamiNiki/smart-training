import {
  ALPHABET_SIZE,
  decrypt,
  enCrypt,
  LOWERCASE_ALPHABET,
  Mode,
  UPPERCASE_ALPHABET,
} from '../constants';

export const main = (word: string, key: string, mode: Mode) => {
  const wordAry: string[] = word.split('');
  const isWordUppercase: (boolean | null)[] = wordAry.map((alphabet) => {
    if (!/[a-zA-Z]/.test(alphabet)) return null;
    return alphabet.toUpperCase() === alphabet ? true : false;
  });

  // アルファベット以外の場合は-1が入る
  const wordNum: number[] = wordAry.map((alphabet, i) =>
    isWordUppercase[i]
      ? UPPERCASE_ALPHABET.indexOf(alphabet)
      : LOWERCASE_ALPHABET.indexOf(alphabet)
  );
  const keyNum: number[] = key
    .split('')
    .map((k) => LOWERCASE_ALPHABET.indexOf(k));

  const resultNum: number[] = [];
  let keyUsedTime: number = 0;
  for (const num of wordNum) {
    if (num < 0) {
      resultNum.push(num);
      continue;
    }

    if (mode === enCrypt) {
      const sum: number = num + keyNum[keyUsedTime % keyNum.length];
      resultNum.push(sum % ALPHABET_SIZE);
    } else if (mode === decrypt) {
      const dif: number = num - keyNum[keyUsedTime % keyNum.length];
      resultNum.push(dif < 0 ? ALPHABET_SIZE + dif : dif);
    }
    keyUsedTime++;
  }

  const result = resultNum
    .map((t, i) => {
      if (t < 0) return wordAry[i];
      if (isWordUppercase[i]) {
        return UPPERCASE_ALPHABET.charAt(t);
      } else {
        return LOWERCASE_ALPHABET.charAt(t);
      }
    })
    .join('');

  return result;
};

main('kfanidqlgtojwrmzupcxsfavid YLGBOJERMHUPKXSNAVQDYTGBWJ', 'key', 'decrypt');
