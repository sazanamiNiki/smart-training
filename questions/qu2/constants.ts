export const STRIKE_BASE_SCORE = 10;
export const SPARE_BASE_SCORE = 10;

export const FIRST_THROW = 0;
export const SECOND_THROW = 1;
export const THIRD_THROW = 2;

export const NOT_THROW_BASE_SCORE = 0;
export const NEXT_FRAME = 1;
export const FIRST_FRAME = 0;
export const FINAL_FRAME = 9;

export type PinCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Tuple<T, N extends number, R extends T[] = []> =
  R['length'] extends N
  ? R
  : Tuple<T, N, [...R, T]>;

export type RegularFrame = [PinCount, PinCount];

export type FinalFrame = [PinCount, PinCount, PinCount];

export type FirstNineFrames = Tuple<RegularFrame, 9>;

export type BowlingFrames = [...FirstNineFrames, FinalFrame];