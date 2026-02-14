/* eslint-disable @typescript-eslint/no-explicit-any */
import { Target } from '../constants';


/**
 * SSE通信データ内容か判定を行う.
 *
 * @param str 検証文字列.
 * @returns boolean
 */
const sseReg = (str: string): boolean => /^data: {/.test(str);

const flatArray = (arr: Array<any>) => {
  return arr.reduce((obj, v) => ({ ...obj, ...(v instanceof Object ? v : { [v]: v }) }), {});
};

/**
 * JSONデータの配列から引数のkeyの情報を取得.
 *
 * @param data JSONデータの配列.
 * @param key 取得する値のkey
 */
const findValue = (rawData: Array<string>, key: string): string | undefined => {
  if (rawData.length === 0) {
    return undefined;
  }

  const data = rawData.every(sseReg) ? trimData(rawData) : rawData;
  const req = new RegExp(`"${key}":`);
  const [jsonData] = data.filter((raw) => req.test(raw));

  if (jsonData === undefined) {
    return undefined;
  }

  try {
    const json = JSON.parse(jsonData);
    if (Object.keys(json).includes(key)) {
      return json[key];
    }

    // 再起呼び出し
    const nextRowData = Object
      .values(json)
      .filter((o) =>  o instanceof Object)
      .map((o) => Array.isArray(o) ? flatArray(o) : o)
      // 再起処理のためにArray<String>へ
      .map((o) => JSON.stringify(o));

    return findValue(nextRowData, key);
  } catch {
    return undefined;
  }
};

/**
 * SSE通信のデータを通常通信と同じように生計を行う.
 *
 * @param rawData SSE通信データ
 * @returns Array<string>
 */
const trimData = (rawData: Array<string>): Array<string> => {
  if (rawData.length && rawData.length > 1) {
    return [];
  }

  return rawData[0]
    .split('\n')
    .filter(sseReg)
    .map((s) => s.replace(/^data: /, ''));
};

/**
 * 引数の値を利用して値のマスクかを行う.
 *
 * @param value 取得した値
 * @param rate マスク率
 */
const maskedValue = (value: any, rate: number): any => {
  if (typeof value  !== 'string') {
    return value;
  }
  return value?.split('').reduce<string>((str, char, index) =>  {
    return str += (index + 1) / value.length <= rate ? '*' : char;
  }, '');
};

/**
 * rawData（HTTPSまたはSSE形式）を解析し、targetsで指定されたキーに最初に見つかった値を、
 * 指定された率でマスク化して返す。
 *
 * @param rawData 入力データ（文字列配列または単一のSSE文字列）。
 * @param targets 検索するキーとマスク化率を定義するオブジェクトの配列。
 * @returns 最初に見つかったマスク化された値。見つからない場合はundefined。
 */
export const main = (rawData: Array<string>, targets: Array<Target>): Record<string, string | undefined> => {
  return targets.reduce<Record<string, string | undefined>>((obj, { key, maskRate }) =>{
    const value = findValue(rawData, key);
    return { ...obj, [key]: maskedValue(value, maskRate) };
  }, {});
};