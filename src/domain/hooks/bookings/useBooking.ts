import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../api/bookings';
import type { BookingResponseDto } from '../../api/bookings';

interface UseBookingOptions {
  enabled?: boolean;
}

export const useBooking = (id: number, options: UseBookingOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<BookingResponseDto>({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getBookingById(id),
    enabled: enabled && !!id,
  });
};

