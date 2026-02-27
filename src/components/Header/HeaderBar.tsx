import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FormControl, IconButton, Menu, MenuItem, Select, Typography } from '@mui/material';

import { useState } from 'react';

import { useGitHubAuth } from '../../contexts/GitHubAuthContext';
import type { Problem } from '../../types';
import styles from './HeaderBar.module.css';
import InquiryDialog from './InquiryDialog';
import SettingsDialog from './SettingsDialog';

type Props = {
  problems: Problem[];
  selectedId: string;
  onProblemChange: (id: string) => void;
  layoutFlipped: boolean;
  onLayoutFlip: (flipped: boolean) => void;
  editorFontSize: number;
  onEditorFontSizeChange: (size: number) => void;
  colorMode: 'dark' | 'light';
  onColorModeChange: (mode: 'dark' | 'light') => void;
};

/**
 * Render application header with problem selector, GitHub user info, and action menu.
 *
 * @param problems - List of available problems.
 * @param selectedId - Currently selected problem ID.
 * @param onProblemChange - Callback when problem selection changes.
 * @param layoutFlipped - Whether the editor and results panel are flipped.
 * @param onLayoutFlip - Callback when the layout flip preference changes.
 * @param editorFontSize - Current editor font size in pixels.
 * @param onEditorFontSizeChange - Callback when the editor font size changes.
 * @param colorMode - Current color mode ('dark' or 'light').
 * @param onColorModeChange - Callback when the color mode changes.
 */
export default function HeaderBar({
  problems,
  selectedId,
  onProblemChange,
  layoutFlipped,
  onLayoutFlip,
  editorFontSize,
  onEditorFontSizeChange,
  colorMode,
  onColorModeChange,
}: Props) {
  const { githubUser } = useGitHubAuth();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryMode, setInquiryMode] = useState<'contact' | 'feature-request'>('contact');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleInquiry = () => {
    closeMenu();
    setInquiryMode('contact');
    setInquiryOpen(true);
  };

  const handleFeatureRequest = () => {
    closeMenu();
    setInquiryMode('feature-request');
    setInquiryOpen(true);
  };

  const handleSettings = () => {
    closeMenu();
    setSettingsOpen(true);
  };

  return (
    <>
      <div className={styles.header}>
        <Typography variant="h2">Smart Training</Typography>
        <FormControl size="small" className={styles.selector}>
          <Select value={selectedId} onChange={(e) => onProblemChange(e.target.value)}>
            {problems.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.quId} - {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={styles.actions}>
          {githubUser && (
            <Typography variant="body2" color="text.secondary">
              {githubUser}
            </Typography>
          )}
          <IconButton
            size="small"
            onClick={() => onColorModeChange(colorMode === 'dark' ? 'light' : 'dark')}
            aria-label={colorMode === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {colorMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" onClick={openMenu} aria-label="メニューを開く">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleSettings}>設定</MenuItem>
          <MenuItem onClick={handleInquiry}>問い合わせ</MenuItem>
          <MenuItem onClick={handleFeatureRequest}>機能追加要望</MenuItem>
        </Menu>
      </div>

      <InquiryDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} mode={inquiryMode} />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        layoutFlipped={layoutFlipped}
        onLayoutFlip={onLayoutFlip}
        editorFontSize={editorFontSize}
        onEditorFontSizeChange={onEditorFontSizeChange}
        colorMode={colorMode}
        onColorModeChange={onColorModeChange}
      />
    </>
  );
}
