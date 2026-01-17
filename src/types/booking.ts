// Типы для системы бронирований

export interface TimeSlot {
  id: string
  startTime: string // ISO 8601 формат: "2024-01-15T18:00:00Z"
  endTime: string // ISO 8601 формат: "2024-01-15T20:00:00Z"
  date: string // Дата в формате YYYY-MM-DD
}

export interface Booking {
  id: string
  tableId: string // ID стола из FloorPlanElement
  floorId: string // ID этажа
  timeSlot: TimeSlot
  guestName: string
  guestPhone: string
  guestEmail?: string
  numberOfGuests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
  notes?: string
}

export interface TableAvailability {
  tableId: string
  floorId: string
  isAvailable: boolean
  currentBooking?: Booking
  upcomingBookings: Booking[]
}

export interface VenueSettings {
  venueId: string
  clientId: string
  operatingHours: {
    [key: string]: { // День недели: 'monday', 'tuesday', etc.
      open: string // "09:00"
      close: string // "22:00"
      isClosed?: boolean
    }
  }
  defaultBookingDuration: number // Минуты
  advanceBookingDays: number // За сколько дней можно бронировать
  timeSlotInterval: number // Интервал между слотами в минутах (15, 30, 60)
}

