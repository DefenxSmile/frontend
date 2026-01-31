import { baseApi } from './baseApi';
import { dataURLtoBlob, isDataUrl } from './formDataUtils';
import type { VenueDto, VenueRequestDto, PaginationParams, PageResponse } from '../../types';
import { mockVenuesApi } from '../../mocks/venues';

export interface VenueQueryParams extends PaginationParams {}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

function buildVenueFormData(data: VenueRequestDto, id?: number): FormData {
  const formData = new FormData();
  const imagePayload = data.image ?? { id: 0, url: '' };
  const isNewImage = data.image && isDataUrl(data.image.url);
  const objectPayload = {
    id: id ?? 0,
    name: data.name,
    address: data.address ?? '',
    description: data.description ?? '',
    phone: data.phone ?? '',
    image: isNewImage ? { id: 0, url: '' } : imagePayload,
  };
  formData.append('object', JSON.stringify(objectPayload));
  if (isNewImage && data.image) {
    const blob = dataURLtoBlob(data.image.url);
    formData.append('image', blob, 'image.jpg');
  }
  return formData;
}

export const venuesApi = {
  getAllVenues: async (params?: VenueQueryParams): Promise<VenueDto[]> => {
    if (USE_MOCKS) {
      return mockVenuesApi.getAllVenues();
    }
    const response = await baseApi.get<PageResponse<VenueDto>, VenueQueryParams>('/venues', params);
    return response.content;
  },

  getVenueById: async (id: number): Promise<VenueDto> => {
    if (USE_MOCKS) {
      return mockVenuesApi.getVenueById(id);
    }
    return baseApi.get<VenueDto>(`/venues/${id}`);
  },

  createVenue: async (data: VenueRequestDto): Promise<VenueDto> => {
    if (USE_MOCKS) {
      return mockVenuesApi.createVenue(data);
    }
    const formData = buildVenueFormData(data);
    return baseApi.post<VenueDto>('/venues', formData);
  },

  updateVenue: async (id: number, data: VenueRequestDto): Promise<VenueDto> => {
    if (USE_MOCKS) {
      return mockVenuesApi.updateVenue(id, data);
    }
    const formData = buildVenueFormData(data, id);
    return baseApi.put<VenueDto>(`/venues/${id}`, formData);
  },

  deleteVenue: async (id: number): Promise<void> => {
    if (USE_MOCKS) {
      return mockVenuesApi.deleteVenue(id);
    }
    return baseApi.delete<void>(`/venues/${id}`);
  },
};

