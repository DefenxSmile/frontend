import { baseApi } from './baseApi';
import type { ReservationObjectDto, ReservationObjectRequestDto, ReservationObjectQueryParams, PageResponse } from '../../types';
import { mockReservationObjectsApi } from '../../mocks/reservationObjects';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const reservationObjectsApi = {
  getAllReservationObjects: async (params?: ReservationObjectQueryParams): Promise<ReservationObjectDto[]> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.getAllReservationObjects(params);
    }
    const response = await baseApi.get<PageResponse<ReservationObjectDto>, ReservationObjectQueryParams>('/reservation-objects', params);
    return response.content;
  },

  getReservationObjectById: async (id: number): Promise<ReservationObjectDto> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.getReservationObjectById(id);
    }
    return baseApi.get<ReservationObjectDto>(`/reservation-objects/${id}`);
  },

  createReservationObject: async (data: ReservationObjectRequestDto): Promise<ReservationObjectDto> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.createReservationObject(data);
    }
    return baseApi.post<ReservationObjectDto>('/reservation-objects', data);
  },

  updateReservationObject: async (id: number, data: ReservationObjectRequestDto): Promise<ReservationObjectDto> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.updateReservationObject(id, data);
    }
    return baseApi.put<ReservationObjectDto>(`/reservation-objects/${id}`, data);
  },

  deleteReservationObject: async (id: number): Promise<void> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.deleteReservationObject(id);
    }
    return baseApi.delete<void>(`/reservation-objects/${id}`);
  },
};

