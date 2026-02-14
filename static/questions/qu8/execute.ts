/**
 * ファイルシステムのツリー構造を表す再帰的な型。
 *
 * - `files`: そのディレクトリ直下のファイル名の配列 (オプション)。
 * - `[directoryName: string]`: サブディレクトリ名。値は再び `FileSystemTree` 型。
 *
 * インデックスシグネチャ `[key: string]` が `files` プロパティの型 (`string[]`) と
 * 競合しないように、共用体型 (`|`) で定義しています。
 */
export type FileSystemTree = {
  files?: string[];
  [directoryName: string]: FileSystemTree | string[] | undefined;
};

/**
 * ファイルパスのリストを受け取り、ツリー構造とエラーリストを返す。
 *
 * @param paths ファイルパスの配列。
 * @returns 構築されたツリー構造と発生したエラーのリストを含むオブジェクト。
 */
export const main = (paths: string[]): { tree: FileSystemTree; errors: string[] } => {
  return { tree: paths.reduce((o,s) => ({ ...o, [s]: s}), {}), errors: [] };
};
