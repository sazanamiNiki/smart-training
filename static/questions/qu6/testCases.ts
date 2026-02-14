import  { targetsOnlyC, targetsOnlyIsActive, targetsOnlyDeletedAt, targetsOnlyMetadata, targetsOnlySecretHalfMask, targetsExtended, targetsStandard, targetsOnlyId, HTTPS_DATA_FULL_EXAMPLE, HTTPS_DATA_SECRET_FIRST, HTTPS_DATA_NESTED_C, HTTPS_DATA_BOOLEAN, HTTPS_DATA_NULL, HTTPS_DATA_OBJECT, HTTPS_DATA_NOT_FOUND, HTTPS_DATA_EMPTY_ARRAY, HTTPS_DATA_INVALID_JSON, HTTPS_DATA_SECRET_SIX_CHARS, SSE_DATA_SSN_ID, SSE_DATA_EMPTY_STRING_IN_ARRAY, SSE_DATA_NO_DATA_PREFIX, SSE_DATA_INVALID_JSON, } from  './constants';

export const testCases = [
  {
    name: 'HTTPS形式: 複数の型が見つかるケース',
    rawData: HTTPS_DATA_FULL_EXAMPLE,
    targets: targetsExtended,
    expected: {
      id: 1,
      secret: "******gh",
      ssn: "*********",
      isActive: true,
      metadata: { tags: ["a"] },
      deletedAt: null,
      zipcode: undefined
    },
  },
    {
    name: 'HTTPS形式: secret(マスクあり)とid(マスクなし)が見つかる',
    rawData: HTTPS_DATA_SECRET_FIRST,
    targets: targetsStandard,
    expected: { ssn: undefined, password: undefined, secret: "******gh", id: 456 },
  },
  {
    name: 'HTTPS形式: ネストしたキー(c)が見つかる',
    rawData: HTTPS_DATA_NESTED_C,
    targets: targetsOnlyC,
    expected: { c: "nested" },
  },
    {
    name: 'HTTPS形式: 真偽値はマスクされない',
    rawData: HTTPS_DATA_BOOLEAN,
    targets: targetsOnlyIsActive,
    expected: { isActive: true },
  },
  {
    name: 'HTTPS形式: Null値はマスクされない',
    rawData: HTTPS_DATA_NULL,
    targets: targetsOnlyDeletedAt,
    expected: { deletedAt: null },
  },
  {
    name: 'HTTPS形式: オブジェクトはマスクされない',
    rawData: HTTPS_DATA_OBJECT,
    targets: targetsOnlyMetadata,
    expected: { metadata: { version: 1 } },
  },
  {
    name: 'HTTPS形式: targetsのキーが見つからない',
    rawData: HTTPS_DATA_NOT_FOUND,
    targets: targetsStandard,
    expected: { ssn: undefined, password: undefined, secret: undefined, id: undefined },
  },
  {
    name: 'HTTPS形式: 入力配列が空',
    rawData: HTTPS_DATA_EMPTY_ARRAY,
    targets: targetsStandard,
    expected: { ssn: undefined, password: undefined, secret: undefined, id: undefined },
  },
  {
    name: 'HTTPS形式: 不正なJSON文字列が含まれる',
    rawData: HTTPS_DATA_INVALID_JSON,
    targets: targetsOnlyId,
    expected: { id: 1 },
  },
    {
    name: 'マスク率50%のテスト (切り上げ)',
    rawData: HTTPS_DATA_SECRET_SIX_CHARS,
    targets: targetsOnlySecretHalfMask,
    expected: { secret: "***456" },
  },
  {
    name: 'SSE形式: id(数値)とssn(マスクあり)が見つかる',
    rawData: SSE_DATA_SSN_ID,
    targets: targetsExtended,
    expected: {
      id: 999,
      secret: undefined,
      ssn: "*********",
      isActive: false,
      metadata: undefined,
      deletedAt: undefined,
      zipcode: undefined
    },
  },
  {
    name: 'SSE形式: 入力配列の要素が空文字列',
    rawData: SSE_DATA_EMPTY_STRING_IN_ARRAY,
    targets: targetsStandard,
    expected: { ssn: undefined, password: undefined, secret: undefined, id: undefined },
  },
  {
    name: 'SSE形式: dataプレフィックスがない不正な形式',
    rawData: SSE_DATA_NO_DATA_PREFIX,
    targets: targetsOnlyId,
    expected: { id: 1 },
  },
  {
    name: 'SSE形式: 不正なJSONが含まれる',
    rawData: SSE_DATA_INVALID_JSON,
    targets: targetsOnlyId,
    expected: { id: undefined },
  },
];
