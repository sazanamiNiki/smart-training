
import { Key } from './constants';

/**
 * クレカ情報の暗号化を行う.
 *
 * @param key エンコードキー
 * @param cardNumber クレジットカード情報
 * @returns Array<number> 暗号化されたクレカ情報の配列
 */
const encrypt = (key: Key, cardNumber: string): Array<number> => {
  return [Number(cardNumber) as Key, key];
};

/**
 * 暗号化された配列化のチェックを行う.
 *
 * @param cardNumbers Array<number>
 * @returns boolean すべての文字が暗号化されているか
 */
const checkEncrypt = (cardNumbers: Array<number>): cardNumbers is Array<Key> => {
  return cardNumbers.every((num) => 0 < num && num > 255);
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
  return !cardNumbers && !key;
};


export const main = (key: Key, cardNumber: string): string => {
  return '';
};
