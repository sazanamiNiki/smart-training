import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const DARK_PALETTE = {
  background: { default: '#0f172a', paper: '#111827' },
  text: { primary: '#e5e7eb', secondary: '#9ca3af' },
  divider: '#1f2937',
  border: '#1f2937',
};

const LIGHT_PALETTE = {
  background: { default: '#f8fafc', paper: '#ffffff' },
  text: { primary: '#1e293b', secondary: '#64748b' },
  divider: '#e2e8f0',
  border: '#e2e8f0',
};

/**
 * Create a MUI theme for the given color mode.
 *
 * @param mode - Color mode, either 'dark' or 'light'.
 * @returns MUI Theme object.
 */
export function createAppTheme(mode: 'dark' | 'light'): Theme {
  const p = mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
  return createTheme({
    palette: {
      mode,
      background: p.background,
      primary: { main: '#3b82f6' },
      success: { main: '#22c55e' },
      error: { main: '#ef4444' },
      warning: { main: '#f59e0b' },
      text: p.text,
      divider: p.divider,
    },
    typography: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      h1: { fontSize: '1.25rem', fontWeight: 600 },
      h2: { fontSize: '1.125rem', fontWeight: 600 },
      body1: { fontSize: '0.875rem' },
      body2: { fontSize: '0.75rem' },
      caption: { fontSize: '0.75rem' },
    },
    spacing: 8,
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${p.border}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            borderBottom: `1px solid ${p.border}`,
            padding: '6px 16px',
          },
        },
      },
    },
  });
}
