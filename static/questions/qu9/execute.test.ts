
import { describe, it, expect } from 'vitest';
import { main } from './execute';
import { testCases } from './testCases';

describe('テキストの均等割り付け (Text Justification)', () => {
  it.each(testCases)(
    '$name',
    ({ words, maxWidth, expected, expectedError }) => {
      if (expectedError) {
        expect(() => {
          main(words, maxWidth);
        }).toThrow(expectedError);
      } else {
        expect(main(words, maxWidth)).toEqual(expected);
      }
    }
  );
});
