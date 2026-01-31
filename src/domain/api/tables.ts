import { baseApi } from './baseApi';
import type { ImageDto } from '../../types';

export type { ImageDto };

export interface TableResponseDto {
  id: string;
  venueId: number;
  hallId?: string;
  hallName: string;
  tableNumber: string;
  capacity: number;
  image?: ImageDto;
  price?: number;
  status: 'available' | 'occupied' | 'reserved' | 'closing' | 'waiting';
  availableUntil?: string;
  occupiedFrom?: string;
  occupiedUntil?: string;
  timeUntilBooking?: string;
  position?: number;
  createdAt?: string;
}

export interface HallResponseDto {
  id: string;
  name: string;
  venueId: number;
}

export const tablesApi = {
  getTablesByVenue: async (venueId: number): Promise<TableResponseDto[]> => {
    return baseApi.get<TableResponseDto[]>(`/venues/${venueId}/tables`);
  },

  getTableById: async (venueId: number, tableId: string): Promise<TableResponseDto> => {
    return baseApi.get<TableResponseDto>(`/venues/${venueId}/tables/${tableId}`);
  },

  getHallsByVenue: async (venueId: number): Promise<HallResponseDto[]> => {
    return baseApi.get<HallResponseDto[]>(`/venues/${venueId}/halls`);
  },
};

