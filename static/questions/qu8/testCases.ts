import {PATHS_NORMAL, PATHS_MIXED_SIBLINGS, PATHS_INTERMEDIATE_DOT, PATHS_MULTIPLE_SUB_DIRS, PATHS_CONFLICT_FILE_AS_DIR } from './constants';

export const testCases = [
  {
    name: '正常系: 衝突なし（基本）',
    input: [PATHS_NORMAL],
    expected: {
      tree: {
        home: {
          user: { files: ['memo.txt'] }
        },
        var: {
          log: {}
        }
      },
      errors: 0
    },
  },
  {
    name: '正常系: ファイルとディレクトリの混在（兄弟関係）',
    input: [PATHS_MIXED_SIBLINGS],
    expected: {
      tree: {
        project: {
          files: ['README.md'],
          dist: {},
          src: {
            files: ['index.ts'],
            components: {}
          }
        }
      },
      errors: 0
    }
  },
  {
    name: '正常系: 深いネストと中間ディレクトリのドット',
    input: [PATHS_INTERMEDIATE_DOT],
    expected: {
      tree: {
        a: {
          b: {
            c: {
              d: {
                e: { files: ['file.txt'] }
              }
            }
          }
        },
        'data.v1': {
          backup: {
            files: [
              'archive_v1.zip',
              'archive_v2.zip'
            ]
          }
        }
      },
      errors: 0
    }
  },
  {
    name: '正常系: 複数のサブディレクトリ',
    input: [PATHS_MULTIPLE_SUB_DIRS],
    expected: {
      tree: {
        usr: {
          bin: {},
          lib: {},
          local: {},
          share: {}
        }
      },
      errors: 0,
    }
  },
  {
    name: '準正常系: ファイルをディレクトリとして使用（エラー記録）',
    input: [PATHS_CONFLICT_FILE_AS_DIR],
    expected: {
      tree: {
        app: {
          files: ['config.json']
        }
      },
      errors: 1,
    }
  },
];
