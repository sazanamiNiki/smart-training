import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

type Props = {
  height?: string;
}

export const MarkdownWrapper = styled(Box)<Props>(({ theme, height }) => ({
  lineHeight: 1.6,
  wordWrap: 'break-word',
  fontSize: '1rem',
  color: theme.palette.text.primary,
  height: height ?? '65%',
  overflow: 'auto',
  '& h1, & h2, & h3': {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    lineHeight: 1.25,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: '0.3em',
  },
  '& p': {
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  '& pre': {
    padding: theme.spacing(2),
    overflow: 'auto',
    fontSize: '85%',
    lineHeight: 1.45,
    backgroundColor: theme.palette.mode === 'dark' ? '#161b22' : '#f6f8fa',
    borderRadius: '6px',
    marginBottom: theme.spacing(2),
  },
  '& code': {
    padding: '0.2em 0.4em',
    margin: 0,
    fontSize: '85%',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(110, 118, 129, 0.4)' : 'rgba(27, 31, 35, 0.05)',
    borderRadius: '3px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },
  '& pre > code': {
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    fontSize: '100%',
    wordBreak: 'normal',
    whiteSpace: 'pre',
  },
  '& table': {
    borderSpacing: 0,
    borderCollapse: 'collapse',
    width: '100%',
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  '& table th, & table td': {
    padding: '6px 13px',
    border: `1px solid ${theme.palette.divider}`,
  },
  '& table tr:nth-of-type(2n)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
  },
  '& blockquote': {
    padding: '0 1em',
    color: theme.palette.text.secondary,
    borderLeft: `0.25em solid ${theme.palette.divider}`,
    margin: `0 0 ${theme.spacing(2)} 0`,
  },
  '& ul, & ol': {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
  },
  '& li': {
    marginTop: theme.spacing(0.5),
    marginBottom: 0,
  },
  '& li > ul, & li > ol': {
    marginTop: 0,
    marginBottom: 0,
  },
}));