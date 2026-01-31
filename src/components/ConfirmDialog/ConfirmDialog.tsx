import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import './ConfirmDialog.scss';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  confirmColor = 'error',
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ className: 'confirm-dialog-paper', sx: { borderRadius: '8px', minWidth: 400 } }}>
      <DialogTitle className="confirm-dialog-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{title}</span>
        <IconButton onClick={onCancel} size="small" aria-label="Закрыть" className="confirm-dialog-close-btn">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="confirm-dialog-content">
        <DialogContentText className="confirm-dialog-message">{message}</DialogContentText>
      </DialogContent>
      <DialogActions className="confirm-dialog-actions">
        <Button onClick={onCancel} className="confirm-dialog-btn-cancel">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          className="confirm-dialog-btn-confirm"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

