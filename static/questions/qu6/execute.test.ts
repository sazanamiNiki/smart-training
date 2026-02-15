import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu6', () => {
  it.each(testCases)('$name', ({ input, expected }) => {
    const actual = (main as unknown as (...args: unknown[]) => unknown)(...input);
    expect(actual).toMatchObject(expected);
  });
});