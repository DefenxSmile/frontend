import { delay } from './utils';
import { mockVenues, getNextVenueId } from './data';
import type { VenueDto, VenueRequestDto } from '../types';

let venues = [...mockVenues];

export const mockVenuesApi = {
  getAllVenues: async (): Promise<VenueDto[]> => {
    await delay(500);
    return [...venues];
  },

  getVenueById: async (id: number): Promise<VenueDto> => {
    await delay(300);
    const venue = venues.find((v) => v.id === id);
    if (!venue) {
      throw new Error(`Venue with id ${id} not found`);
    }
    return { ...venue };
  },

  createVenue: async (data: VenueRequestDto): Promise<VenueDto> => {
    await delay(500);
    const newVenue: VenueDto = {
      id: getNextVenueId(),
      ...data,
    };
    venues.push(newVenue);
    return { ...newVenue };
  },

  updateVenue: async (id: number, data: VenueRequestDto): Promise<VenueDto> => {
    await delay(500);
    const index = venues.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Venue with id ${id} not found`);
    }
    venues[index] = { ...venues[index], ...data };
    return { ...venues[index] };
  },

  deleteVenue: async (id: number): Promise<void> => {
    await delay(300);
    const index = venues.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Venue with id ${id} not found`);
    }
    venues.splice(index, 1);
  },
};

