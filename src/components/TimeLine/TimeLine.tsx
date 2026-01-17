import { useMemo, useRef, useEffect } from 'react'
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import type { TimeSlot, Booking } from '../../types/booking'
import type { FloorPlanElement } from '../../types/floorPlan'
import './TimeLine.scss'

interface TimeLineProps {
  timeSlots: TimeSlot[]
  selectedTimeSlot: TimeSlot | null
  onTimeSlotSelect: (slot: TimeSlot | null) => void
  bookings: Booking[]
  tables: FloorPlanElement[]
}

const TimeLine = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  bookings,
  tables,
}: TimeLineProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Вычисляем доступность столов для каждого временного слота
  const slotAvailability = useMemo(() => {
    return timeSlots.map((slot) => {
      const availableTables = tables.filter((table) => {
        if (table.type !== 'table' || table.isAvailable === false) return false
        // Проверяем, не забронирован ли стол в это время
        const isBooked = bookings.some(
          (booking) =>
            booking.tableId === table.id &&
            booking.status !== 'cancelled' &&
            booking.timeSlot.id === slot.id
        )
        return !isBooked
      })

      return {
        slot,
        availableCount: availableTables.length,
        totalCount: tables.filter((t) => t.type === 'table' && t.isAvailable !== false).length,
      }
    })
  }, [timeSlots, bookings, tables])

  // Прокрутка к выбранному слоту
  useEffect(() => {
    if (selectedTimeSlot && scrollContainerRef.current) {
      const slotElement = scrollContainerRef.current.querySelector(
        `[data-slot-id="${selectedTimeSlot.id}"]`
      )
      if (slotElement) {
        slotElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedTimeSlot])

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (timeSlots.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 2, borderRadius: '12px', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Нет доступных временных слотов для выбранной даты
        </Typography>
      </Paper>
    )
  }

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
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '1rem', sm: '1.125rem' },
              background: 'linear-gradient(135deg, #FF6B01 0%, #E55A00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Выберите время для бронирования
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {/* Кнопка прокрутки влево */}
          <IconButton
            size="small"
            onClick={() => handleScroll('left')}
            sx={{
              flexShrink: 0,
              display: { xs: 'none', sm: 'flex' },
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft />
          </IconButton>

          {/* Контейнер с временными слотами */}
          <Box
            ref={scrollContainerRef}
            className="timeline-container"
            sx={{
              flex: 1,
              display: 'flex',
              gap: { xs: 1, sm: 1.5 },
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              pb: 1.5,
              px: 0.5,
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'action.disabled',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'text.secondary',
                },
              },
            }}
          >
            {slotAvailability.map(({ slot, availableCount, totalCount }) => {
              const isSelected = selectedTimeSlot?.id === slot.id
              const availabilityPercent = totalCount > 0 ? (availableCount / totalCount) * 100 : 0
              const isFullyBooked = availableCount === 0
              const isMostlyBooked = availabilityPercent < 30
              const isAvailable = !isFullyBooked

              // Градиенты для разных состояний
              const getBackgroundGradient = () => {
                if (isSelected) {
                  return 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
                }
                if (isFullyBooked) {
                  return 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)'
                }
                if (isMostlyBooked) {
                  return 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)'
                }
                return 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)'
              }

              const getBorderColor = () => {
                if (isSelected) return '#2196F3'
                if (isFullyBooked) return '#EF5350'
                if (isMostlyBooked) return '#FFB74D'
                return '#66BB6A'
              }

              return (
                <Box
                  key={slot.id}
                  data-slot-id={slot.id}
                  onClick={() => isAvailable && onTimeSlotSelect(isSelected ? null : slot)}
                  sx={{
                    minWidth: { xs: 110, sm: 130 },
                    flexShrink: 0,
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? '#2196F3' : 'transparent'}`,
                    background: getBackgroundGradient(),
                    cursor: isFullyBooked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isFullyBooked ? 0.5 : 1,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isSelected
                      ? '0 8px 24px rgba(33, 150, 243, 0.3)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none',
                    },
                    '&:hover': {
                      transform: isFullyBooked ? 'none' : 'translateY(-4px) scale(1.02)',
                      boxShadow: isFullyBooked
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : '0 12px 32px rgba(0,0,0,0.15)',
                      borderColor: isFullyBooked ? 'transparent' : getBorderColor(),
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                    zIndex: isSelected ? 1 : 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: '#FFFFFF',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {formatTime(slot.startTime)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 500,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {formatTime(slot.endTime)}
                  </Typography>
                  <Chip
                    label={`${availableCount} из ${totalCount}`}
                    size="small"
                    sx={{
                      height: { xs: 22, sm: 26 },
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontWeight: 700,
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </Box>
              )
            })}
          </Box>

          {/* Кнопка прокрутки вправо */}
          <IconButton
            size="small"
            onClick={() => handleScroll('right')}
            sx={{
              flexShrink: 0,
              display: { xs: 'none', sm: 'flex' },
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Легенда */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1.5, sm: 2.5 }, 
          mt: 2, 
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap', 
          justifyContent: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)',
                boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
              }}
            />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, fontWeight: 500 }}>
              Много свободных
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)',
                boxShadow: '0 2px 4px rgba(255, 167, 38, 0.3)',
              }}
            />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, fontWeight: 500 }}>
              Мало свободных
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
                boxShadow: '0 2px 4px rgba(229, 57, 53, 0.3)',
              }}
            />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, fontWeight: 500 }}>
              Нет свободных
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default TimeLine

