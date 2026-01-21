import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../../api/bookings';

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => bookingsApi.deleteBooking(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.removeQueries({ queryKey: ['bookings', id] });
    },
  });
};

