import { validSolvedBoard, validIncompleteBoard, emptyBoard, invalidRowBoard, invalidColumnBoard, invalidBoxBoard, invalidRowWithZeros, invalidColumnWithZeros, invalidBoxWithZeros } from './constants';

export const testCases = [
  { 
    name: '正しく完成した盤面',
    input: [validSolvedBoard],
    expected: true
  },
  { 
    name: '未完成だがルール違反のない盤面',
    input: [validIncompleteBoard],
    expected: true
  },
  { 
    name: '完全に空の盤面',
    input: [emptyBoard],
    expected: true
  },
  { 
    name: '行に重複がある不正な盤面',
    input: [invalidRowBoard],
    expected: false
  },
  { 
    name: '列に重複がある不正な盤面',
    input: [invalidColumnBoard],
    expected: false
  },
  { 
    name: '3x3ブロックに重複がある不正な盤面',
    input: [invalidBoxBoard],
    expected: false
  },
  { 
    name: '行内に未回答(0)と重複が混在する不正な盤面',
    input: [invalidRowWithZeros],
    expected: false
  },
  { 
    name: '列内に未回答(0)と重複が混在する不正な盤面',
    input: [invalidColumnWithZeros],
    expected: false
  },
  { 
    name: '3x3ブロック内に未回答(0)と重複が混在する不正な盤面',
    input: [invalidBoxWithZeros],
    expected: false
  },
];
