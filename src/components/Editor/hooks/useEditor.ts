import { useState, useRef, useCallback } from 'react';
import type { Problem, TestResult, WorkerResponse } from '../../../types';
import { initEsbuild, transformTS } from '../../../services/esbuild.service';

/**
 * Manage editor state and test execution for a given problem.
 *
 * @param problem - The problem to solve.
 * @returns Editor state and actions.
 */
export function useEditor(problem: Problem) {
  const [code, setCode] = useState(problem.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Array<TestResult> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    try {
      await initEsbuild();
      const jsCode = await transformTS(code);

      const worker = new Worker(
        new URL('../../../workers/executor.worker.ts', import.meta.url),
        { type: 'module' },
      );
      workerRef.current = worker;

      const timeout = setTimeout(() => {
        worker.terminate();
        setError('Timeout: execution exceeded 2 seconds.');
        setIsRunning(false);
      }, 2000);

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        clearTimeout(timeout);
        const response = event.data;
        if (response.ok) {
          setResults(response.results);
        } else {
          setError(response.error);
        }
        setIsRunning(false);
        worker.terminate();
      };

      worker.onerror = (e) => {
        clearTimeout(timeout);
        setError(e.message);
        setIsRunning(false);
        worker.terminate();
      };

      worker.postMessage({ code: jsCode, tests: problem.tests, functionName: problem.functionName });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setIsRunning(false);
    }
  }, [code, problem]);

  return { code, setCode, isRunning, results, error, runTests };
}
