import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../../api/bookings';

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => reservationsApi.cancelReservation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.removeQueries({ queryKey: ['reservations', id] });
    },
  });
};

