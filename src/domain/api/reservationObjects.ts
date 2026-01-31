import { baseApi } from './baseApi';
import { dataURLtoBlob, isDataUrl } from './formDataUtils';
import type { ReservationObjectDto, ReservationObjectRequestDto, ReservationObjectQueryParams, PageResponse } from '../../types';
import { mockReservationObjectsApi } from '../../mocks/reservationObjects';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * По OpenAPI: part "object" = ReservationObjectRequestDto (name, venueId, description?, capacity?);
 * part "images" = массив binary (optional).
 */
function buildReservationObjectFormData(data: ReservationObjectRequestDto, _id?: number): FormData {
  const formData = new FormData();
  const objectPayload = {
    name: data.name,
    description: data.description ?? '',
    capacity: data.capacity ?? 0,
    venueId: data.venueId,
  };
  formData.append('object', JSON.stringify(objectPayload));
  if (data.image && isDataUrl(data.image.url)) {
    const blob = dataURLtoBlob(data.image.url);
    formData.append('images', blob, 'image.jpg');
  }
  return formData;
}

export const reservationObjectsApi = {
  getAllReservationObjects: async (params?: ReservationObjectQueryParams): Promise<ReservationObjectDto[]> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.getAllReservationObjects(params);
    }
    // По OpenAPI ответ — массив, не PageResponse
    const response = await baseApi.get<ReservationObjectDto[] | PageResponse<ReservationObjectDto>, ReservationObjectQueryParams>('/reservation-objects', params);
    return Array.isArray(response) ? response : response.content;
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
    const formData = buildReservationObjectFormData(data);
    return baseApi.post<ReservationObjectDto>('/reservation-objects', formData);
  },

  updateReservationObject: async (id: number, data: ReservationObjectRequestDto): Promise<ReservationObjectDto> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.updateReservationObject(id, data);
    }
    const formData = buildReservationObjectFormData(data, id);
    return baseApi.put<ReservationObjectDto>(`/reservation-objects/${id}`, formData);
  },

  deleteReservationObject: async (id: number): Promise<void> => {
    if (USE_MOCKS) {
      return mockReservationObjectsApi.deleteReservationObject(id);
    }
    return baseApi.delete<void>(`/reservation-objects/${id}`);
  },
};

