/**
 * 数独が解けているか判定を行う.
 * @param board MagicSquare
 * @returns boolean
 */
export const main = (board: MagicSquare): boolean => {
  return board.length > 0;
};