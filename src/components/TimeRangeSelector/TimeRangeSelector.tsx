import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  Chip,
} from '@mui/material'
import { AccessTime } from '@mui/icons-material'
import type { Booking } from '../../types/booking'
import type { FloorPlanElement } from '../../types/floorPlan'
import type { VenueSettings } from '../../types/booking'
import './TimeRangeSelector.scss'

interface TimeRangeSelectorProps {
  selectedDate: string // YYYY-MM-DD
  venueSettings: VenueSettings
  bookings: Booking[]
  tables: FloorPlanElement[]
  selectedStartTime: string | null // ISO string
  selectedEndTime: string | null // ISO string
  onTimeRangeChange: (startTime: string | null, endTime: string | null) => void
  minDuration?: number // Минимальная длительность в минутах
}

const TimeRangeSelector = ({
  selectedDate,
  venueSettings,
  bookings,
  tables,
  selectedStartTime,
  selectedEndTime,
  onTimeRangeChange,
  minDuration = 30,
}: TimeRangeSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null)
  const [tempStartTime, setTempStartTime] = useState<string | null>(null)
  const [tempEndTime, setTempEndTime] = useState<string | null>(null)

  // Получаем рабочие часы для выбранной даты
  const { startTime, endTime } = useMemo(() => {
    const date = new Date(selectedDate)
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayOfWeek = dayNames[date.getDay()] as keyof typeof venueSettings.operatingHours
    const daySettings = venueSettings.operatingHours[dayOfWeek]

    if (!daySettings || daySettings.isClosed) {
      return { startTime: null, endTime: null }
    }

    const [openHour, openMinute] = daySettings.open.split(':').map(Number)
    const [closeHour, closeMinute] = daySettings.close.split(':').map(Number)

    const start = new Date(date)
    start.setHours(openHour, openMinute, 0, 0)

    const end = new Date(date)
    end.setHours(closeHour, closeMinute, 0, 0)

    return { startTime: start, endTime: end }
  }, [selectedDate, venueSettings])

  // Преобразуем координату X в время
  const xToTime = useCallback(
    (x: number): Date | null => {
      if (!containerRef.current || !startTime || !endTime) return null

      const rect = containerRef.current.getBoundingClientRect()
      const relativeX = x - rect.left
      const width = rect.width
      const ratio = Math.max(0, Math.min(1, relativeX / width))

      const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      const minutes = ratio * totalMinutes

      const time = new Date(startTime)
      time.setMinutes(time.getMinutes() + minutes)

      // Округляем до ближайших 15 минут для удобства
      const roundedMinutes = Math.round(time.getMinutes() / 15) * 15
      time.setMinutes(roundedMinutes, 0, 0)

      return time
    },
    [startTime, endTime]
  )

  // Преобразуем время в координату X
  const timeToX = useCallback(
    (time: Date): number => {
      if (!containerRef.current || !startTime || !endTime) return 0

      const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      const minutes = (time.getTime() - startTime.getTime()) / (1000 * 60)
      const ratio = minutes / totalMinutes

      const rect = containerRef.current.getBoundingClientRect()
      return rect.left + ratio * rect.width
    },
    [startTime, endTime]
  )

  const handleStartMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging('start')
  }

  const handleEndMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging('end')
  }

  const handleStartTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging('start')
  }

  const handleEndTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging('end')
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !startTime || !endTime) return

      const currentX = e.clientX
      const newTime = xToTime(currentX)

      if (!newTime) return

      if (isDragging === 'start') {
        const end = selectedEndTime ? new Date(selectedEndTime) : null
        if (end && newTime >= end) return
        
        // Просто устанавливаем новое время начала, не трогая конец
        setTempStartTime(newTime.toISOString())
      } else if (isDragging === 'end') {
        const start = selectedStartTime ? new Date(selectedStartTime) : null
        if (start && newTime <= start) return
        
        // Просто устанавливаем новое время конца, не трогая начало
        setTempEndTime(newTime.toISOString())
      }
    },
    [isDragging, xToTime, selectedStartTime, selectedEndTime, startTime, endTime]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging && (tempStartTime || tempEndTime)) {
      onTimeRangeChange(tempStartTime || selectedStartTime, tempEndTime || selectedEndTime)
    }
    setIsDragging(null)
    setTempStartTime(null)
    setTempEndTime(null)
  }, [isDragging, tempStartTime, tempEndTime, selectedStartTime, selectedEndTime, onTimeRangeChange])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !startTime || !endTime) return
      const touch = e.touches[0]
      if (!touch) return

      const currentX = touch.clientX
      const newTime = xToTime(currentX)

      if (!newTime) return

      if (isDragging === 'start') {
        const end = selectedEndTime ? new Date(selectedEndTime) : null
        if (end && newTime >= end) return
        
        // Просто устанавливаем новое время начала, не трогая конец
        setTempStartTime(newTime.toISOString())
      } else if (isDragging === 'end') {
        const start = selectedStartTime ? new Date(selectedStartTime) : null
        if (start && newTime <= start) return
        
        // Просто устанавливаем новое время конца, не трогая начало
        setTempEndTime(newTime.toISOString())
      }
    },
    [isDragging, xToTime, selectedStartTime, selectedEndTime, startTime, endTime]
  )

  const handleTouchEnd = useCallback(() => {
    if (isDragging && (tempStartTime || tempEndTime)) {
      onTimeRangeChange(tempStartTime || selectedStartTime, tempEndTime || selectedEndTime)
    }
    setIsDragging(null)
    setTempStartTime(null)
    setTempEndTime(null)
  }, [isDragging, tempStartTime, tempEndTime, selectedStartTime, selectedEndTime, onTimeRangeChange])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Обработка клика на шкале
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isDragging) return
    
    // Проверяем, не кликнули ли мы на маркер
    const target = e.target as HTMLElement
    if (target.closest('[data-marker="start"]') || target.closest('[data-marker="end"]')) {
      return
    }
    
    const time = xToTime(e.clientX)
    if (!time) return

    // Если оба маркера установлены, перемещаем ближайший к клику
    if (selectedStartTime && selectedEndTime) {
      const startX = timeToX(new Date(selectedStartTime))
      const endX = timeToX(new Date(selectedEndTime))
      const clickX = e.clientX
      
      const distanceToStart = Math.abs(clickX - startX)
      const distanceToEnd = Math.abs(clickX - endX)

      if (distanceToStart < distanceToEnd) {
        // Перемещаем начало
        const end = new Date(selectedEndTime)
        if (time >= end) return // Нельзя переместить начало после конца
        onTimeRangeChange(time.toISOString(), selectedEndTime)
      } else {
        // Перемещаем конец
        const start = new Date(selectedStartTime)
        if (time <= start) return // Нельзя переместить конец до начала
        onTimeRangeChange(selectedStartTime, time.toISOString())
      }
    } else if (selectedStartTime && !selectedEndTime) {
      // Устанавливаем конец
      const start = new Date(selectedStartTime)
      if (time <= start) {
        // Если кликнули до начала, меняем местами
        const newEnd = new Date(start.getTime() + minDuration * 60 * 1000)
        if (newEnd <= endTime!) {
          onTimeRangeChange(time.toISOString(), newEnd.toISOString())
        }
      } else {
        onTimeRangeChange(selectedStartTime, time.toISOString())
      }
    } else {
      // Устанавливаем начало
      onTimeRangeChange(time.toISOString(), null)
    }
  }

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const displayStartTime = tempStartTime || selectedStartTime
  const displayEndTime = tempEndTime || selectedEndTime

  // Вычисляем доступность для выбранного диапазона
  const rangeAvailability = useMemo(() => {
    if (!displayStartTime || !displayEndTime) return null

    const start = new Date(displayStartTime)
    const end = new Date(displayEndTime)

    const availableTables = tables.filter((table) => {
      if (table.type !== 'table' || table.isAvailable === false) return false

      const hasConflict = bookings.some((booking) => {
        if (booking.tableId !== table.id || booking.status === 'cancelled') return false

        const bookingStart = new Date(booking.timeSlot.startTime)
        const bookingEnd = new Date(booking.timeSlot.endTime)

        return (start < bookingEnd && end > bookingStart)
      })

      return !hasConflict
    })

    return {
      availableCount: availableTables.length,
      totalCount: tables.filter((t) => t.type === 'table' && t.isAvailable !== false).length,
    }
  }, [displayStartTime, displayEndTime, bookings, tables])

  // Генерируем метки времени
  const timeMarks = useMemo(() => {
    if (!startTime || !endTime) return []

    const marks: Array<{ time: Date; isHour: boolean; isHalfHour: boolean }> = []
    const current = new Date(startTime)

    while (current <= endTime) {
      const minutes = current.getMinutes()
      marks.push({
        time: new Date(current),
        isHour: minutes === 0,
        isHalfHour: minutes === 30,
      })
      current.setMinutes(current.getMinutes() + 15)
    }

    return marks
  }, [startTime, endTime])

  if (!startTime || !endTime) {
    return (
      <Paper elevation={0} sx={{ borderRadius: '16px', mb: 2, p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Заведение закрыто в выбранную дату
        </Typography>
      </Paper>
    )
  }

  const startX = displayStartTime ? timeToX(new Date(displayStartTime)) : 0
  const endX = displayEndTime ? timeToX(new Date(displayEndTime)) : 0
  const rangeWidth = displayStartTime && displayEndTime ? Math.abs(endX - startX) : 0
  const rangeLeft = displayStartTime && displayEndTime ? Math.min(startX, endX) : 0
  const containerLeft = containerRef.current?.getBoundingClientRect().left || 0
  const containerWidth = containerRef.current?.getBoundingClientRect().width || 1

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        mb: 2,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 251, 252, 0.9) 100%)',
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        {/* Заголовок */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '0.9375rem', sm: '1.125rem' },
              background: 'linear-gradient(135deg, #FF6B01 0%, #E55A00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Выберите время
          </Typography>
          
          {rangeAvailability && (
            <Chip
              icon={<AccessTime />}
              label={`${rangeAvailability.availableCount} из ${rangeAvailability.totalCount} свободно`}
              size="small"
              sx={{
                backgroundColor: rangeAvailability.availableCount > 0 ? '#4CAF50' : '#EF5350',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
              }}
            />
          )}
        </Box>

        {/* Единая временная шкала */}
        <Box sx={{ mb: 2 }}>
          {/* Подписи времени */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 1 }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>
              {formatTime(startTime)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>
              {formatTime(endTime)}
            </Typography>
          </Box>

          {/* Шкала */}
          <Box
            ref={containerRef}
            className="time-range-selector"
            onClick={handleTimelineClick}
            sx={{
              position: 'relative',
              height: 60,
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '12px',
              cursor: 'crosshair',
              overflow: 'visible',
              touchAction: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            {/* Метки времени */}
            {timeMarks.map((mark, index) => {
              const x = timeToX(mark.time)
              const percent = ((x - containerLeft) / containerWidth) * 100

              return (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    left: `${percent}%`,
                    top: mark.isHour ? 0 : mark.isHalfHour ? 8 : 16,
                    bottom: 0,
                    width: mark.isHour ? '2px' : mark.isHalfHour ? '1.5px' : '1px',
                    backgroundColor: mark.isHour ? 'primary.main' : mark.isHalfHour ? 'text.primary' : 'text.secondary',
                    opacity: mark.isHour ? 1 : mark.isHalfHour ? 0.7 : 0.5,
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                    '&::after': mark.isHour ? {
                      content: `"${formatTime(mark.time)}"`,
                      position: 'absolute',
                      top: '-22px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.7rem',
                      color: 'text.primary',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      backgroundColor: 'background.paper',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      border: '1px solid',
                      borderColor: 'divider',
                    } : {},
                  }}
                />
              )
            })}

            {/* Выбранный диапазон */}
            {displayStartTime && displayEndTime && (
              <Box
                sx={{
                  position: 'absolute',
                  left: `${((rangeLeft - containerLeft) / containerWidth) * 100}%`,
                  width: `${(rangeWidth / containerWidth) * 100}%`,
                  top: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(33, 150, 243, 0.15)',
                  borderTop: '2px solid #2196F3',
                  borderBottom: '2px solid #2196F3',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            )}

            {/* Маркер начала */}
            {displayStartTime && (
              <Box
                data-marker="start"
                onMouseDown={handleStartMouseDown}
                onTouchStart={handleStartTouchStart}
                sx={{
                  position: 'absolute',
                  left: `${((startX - containerLeft) / containerWidth) * 100}%`,
                  top: '-8px',
                  bottom: 0,
                  width: '3px',
                  backgroundColor: '#2196F3',
                  cursor: 'ew-resize',
                  zIndex: 20,
                  touchAction: 'none',
                  transition: 'all 0.1s ease',
                  boxShadow: '0 2px 6px rgba(33, 150, 243, 0.4)',
                  '&:hover': {
                    width: '5px',
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.6)',
                  },
                  '&::before': {
                    content: '"Начало"',
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: 'text.secondary',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    backgroundColor: 'background.paper',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  },
                }}
              />
            )}

            {/* Маркер конца */}
            {displayEndTime && (
              <Box
                data-marker="end"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleEndMouseDown(e)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleEndTouchStart(e)
                }}
                sx={{
                  position: 'absolute',
                  left: `${((endX - containerLeft) / containerWidth) * 100}%`,
                  top: '-8px',
                  bottom: 0,
                  width: '3px',
                  backgroundColor: '#2196F3',
                  cursor: 'ew-resize',
                  zIndex: 20,
                  touchAction: 'none',
                  transition: 'all 0.1s ease',
                  boxShadow: '0 2px 6px rgba(33, 150, 243, 0.4)',
                  '&:hover': {
                    width: '5px',
                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.6)',
                  },
                  '&::before': {
                    content: '"Конец"',
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: 'text.secondary',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    backgroundColor: 'background.paper',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  },
                }}
              />
            )}

            {/* Маркер начала (если выбран только старт) */}
            {displayStartTime && !displayEndTime && (
              <Box
                data-marker="start"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStartMouseDown(e)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStartTouchStart(e)
                }}
                sx={{
                  position: 'absolute',
                  left: `${((startX - containerLeft) / containerWidth) * 100}%`,
                  top: '-8px',
                  bottom: 0,
                  width: '3px',
                  backgroundColor: '#FF6B01',
                  cursor: 'ew-resize',
                  zIndex: 20,
                  touchAction: 'none',
                  transition: 'all 0.1s ease',
                  boxShadow: '0 2px 6px rgba(255, 107, 1, 0.4)',
                  '&:hover': {
                    width: '5px',
                    boxShadow: '0 4px 10px rgba(255, 107, 1, 0.6)',
                  },
                  '&::before': {
                    content: '"Начало"',
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: 'text.secondary',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    backgroundColor: 'background.paper',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#FF6B01',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  },
                }}
              />
            )}
          </Box>

          {/* Инструкция */}
          {!displayStartTime && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 1,
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              Кликните на шкале, чтобы выбрать начало времени, затем кликните еще раз для выбора конца
            </Typography>
          )}
        </Box>

        {/* Отображение выбранного диапазона */}
        {displayStartTime && displayEndTime && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}>
            <Chip
              label={`${formatTime(new Date(displayStartTime))} - ${formatTime(new Date(displayEndTime))}`}
              sx={{
                backgroundColor: '#2196F3',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: 2,
              }}
            />
            <Chip
              label={`${Math.round((new Date(displayEndTime).getTime() - new Date(displayStartTime).getTime()) / (1000 * 60))} минут`}
              sx={{
                backgroundColor: 'success.main',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: 2,
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export default TimeRangeSelector
