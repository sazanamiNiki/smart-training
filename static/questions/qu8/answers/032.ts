import { FileSystemResult, FileSystemTree } from '../constants';

const FIRST_INDEX = 0;
const INCREMENT = 1;

const isFileSystemTree = (result: string[] | FileSystemTree | undefined): result is FileSystemTree => {
  return !Array.isArray(result) && result !== undefined;
};

/**
 * テキストからツリー構造のオブジェクトの作成を行う.
 *
 * @param {Array<string>} dirs ツリー構造とする文字配列
 * @returns {FileSystemTree}
 */
const crateTree = (dirs: Array<string>): FileSystemTree => {
  return dirs
    .reverse()
    .reduce((df, dir, index) => {
      const path = dirs[index + INCREMENT];
      if (path === undefined) {
        return df;
      }

      if (/[.][a-zA-Z]+/.test(dir) && index === FIRST_INDEX) {
        return { [path]: { files: [dir] }};
      }

      return { [path]: { [dir]: df[dir] ?? {} }};
    }, {} as FileSystemTree);
};

/**
 * 変換後のツリー情報を結果のツリー構造に対してマージ処理を行う.
 *
 * @param {FileSystemTree} current 変換後のツリー構造のObject
 * @param {FileSystemTree} result 返却結果ののツリー構造のObject
 * @param {Array<string>} path情報
 * @returns FileSystemTree
 */
const mergeTree = (current: FileSystemTree, result: FileSystemTree, [dir, ...dirs]: Array<string>): FileSystemTree => {
  if (isFileSystemTree(result[dir]) && isFileSystemTree(current[dir]) && dirs.length > 0) {
    const { error, ...other }= mergeTree(current[dir], result[dir],  dirs);
    return { [dir]: other, error };
  }
  if (result['files']?.includes(dir) || (current['files']?.includes(dir) && Object.values(result[dir] ?? {}).length)) {
    return { ...result, error: [dir] };
  }

  const files = result['files']?.concat(current['files'] ?? []);
  return files ? { ...result, ...current, files } : { ...result, ...current };
};

/**
 * ファイルパスのリストを受け取り、ツリー構造とエラーリストを返す。
 *
 * @param paths ファイルパスの配列。
 * @returns 構築されたツリー構造と発生したエラーのリストを含むオブジェクト。
 */
export const main = (paths: string[]): FileSystemResult => {
  return paths.reduce(({ tree, errors }: FileSystemResult, path: string) => {
    const [, ...dirs] = path.split('/');

    const current = crateTree([...dirs]);
    const { error, ...currentTree } = mergeTree(current, tree, dirs);

    return {
      tree: {...tree, ...currentTree },
      errors: errors.concat(error as Array<string> ?? [])
    };
  }, { tree: {}, errors: []});
};
