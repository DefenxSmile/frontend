import { useState, useCallback, useRef } from 'react';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({
    title: '',
    message: '',
  });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(options);
      resolveRef.current = resolve;
      setOpen(true);
    });
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  return {
    open,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

