import { useQuery } from '@tanstack/react-query';
import { tablesApi } from '../../api/tables';

export const useTables = (venueId: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['tables', venueId],
    queryFn: () => tablesApi.getTablesByVenue(venueId),
    enabled: options?.enabled !== false && !!venueId,
  });
};

