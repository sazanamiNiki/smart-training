
import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu9', () => {
  it.each(testCases)(
    '$name',
    ({ input, expected, expectedError }) => {
      if (expectedError) {
        expect(() => {
          (main as unknown as (...args: unknown[]) => unknown)(...input);
        }).toThrow(expected);
      } else {
        expect((main as unknown as (...args: unknown[]) => unknown)(...(input as unknown[]))).toEqual(expected);
      }
    }
  );
});
