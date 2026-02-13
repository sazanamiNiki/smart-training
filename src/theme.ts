import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#111827',
    },
    primary: {
      main: '#3b82f6',
    },
    success: {
      main: '#22c55e',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
    },
    divider: '#1f2937',
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
          border: '1px solid #1f2937',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'monospace',
          fontSize: '0.8125rem',
          borderBottom: '1px solid #1f2937',
          padding: '6px 16px',
        },
      },
    },
  },
});

export default theme;
