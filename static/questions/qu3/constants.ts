export const ALPHABET_SIZE = 26;

export const enCrypt = 'encrypt' as const;
export const decrypt = 'decrypt' as const;

export type Mode = typeof enCrypt  | typeof decrypt;