## 課題：JSONデータからのキー探索とマスク化 🎭

### 概要
特定の形式で与えられるJSONデータ（文字列配列）を解析します。次に、指定されたキーとマスク化率のペアのリスト（`targets`）に基づき、JSONデータ内（ネスト構造を含む）を探索します。`targets`で指定された**すべてのキー**について、データ内で最初に見つかった値を指定されたルールに従ってマスク化（またはそのまま）し、その結果をキーと値のペアとして含む**単一のオブジェクト**を返します。

---
### 入力データ形式について
入力となるデータ (`rawData`) は、常に**文字列の配列 (`string[]`)** ですが、その中身の解釈が以下の2パターンあります。

1.  **形式A (HTTPS風)**:
    配列の**各要素**が、それぞれ独立したJSONオブジェクトを表す文字列です。
    ```javascript
    ['{"id": 1, "secret": "abc"}', '{"user": {"name": "Alice", "ssn": "12345"}, "id": 123}']
    ```

2.  **形式B (SSE風)**:
    配列の**最初の要素 (`rawData[0]`) のみ**を使用します。この文字列には、`data: ` プレフィックスと改行(`\n`)で区切られた複数のJSONオブジェクト文字列が含まれている可能性があります。
    ```javascript
    // rawData[0] の中身が以下のようになっている
    'data: {"id": 1, "secret": "abc"}\ndata: {"user": {"name": "Alice", "ssn": "12345"}, "id": 123}\nevent: message'
    ```
    この場合、**`data: ` で始まる行のJSON部分のみ**を解析対象とします。

    **【注意】** SSE風データが配列の複数要素に分割されている場合（例: `['data: {}', 'data: {}']`）は、**異常データ**として扱い、すべてのkeyをundefinedで返却する。

---
### あなたのミッション
提供される `main` 関数を完成させ、引数 `rawData` を解析し、その中に含まれるJSONデータから、`targets` リストで指定された**すべてのキー**について値を探索してください。
各キーについて、データ内で**最初に見つかった値**を**マスク化ルール**に従って処理します。
最終的に、**`targets`で指定されたすべてのキーをプロパティとして持ち、値が見つかった場合は処理後の値、見つからなかった場合は`undefined`を値とするオブジェクト**を返してください。

#### 実装のポイント
1.  **形式判定とJSON抽出/パース**:
    * `rawData` が形式Aか形式Bかを判定し、JSON文字列を抽出してパースします。**すべての有効なJSONオブジェクト**を処理対象とします。エラーハンドリングも考慮してください。
2.  **キーの探索**:
    * パースした各JSONデータの中を**再帰的に**探索し、`targets` リストに含まれる**すべてのキー**を探します。**最初に見つかった値のみ**を採用します（同じキーが複数箇所にあっても、2つ目以降は無視します）。
3.  **マスク化ルール**:
    * `targets`リストのキーが見つかった場合、その値の**データ型**に応じて、対応する`maskRate`に基づき以下の処理を行います。
        * **文字列 (`string`) の場合**: 値の**先頭から** `maskRate` の割合の文字数を `*` で置き換えます。文字数は**切り上げ**で計算してください。（例: 10文字で`maskRate`が`0.75`なら、`ceil(10 * 0.75) = 8`文字をマスク）
        * **数値 (`number`), 真偽値 (`boolean`), `null` の場合**: マスク化せず、**そのままの値**を返します。
        * **オブジェクト (`object`), 配列 (`array`) の場合**: マスク化せず、**そのままの値**（オブジェクトまたは配列）を返します。
4.  **結果オブジェクトの構築**:
    * `targets`で指定されたすべてのキーを含むオブジェクトを生成します。
    * 各キーに対して、探索で見つかった処理後の値（マスク化された文字列、または元の値）、または見つからなかった場合は`undefined`を設定します。

### 入出力の仕様
* **入力**:
    * `rawData: string[]`: 形式Aまたは形式Bのデータ（常に文字列配列）。
    * `targets: { key: string, maskRate: number }[]`: 検索とマスク化の設定配列。
* **出力**: `{ [key: string]: any | undefined }`
    * `targets`で指定された**すべてのキー**をプロパティとして持つオブジェクト。
    * 値は、`rawData` 内で見つかった場合は**マスク化ルールに従って処理された値**、見つからなかった場合は`undefined`。

---
### 実装例
```javascript
const targets = [
  { key: "ssn", maskRate: 1.0 },
  { key: "secret", maskRate: 0.75 },
  { key: "id", maskRate: 0 },
  { key: "isActive", maskRate: 1.0 },
  { key: "metadata", maskRate: 0.8 },
  { key: "deletedAt", maskRate: 1.0 }
];

// 形式A (HTTPS風)
const httpsData1 = [
  '{"id": 1, "secret": "abcdefgh", "isActive": true}',
  '{"user": {"name": "Alice", "ssn": "123456789", "metadata": {"tags": ["a"]}}, "id": 123, "deletedAt": null}'
];
main(httpsData1, targets);
// {
//   id: 1,
//   secret: "******gh",
//   ssn: "*********",
//   isActive: true,
//   metadata: { tags: ["a"] },
//   deletedAt: null
// } を返す

// 形式B (SSE風)
const sseData1 = ['data: {"id": 999, "isActive": false}\ndata: {"user": {"ssn": "987654321"}}'];
main(sseData1, targets);
// {
//   id: 999,
//   secret: undefined,
//   ssn: "*********",
//   isActive: false,
//   metadata: undefined,
//   deletedAt: undefined
// } を返す

// 形式B (SSE風 異常データ　配列が2以上)
const sseData2 = ['data: {}','data: {"id": 999, "isActive": false}\ndata: {"user": {"ssn": "987654321"}}'];
main(sseData2, targets);
// {
//   id: undefined,
//   secret: undefined,
//   ssn: undefined,
//   isActive: undefined,
//   metadata: undefined,
//   deletedAt: undefined
// } を返

// キーが見つからないケース
const httpsData3 = ['{"a": 1}', '{"b": 2}'];
main(httpsData3, targets);
// {
//   id: undefined,
//   secret: undefined,
//   ssn: undefined,
//   isActive: undefined,
//   metadata: undefined,
//   deletedAt: undefined
// } を返す