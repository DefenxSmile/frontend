export type TimeSlotOption = string;

import type { ImageDto } from '../../types';

export interface FilteredReservationObject {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
  venueId: number;
  images?: ImageDto[];
  isOccupied: boolean;
}
