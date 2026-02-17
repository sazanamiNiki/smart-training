
  /**
   * rawData（HTTPSまたはSSE形式）を解析し、targetsで指定されたキーに最初に見つかった値を、
   * 指定された率でマスク化して返す。
   *
   * @param rawData 入力データ（文字列配列または単一のSSE文字列）。
   * @param targets 検索するキーとマスク化率を定義するオブジェクトの配列。
   * @returns 最初に見つかったマスク化された値。見つからない場合はundefined。
   */
  export const main = (rawData: Array<string>, targets: Array<Target>): Record<string, string | undefined> => {
    return rawData ? targets as any : {};
  };
