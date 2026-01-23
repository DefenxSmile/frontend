import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationObjectsApi } from '../../api/reservationObjects';
import type { ReservationObjectRequestDto, ReservationObjectDto } from '../../../types';

export const useCreateReservationObject = () => {
  const queryClient = useQueryClient();

  return useMutation<ReservationObjectDto, Error, ReservationObjectRequestDto>({
    mutationFn: (data: ReservationObjectRequestDto) => reservationObjectsApi.createReservationObject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation-objects'] });
    },
  });
};

