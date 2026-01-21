import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../../api/bookings';
import type { BookingRequestDto, BookingResponseDto } from '../../api/bookings';

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<BookingResponseDto, Error, { id: number; data: Partial<BookingRequestDto> }>({
    mutationFn: ({ id, data }) => bookingsApi.updateBooking(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', data.id] });
    },
  });
};

