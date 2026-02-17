const HAND_TYPE = {
  [4]: ONE_PAIR,
  [3]: TWO_PAIR,
  [2]: FULL_HOUSE,
};

const STRAIGHT_DIFF = 4;
const FOUR_OF_A_KIND_DIFF_LENGTH = 4;
const THREE_OF_A_KIND_DIFF_LENGTH = 3;
const FST_INDEX = 0;
const LAST_INDEX = 4;

/**
 * 役を保持するobjectのキーかの判定.
 * @param num keyかもしれない数値
 * @returns boolean 
 */
const isHandTypeKeys = (num: number): num is keyof typeof HAND_TYPE => {
  return num in HAND_TYPE;
};

/**
 * 
 * @param {string} hand 役を判定すべき手札
 * @returns {string} 役名.
 */
export const main = (hand: string): string => {
  const arr = hand.split('').map(Number).sort();
  const set = new Set(arr);
  const diff = hand.length - hand.replaceAll(String(arr[2]), '').length;

  if (set.size === 2 && diff === FOUR_OF_A_KIND_DIFF_LENGTH) {
    return FOUR_OF_A_KIND;
  }

  if (set.size === 3 && diff === THREE_OF_A_KIND_DIFF_LENGTH) {
    return THREE_OF_A_KIND;
  }

  if (isHandTypeKeys(set.size)) {
    return HAND_TYPE[set.size];  
  }

  return set.size === 5 && arr[LAST_INDEX] - arr[FST_INDEX] === STRAIGHT_DIFF
   ? STRAIGHT
   : HIGH_CARD;
};