import { useQuery } from '@tanstack/react-query';
import { reservationObjectsApi } from '../../api/reservationObjects';
import type { ReservationObjectDto, ReservationObjectQueryParams } from '../../../types';

interface UseReservationObjectsOptions {
  enabled?: boolean;
}

export const useReservationObjects = (params?: ReservationObjectQueryParams, options: UseReservationObjectsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<ReservationObjectDto[]>({
    queryKey: ['reservation-objects', params],
    queryFn: () => reservationObjectsApi.getAllReservationObjects(params),
    enabled,
  });
};

