import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationObjectsApi } from '../../api/reservationObjects';
import type { ReservationObjectRequestDto, ReservationObjectDto } from '../../../types';

export const useUpdateReservationObject = () => {
  const queryClient = useQueryClient();

  return useMutation<ReservationObjectDto, Error, { id: number; data: ReservationObjectRequestDto }>({
    mutationFn: ({ id, data }) => reservationObjectsApi.updateReservationObject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reservation-objects'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-objects', data.id] });
    },
  });
};

