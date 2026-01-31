import { delay } from './utils';
import { mockReservationObjects, getNextReservationObjectId } from './data';
import type {
  ReservationObjectDto,
  ReservationObjectRequestDto,
  ReservationObjectQueryParams,
} from '../types';

let reservationObjects = [...mockReservationObjects];

export const mockReservationObjectsApi = {
  getAllReservationObjects: async (
    params?: ReservationObjectQueryParams
  ): Promise<ReservationObjectDto[]> => {
    await delay(500);
    let result = [...reservationObjects];

    if (params?.venueId) {
      result = result.filter((obj) => obj.venueId === params.venueId);
    }

    return result;
  },

  getReservationObjectById: async (id: number): Promise<ReservationObjectDto> => {
    await delay(300);
    const obj = reservationObjects.find((o) => o.id === id);
    if (!obj) {
      throw new Error(`Reservation object with id ${id} not found`);
    }
    return { ...obj };
  },

  createReservationObject: async (
    data: ReservationObjectRequestDto
  ): Promise<ReservationObjectDto> => {
    await delay(500);
    const newObject: ReservationObjectDto = {
      id: getNextReservationObjectId(),
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      venueId: data.venueId,
      images: data.image ? [data.image] : [],
    };
    reservationObjects.push(newObject);
    return { ...newObject };
  },

  updateReservationObject: async (
    id: number,
    data: ReservationObjectRequestDto
  ): Promise<ReservationObjectDto> => {
    await delay(500);
    const index = reservationObjects.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Reservation object with id ${id} not found`);
    }
    const existing = reservationObjects[index];
    const updated: ReservationObjectDto = {
      ...existing,
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      venueId: data.venueId,
      images: data.image
        ? [...(existing.images ?? []), data.image]
        : existing.images,
    };
    reservationObjects[index] = updated;
    return { ...updated };
  },

  deleteReservationObject: async (id: number): Promise<void> => {
    await delay(300);
    const index = reservationObjects.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Reservation object with id ${id} not found`);
    }
    reservationObjects.splice(index, 1);
  },
};

