import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => venuesApi.deleteVenue(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.removeQueries({ queryKey: ['venues', id] });
    },
  });
};

