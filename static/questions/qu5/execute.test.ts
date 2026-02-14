import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu5', () => {
  it.each(testCases)('$name', ({ key, cardNumber, expected }) => {
    expect((main as unknown as (...args: unknown[]) => unknown)(key, cardNumber)).toEqual(expected);
  });
});
