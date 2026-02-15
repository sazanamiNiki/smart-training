import { useState, useEffect, useRef } from 'react';
import type { Problem, TestResult, WorkerRequest, WorkerResponse } from '../../../types';
import { saveProblemCode, loadProblemCode } from '../../../services/storage.service';

export interface UseEditorReturn {
  code: string;
  setCode: (code: string) => void;
  results: TestResult[];
  running: boolean;
  run: () => void;
}

export function useEditor(problem: Problem): UseEditorReturn {
  const [code, setCodeState] = useState<string>(
    () => loadProblemCode(problem.id) ?? problem.initialCode
  );
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../../workers/executor.worker.ts', import.meta.url),
      { type: 'module' }
    );
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const saved = loadProblemCode(problem.id);
    setCodeState(saved ?? problem.initialCode);
    setResults([]);
  }, [problem.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCode = (newCode: string) => {
    setCodeState(newCode);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveProblemCode(problem.id, newCode);
    }, 300);
  };

  const run = () => {
    if (!workerRef.current || running) return;
    setRunning(true);
    const worker = workerRef.current;
    worker.onmessage = (event) => {
      worker.onmessage = null;
      setRunning(false);
      const data = event.data as WorkerResponse;
      if (data.type === 'result') {
        setResults(data.results);
      } else {
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
    };
    const message: WorkerRequest = {
      type: 'run',
      code,
      testCode: problem.testCode,
      testCases: problem.testCases,
      functionName: problem.functionName,
      constants: problem.constants,
    };
    worker.postMessage(message);
  };

  return { code, setCode, results, running, run };
}
