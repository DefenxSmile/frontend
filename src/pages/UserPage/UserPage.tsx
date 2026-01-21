import { useState, useRef, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Chip,
  Drawer,
  IconButton,
} from '@mui/material'
import { Upload as UploadIcon, InsertDriveFile as FileIcon, Close as CloseIcon } from '@mui/icons-material'
import FloorPlanViewerSVG from '../../components/FloorPlanViewerSVG/FloorPlanViewerSVG'
import BookingPanel from '../../components/BookingPanel/BookingPanel'
import TimeRangeSelector from '../../components/TimeRangeSelector/TimeRangeSelector'
import { useVenue, useBookings, useCreateBooking } from '../../domain/hooks'
import type { FloorPlanData, FloorPlanElement } from '../../types/floorPlan'
import type { TimeSlot, Booking, VenueSettings } from '../../types/booking'
import { generateTimeSlots, getAvailableTimeSlots } from '../../utils/timeSlots'
import './UserPage.scss'

const UserPage = () => {
  const { venueId: venueIdParam } = useParams<{ venueId?: string }>()
  const venueId = venueIdParam ? Number(venueIdParam) : null
  
  const { data: venue } = useVenue(venueId || 0, { enabled: !!venueId })
  
  const [jsonInput, setJsonInput] = useState('')
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedTable, setSelectedTable] = useState<FloorPlanElement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null)
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const bookingsQueryParams = useMemo(() => {
    if (!venueId || !selectedDate) return undefined
    
    const startOfDay = `${selectedDate}T00:00:00`
    const endOfDay = `${selectedDate}T23:59:59`
    
    return {
      venueId,
      startTime: new Date(startOfDay).toISOString(),
      endTime: new Date(endOfDay).toISOString(),
    }
  }, [venueId, selectedDate])
  
  const { data: bookingsResponse = [] } = useBookings(bookingsQueryParams, { enabled: !!bookingsQueryParams })
  const createBooking = useCreateBooking()
  
  const bookings: Booking[] = useMemo(() => {
    return bookingsResponse.map((b) => ({
      id: String(b.id),
      tableId: b.tableId,
      floorId: floorPlanData?.currentFloorId || '',
      timeSlot: {
        id: `slot-${b.id}`,
        startTime: b.startTime,
        endTime: b.endTime,
        date: selectedDate,
      },
      guestName: b.guestName || 'Гость',
      guestPhone: b.guestPhone || '',
      guestEmail: b.guestEmail,
      numberOfGuests: 1, // TODO: получить из API
      status: 'confirmed' as const, // TODO: получить из API
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      notes: b.notes,
    }))
  }, [bookingsResponse, floorPlanData, selectedDate])
  
  useEffect(() => {
    if (venue?.floorPlan) {
      setFloorPlanData(venue.floorPlan)
    }
  }, [venue])

  const handleLoadJson = () => {
    try {
      setError(null)
      const parsed = JSON.parse(jsonInput) as FloorPlanData

      if (!parsed.stage || !parsed.floors || !Array.isArray(parsed.floors)) {
        throw new Error('Неверный формат JSON: отсутствуют обязательные поля stage или floors')
      }

      if (parsed.floors.length === 0) {
        throw new Error('JSON должен содержать хотя бы один этаж')
      }

      // Проверяем структуру этажей
      for (const floor of parsed.floors) {
        if (!floor.id || !floor.name || !Array.isArray(floor.elements)) {
          throw new Error('Неверный формат этажей в JSON')
        }
      }

      // Проверяем наличие currentFloorId
      if (!parsed.currentFloorId) {
        // Если нет currentFloorId, устанавливаем первый этаж
        parsed.currentFloorId = parsed.floors[0].id
      }

      setFloorPlanData(parsed)
      // Сбрасываем выбранный стол при загрузке нового плана
      setSelectedTable(null)
      setSelectedTimeSlot(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при парсинге JSON')
      setFloorPlanData(null)
    }
  }

  // Обработчик клика на стол
  const handleTableClick = (table: FloorPlanElement) => {
    setSelectedTable(table)
    setSelectedTimeSlot(null) // Сбрасываем выбранное время при выборе нового стола
    setDrawerOpen(true) // Открываем Drawer при выборе стола
  }

  // Настройки заведения (по умолчанию)
  const venueSettings: VenueSettings = useMemo(() => {
    const defaultSettings: VenueSettings = {
      venueId: floorPlanData?.metadata?.venueId || '',
      clientId: floorPlanData?.metadata?.clientId || '',
      operatingHours: {
        monday: { open: '10:00', close: '22:00', isClosed: false },
        tuesday: { open: '10:00', close: '22:00', isClosed: false },
        wednesday: { open: '10:00', close: '22:00', isClosed: false },
        thursday: { open: '10:00', close: '22:00', isClosed: false },
        friday: { open: '10:00', close: '23:00', isClosed: false },
        saturday: { open: '10:00', close: '23:00', isClosed: false },
        sunday: { open: '10:00', close: '22:00', isClosed: false },
      },
      timeSlotInterval: 30,
      defaultBookingDuration: 120,
      advanceBookingDays: 30,
    }

    if (floorPlanData?.venueSettings) {
      return {
        ...defaultSettings,
        ...floorPlanData.venueSettings,
        operatingHours: floorPlanData.venueSettings.operatingHours || defaultSettings.operatingHours,
      } as VenueSettings
    }

    return defaultSettings
  }, [floorPlanData])

  // Генерация всех временных слотов для выбранной даты (для обратной совместимости)
  const allTimeSlots = useMemo(() => {
    if (!selectedDate || !floorPlanData) return []
    return generateTimeSlots(selectedDate, venueSettings)
  }, [selectedDate, venueSettings, floorPlanData])

  // Получаем все столы из текущего этажа
  const allTables = useMemo(() => {
    if (!floorPlanData) return []
    const currentFloor = floorPlanData.floors.find((f) => f.id === floorPlanData.currentFloorId)
    return currentFloor?.elements.filter((el) => el.type === 'table') || []
  }, [floorPlanData])

  // Генерация доступных временных слотов для выбранного стола
  const availableTimeSlots = useMemo(() => {
    if (!selectedTable) return allTimeSlots
    return getAvailableTimeSlots(allTimeSlots, bookings, selectedTable.id)
  }, [allTimeSlots, selectedTable, bookings])

  // Обработчик изменения временного диапазона
  const handleTimeRangeChange = (startTime: string | null, endTime: string | null) => {
    setSelectedStartTime(startTime)
    setSelectedEndTime(endTime)
    
    // Создаем TimeSlot из выбранного диапазона для совместимости с BookingPanel
    if (startTime && endTime) {
      const timeSlot: TimeSlot = {
        id: `custom-${startTime}-${endTime}`,
        startTime,
        endTime,
        date: selectedDate,
      }
      setSelectedTimeSlot(timeSlot)
    } else {
      setSelectedTimeSlot(null)
    }
  }

  // Фильтруем бронирования для выбранного времени (для отображения статуса столов)
  const bookingsForSelectedTime = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime) return []
    
    const start = new Date(selectedStartTime)
    const end = new Date(selectedEndTime)
    
    return bookings.filter((booking) => {
      if (booking.status === 'cancelled') return false
      
      const bookingStart = new Date(booking.timeSlot.startTime)
      const bookingEnd = new Date(booking.timeSlot.endTime)
      
      // Проверяем пересечение временных диапазонов
      return start < bookingEnd && end > bookingStart
    })
  }, [bookings, selectedStartTime, selectedEndTime])

  // Обработчик отправки бронирования
  const handleBookingSubmit = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedTable || !selectedTimeSlot || !venueId) {
      alert('Пожалуйста, выберите стол и время')
      return
    }

    // Создаем бронирование через API
    createBooking.mutate(
      {
        venueId,
        tableId: selectedTable.id,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        guestName: bookingData.guestName,
        guestPhone: bookingData.guestPhone,
        guestEmail: bookingData.guestEmail,
        notes: bookingData.notes,
      },
      {
        onSuccess: () => {
          alert('Бронирование успешно создано!')
          // Сбрасываем форму и закрываем Drawer
          setSelectedTable(null)
          setSelectedTimeSlot(null)
          setDrawerOpen(false)
        },
        onError: (error) => {
          alert(`Ошибка при создании бронирования: ${error.message}`)
        },
      }
    )
  }

  const handleClear = () => {
    setJsonInput('')
    setFloorPlanData(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        setJsonInput(content)
        // Автоматически загружаем после чтения файла
        setTimeout(() => {
          const parsed = JSON.parse(content) as FloorPlanData
          if (!parsed.stage || !parsed.floors || !Array.isArray(parsed.floors) || parsed.floors.length === 0) {
            throw new Error('Неверный формат JSON: отсутствуют обязательные поля stage или floors')
          }
          // Устанавливаем currentFloorId если его нет
          if (!parsed.currentFloorId) {
            parsed.currentFloorId = parsed.floors[0].id
          }
          setFloorPlanData(parsed)
          setError(null)
        }, 100)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при чтении файла')
      }
    }
    reader.readAsText(file)
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 3 } }}>
      <Box 
        className="user-page"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Бронирование столика
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Выберите столик на схеме и укажите желаемое время для бронирования
        </Typography>

        {!floorPlanData ? (
          <Paper elevation={1} sx={{ p: 3, borderRadius: '12px', mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Введите JSON данные
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"stage": {...}, "elements": [...], "floors": [...]}'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  },
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={handleLoadJson}
                disabled={!jsonInput.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B01 0%, #E55A00 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A00 0%, #CC4F00 100%)',
                  },
                }}
              >
                Загрузить схему
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileIcon />}
                onClick={() => fileInputRef.current?.click()}
              >
                Загрузить из файла
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button variant="outlined" onClick={handleClear}>
                Очистить
              </Button>
            </Box>
          </Paper>
        ) : (
          <>
            <Paper elevation={1} sx={{ p: 2, borderRadius: '12px', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {floorPlanData.metadata?.venueName || 'Схема зала'}
                  </Typography>
                  {floorPlanData.metadata?.clientName && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {floorPlanData.metadata.clientName}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {selectedTable && (
                    <Chip
                      label={`Выбран стол: ${selectedTable.label || selectedTable.id}`}
                      color="primary"
                      size="small"
                    />
                  )}
                  <Button variant="outlined" size="small" onClick={handleClear}>
                    Загрузить другой план
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Временная линейка для выбора произвольного времени */}
            <TimeRangeSelector
              selectedDate={selectedDate}
              venueSettings={venueSettings}
              bookings={bookings}
              tables={allTables}
              selectedStartTime={selectedStartTime}
              selectedEndTime={selectedEndTime}
              onTimeRangeChange={handleTimeRangeChange}
              minDuration={30}
            />

            <Box 
              sx={{ 
                height: { xs: 'calc(100vh - 200px)', sm: 'calc(100vh - 300px)' }, 
                minHeight: { xs: '400px', sm: '600px' },
                width: '100%',
              }}
            >
              <FloorPlanViewerSVG
                data={floorPlanData}
                bookings={selectedTimeSlot ? bookingsForSelectedTime : bookings}
                onTableClick={handleTableClick}
                selectedTableId={selectedTable?.id || null}
                interactive={true}
              />
            </Box>

            {/* Drawer для панели бронирования */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: { xs: '100%', sm: 400 },
                  maxWidth: '100%',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  borderLeft: { xs: 'none', sm: '1px solid #e0e0e0' },
                },
              }}
              ModalProps={{
                keepMounted: false, // Улучшает производительность на мобильных
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: { xs: 1.5, sm: 2 }, 
                borderBottom: '1px solid #e0e0e0',
                position: 'sticky',
                top: 0,
                backgroundColor: 'background.paper',
                zIndex: 1,
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Бронирование стола
                </Typography>
                <IconButton 
                  onClick={() => setDrawerOpen(false)} 
                  size="small"
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ 
                overflowY: 'auto', 
                height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
                WebkitOverflowScrolling: 'touch', // Плавная прокрутка на iOS
              }}>
                <BookingPanel
                  selectedTable={selectedTable}
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onDateChange={setSelectedDate}
                  onTimeSlotChange={setSelectedTimeSlot}
                  onBookingSubmit={handleBookingSubmit}
                  availableTimeSlots={availableTimeSlots}
                />
              </Box>
            </Drawer>
          </>
        )}
      </Box>
    </Container>
  )
}

export default UserPage
