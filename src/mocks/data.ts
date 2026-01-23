import type {
  VenueDto,
  ReservationObjectDto,
  ReservationDto,
  ReservationStatus,
} from '../types';

export const mockVenues: VenueDto[] = [
  {
    id: 1,
    name: 'Рыба и Мясо',
    address: 'Москва, Петровка, 38',
    phone: '+7 (495) 123-45-67',
    description: 'Ресторан европейской кухни с уютной атмосферой',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Итальянская кухня',
    address: 'Москва, Тверская, 15',
    phone: '+7 (495) 234-56-78',
    description: 'Аутентичная итальянская кухня в центре Москвы',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Суши-бар Сакура',
    address: 'Москва, Арбат, 22',
    phone: '+7 (495) 345-67-89',
    description: 'Японская кухня и свежие морепродукты',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
  },
];

export const mockReservationObjects: ReservationObjectDto[] = [
  {
    id: 1,
    name: 'Стол №17',
    description: 'Уютный столик у окна',
    capacity: 4,
    venueId: 1,
    venue: mockVenues[0],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Стол №20',
    description: 'Большой стол для компании',
    capacity: 15,
    venueId: 1,
    venue: mockVenues[0],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'VIP-диван',
    description: 'Комфортный диван для романтического ужина',
    capacity: 2,
    venueId: 1,
    venue: mockVenues[0],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Стол №5',
    description: 'Столик в основном зале',
    capacity: 6,
    venueId: 2,
    venue: mockVenues[1],
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Барная стойка',
    description: 'Места у барной стойки',
    capacity: 8,
    venueId: 2,
    venue: mockVenues[1],
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    name: 'Стол №12',
    description: 'Традиционный японский стол',
    capacity: 4,
    venueId: 3,
    venue: mockVenues[2],
    // Без изображения для демонстрации placeholder
  },
];

const getMockUser = (id: number) => ({
  id,
  name: `Гость ${id}`,
  phone: `+7 (999) ${100 + id}-${10 + id}-${20 + id}`,
});

export const mockReservations: ReservationDto[] = [
  {
    id: 1,
    reservationObjectId: 1,
    reservationObject: mockReservationObjects[0],
    clientId: 1,
    client: getMockUser(1),
    startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Завтра
    endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    status: 'CONFIRMED' as ReservationStatus,
    notes: 'День рождения',
  },
  {
    id: 2,
    reservationObjectId: 2,
    reservationObject: mockReservationObjects[1],
    clientId: 2,
    client: getMockUser(2),
    startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING' as ReservationStatus,
    notes: '',
  },
  {
    id: 3,
    reservationObjectId: 3,
    reservationObject: mockReservationObjects[2],
    clientId: 3,
    client: getMockUser(3),
    startDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Вчера
    endDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED' as ReservationStatus,
    notes: 'Романтический ужин',
  },
];

// Генератор ID для новых сущностей
let nextVenueId = 10;
let nextReservationObjectId = 10;
let nextReservationId = 10;

export const getNextVenueId = () => nextVenueId++;
export const getNextReservationObjectId = () => nextReservationObjectId++;
export const getNextReservationId = () => nextReservationId++;

