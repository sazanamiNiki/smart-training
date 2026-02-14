import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu3', () => {
  it.each(testCases)('$name', ({ key, text, expected }) => {
    expect((main as unknown as (...args: unknown[]) => unknown)(key, text)).toEqual(expected);
  });
});
