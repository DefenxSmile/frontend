import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueRequestDto, VenueDto } from '../../../types';

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<VenueDto, Error, { id: number; data: VenueRequestDto }>({
    mutationFn: ({ id, data }) => venuesApi.updateVenue(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venues', data.id] });
    },
  });
};

