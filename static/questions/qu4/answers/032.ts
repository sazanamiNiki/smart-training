import { MagicSquare, Numbers } from '../constants';

const NON_ANSWERED = 0;

/**
 * 行列のそれぞれのindexから3^2の方陣のindexの算出を行う.
 * @param rawIndex 行のindex
 * @param columnIndex 列のindex
 * @returns 
 */
const convertSquareIndex = (rawIndex: number, columnIndex: number) => {
  return Math.floor(rawIndex / 3) * 3 + Math.floor(columnIndex / 3);
};

/**
 * 検証用の配列の0以外の値の重複判定を行う.
 * @param group 検証用の数字の配列 
 * @returns boolean ? 重複なし : 重複あり
 */
const isValidGroup = (group: Array<Numbers>): boolean => {
  const answersNumber = group.filter(n => n !== NON_ANSWERED);
  return Array.from(new Set(answersNumber)).length === answersNumber.length;
};

/**
 * 数独が解けているか判定を行う.
 * @param board MagicSquare
 * @returns boolean
 */
export const main = (board: MagicSquare): boolean => {
  const columns: MagicSquare = board.map(() => []);
  const squares: MagicSquare = board.map(() => []);

  board.forEach((line, rowIndex) => {
    line.forEach((currentNumber, columnIndex) => {
      if (currentNumber === NON_ANSWERED) {
        return;
      }
      const squareIndex = convertSquareIndex(rowIndex, columnIndex);
      const square = squares[squareIndex];

      squares[squareIndex] = [...square, currentNumber];
      columns[columnIndex][rowIndex] = currentNumber;
    });

  });

  return [...columns, ...squares, ...board].every(isValidGroup);
};

main([[]]);