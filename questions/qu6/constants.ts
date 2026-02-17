/* eslint-disable @typescript-eslint/no-explicit-any */

export type Target = {
  key: string;
  maskRate: number;
};



export const targetsStandard = [
  { key: "ssn", maskRate: 1.0 },
  { key: "password", maskRate: 1.0 },
  { key: "secret", maskRate: 0.75 },
  { key: "id", maskRate: 0 }
];

export const targetsExtended = [
  { key: "ssn", maskRate: 1.0 },
  { key: "secret", maskRate: 0.75 },
  { key: "id", maskRate: 0 },
  { key: "zipcode", maskRate: 0.5 },
  { key: "isActive", maskRate: 1.0 },
  { key: "metadata", maskRate: 0.8 },
  { key: "deletedAt", maskRate: 1.0 }
];

export const targetsOnlyId = [{ key: "id", maskRate: 0 }];
export const targetsOnlySecretHalfMask = [{ key: "secret", maskRate: 0.5 }];
export const targetsOnlyC = [{ key: "c", maskRate: 0 }];
export const targetsOnlyIsActive = [{ key: "isActive", maskRate: 1.0 }];
export const targetsOnlyDeletedAt = [{ key: "deletedAt", maskRate: 1.0 }];
export const targetsOnlyMetadata = [{ key: "metadata", maskRate: 0.8 }];


export const HTTPS_DATA_FULL_EXAMPLE = [
  '{"id": 1, "secret": "abcdefgh", "isActive": true}',
  '{"user": {"name": "Alice", "ssn": "123456789", "metadata": {"tags": ["a"]}}, "id": 123, "deletedAt": null}'
];
export const HTTPS_DATA_SECRET_FIRST = [
  '{"user": {"secret": "abcdefgh", "name": "Bob"}}', '{"id": 456}'
];
export const HTTPS_DATA_NESTED_C = ['{"a": {"b": {"c": "nested"}}}', '{"d": 1}'];
export const HTTPS_DATA_BOOLEAN = ['{"isActive": true, "id": 1}'];
export const HTTPS_DATA_NULL = ['{"deletedAt": null, "id": 2}'];
export const HTTPS_DATA_OBJECT = ['{"metadata": {"version": 1}, "id": 3}'];
export const HTTPS_DATA_NOT_FOUND = ['{"a": 1}', '{"b": 2}'];
export const HTTPS_DATA_EMPTY_ARRAY = [];
export const HTTPS_DATA_INVALID_JSON = ['{"id": 1}', 'this is not json', '{"secret": "abc"}'];
export const HTTPS_DATA_SECRET_SIX_CHARS = ['{"secret": "123456"}'];


// SSE Style Data
export const SSE_DATA_SSN_ID = [
  'data: {"id": 999, "isActive": false}\ndata: {"user": {"ssn": "987654321"}}'
];
export const SSE_DATA_EMPTY_STRING_IN_ARRAY = [''];
export const SSE_DATA_NO_DATA_PREFIX = ['{"id": 1}'];
export const SSE_DATA_INVALID_JSON = ['data: {}', 'data: {"id": 1}'];

