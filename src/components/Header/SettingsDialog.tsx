import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from '@mui/material';

import styles from './SettingsDialog.module.css';

const FONT_SIZE_OPTIONS = [12, 13, 14, 15, 16, 18, 20];

type Props = {
  open: boolean;
  onClose: () => void;
  layoutFlipped: boolean;
  onLayoutFlip: (flipped: boolean) => void;
  editorFontSize: number;
  onEditorFontSizeChange: (size: number) => void;
  colorMode: 'dark' | 'light';
  onColorModeChange: (mode: 'dark' | 'light') => void;
};

/**
 * Render settings dialog with layout and display preferences.
 *
 * @param open - Whether the dialog is open.
 * @param onClose - Callback to close the dialog.
 * @param layoutFlipped - Whether the editor and results panel are flipped.
 * @param onLayoutFlip - Callback when the layout flip preference changes.
 * @param editorFontSize - Current editor font size in pixels.
 * @param onEditorFontSizeChange - Callback when the editor font size changes.
 * @param colorMode - Current color mode ('dark' or 'light').
 * @param onColorModeChange - Callback when the color mode changes.
 */
export default function SettingsDialog({
  open,
  onClose,
  layoutFlipped,
  onLayoutFlip,
  editorFontSize,
  onEditorFontSizeChange,
  colorMode,
  onColorModeChange,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>設定</DialogTitle>
      <DialogContent>
        <div className={styles.betaNotice}>
          <Typography variant="caption" fontWeight={'700'}>
            <span>ベータ版: 設定はこのブラウザのみに保存されます。</span>
            <br />
          </Typography>
        </div>
        <div className={styles.colorModeRow}>
          <FormControl size="small" fullWidth>
            <InputLabel>カラーモード</InputLabel>
            <Select value={colorMode} label="カラーモード" onChange={(e) => onColorModeChange(e.target.value as 'dark' | 'light')}>
              <MenuItem value="dark">
                <div className={styles.menuItemRow}>
                  <DarkModeIcon fontSize="small" />
                  ダーク
                </div>
              </MenuItem>
              <MenuItem value="light">
                <div className={styles.menuItemRow}>
                  <LightModeIcon fontSize="small" />
                  ライト
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <FormControlLabel control={<Switch checked={layoutFlipped} onChange={(e) => onLayoutFlip(e.target.checked)} />} label="エディタを右側に表示" />
        <div className={styles.fontSizeRow}>
          <FormControl size="small" fullWidth>
            <InputLabel>エディタフォントサイズ</InputLabel>
            <Select value={editorFontSize} label="エディタフォントサイズ" onChange={(e) => onEditorFontSizeChange(e.target.value as number)}>
              {FONT_SIZE_OPTIONS.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px{size === 14 ? ' (デフォルト)' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
    </Dialog>
  );
}
