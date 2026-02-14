import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu6', () => {
  it.each(testCases)('$name', ({ rawData, targets, expected }) => {
    expect((main as unknown as (...args: unknown[]) => unknown)(rawData, targets)).toEqual(expected);
  });
});
