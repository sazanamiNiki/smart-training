import { useState, useCallback } from 'react';

/**
 * A `useState`-like hook that automatically persists state changes to localStorage.
 *
 * @param loadFn - Function to load the initial value from localStorage.
 * @param saveFn - Function to persist the value to localStorage on change.
 * @returns A `[value, setValue]` tuple matching the `useState` API.
 *
 * @example
 * ```ts
 * const [fontSize, setFontSize] = usePersistedState(loadEditorFontSize, saveEditorFontSize);
 * ```
 */
export function usePersistedState<T>(
  loadFn: () => T,
  saveFn: (value: T) => void,
): [T, (value: T) => void] {
  const [value, setValueState] = useState<T>(loadFn);

  const setValue = useCallback(
    (newValue: T) => {
      setValueState(newValue);
      saveFn(newValue);
    },
    [saveFn],
  );

  return [value, setValue];
}
