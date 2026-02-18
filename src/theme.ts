import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const DARK_PALETTE = {
  background: { default: '#0f172a', paper: '#111827' },
  text: { primary: '#e5e7eb', secondary: '#9ca3af', disabled: 'rgba(255, 255, 255, 0.5)' },
  divider: '#1f2937',
  border: '#1f2937',
  actionHover: 'rgba(255, 255, 255, 0.08)',
  codeBg: 'rgba(110, 118, 129, 0.4)',
  preBg: '#161b22',
  tableStripeBg: '#0d1117',
};

const LIGHT_PALETTE = {
  background: { default: '#f8fafc', paper: '#ffffff' },
  text: { primary: '#1e293b', secondary: '#64748b', disabled: 'rgba(0, 0, 0, 0.38)' },
  divider: '#e2e8f0',
  border: '#e2e8f0',
  actionHover: 'rgba(0, 0, 0, 0.04)',
  codeBg: 'rgba(27, 31, 35, 0.05)',
  preBg: '#f6f8fa',
  tableStripeBg: '#f6f8fa',
};

/**
 * Create a MUI theme for the given color mode.
 *
 * @param mode - Color mode, either 'dark' or 'light'.
 * @returns MUI Theme object.
 */
/**
 * Inject CSS custom properties derived from theme palette into :root.
 * Called once on app boot and whenever the color mode changes.
 */
export function applyCssVariables(mode: 'dark' | 'light'): void {
  const p = mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;
  const root = document.documentElement;
  root.style.setProperty('--bg-default', p.background.default);
  root.style.setProperty('--bg-paper', p.background.paper);
  root.style.setProperty('--text-primary', p.text.primary);
  root.style.setProperty('--text-secondary', p.text.secondary);
  root.style.setProperty('--text-disabled', p.text.disabled);
  root.style.setProperty('--color-primary', '#3b82f6');
  root.style.setProperty('--color-success', '#22c55e');
  root.style.setProperty('--color-error', '#ef4444');
  root.style.setProperty('--color-warning', '#f59e0b');
  root.style.setProperty('--color-divider', p.divider);
  root.style.setProperty('--color-border', p.border);
  root.style.setProperty('--action-hover', p.actionHover);
  root.style.setProperty('--code-bg', p.codeBg);
  root.style.setProperty('--pre-bg', p.preBg);
  root.style.setProperty('--table-stripe-bg', p.tableStripeBg);
}

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
