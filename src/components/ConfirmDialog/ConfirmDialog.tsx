import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

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
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          minWidth: '400px',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#111827', padding: '24px 24px 16px' }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: '0 24px' }}>
        <DialogContentText sx={{ color: '#6B7280', fontSize: '0.9375rem' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px 24px', gap: '8px' }}>
        <Button
          onClick={onCancel}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            color: '#6B7280',
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: confirmColor === 'error' ? '#DC2626' : undefined,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

