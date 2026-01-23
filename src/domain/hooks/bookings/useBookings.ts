import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/bookings';
import type { ReservationDto, ReservationQueryParams } from '../../../types';

interface UseReservationsOptions {
  enabled?: boolean;
}

export const useReservations = (params?: ReservationQueryParams, options: UseReservationsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<ReservationDto[]>({
    queryKey: ['reservations', params],
    queryFn: () => reservationsApi.getReservations(params),
    enabled,
  });
};

