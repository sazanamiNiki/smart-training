import {PATHS_NORMAL, PATHS_MIXED_SIBLINGS, PATHS_INTERMEDIATE_DOT, PATHS_MULTIPLE_SUB_DIRS, PATHS_CONFLICT_FILE_AS_DIR, PATHS_CONFLICT_DIR_AS_FILE } from './constants';

export const testCases = [
  {
    name: '正常系: 衝突なし（基本）',
    paths: PATHS_NORMAL,
    expectedTree: {
      home: {
        user: { files: ['memo.txt'] }
      },
      var: {
        log: {}
      }
    },
    expectedErrorCount: 0,
    reason: '基本的なファイル（ドットあり）とディレクトリ（ドットなし）が正しくツリー構造に変換されるかを確認する。',
  },
  {
    name: '正常系: ファイルとディレクトリの混在（兄弟関係）',
    paths: PATHS_MIXED_SIBLINGS,
    expectedTree: {
      project: {
        files: ['README.md'],
        dist: {},
        src: {
          files: ['index.ts'],
          components: {}
        }
      }
    },
    expectedErrorCount: 0,
    reason: '同じディレクトリ直下にファイル（files配列）とサブディレクトリ（オブジェクトキー）が同居できるかを確認する。',
  },
  {
    name: '正常系: 深いネストと中間ディレクトリのドット',
    paths: PATHS_INTERMEDIATE_DOT,
    expectedTree: {
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
    expectedErrorCount: 0,
    reason: 'ドットを含む名前（data.v1）でも、パスの途中であればディレクトリとして正しく扱われるかを確認する。',
  },
  {
    name: '正常系: 複数のサブディレクトリ',
    paths: PATHS_MULTIPLE_SUB_DIRS,
    expectedTree: {
      usr: {
        bin: {},
        lib: {},
        local: {},
        share: {}
      }
    },
    expectedErrorCount: 0,
    reason: '一つの親ディレクトリの下に複数のディレクトリキーが並列で作成されるかを確認する。',
  },
  {
    name: '準正常系: ファイルをディレクトリとして使用（エラー記録）',
    paths: PATHS_CONFLICT_FILE_AS_DIR,
    expectedTree: {
      app: {
        files: ['config.json']
      }
    },
    expectedErrorCount: 1,
    reason: 'ファイルとして確定した名前をディレクトリとして掘り下げようとした場合に、既存構造を破壊せずエラーとして記録されるかを確認する。',
  },
  {
    name: '準正常系: ディレクトリとして使用後にファイルとして処理（エラー記録）',
    paths: PATHS_CONFLICT_DIR_AS_FILE,
    expectedTree: {
      app: {
        'config.json': {
          settings: {}
        }
      }
    },
    expectedErrorCount: 1,
    reason: 'ディレクトリとして処理後にファイルとして登録を行おうとする際にエラーとして記録されるかを確認する。',
  }
];
