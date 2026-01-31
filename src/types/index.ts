export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface ImageDto {
  id: number;
  url: string;
}

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
  image?: ImageDto;
}

export interface VenueRequestDto {
  name: string;
  address?: string;
  description?: string;
  phone?: string;
  /** Для POST (создание); в PUT не передаётся */
  image?: ImageDto;
}

export interface ReservationObjectDto {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
  venueId: number;
  venue?: VenueDto;
  /** Массив изображений (по OpenAPI) */
  images?: ImageDto[];
}

export interface ReservationObjectRequestDto {
  name: string;
  description?: string;
  capacity?: number;
  venueId: number;
  /** Только для превью в форме; в API не входит в part "object", отправляется в part "images" */
  image?: ImageDto;
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

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
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

