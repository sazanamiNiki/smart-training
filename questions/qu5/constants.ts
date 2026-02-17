type Enumerate<N extends number, Acc extends number[] = []> =
  Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type Key = Enumerate<256>;



export const ACTIVE_CARD = '有効なカード番号';
export const NONACTIVE_CARD = '無効なカード番号';

export const VISA_CARD = 'Visa';
export const MASTER_CARD = 'Mastercard';
export const AMEX_CARD = 'American Express';

export const VISA_CARD_LENGTH = 16 as const;
export const MASTER_CARD_LENGTH = 16 as const;
export const AMEX_CARD_LENGTH = 15 as const;
