import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu8', () => {
  it.each(testCases)(
    '$name',
    ({ input, expected }) => {
      const result: any = (main as unknown as (...args: unknown[]) => unknown)(...(input as unknown[]));
      expect(result.tree).toMatchObject(expected.tree);
      expect(result.errors).toHaveLength(expected.errors);

      if (expected.errors > 0) {
        result.errors.forEach((err: any) => {
          expect(typeof err).toBe('string');
          expect(err.length).toBeGreaterThan(0);
        });
      }
    }
  );
});
