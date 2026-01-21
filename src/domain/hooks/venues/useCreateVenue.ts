import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueRequestDto, VenueResponseDto } from '../../api/venues';

export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation<VenueResponseDto, Error, VenueRequestDto>({
    mutationFn: (data: VenueRequestDto) => venuesApi.createVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
};

