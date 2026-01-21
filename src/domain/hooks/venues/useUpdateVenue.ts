import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueRequestDto, VenueResponseDto } from '../../api/venues';

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<VenueResponseDto, Error, { id: number; data: VenueRequestDto }>({
    mutationFn: ({ id, data }) => venuesApi.updateVenue(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venues', data.id] });
    },
  });
};

