import { Box, CircularProgress, Typography, List, ListItemText, ListItemButton, Collapse, Divider } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { TestResult } from "../../types";
import SubmissionArea from './SubmissionArea';

import { useState } from "react";

type Props = {
  running: boolean;
  results: TestResult[];
  code: string;
  quId: string;
};

export const Results = ({ running, results, code, quId }: Props) => {
  const allPassed = results.length > 0 && results.every((r) => r.passed);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const handleToggle = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {running ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : results.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Run を実行してテスト結果を表示
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2">
              {results.filter((r) => r.passed).length} / {results.length} passed
            </Typography>
          </Box>
          <List>
            {results.map((result, i) => {
              const open = openIndexes.includes(i);
              return (
                <Box key={i}>
                  <ListItemButton onClick={() => handleToggle(i)}>
                    <ListItemText
                      primary={`#${i + 1} : ${result.name} `}
                      secondaryTypographyProps={{
                        color: result.passed ? 'success.main' : 'error.main',
                        fontWeight: result.passed ? 500 : 700,
                      }}
                      secondary={open ? undefined : `Reslut: ${result.passed ? 'PASS' : 'FAIL'}`}
                    />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4, py: 1, backgroundColor: '#111a2e' }}>
                      <Typography variant="body2" lineHeight={2}><b>Input:</b> {JSON.stringify(result.input)}</Typography>
                      <Typography variant="body2" lineHeight={2}><b>Expected:</b> {JSON.stringify(result.expected)}</Typography>
                      <Typography variant="body2" lineHeight={2}><b>Actual:</b> {result.error ?? JSON.stringify(result.actual)}</Typography>
                      {result.error && (
                        <Typography variant="body2" color="error"><b>Error:</b> {result.error}</Typography>
                      )}
                    </Box>
                  </Collapse>
                  <Divider />
                </Box>
              );
            })}
          </List>
          {allPassed && <SubmissionArea quId={quId} code={code} />}
        </>
      )}
    </Box>
  );
};