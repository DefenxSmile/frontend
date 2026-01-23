import { useQuery } from '@tanstack/react-query';
import { tablesApi } from '../../api/tables';

export const useHalls = (venueId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['halls', venueId],
    queryFn: () => tablesApi.getHallsByVenue(venueId),
    enabled: options?.enabled !== false && !!venueId,
  });
};

