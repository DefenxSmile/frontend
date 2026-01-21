import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../api/bookings';
import type { BookingResponseDto, BookingQueryParams } from '../../api/bookings';

interface UseBookingsOptions {
  enabled?: boolean;
}

export const useBookings = (params?: BookingQueryParams, options: UseBookingsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<BookingResponseDto[]>({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getBookings(params),
    enabled,
  });
};

