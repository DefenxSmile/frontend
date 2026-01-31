import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { ReservationObjectDto, ReservationObjectRequestDto } from '../../types';
import './ReservationObjectForm.scss';

interface ReservationObjectFormProps {
  open: boolean;
  object?: ReservationObjectDto | null;
  formData: ReservationObjectRequestDto;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: ReservationObjectRequestDto) => void;
}

export const ReservationObjectForm = ({
  open,
  object,
  formData,
  isLoading,
  onClose,
  onSubmit,
  onChange,
}: ReservationObjectFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.image?.url ?? null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }

      // Проверяем размер файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
      }

      // Создаем preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onChange({ ...formData, image: { id: 0, url: result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onChange({ ...formData, image: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setImagePreview(formData.image?.url ?? null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: 'reservation-object-form-dialog', sx: { borderRadius: '24px' } }}>
      <DialogTitle className="reservation-object-form-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{object ? 'Редактировать объект' : 'Создать объект бронирования'}</span>
        <IconButton onClick={handleClose} size="small" aria-label="Закрыть" className="reservation-object-form-close-btn">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="reservation-object-form-content">
        <TextField
          fullWidth
          label="Название"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          margin="normal"
          required
          className="reservation-object-form-text-field"
        />
        <TextField
          fullWidth
          label="Описание"
          value={formData.description || ''}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={3}
          className="reservation-object-form-text-field"
        />
        <TextField
          fullWidth
          label="Вместимость (чел.)"
          type="number"
          value={formData.capacity || ''}
          onChange={(e) =>
            onChange({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })
          }
          margin="normal"
          inputProps={{ min: 1 }}
          className="reservation-object-form-text-field"
        />

        <Box className="mt-6">
          <Typography variant="body2" className="text-sm font-semibold text-gray-700 mb-3">
            Изображение объекта
          </Typography>
          {imagePreview ? (
            <Box className="reservation-object-form-image-preview">
              <Box component="img" src={imagePreview} alt="Preview" className="w-full h-[200px] object-cover block" />
              <IconButton onClick={handleRemoveImage} className="reservation-object-form-remove-image-btn">
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className="reservation-object-form-upload-zone" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="text-5xl text-gray-400 mb-3" />
              <Typography variant="body2" className="text-gray-500 mb-2">
                Нажмите для загрузки изображения
              </Typography>
              <Typography variant="caption" className="text-gray-400 text-xs">
                PNG, JPG до 5MB
              </Typography>
            </Box>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {!imagePreview && (
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              className="reservation-object-form-btn-outline"
            >
              Выбрать файл
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="reservation-object-form-actions">
        <Button onClick={handleClose} className="reservation-object-form-btn-cancel">
          Отмена
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          className="reservation-object-form-btn-submit"
          disabled={!formData.name || !formData.venueId || isLoading}
        >
          {isLoading ? <CircularProgress size={20} className="!text-white" /> : object ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
