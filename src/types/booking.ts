export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  date: string
}

export interface Booking {
  id: string
  tableId: string
  floorId: string
  timeSlot: TimeSlot
  guestName: string
  guestPhone: string
  guestEmail?: string
  numberOfGuests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
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
    [key: string]: {
      open: string
      close: string
      isClosed?: boolean
    }
  }
  defaultBookingDuration: number
  advanceBookingDays: number
  timeSlotInterval: number
}

