import { baseApi } from './baseApi';

export interface BookingRequestDto {
  venueId: number;
  tableId: string;
  startTime: string;
  endTime: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  notes?: string;
}

export interface BookingResponseDto {
  id: number;
  venueId: number;
  tableId: string;
  startTime: string;
  endTime: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingQueryParams {
  venueId?: number;
  tableId?: string;
  startTime?: string;
  endTime?: string;
  page?: number;
  pageSize?: number;
}

export const bookingsApi = {
  getBookings: async (params?: BookingQueryParams): Promise<BookingResponseDto[]> => {
    return baseApi.get<BookingResponseDto[], BookingQueryParams>('/bookings', params);
  },

  getBookingById: async (id: number): Promise<BookingResponseDto> => {
    return baseApi.get<BookingResponseDto>(`/bookings/${id}`);
  },

  createBooking: async (data: BookingRequestDto): Promise<BookingResponseDto> => {
    return baseApi.post<BookingResponseDto>('/bookings', data);
  },

  updateBooking: async (id: number, data: Partial<BookingRequestDto>): Promise<BookingResponseDto> => {
    return baseApi.patch<BookingResponseDto>(`/bookings/${id}`, data);
  },

  deleteBooking: async (id: number): Promise<void> => {
    return baseApi.delete<void>(`/bookings/${id}`);
  },
};

