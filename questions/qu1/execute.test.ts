import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu1', () => {
  it.each(testCases)('input: $input → $expected', ({ input, expected }) => {
    expect((main as unknown as (...args: unknown[]) => unknown)(...input)).toEqual(expected);
  });
});
