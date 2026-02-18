import { Button, Typography } from '@mui/material';
import type { ConsoleEntry } from '../../types';
import styles from './ConsolePanel.module.css';

export interface ConsolePanelProps {
  logs: ConsoleEntry[];
  onClear: () => void;
}

/**
 * Display console output captured during code execution.
 *
 * @param logs - Array of captured console entries.
 * @param onClear - Callback to clear the log entries.
 */
export function ConsolePanel({ logs, onClear }: ConsolePanelProps) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Typography variant="caption" className={styles.headerLabel}>
          Console
        </Typography>
        <Button size="small" onClick={onClear} className={styles.clearBtn} data-testid="console-clear">
          Clear
        </Button>
      </div>
      <div
        data-testid="console-output"
        className={styles.output}
      >
        {logs.length === 0 ? (
          <Typography
            variant="caption"
            className={styles.noOutput}
          >
            No output
          </Typography>
        ) : (
          logs.map((entry, i) => (
            <Typography
              key={i}
              variant="caption"
              component="div"
              className={styles.logEntry}
              data-type={entry.type}
            >
              {entry.args}
            </Typography>
          ))
        )}
      </div>
    </div>
  );
}
