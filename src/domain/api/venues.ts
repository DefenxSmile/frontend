import { baseApi } from './baseApi';
import type { VenueDto, VenueRequestDto, PaginationParams, PageResponse } from '../../types';
import { mockVenuesApi } from '../../mocks/venues';

export interface VenueQueryParams extends PaginationParams {}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

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
    return baseApi.post<VenueDto>('/venues', data);
  },

  updateVenue: async (id: number, data: VenueRequestDto): Promise<VenueDto> => {
    if (USE_MOCKS) {
      return mockVenuesApi.updateVenue(id, data);
    }
    return baseApi.put<VenueDto>(`/venues/${id}`, data);
  },

  deleteVenue: async (id: number): Promise<void> => {
    if (USE_MOCKS) {
      return mockVenuesApi.deleteVenue(id);
    }
    return baseApi.delete<void>(`/venues/${id}`);
  },
};

