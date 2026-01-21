import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueResponseDto } from '../../api/venues';

export const useVenues = () => {
  return useQuery<VenueResponseDto[]>({
    queryKey: ['venues'],
    queryFn: () => venuesApi.getAllVenues(),
  });
};

