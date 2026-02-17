import { Box, Button, Typography } from '@mui/material';
import type { ConsoleEntry, ConsoleLogType } from '../../types';

export interface ConsolePanelProps {
  logs: ConsoleEntry[];
  onClear: () => void;
}

const LOG_COLOR: Record<ConsoleLogType, string> = {
  log: 'text.primary',
  info: 'primary.main',
  warn: 'warning.main',
  error: 'error.main',
};

/**
 * Display console output captured during code execution.
 *
 * @param logs - Array of captured console entries.
 * @param onClear - Callback to clear the log entries.
 */
export function ConsolePanel({ logs, onClear }: ConsolePanelProps) {
  return (
    <Box
      sx={{
        height: 160,
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', mr: 'auto' }}>
          Console
        </Typography>
        <Button size="small" onClick={onClear} sx={{ minWidth: 0, px: 1, fontSize: 12 }} data-testid="console-clear">
          Clear
        </Button>
      </Box>
      <Box
        data-testid="console-output"
        sx={{
          flex: 1,
          overflow: 'auto',
          px: 2,
          py: 1,
          bgcolor: 'action.hover',
        }}
      >
        {logs.length === 0 ? (
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', fontFamily: 'monospace' }}
          >
            No output
          </Typography>
        ) : (
          logs.map((entry, i) => (
            <Typography
              key={i}
              variant="caption"
              component="div"
              sx={{
                color: LOG_COLOR[entry.type],
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                lineHeight: 1.6,
              }}
            >
              {entry.args}
            </Typography>
          ))
        )}
      </Box>
    </Box>
  );
}
