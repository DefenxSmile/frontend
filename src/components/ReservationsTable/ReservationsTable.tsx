import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ReservationDto, ReservationStatus } from '../../types';
import './ReservationsTable.scss';

interface ReservationsTableProps {
  reservations: ReservationDto[];
  showActions?: boolean;
  onCancel?: (id: number) => void;
}

const getStatusLabel = (status: ReservationStatus): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'Подтверждено';
    case 'PENDING':
      return 'Ожидает';
    case 'CANCELLED':
      return 'Отменено';
    case 'COMPLETED':
      return 'Завершено';
    default:
      return status;
  }
};

export const ReservationsTable = ({ reservations, showActions, onCancel }: ReservationsTableProps) => {
  if (reservations.length === 0) {
    return (
      <Box className="text-center py-12 px-6">
        <EventIcon className="text-[64px] text-gray-300 mb-4" />
        <Typography variant="h6" className="text-gray-500 mb-2 font-semibold">
          Нет бронирований
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Здесь будут отображаться ваши бронирования
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-4">
      {reservations.map((reservation) => {
        const startDate = new Date(reservation.startDateTime);
        const endDate = new Date(reservation.endDateTime);

        return (
          <Card
            key={reservation.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
          >
            <CardContent className="!p-6">
              <Box className="flex justify-between items-start mb-5 flex-wrap gap-4">
                <Box className="flex-1 min-w-0">
                  <Box className="flex items-center gap-3 mb-4">
                    <Box className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                      <RestaurantIcon className="text-2xl text-white" />
                    </Box>
                    <Box className="flex-1 min-w-0">
                      <Typography variant="h6" className="font-bold text-lg text-gray-800 mb-1">
                        {reservation.reservationObject?.name || 'Не указано'}
                      </Typography>
                      <Chip
                        label={getStatusLabel(reservation.status)}
                        size="small"
                        className={`reservations-table-chip reservations-table-chip--${reservation.status}`}
                      />
                    </Box>
                  </Box>

                  <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Box className="flex items-start gap-2">
                      <PersonIcon className="text-gray-500 text-xl mt-0.5 shrink-0" />
                      <Box className="min-w-0">
                        <Typography variant="body2" className="text-xs text-gray-400 mb-1 font-medium">
                          Клиент
                        </Typography>
                        <Typography variant="body1" className="text-[0.9375rem] text-gray-800 font-semibold mb-1">
                          {reservation.client?.name || 'Не указано'}
                        </Typography>
                        {reservation.client?.phone && (
                          <Box className="flex items-center gap-1">
                            <PhoneIcon className="text-sm text-gray-400" />
                            <Typography variant="body2" className="text-sm text-gray-500">
                              {reservation.client.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box className="flex items-start gap-2">
                      <TimeIcon className="text-gray-500 text-xl mt-0.5 shrink-0" />
                      <Box className="min-w-0">
                        <Typography variant="body2" className="text-xs text-gray-400 mb-1 font-medium">
                          Время бронирования
                        </Typography>
                        <Typography variant="body1" className="text-[0.9375rem] text-gray-800 font-semibold mb-0.5">
                          {format(startDate, 'dd MMMM yyyy', { locale: ru })}
                        </Typography>
                        <Typography variant="body2" className="text-sm text-gray-500">
                          {format(startDate, 'HH:mm', { locale: ru })} - {format(endDate, 'HH:mm', { locale: ru })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {reservation.notes && (
                    <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <Typography variant="body2" className="text-xs text-gray-400 mb-1 font-medium">
                        Примечания
                      </Typography>
                      <Typography variant="body2" className="text-sm text-gray-700 leading-relaxed">
                        {reservation.notes}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {showActions && onCancel && reservation.status !== 'CANCELLED' && (
                  <Box className="flex flex-col gap-2">
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => onCancel(reservation.id)}
                      className="reservations-table-btn-cancel"
                    >
                      Отменить
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
