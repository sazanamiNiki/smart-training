import  { targetsOnlyC, targetsOnlyIsActive, targetsOnlyDeletedAt, targetsOnlyMetadata, targetsOnlySecretHalfMask, targetsExtended, targetsStandard, targetsOnlyId, HTTPS_DATA_FULL_EXAMPLE, HTTPS_DATA_SECRET_FIRST, HTTPS_DATA_NESTED_C, HTTPS_DATA_BOOLEAN, HTTPS_DATA_NULL, HTTPS_DATA_OBJECT, HTTPS_DATA_NOT_FOUND, HTTPS_DATA_EMPTY_ARRAY, HTTPS_DATA_INVALID_JSON, HTTPS_DATA_SECRET_SIX_CHARS, SSE_DATA_SSN_ID, SSE_DATA_EMPTY_STRING_IN_ARRAY, SSE_DATA_NO_DATA_PREFIX, SSE_DATA_INVALID_JSON, } from  './constants';

export const testCases = [
  {
    name: 'HTTPS形式: 複数の型が見つかるケース',
    input: [HTTPS_DATA_FULL_EXAMPLE, targetsExtended],
    expected: { id: 1, secret: "******gh", ssn: "*********", isActive: true, metadata: { tags: ["a"] }, deletedAt: null, zipcode: undefined },
  },
  {
    name: 'HTTPS形式: secret(マスクあり)とid(マスクなし)が見つかる',
    input: [HTTPS_DATA_SECRET_FIRST, targetsStandard],
    expected: { ssn: undefined, password: undefined, secret: "******gh", id: 456 },
  },
  {
    name: 'HTTPS形式: ネストしたキー(c)が見つかる',
    input: [HTTPS_DATA_NESTED_C, targetsOnlyC],
    expected: { c: "nested" },
  },
  {
    name: 'HTTPS形式: 真偽値はマスクされない',
    input: [HTTPS_DATA_BOOLEAN, targetsOnlyIsActive],
    expected: { isActive: true },
  },
  {
    name: 'HTTPS形式: Null値はマスクされない',
    input: [HTTPS_DATA_NULL, targetsOnlyDeletedAt],
    expected: { deletedAt: null },
  },
  {
    name: 'HTTPS形式: オブジェクトはマスクされない',
    input: [HTTPS_DATA_OBJECT, targetsOnlyMetadata],
    expected: { metadata: { version: 1 } },
  },
  {
    name: 'HTTPS形式: targetsのキーが見つからない',
    input: [HTTPS_DATA_NOT_FOUND, targetsStandard],
    expected: { ssn: undefined, password: undefined, secret: undefined, id: undefined },
  },
  {
    name: 'HTTPS形式: 入力配列が空',
    input: [HTTPS_DATA_EMPTY_ARRAY, targetsStandard],
    expected: { ssn: undefined, password: undefined, secret: undefined, id: undefined },
  },
  {
    name: 'HTTPS形式: 不正なJSON文字列が含まれる',
    input: [HTTPS_DATA_INVALID_JSON, targetsOnlyId],
    expected: { id: 1 },
  },
  {
    name: 'マスク率50%のテスト (切り上げ)',
    input: [HTTPS_DATA_SECRET_SIX_CHARS, targetsOnlySecretHalfMask],
    expected: { secret: "***456" },
  },
  {
    name: 'SSE形式: id(数値)とssn(マスクあり)が見つかる',
    input: [SSE_DATA_SSN_ID, targetsExtended],
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
    input: [SSE_DATA_EMPTY_STRING_IN_ARRAY, targetsStandard],
    expected: { ssn: undefined, password: undefined, secret: undefined, id: undefined },
  },
  {
    name: 'SSE形式: dataプレフィックスがない不正な形式',
    input: [SSE_DATA_NO_DATA_PREFIX, targetsOnlyId],
    expected: { id: 1 },
  },
  {
    name: 'SSE形式: 不正なJSONが含まれる',
    input: [SSE_DATA_INVALID_JSON, targetsOnlyId],
    expected: { id: undefined },
  },
];
