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
import type { VenueDto, VenueRequestDto } from '../../types';
import './VenueForm.scss';

interface VenueFormProps {
  open: boolean;
  venue?: VenueDto | null;
  formData: VenueRequestDto;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (data: VenueRequestDto) => void;
}

export const VenueForm = ({
  open,
  venue,
  formData,
  isLoading,
  onClose,
  onSubmit,
  onChange,
}: VenueFormProps) => {
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: 'venue-form-dialog', sx: { borderRadius: '24px' } }}
    >
      <DialogTitle className="venue-form-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{venue ? 'Редактировать заведение' : 'Создать заведение'}</span>
        <IconButton onClick={handleClose} size="small" aria-label="Закрыть" className="venue-form-close-btn">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="venue-form-content">
        <TextField
          fullWidth
          label="Название"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          margin="normal"
          required
          className="venue-form-text-field"
        />
        <TextField
          fullWidth
          label="Адрес"
          value={formData.address || ''}
          onChange={(e) => onChange({ ...formData, address: e.target.value })}
          margin="normal"
          className="venue-form-text-field"
        />
        <TextField
          fullWidth
          label="Телефон"
          value={formData.phone || ''}
          onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          margin="normal"
          className="venue-form-text-field"
        />
        <TextField
          fullWidth
          label="Описание"
          value={formData.description || ''}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={4}
          className="venue-form-text-field"
        />

        {/* Загрузка изображения */}
        <Box className="mt-6">
          <Typography variant="body2" className="text-sm font-semibold text-gray-700 mb-3">
            Изображение заведения
          </Typography>

          {imagePreview ? (
            <Box className="venue-form-image-preview">
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                className="w-full h-[200px] object-cover block"
              />
              <IconButton onClick={handleRemoveImage} className="venue-form-remove-image-btn">
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              className="venue-form-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="text-5xl text-gray-400 mb-3" />
              <Typography variant="body2" className="text-gray-500 mb-2">
                Нажмите для загрузки изображения
              </Typography>
              <Typography variant="caption" className="text-gray-400 text-xs">
                PNG, JPG до 5MB
              </Typography>
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {!imagePreview && (
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              className="venue-form-btn-outline"
            >
              Выбрать файл
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="venue-form-actions">
        <Button onClick={handleClose} className="venue-form-btn-cancel">
          Отмена
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          className="venue-form-btn-submit"
          disabled={!formData.name || isLoading}
        >
          {isLoading ? <CircularProgress size={20} className="!text-white" /> : venue ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
