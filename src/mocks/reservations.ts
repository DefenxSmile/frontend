import { delay } from './utils';
import { mockReservations, mockReservationObjects, getNextReservationId } from './data';
import type { ReservationDto, ReservationRequestDto, ReservationUpdateDto, ReservationQueryParams } from '../types';

let reservations = [...mockReservations];
let nextClientId = 100;

const getMockUser = (id: number) => ({
  id,
  name: `Гость ${id}`,
  phone: `+7 (999) ${100 + id}-${10 + id}-${20 + id}`,
});

export const mockReservationsApi = {
  getReservations: async (params?: ReservationQueryParams): Promise<ReservationDto[]> => {
    await delay(500);
    let result = [...reservations];

    if (params?.clientId) {
      result = result.filter((r) => r.clientId === params.clientId);
    }

    if (params?.reservationObjectId) {
      result = result.filter((r) => r.reservationObjectId === params.reservationObjectId);
    }

    if (params?.status) {
      result = result.filter((r) => r.status === params.status);
    }

    return result;
  },

  getReservationById: async (id: number): Promise<ReservationDto> => {
    await delay(300);
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    return { ...reservation };
  },

  createReservation: async (data: ReservationRequestDto): Promise<ReservationDto> => {
    await delay(500);
    const reservationObject = mockReservationObjects.find((o) => o.id === data.reservationObjectId);
    
    const clientId = nextClientId++;
    const newReservation: ReservationDto = {
      id: getNextReservationId(),
      reservationObjectId: data.reservationObjectId,
      reservationObject: reservationObject,
      clientId: clientId,
      client: getMockUser(clientId),
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      status: 'PENDING',
      notes: data.notes,
    };
    
    reservations.push(newReservation);
    return { ...newReservation };
  },

  updateReservation: async (id: number, data: ReservationUpdateDto): Promise<ReservationDto> => {
    await delay(500);
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    reservations[index] = { ...reservations[index], ...data };
    return { ...reservations[index] };
  },

  cancelReservation: async (id: number): Promise<void> => {
    await delay(300);
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    reservations[index] = { ...reservations[index], status: 'CANCELLED' };
  },
};

