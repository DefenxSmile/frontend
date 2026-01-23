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

interface ReservationsTableProps {
  reservations: ReservationDto[];
  showActions?: boolean;
  onCancel?: (id: number) => void;
}

const getStatusColor = (status: ReservationStatus): string => {
  switch (status) {
    case 'CONFIRMED':
      return '#10B981';
    case 'PENDING':
      return '#F59E0B';
    case 'CANCELLED':
      return '#EF4444';
    case 'COMPLETED':
      return '#6B7280';
    default:
      return '#9CA3AF';
  }
};

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

const getStatusBgColor = (status: ReservationStatus): string => {
  switch (status) {
    case 'CONFIRMED':
      return '#D1FAE5';
    case 'PENDING':
      return '#FEF3C7';
    case 'CANCELLED':
      return '#FEE2E2';
    case 'COMPLETED':
      return '#F3F4F6';
    default:
      return '#F9FAFB';
  }
};

export const ReservationsTable = ({ reservations, showActions, onCancel }: ReservationsTableProps) => {
  if (reservations.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          padding: '48px 24px',
        }}
      >
        <EventIcon sx={{ fontSize: '64px', color: '#D1D5DB', marginBottom: '16px' }} />
        <Typography
          variant="h6"
          sx={{
            color: '#6B7280',
            marginBottom: '8px',
            fontWeight: 600,
          }}
        >
          Нет бронирований
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#9CA3AF',
          }}
        >
          Здесь будут отображаться ваши бронирования
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {reservations.map((reservation) => {
        const startDate = new Date(reservation.startDateTime);
        const endDate = new Date(reservation.endDateTime);
        const statusColor = getStatusColor(reservation.status);
        const statusBgColor = getStatusBgColor(reservation.status);

        return (
          <Card
            key={reservation.id}
            sx={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderColor: '#D1D5DB',
              },
            }}
          >
            <CardContent sx={{ padding: '24px !important' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                {/* Левая часть - информация о бронировании */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RestaurantIcon sx={{ fontSize: '24px', color: 'white' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.125rem',
                          color: '#1F2937',
                          marginBottom: '4px',
                        }}
                      >
                        {reservation.reservationObject?.name || 'Не указано'}
                      </Typography>
                      <Chip
                        label={getStatusLabel(reservation.status)}
                        size="small"
                        sx={{
                          backgroundColor: statusBgColor,
                          color: statusColor,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: '24px',
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                      gap: '16px',
                    }}
                  >
                    {/* Клиент */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: '20px', color: '#6B7280', marginTop: '2px', flexShrink: 0 }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.75rem',
                            color: '#9CA3AF',
                            marginBottom: '4px',
                            fontWeight: 500,
                          }}
                        >
                          Клиент
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '0.9375rem',
                            color: '#1F2937',
                            fontWeight: 600,
                            marginBottom: '4px',
                          }}
                        >
                          {reservation.client?.name || 'Не указано'}
                        </Typography>
                        {reservation.client?.phone && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <PhoneIcon sx={{ fontSize: '14px', color: '#9CA3AF' }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.875rem',
                                color: '#6B7280',
                              }}
                            >
                              {reservation.client.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Время */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                      }}
                    >
                      <TimeIcon sx={{ fontSize: '20px', color: '#6B7280', marginTop: '2px', flexShrink: 0 }} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.75rem',
                            color: '#9CA3AF',
                            marginBottom: '4px',
                            fontWeight: 500,
                          }}
                        >
                          Время бронирования
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '0.9375rem',
                            color: '#1F2937',
                            fontWeight: 600,
                            marginBottom: '2px',
                          }}
                        >
                          {format(startDate, 'dd MMMM yyyy', { locale: ru })}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.875rem',
                            color: '#6B7280',
                          }}
                        >
                          {format(startDate, 'HH:mm', { locale: ru })} - {format(endDate, 'HH:mm', { locale: ru })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Примечания */}
                  {reservation.notes && (
                    <Box
                      sx={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          marginBottom: '4px',
                          fontWeight: 500,
                        }}
                      >
                        Примечания
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          lineHeight: 1.6,
                        }}
                      >
                        {reservation.notes}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Правая часть - действия */}
                {showActions && onCancel && reservation.status !== 'CANCELLED' && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => onCancel(reservation.id)}
                      sx={{
                        borderColor: '#EF4444',
                        color: '#EF4444',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        padding: '8px 16px',
                        '&:hover': {
                          borderColor: '#DC2626',
                          backgroundColor: '#FEE2E2',
                        },
                      }}
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
