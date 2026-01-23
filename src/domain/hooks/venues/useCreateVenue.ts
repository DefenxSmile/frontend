import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueRequestDto, VenueDto } from '../../../types';

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<VenueDto, Error, VenueRequestDto>({
    mutationFn: (data: VenueRequestDto) => venuesApi.createVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};

