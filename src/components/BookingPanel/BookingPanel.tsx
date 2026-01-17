import { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Divider,
} from '@mui/material'
import { CalendarToday, AccessTime, Person, Phone, Email, EventAvailable } from '@mui/icons-material'
import type { TimeSlot, Booking, TableAvailability } from '../../types/booking'
import type { FloorPlanElement } from '../../types/floorPlan'
import './BookingPanel.scss'

interface BookingPanelProps {
  selectedTable: FloorPlanElement | null
  selectedDate: string // YYYY-MM-DD
  selectedTimeSlot: TimeSlot | null
  onDateChange: (date: string) => void
  onTimeSlotChange: (slot: TimeSlot | null) => void
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void
  tableAvailability?: TableAvailability
  availableTimeSlots: TimeSlot[]
  isLoading?: boolean
}

const BookingPanel = ({
  selectedTable,
  selectedDate,
  selectedTimeSlot,
  onDateChange,
  onTimeSlotChange,
  onBookingSubmit,
  tableAvailability,
  availableTimeSlots,
  isLoading = false,
}: BookingPanelProps) => {
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [notes, setNotes] = useState('')

  // Валидация формы
  const isFormValid = useMemo(() => {
    return (
      selectedTable !== null &&
      selectedTimeSlot !== null &&
      guestName.trim() !== '' &&
      guestPhone.trim() !== '' &&
      numberOfGuests > 0 &&
      numberOfGuests <= (selectedTable.capacity || 4)
    )
  }, [selectedTable, selectedTimeSlot, guestName, guestPhone, numberOfGuests])

  const handleSubmit = () => {
    if (!isFormValid || !selectedTable || !selectedTimeSlot) return

    onBookingSubmit({
      tableId: selectedTable.id,
      floorId: '', // Будет заполнено из контекста
      timeSlot: selectedTimeSlot,
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      guestEmail: guestEmail.trim() || undefined,
      numberOfGuests,
      status: 'pending',
      notes: notes.trim() || undefined,
    })

    // Очистка формы
    setGuestName('')
    setGuestPhone('')
    setGuestEmail('')
    setNumberOfGuests(1)
    setNotes('')
  }

  if (!selectedTable) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <EventAvailable sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Выберите стол для бронирования
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>

        {/* Информация о столе */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#F5F7FA', borderRadius: '8px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {selectedTable.label || 'Стол'}
          </Typography>
          <Chip
            label={`Вместимость: ${selectedTable.capacity || 4} мест`}
            size="small"
            sx={{ fontSize: '11px' }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Выбор даты */}
        <Box sx={{ mb: 2 }}>
          <InputLabel sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" />
            Дата
          </InputLabel>
          <TextField
            fullWidth
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split('T')[0],
            }}
          />
        </Box>

        {/* Выбор времени */}
        <Box sx={{ mb: 2 }}>
          <InputLabel sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime fontSize="small" />
            Время
          </InputLabel>
          <FormControl fullWidth>
            <Select
              value={selectedTimeSlot?.id || ''}
              onChange={(e) => {
                const slot = availableTimeSlots.find((s) => s.id === e.target.value)
                onTimeSlotChange(slot || null)
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Выберите время
              </MenuItem>
              {availableTimeSlots.map((slot) => (
                <MenuItem key={slot.id} value={slot.id}>
                  {new Date(slot.startTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(slot.endTime).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Статус доступности */}
        {tableAvailability && (
          <Box sx={{ mb: 2 }}>
            {tableAvailability.isAvailable ? (
              <Alert severity="success" sx={{ fontSize: '12px' }}>
                Стол свободен в выбранное время
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ fontSize: '12px' }}>
                Стол занят в выбранное время
              </Alert>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Данные гостя */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Данные гостя
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Имя"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            InputProps={{
              startAdornment: <Person fontSize="small" sx={{ mr: 1, color: '#999' }} />,
            }}
          />
          <TextField
            fullWidth
            label="Телефон"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            required
            InputProps={{
              startAdornment: <Phone fontSize="small" sx={{ mr: 1, color: '#999' }} />,
            }}
          />
          <TextField
            fullWidth
            label="Email (необязательно)"
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            InputProps={{
              startAdornment: <Email fontSize="small" sx={{ mr: 1, color: '#999' }} />,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Количество гостей</InputLabel>
            <Select
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(Number(e.target.value))}
              label="Количество гостей"
            >
              {Array.from({ length: selectedTable.capacity || 4 }, (_, i) => i + 1).map((num) => (
                <MenuItem key={num} value={num}>
                  {num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Примечания (необязательно)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          sx={{
            background: 'linear-gradient(135deg, #FF6B01 0%, #E55A00 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #E55A00 0%, #CC4F00 100%)',
            },
            py: 1.5,
          }}
        >
          {isLoading ? 'Бронирование...' : 'Забронировать стол'}
        </Button>
    </Box>
  )
}

export default BookingPanel

