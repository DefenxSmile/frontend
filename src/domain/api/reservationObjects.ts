import { baseApi } from './baseApi';
import type { ReservationObjectDto, ReservationObjectRequestDto, ReservationObjectQueryParams } from '../../types';
import { mockReservationObjectsApi } from '../../mocks/reservationObjects';

const USE_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS !== 'false';

export const reservationObjectsApi = {
  getAllReservationObjects: async (params?: ReservationObjectQueryParams): Promise<ReservationObjectDto[]> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.getAllReservationObjects(params);
    }
    return baseApi.get<ReservationObjectDto[], ReservationObjectQueryParams>('/reservation-objects', params);
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

