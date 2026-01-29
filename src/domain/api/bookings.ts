import { baseApi } from './baseApi';
import type { ReservationDto, ReservationRequestDto, ReservationUpdateDto, ReservationQueryParams, PageResponse } from '../../types';
import { mockReservationsApi } from '../../mocks/reservations';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const reservationsApi = {
  getReservations: async (params?: ReservationQueryParams): Promise<ReservationDto[]> => {
    if (USE_MOCKS) {
      return mockReservationsApi.getReservations(params);
    }
    const response = await baseApi.get<PageResponse<ReservationDto>, ReservationQueryParams>('/reservations', params);
    return response.content;
  },

  getReservationById: async (id: number): Promise<ReservationDto> => {
    if (USE_MOCKS) {
      return mockReservationsApi.getReservationById(id);
    }
    return baseApi.get<ReservationDto>(`/reservations/${id}`);
  },

  createReservation: async (data: ReservationRequestDto): Promise<ReservationDto> => {
    if (USE_MOCKS) {
      return mockReservationsApi.createReservation(data);
    }
    return baseApi.post<ReservationDto>('/reservations', data);
  },

  updateReservation: async (id: number, data: ReservationUpdateDto): Promise<ReservationDto> => {
    if (USE_MOCKS) {
      return mockReservationsApi.updateReservation(id, data);
    }
    return baseApi.put<ReservationDto>(`/reservations/${id}`, data);
  },

  cancelReservation: async (id: number): Promise<void> => {
    if (USE_MOCKS) {
      return mockReservationsApi.cancelReservation(id);
    }
    return baseApi.delete<void>(`/reservations/${id}`);
  },
};

