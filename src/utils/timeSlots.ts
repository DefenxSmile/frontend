import type { TimeSlot, VenueSettings, Booking } from '../types/booking'

/**
 * Генерирует временные слоты для бронирования на основе настроек заведения
 */
export const generateTimeSlots = (
  date: string, // YYYY-MM-DD
  settings: VenueSettings
): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const selectedDate = new Date(date)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfWeek = dayNames[selectedDate.getDay()] as keyof typeof settings.operatingHours

  const daySettings = settings.operatingHours[dayOfWeek]
  if (!daySettings || daySettings.isClosed) {
    return slots
  }

  const [openHour, openMinute] = daySettings.open.split(':').map(Number)
  const [closeHour, closeMinute] = daySettings.close.split(':').map(Number)

  const startTime = new Date(selectedDate)
  startTime.setHours(openHour, openMinute, 0, 0)

  const endTime = new Date(selectedDate)
  endTime.setHours(closeHour, closeMinute, 0, 0)

  const interval = settings.timeSlotInterval || 30
  const duration = settings.defaultBookingDuration || 120 // 2 часа по умолчанию

  let currentTime = new Date(startTime)

  while (currentTime.getTime() + duration * 60 * 1000 <= endTime.getTime()) {
    const slotStart = new Date(currentTime)
    const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000)

    slots.push({
      id: `slot-${date}-${slotStart.getHours()}-${slotStart.getMinutes()}`,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
      date,
    })

    currentTime = new Date(currentTime.getTime() + interval * 60 * 1000)
  }

  return slots
}

/**
 * Фильтрует доступные временные слоты, исключая уже забронированные
 */
export const getAvailableTimeSlots = (
  allSlots: TimeSlot[],
  bookings: Booking[],
  tableId: string
): TimeSlot[] => {
  const bookedSlotIds = bookings
    .filter((booking) => booking.tableId === tableId && booking.status !== 'cancelled')
    .map((booking) => booking.timeSlot.id)

  return allSlots.filter((slot) => !bookedSlotIds.includes(slot.id))
}

/**
 * Проверяет доступность стола в указанный временной слот
 */
export const isTableAvailable = (
  tableId: string,
  timeSlot: TimeSlot,
  bookings: Booking[]
): boolean => {
  return !bookings.some(
    (booking) =>
      booking.tableId === tableId &&
      booking.status !== 'cancelled' &&
      booking.timeSlot.id === timeSlot.id
  )
}

