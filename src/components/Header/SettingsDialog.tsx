import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';

const FONT_SIZE_OPTIONS = [12, 13, 14, 15, 16, 18, 20];

type Props = {
  open: boolean;
  onClose: () => void;
  layoutFlipped: boolean;
  onLayoutFlip: (flipped: boolean) => void;
  editorFontSize: number;
  onEditorFontSizeChange: (size: number) => void;
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
 */
export default function SettingsDialog({
  open,
  onClose,
  layoutFlipped,
  onLayoutFlip,
  editorFontSize,
  onEditorFontSizeChange,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>設定</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight={'700'}>
              <span>ベータ版: 設定はこのブラウザのみに保存されます。</span><br />
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={layoutFlipped}
              onChange={(e) => onLayoutFlip(e.target.checked)}
            />
          }
          label="エディタを右側に表示"
        />
        <Box sx={{ mt: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>エディタフォントサイズ</InputLabel>
            <Select
              value={editorFontSize}
              label="エディタフォントサイズ"
              onChange={(e) => onEditorFontSizeChange(e.target.value as number)}
            >
              {FONT_SIZE_OPTIONS.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px{size === 14 ? ' (デフォルト)' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
