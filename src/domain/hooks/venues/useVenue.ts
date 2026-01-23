import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueDto } from '../../../types';

interface UseVenueOptions {
  enabled?: boolean;
}

export const useVenue = (id: number, options: UseVenueOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<VenueDto>({
    queryKey: ['venues', id],
    queryFn: () => venuesApi.getVenueById(id),
    enabled: enabled && !!id,
  });
};

