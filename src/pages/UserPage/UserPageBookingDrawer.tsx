import { Box, Drawer, Typography, IconButton, Button, TextField, FormControl, Select, MenuItem, Chip } from '@mui/material';
import { Close as CloseIcon, CalendarToday as CalendarIcon, AccessTime as TimeIcon, Person as PersonIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CircularProgress } from '@mui/material';
import type { ReservationObjectDto } from '../../types';

export interface UserPageBookingDrawerFormState {
  selectedObject: ReservationObjectDto | null;
  selectedDate: Date | null;
  selectedTime: string;
  guests: number;
  clientName: string;
  clientPhone: string;
  notes: string;
}

interface UserPageBookingDrawerProps {
  open: boolean;
  formState: UserPageBookingDrawerFormState;
  timeSlots: string[];
  isPending: boolean;
  onClose: () => void;
  onBook: () => void;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
  onGuestsChange: (guests: number) => void;
  onClientNameChange: (value: string) => void;
  onClientPhoneChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export const UserPageBookingDrawer = ({
  open,
  formState,
  timeSlots,
  isPending,
  onClose,
  onBook,
  onDateChange,
  onTimeChange,
  onGuestsChange,
  onClientNameChange,
  onClientPhoneChange,
  onNotesChange,
}: UserPageBookingDrawerProps) => {
  const { selectedObject, selectedDate, selectedTime, guests, clientName, clientPhone, notes } = formState;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'user-page-drawer-paper',
        sx: { padding: 0, width: { xs: '100%', sm: 480 } },
      }}
    >
      <Box className="user-page-drawer-root">
        <Box className="user-page-drawer-header">
          <Typography variant="h5" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
            Бронирование стола
          </Typography>
          <IconButton onClick={onClose} className="user-page-drawer-close-btn">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className="user-page-drawer-content">
          {selectedObject && (
            <Box className="user-page-form-block" style={{ marginBottom: 24 }}>
              {selectedObject.images?.[0]?.url ? (
              <Box
                  component="img"
                  src={selectedObject.images[0].url}
                  alt={selectedObject.name}
                  className="user-page-card-image"
                  style={{ borderRadius: 12, marginBottom: 16 }}
                />
              ) : (
                <Box className="user-page-card-image-placeholder" style={{ borderRadius: 12, marginBottom: 16 }}>
                  <RestaurantIcon style={{ fontSize: 64, color: '#d1d5db' }} />
                </Box>
              )}
              <Typography variant="h6" className="user-page-typography-section" style={{ marginBottom: 8 }}>
                {selectedObject.name}
              </Typography>
              {selectedObject.description && (
                <Typography variant="body2" className="user-page-typography-card-desc">
                  {selectedObject.description}
                </Typography>
              )}
              {selectedObject.capacity && (
                <Chip
                  icon={<PersonIcon style={{ fontSize: 16 }} />}
                  label={`До ${selectedObject.capacity} чел.`}
                  size="small"
                  className="user-page-chip-capacity"
                />
              )}
            </Box>
          )}

          <Box className="user-page-form-block">
            <Box className="user-page-section-label">
              <CalendarIcon className="user-page-icon-primary" />
              <Typography variant="body2" className="user-page-typography-label">
                Дата бронирования
              </Typography>
            </Box>
            <DatePicker
              value={selectedDate}
              onChange={onDateChange}
              format="dd MMMM yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  className: 'user-page-outlined-input',
                },
              }}
            />
          </Box>

          <Box className="user-page-form-block">
            <Box className="user-page-section-label">
              <TimeIcon className="user-page-icon-primary" />
              <Typography variant="body2" className="user-page-typography-label">
                Время бронирования
              </Typography>
            </Box>
            <FormControl fullWidth>
              <Select value={selectedTime} onChange={(e) => onTimeChange(e.target.value)} className="user-page-outlined-input">
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="user-page-form-block">
            <Box className="user-page-section-label">
              <PersonIcon className="user-page-icon-primary" />
              <Typography variant="body2" className="user-page-typography-label">
                Количество гостей
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="number"
              value={guests}
              onChange={(e) => onGuestsChange(parseInt(e.target.value) || 2)}
              inputProps={{ min: 1, max: 20 }}
              variant="outlined"
              className="user-page-outlined-input"
            />
          </Box>

          <Box className="user-page-form-block">
            <Box className="user-page-section-label user-page-section-label--large">
              <PersonIcon className="user-page-icon-primary" />
              <Typography variant="body2" className="user-page-typography-label">
                Ваши данные
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Ваше имя"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              required
              variant="outlined"
              className="user-page-outlined-input"
              style={{ marginBottom: 16 }}
            />
            <TextField
              fullWidth
              label="Телефон"
              value={clientPhone}
              onChange={(e) => onClientPhoneChange(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box style={{ marginRight: 8, color: '#6b7280' }}>
                    <PhoneIcon style={{ fontSize: 20 }} />
                  </Box>
                ),
              }}
              className="user-page-outlined-input"
              style={{ marginBottom: 16 }}
            />
            <TextField
              fullWidth
              label="Примечания (необязательно)"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              placeholder="Особые пожелания, аллергии, предпочтения..."
              className="user-page-outlined-input"
            />
          </Box>
        </Box>

        <Box className="user-page-drawer-footer">
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onBook}
            disabled={
              !selectedDate || !selectedTime || !selectedObject || !clientName || !clientPhone || isPending
            }
            className="user-page-btn-primary"
          >
            {isPending ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Забронировать стол'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
