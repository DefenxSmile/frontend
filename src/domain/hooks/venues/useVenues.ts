import { useQuery } from '@tanstack/react-query';
import { venuesApi } from '../../api/venues';
import type { VenueDto } from '../../../types';
import type { VenueQueryParams } from '../../api/venues';

export const useVenues = (params?: VenueQueryParams) => {
  return useQuery<VenueDto[]>({
    queryKey: ['venues', params],
    queryFn: () => venuesApi.getAllVenues(params),
  });
};

