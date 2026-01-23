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
  const [imagePreview, setImagePreview] = useState<string | null>(formData.imageUrl || null);

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
        onChange({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onChange({ ...formData, imageUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setImagePreview(formData.imageUrl || null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          padding: '24px 32px',
          fontSize: '1.25rem',
        }}
      >
        {object ? 'Редактировать объект' : 'Создать объект бронирования'}
      </DialogTitle>
      <DialogContent sx={{ padding: '32px !important' }}>
        <TextField
          fullWidth
          label="Название"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          margin="normal"
          required
          sx={{
            marginBottom: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
        <TextField
          fullWidth
          label="Описание"
          value={formData.description || ''}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={3}
          sx={{
            marginBottom: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
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
          sx={{
            marginBottom: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />

        {/* Загрузка изображения */}
        <Box sx={{ marginTop: '24px' }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '12px',
            }}
          >
            Изображение объекта
          </Typography>

          {imagePreview ? (
            <Box
              sx={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #E5E7EB',
                marginBottom: '12px',
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                border: '2px dashed #D1D5DB',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#667eea',
                  backgroundColor: '#F0F4FF',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon sx={{ fontSize: '48px', color: '#9CA3AF', marginBottom: '12px' }} />
              <Typography variant="body2" sx={{ color: '#6B7280', marginBottom: '8px' }}>
                Нажмите для загрузки изображения
              </Typography>
              <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                PNG, JPG до 5MB
              </Typography>
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />

          {!imagePreview && (
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                marginTop: '12px',
                borderRadius: '12px',
                textTransform: 'none',
                borderColor: '#D1D5DB',
                color: '#374151',
                '&:hover': {
                  borderColor: '#667eea',
                  backgroundColor: '#F0F4FF',
                },
              }}
            >
              Выбрать файл
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '24px 32px', gap: '12px' }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#6B7280',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '12px',
            padding: '10px 24px',
          }}
        >
          Отмена
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '12px',
            padding: '10px 24px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
            },
            '&:disabled': {
              background: '#E5E7EB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
          }}
          disabled={!formData.name || !formData.venueId || isLoading}
        >
          {isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : object ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
