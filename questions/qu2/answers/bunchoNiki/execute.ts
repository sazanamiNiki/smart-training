
const LAST_FRAME_INDEX = 9;

const sumScore = ([fst, second]: PinCount[], next: PinCount[], extra: PinCount[] = []): number => {
  if (fst !== STRIKE_BASE_SCORE && fst + second !== SPARE_BASE_SCORE) {
    return fst + second;
  } else if (fst === STRIKE_BASE_SCORE) {
    return STRIKE_BASE_SCORE + (extra.length === 0 ? next[0] : sumScore(next, extra));
  } else {
    return extra.length === 0 ? SPARE_BASE_SCORE : SPARE_BASE_SCORE + next[0];
  }
};

/**
 * @param {BowlingFrames} frames 1ゲームの全フレームの配列
 * @returns {Array<number>} 各フレームのスコア
 */
export const main = (frames: BowlingFrames): Array<number> => {
  const [fst, second, extra] = frames[LAST_FRAME_INDEX];
  const flatFrames = frames.slice(0, 9);

  if (fst === STRIKE_BASE_SCORE) {
    flatFrames.push([fst, 0]);
    flatFrames.push([second, extra]);
  } else {
    flatFrames.push([fst, second]);
  }

  flatFrames.push([extra, 0]);

  return frames
    .map((frame, i) => sumScore(frame, flatFrames[i + 1], flatFrames[i + 2] ?? [0]))
    .reduce((a, s, i) => [...a, (a[i - 1] ?? 0) + s] , [] as Array<number>);
};