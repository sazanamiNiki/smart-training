import { VISA_CARD, VISA_CARD_LENGTH, MASTER_CARD, MASTER_CARD_LENGTH, AMEX_CARD, AMEX_CARD_LENGTH, ACTIVE_CARD, Key, NONACTIVE_CARD } from '../constants';

export const BRAND_CHECK_RULES = [
  {
    brand: VISA_CARD,
    rule: (c: string) => new RegExp('^4.*').test(c),
    length: VISA_CARD_LENGTH
  },
  {
    brand: MASTER_CARD,
    rule: (c: string) => new RegExp('^5+(1|6).*').test(c),
    length: MASTER_CARD_LENGTH
  },
  {
    brand: AMEX_CARD,
    rule:  (c: string) => new RegExp('^3+(4|7).*').test(c),
    length: AMEX_CARD_LENGTH
  }
];

/**
 * XOR暗号への変換処理を行う.
 *
 * @param keyBinary 復号/暗号用のkeyの二進数.
 * @returns Function
 */
const xorConvert = (keyBinary: string) => (str: string | number) => {
  const currentBinary = Number(str).toString(2);
  const [maxBinary, min] = [currentBinary, keyBinary].sort((a, b) => a.length > b.length ? -1 : 1);
  const addedBinary = min.padStart(maxBinary.length, '0');
  const encodeBinary = maxBinary.split('').map((s, i) => s === addedBinary[i] ? '0' : '1').join('');
  return parseInt(encodeBinary, 2);
};

/**
 * クレカ情報の暗号化を行う.
 *
 * @param cardNumber クレジットカード情報
 * @param key エンコードキー
 * @returns Array<number> 暗号化されたクレカ情報の配列
 */
const encrypt = (cardNumber: string, key: Key): Array<number> => {
  const keyBinary = key.toString(2);
  const cardNumStr = cardNumber.replaceAll(/\D+/g, '');
  return cardNumStr.split('').map(xorConvert(keyBinary));
};

/**
 * 暗号化された配列化のチェックを行う.
 *
 * @param cardNumbers Array<number>
 * @returns boolean すべての文字が暗号化されているか
 */
const checkEncrypt = (cardNumbers: Array<number>): cardNumbers is Array<Key> => {
  return !cardNumbers.every((num) => 0 < num && num > 255);
};

/**
 * 暗号化されたカード情報を受け取り有効なクレジットカード番号かの判定を行う.
 *
 * @param cardNumbers Array<number>
 * @param key Key デコードキー
 * @returns 判定結果
 */
const decryptAndValidate = (cardNumbers: Array<number>, key: Key): boolean => {
  if (!checkEncrypt(cardNumbers)) {
    throw new TypeError('暗号化が正しくされていません。');
  }
  const decodeCardNum = cardNumbers.map(xorConvert(key.toString(2)));
  const [end, ...otherCardNum] = decodeCardNum.reverse();
  const checkSum = otherCardNum
    .map((num, i) => {
      return i % 2 === 0 ? num * 2 % 10 + Math.floor(num * 2 / 10) : num;
    })
    .reduce((total, num) => total += num, 0);
  return (checkSum + end) % 10 === 0;
};



/**
 * クレジットカードのブランドの判定を行う.
 *
 * @param cardNumber クレジッドカードの文字列.
 * @returns ブランド名
 */
const checkCardBrand = (cardNumber: string): string | undefined => {
  const cardNumStr = cardNumber.replaceAll(/\D+/g, '');
  const [checked] = BRAND_CHECK_RULES.filter(({ rule, length }) => rule(cardNumStr) && cardNumStr.length === length);
  const { brand } = checked ?? {};
  return brand;
};

export const main = (cardNumber: string, key: Key): string => {
  const encode = encrypt(cardNumber, key);
  const valid = decryptAndValidate(encode, key);
  if (valid) {
    const brandName = checkCardBrand(cardNumber);
    return brandName ?? ACTIVE_CARD;
  }
  return NONACTIVE_CARD;
};

main('4992-7398-716-922', 55);