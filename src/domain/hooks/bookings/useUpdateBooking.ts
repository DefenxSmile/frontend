import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../../api/bookings';
import type { ReservationUpdateDto, ReservationDto } from '../../../types';

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<ReservationDto, Error, { id: number; data: ReservationUpdateDto }>({
    mutationFn: ({ id, data }) => reservationsApi.updateReservation(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', data.id] });
    },
  });
};

