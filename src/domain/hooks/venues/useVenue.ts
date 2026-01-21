import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueResponseDto } from '../../api/venues';

interface UseVenueOptions {
  enabled?: boolean;
}

export const useVenue = (id: number, options: UseVenueOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<VenueResponseDto>({
    queryKey: ['venues', id],
    queryFn: () => venuesApi.getVenueById(id),
    enabled: enabled && !!id,
  });
};

