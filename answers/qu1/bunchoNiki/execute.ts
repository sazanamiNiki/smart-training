
/**
 * 
 * @param {string} hand 役を判定すべき手札
 * @returns {string} 役名.
 */
export const main = (hand: string): string => {
const arr = hand.split('').map(Number).sort();
  const counts: Record<number, number> = {};

  for (const digit of arr) {
    counts[digit] = (counts[digit] || 0) + 1;
  }

  const countValues = Object.values(counts).sort((a, b) => b - a);

  if (countValues[0] === 4) {
    return FOUR_OF_A_KIND;
  }

  if (countValues[0] === 3 && countValues[1] === 2) {
    return FULL_HOUSE;
  }

  let isStraight = true;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + 1) {
      isStraight = false;
      break;
    }
  }

  if (isStraight) {
    return STRAIGHT;
  }

  if (countValues[0] === 3) {
    return THREE_OF_A_KIND;
  }

  if (countValues[0] === 2 && countValues[1] === 2) {
    return TWO_PAIR;
  }

  if (countValues[0] === 2) {
    return ONE_PAIR;
  }

  return HIGH_CARD;

};