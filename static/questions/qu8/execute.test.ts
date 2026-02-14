import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('qu8', () => {
  it.each(testCases)(
    '$name',
    ({ paths, expectedTree, expectedErrorCount }) => {
      const result = main(paths);
      expect(result.tree).toEqual(expectedTree);
      expect(result.errors).toHaveLength(expectedErrorCount);

      if (expectedErrorCount > 0) {
        result.errors.forEach((err: any) => {
          expect(typeof err).toBe('string');
          expect(err.length).toBeGreaterThan(0);
        });
      }
    }
  );
});
