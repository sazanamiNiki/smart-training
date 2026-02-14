/**
 * @param {BowlingFrames} frames 1ゲームの全フレームの配列
 * @returns {Array<number>} 各フレームのスコア
 */
export const main = (frames: BowlingFrames): Array<number> => {
  return frames.map(f => f[0]);
};