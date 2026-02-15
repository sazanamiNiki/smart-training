
export const PATHS_NORMAL: string[] = [
  '/home/user/memo.txt',
  '/var/log'
];

export const PATHS_MIXED_SIBLINGS: string[] = [
  '/project/src/index.ts',
  '/project/src/components',
  '/project/README.md',
  '/project/dist'
];

export const PATHS_INTERMEDIATE_DOT: string[] = [
  '/a/b/c/d/e/file.txt',
  '/data.v1/backup/archive_v1.zip',
  '/data.v1/backup/archive_v2.zip'
];

export const PATHS_MULTIPLE_SUB_DIRS: string[] = [
  '/usr/bin',
  '/usr/lib',
  '/usr/local',
  '/usr/share'
];

export const PATHS_CONFLICT_FILE_AS_DIR: string[] = [
  '/app/config.json',
  '/app/config.json/settings'
];


export type FileSystemTree = {
  files?: string[];
  [directoryName: string]: FileSystemTree | string[] | undefined;
};

export type FileSystemResult = {
  tree: FileSystemTree;
  errors: string[];
};
