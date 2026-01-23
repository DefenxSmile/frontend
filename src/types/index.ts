// Types based on OpenAPI specification

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface UserDto {
  id: number;
  name: string;
  phone?: string;
}

export interface UserRequestDto {
  name: string;
  phone?: string;
}

export interface VenueDto {
  id: number;
  name: string;
  address?: string;
  description?: string;
  phone?: string;
  imageUrl?: string;
}

export interface VenueRequestDto {
  name: string;
  address?: string;
  description?: string;
  phone?: string;
  imageUrl?: string;
}

export interface ReservationObjectDto {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
  venueId: number;
  venue?: VenueDto;
  imageUrl?: string;
}

export interface ReservationObjectRequestDto {
  name: string;
  description?: string;
  capacity?: number;
  venueId: number;
  imageUrl?: string;
}

export interface ReservationDto {
  id: number;
  reservationObjectId: number;
  reservationObject?: ReservationObjectDto;
  clientId: number;
  client?: UserDto;
  startDateTime: string;
  endDateTime: string;
  status: ReservationStatus;
  notes?: string;
}

export interface ReservationRequestDto {
  reservationObjectId: number;
  startDateTime: string;
  endDateTime: string;
  notes?: string;
}

export interface ReservationUpdateDto {
  startDateTime?: string;
  endDateTime?: string;
  status?: ReservationStatus;
  notes?: string;
}

export interface SendCodeRequest {
  phone: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface AuthResponse {
  token: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ReservationQueryParams extends PaginationParams {
  clientId?: number;
  reservationObjectId?: number;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

export interface ReservationObjectQueryParams extends PaginationParams {
  venueId?: number;
}

