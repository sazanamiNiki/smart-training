import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Divider, ListItemButton, Typography } from '@mui/material';

import type { TestResult } from '../../types';
import styles from './TestResultRow.module.css';

type Props = {
  result: TestResult;
  index: number;
  open: boolean;
  onToggle: (index: number) => void;
};

function stringifyValue(obj: unknown): string {
  return JSON.stringify(obj, (_, value) => (value === undefined ? 'undefined' : value));
}

/**
 * Render a single test result row with expandable detail panel.
 *
 * @param result - The test result to display.
 * @param index - Zero-based index used for testid and display number.
 * @param open - Whether the detail panel is expanded.
 * @param onToggle - Callback to toggle expansion.
 */
export default function TestResultRow({ result, index, open, onToggle }: Props) {
  return (
    <div>
      <ListItemButton onClick={() => onToggle(index)} className={styles.row} data-testid={`test-result-row-${index}`}>
        <Typography variant="body2" className={result.passed ? styles.passLabel : styles.failLabel}>
          {result.passed ? 'PASS' : 'FAIL'}
        </Typography>
        <Typography variant="body2" className={styles.resultName}>
          #{index + 1} {result.name}
        </Typography>
        {open ? <ExpandLess className={styles.expandIcon} /> : <ExpandMore className={styles.expandIcon} />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <div className={result.passed ? styles.detailPass : styles.detailFail}>
          <Typography variant="body2" className={styles.detailLine}>
            <span className={styles.detailLabel}>Input:</span>
            <span className={styles.detailValue}>{stringifyValue(result.input)}</span>
          </Typography>
          <Typography variant="body2" className={styles.detailLine}>
            <span className={styles.detailLabel}>Expected:</span>
            <span className={styles.detailValue}>{stringifyValue(result.expected)}</span>
          </Typography>
          <Typography variant="body2" className={styles.detailLine}>
            <span className={styles.detailLabel}>Actual:</span>
            <span className={styles.detailValue}>{stringifyValue(result.actual)}</span>
          </Typography>
          {result.error && (
            <Typography variant="body2" className={styles.errorText}>
              Error: {result.error}
            </Typography>
          )}
          {!result.error && result.reason && (
            <Typography variant="body2" className={styles.warningText}>
              Reason: {result.reason}
            </Typography>
          )}
        </div>
      </Collapse>

      <Divider />
    </div>
  );
}
