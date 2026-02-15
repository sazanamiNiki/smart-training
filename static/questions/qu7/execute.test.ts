import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu7', () => {
  it.each(testCases)('$name', ({ input, expected }) => {
    expect((main as unknown as (...args: unknown[]) => unknown)(...(input as unknown[]))).toEqual(expected);
  });
});
