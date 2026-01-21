import { baseApi } from './baseApi';
import type { FloorPlanData } from '../../types/floorPlan';

export interface VenueRequestDto {
  floorPlan: FloorPlanData;
}

export interface VenueResponseDto {
  id: number;
  floorPlan: FloorPlanData;
}

export const venuesApi = {
  getAllVenues: async (): Promise<VenueResponseDto[]> => {
    return baseApi.get<VenueResponseDto[]>('/venues');
  },

  getVenueById: async (id: number): Promise<VenueResponseDto> => {
    return baseApi.get<VenueResponseDto>(`/venues/${id}`);
  },

  createVenue: async (data: VenueRequestDto): Promise<VenueResponseDto> => {
    return baseApi.post<VenueResponseDto>('/venues', data);
  },

  updateVenue: async (id: number, data: VenueRequestDto): Promise<VenueResponseDto> => {
    return baseApi.put<VenueResponseDto>(`/venues/${id}`, data);
  },

  deleteVenue: async (id: number): Promise<void> => {
    return baseApi.delete<void>(`/venues/${id}`);
  },
};

