import { useEffect, useRef, useCallback } from 'react';
import type { WorkerRequest, WorkerResponse } from '../../../types';

export interface UseWorkerReturn {
  /** Send a message to the worker and receive a single response via callback. */
  postMessage: (message: WorkerRequest, onResponse: (data: WorkerResponse) => void) => void;
  /** Whether the worker is ready to accept messages. */
  ready: boolean;
}

/**
 * Manage a Web Worker lifecycle (creation, messaging, termination).
 *
 * The worker is instantiated on mount and terminated on unmount.
 * Each `postMessage` call registers a one-shot `onmessage` handler so that
 * the caller receives exactly one response per request.
 */
export function useWorker(): UseWorkerReturn {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../../workers/executor.worker.ts', import.meta.url),
      { type: 'module' },
    );
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const postMessage = useCallback(
    (message: WorkerRequest, onResponse: (data: WorkerResponse) => void) => {
      const worker = workerRef.current;
      if (!worker) return;
      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        worker.onmessage = null;
        onResponse(event.data);
      };
      worker.postMessage(message);
    },
    [],
  );

  return { postMessage, ready: true };
}
