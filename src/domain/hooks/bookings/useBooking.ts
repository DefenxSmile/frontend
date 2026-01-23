import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/bookings';
import type { ReservationDto } from '../../../types';

interface UseReservationOptions {
  enabled?: boolean;
}

export const useReservation = (id: number, options: UseReservationOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<ReservationDto>({
    queryKey: ['reservations', id],
    queryFn: () => reservationsApi.getReservationById(id),
    enabled: enabled && !!id,
  });
};

