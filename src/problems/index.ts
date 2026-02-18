import type { Problem, ProblemMeta, TestCase } from '../types';

const metaModules = import.meta.glob('/static/questions/qu*/meta.ts', { eager: true }) as Record<string, { meta: ProblemMeta }>;
const testCaseModules = import.meta.glob('/static/questions/qu*/testCases.ts', {
  eager: true,
}) as Record<string, { testCases: TestCase[] }>;
const readmeModules = import.meta.glob('/static/questions/qu*/README.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;
const executeModules = import.meta.glob('/static/questions/qu*/execute.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;
const testCodeModules = import.meta.glob('/static/questions/qu*/execute.test.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;
const constantsModules = import.meta.glob('/static/questions/qu*/constants.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const problems: Problem[] = Object.keys(metaModules)
  .sort()
  .map((metaPath) => {
    const dir = metaPath.replace('/meta.ts', '');
    const quId = dir.split('/').pop() ?? '';
    const { meta } = metaModules[metaPath];
    const { testCases } = testCaseModules[`${dir}/testCases.ts`];
    const readme = readmeModules[`${dir}/README.md`];
    const initialCode = executeModules[`${dir}/execute.ts`];
    const testCode = testCodeModules[`${dir}/execute.test.ts`] ?? '';
    const rawConstants = constantsModules[`${dir}/constants.ts`];
    const constants = rawConstants?.replace(/^export\s+/gm, '');

    return { ...meta, quId, readme, initialCode, testCode, testCases, constants };
  });

export default problems;
