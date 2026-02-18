import { useCallback, useEffect, useRef, useState } from 'react';

import { loadProblemCode, saveProblemCode } from '../../../services/storage.service';
import type { ConsoleEntry, Problem, TestResult, WorkerResponse } from '../../../types';
import { useWorker } from './useWorker';

export interface UseEditorReturn {
  code: string;
  setCode: (code: string) => void;
  results: TestResult[];
  running: boolean;
  run: () => void;
  consoleLogs: ConsoleEntry[];
  executing: boolean;
  execute: () => void;
  clearConsoleLogs: () => void;
}

/**
 * Manage code editing state, debounced persistence, and test / console execution.
 *
 * Worker communication is delegated to `useWorker`.
 */
export function useEditor(problem: Problem): UseEditorReturn {
  const [code, setCodeState] = useState<string>(() => loadProblemCode(problem.id) ?? problem.initialCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [executing, setExecuting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { postMessage } = useWorker();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const saved = loadProblemCode(problem.id);
    setCodeState(saved ?? problem.initialCode);
    setResults([]);
  }, [problem.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Update in-memory code and debounce-persist to localStorage. */
  const setCode = useCallback(
    (newCode: string) => {
      setCodeState(newCode);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        saveProblemCode(problem.id, newCode);
      }, 300);
    },
    [problem.id],
  );

  /** Run test cases against the current code via the worker. */
  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    postMessage(
      {
        type: 'run',
        code,
        testCode: problem.testCode,
        testCases: problem.testCases,
        functionName: problem.functionName,
        constants: problem.constants,
      },
      (data: WorkerResponse) => {
        setRunning(false);
        if (data.type === 'result') {
          setResults(data.results);
        } else if (data.type === 'error') {
          setResults([
            {
              input: [],
              name: '',
              expected: undefined,
              actual: undefined,
              passed: false,
              error: data.message,
            },
          ]);
        }
      },
    );
  }, [running, code, problem, postMessage]);

  /** Execute code (console-only) via the worker. */
  const execute = useCallback(() => {
    if (running || executing) return;
    setExecuting(true);
    setConsoleLogs([]);
    postMessage({ type: 'execute', code, constants: problem.constants }, (data: WorkerResponse) => {
      setExecuting(false);
      if (data.type === 'console-result') {
        setConsoleLogs(data.logs);
      }
    });
  }, [running, executing, code, problem.constants, postMessage]);

  const clearConsoleLogs = useCallback(() => setConsoleLogs([]), []);

  return {
    code,
    setCode,
    results,
    running,
    run,
    consoleLogs,
    executing,
    execute,
    clearConsoleLogs,
  };
}
