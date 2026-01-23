import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../../api/bookings';
import type { ReservationRequestDto, ReservationDto } from '../../../types';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<ReservationDto, Error, ReservationRequestDto>({
    mutationFn: (data: ReservationRequestDto) => reservationsApi.createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

