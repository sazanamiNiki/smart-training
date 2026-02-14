import { validSolvedBoard, validIncompleteBoard, emptyBoard, invalidRowBoard, invalidColumnBoard, invalidBoxBoard, invalidRowWithZeros, invalidColumnWithZeros, invalidBoxWithZeros } from './constants';

export const testCases = [
    { name: '正しく完成した盤面', board: validSolvedBoard, expected: true },
    { name: '未完成だがルール違反のない盤面', board: validIncompleteBoard, expected: true },
    { name: '完全に空の盤面', board: emptyBoard, expected: true },
    { name: '行に重複がある不正な盤面', board: invalidRowBoard, expected: false },
    { name: '列に重複がある不正な盤面', board: invalidColumnBoard, expected: false },
    { name: '3x3ブロックに重複がある不正な盤面', board: invalidBoxBoard, expected: false },
    { name: '行内に未回答(0)と重複が混在する不正な盤面', board: invalidRowWithZeros, expected: false },
    { name: '列内に未回答(0)と重複が混在する不正な盤面', board: invalidColumnWithZeros, expected: false },
    { name: '3x3ブロック内に未回答(0)と重複が混在する不正な盤面', board: invalidBoxWithZeros, expected: false },
  ];