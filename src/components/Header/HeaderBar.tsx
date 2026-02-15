import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Problem } from '../../types';
import { useGitHubAuth } from '../../contexts/GitHubAuthContext';
import InquiryDialog from './InquiryDialog';
import SettingsDialog from './SettingsDialog';

type Props = {
  problems: Problem[];
  selectedId: string;
  onProblemChange: (id: string) => void;
  onValidate?: () => void;
  isDev?: boolean;
  layoutFlipped: boolean;
  onLayoutFlip: (flipped: boolean) => void;
  editorFontSize: number;
  onEditorFontSizeChange: (size: number) => void;
};

/**
 * Render application header with problem selector, GitHub user info, and action menu.
 *
 * @param problems - List of available problems.
 * @param selectedId - Currently selected problem ID.
 * @param onProblemChange - Callback when problem selection changes.
 * @param onValidate - Callback for DEV-only validate action.
 * @param isDev - Whether running in development mode.
 * @param layoutFlipped - Whether the editor and results panel are flipped.
 * @param onLayoutFlip - Callback when the layout flip preference changes.
 * @param editorFontSize - Current editor font size in pixels.
 * @param onEditorFontSizeChange - Callback when the editor font size changes.
 */
export default function HeaderBar({
  problems,
  selectedId,
  onProblemChange,
  onValidate,
  isDev,
  layoutFlipped,
  onLayoutFlip,
  editorFontSize,
  onEditorFontSizeChange,
}: Props) {
  const { githubUser } = useGitHubAuth();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleInquiry = () => {
    closeMenu();
    setInquiryOpen(true);
  };

  const handleSettings = () => {
    closeMenu();
    setSettingsOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography variant="h2">Smart Training</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {problems.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.quId} - {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {isDev && onValidate && (
          <Button variant="outlined" size="small" onClick={onValidate}>
            Validate
          </Button>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          {githubUser && (
            <Typography variant="body2" color="text.secondary">
              {githubUser}
            </Typography>
          )}
          <IconButton size="small" onClick={openMenu} aria-label="メニューを開く">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleSettings}>設定</MenuItem>
          <MenuItem onClick={handleInquiry}>問い合わせ</MenuItem>
        </Menu>
      </Box>

      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        layoutFlipped={layoutFlipped}
        onLayoutFlip={onLayoutFlip}
        editorFontSize={editorFontSize}
        onEditorFontSizeChange={onEditorFontSizeChange}
      />
    </>
  );
}
