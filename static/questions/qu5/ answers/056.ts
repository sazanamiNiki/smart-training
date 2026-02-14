import {
  ACTIVE_CARD,
  AMEX_CARD,
  Key,
  MASTER_CARD,
  NONACTIVE_CARD,
  VISA_CARD,
} from '../constants';

/**
 * クレカ情報の暗号化を行う.
 *
 * @param cardNumber クレジットカード情報
 * @param key エンコードキー
 * @returns Array<number> 暗号化されたクレカ情報の配列
 */
const encrypt = (cardNumber: string, key: Key): Array<number> => {
  const encryptNumbers: number[] = cardNumber
    .split('')
    .filter((num) => Number(num) || num === '0')
    .map((num) => Number(num) ^ key);

  return encryptNumbers;
};

/**
 * 暗号化された配列化のチェックを行う.
 *
 * @param cardNumbers Array<number>
 * @returns boolean すべての文字が暗号化されているか
 */
const checkEncrypt = (
  cardNumbers: Array<number>
): cardNumbers is Array<Key> => {
  return cardNumbers.every((num) => 0 < num && num < 255);
};

/**
 * 暗号化されたカード情報を受け取り有効なクレジットカード番号かの判定を行う.
 *
 * @param cardNumbers Array<number>
 * @param key Key デコードキー
 * @returns 判定結果
 */
const decryptAndValidate = (cardNumbers: Array<number>, key: Key): string => {
  if (!checkEncrypt(cardNumbers)) {
    throw new TypeError('暗号化が正しくされていません。');
  }

  const decryptCardNumbers: number[] = cardNumbers.map((num) => num ^ key);

  const applyLuhnNum: number = decryptCardNumbers
    .map((num) => num)
    .reverse()
    .reduce((acc, cur, index) => {
      if (index % 2 !== 0) {
        const doubledNum =
          cur * 2 >= 10
            ? Number(String(cur * 2).split('')[0]) +
              Number(String(cur * 2).split('')[1])
            : cur * 2;
        return acc + doubledNum;
      } else {
        return acc + cur;
      }
    });

  if (applyLuhnNum % 10 !== 0) {
    return NONACTIVE_CARD;
  }

  const firstTwoNum: number =
    decryptCardNumbers[0] * 10 + decryptCardNumbers[1];

  switch (decryptCardNumbers.length) {
    case 16:
      if (decryptCardNumbers[0] === 4) return VISA_CARD;
      if (firstTwoNum >= 51 && firstTwoNum <= 55) return MASTER_CARD;
      break;
    case 15:
      if ([34, 37].includes(firstTwoNum)) return AMEX_CARD;
      break;
  }

  return ACTIVE_CARD;
};

export const main = (cardNumber: string, key: Key): string => {
  const encode = encrypt(cardNumber, key);
  return decryptAndValidate(encode, key);
};

main('5123 4567 8901 2346', 123);