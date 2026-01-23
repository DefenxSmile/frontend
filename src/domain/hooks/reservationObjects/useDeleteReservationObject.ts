import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationObjectsApi } from '../../api/reservationObjects';

export const useDeleteReservationObject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => reservationObjectsApi.deleteReservationObject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reservation-objects'] });
      queryClient.removeQueries({ queryKey: ['reservation-objects', id] });
    },
  });
};

