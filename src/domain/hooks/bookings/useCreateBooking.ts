import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../../api/bookings';
import type { BookingRequestDto, BookingResponseDto } from '../../api/bookings';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<BookingResponseDto, Error, BookingRequestDto>({
    mutationFn: (data: BookingRequestDto) => bookingsApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

