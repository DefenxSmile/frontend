import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  Fade,
  Container,
  Grow,
  Drawer,
  IconButton,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  TableRestaurant as TableIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale/ru';
import { useVenues } from '../../domain/hooks/venues/useVenues';
import { useVenue } from '../../domain/hooks/venues/useVenue';
import { useReservationObjects } from '../../domain/hooks/reservationObjects/useReservationObjects';
import { useReservations } from '../../domain/hooks/bookings/useBookings';
import { useCreateReservation } from '../../domain/hooks/bookings/useCreateBooking';
import { useCancelReservation } from '../../domain/hooks/bookings/useDeleteBooking';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import {
  ReservationsTable,
  ConfirmDialog,
} from '../../components';
import './UserPage.scss';

const UserPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(new Date());
  const [filterTimeSlot, setFilterTimeSlot] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guests, setGuests] = useState<number>(2);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const { data: venues } = useVenues();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Устанавливаем первое заведение по умолчанию
  useEffect(() => {
    if (venues && venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId]);

  const { data: selectedVenue } = useVenue(selectedVenueId || 0, { enabled: !!selectedVenueId });
  const { data: reservationObjects } = useReservationObjects(
    selectedVenueId ? { venueId: selectedVenueId } : undefined,
    { enabled: !!selectedVenueId }
  );
  const { data: allReservations } = useReservations(
    selectedVenueId ? { reservationObjectId: undefined } : undefined,
    { enabled: !!selectedVenueId }
  );
  const { data: myReservations } = useReservations(undefined, { enabled: true });
  const createReservation = useCreateReservation();
  const cancelReservation = useCancelReservation();
  const timeSlots = useTimeSlots();
  const confirmDialog = useConfirmDialog();

  // Фильтрация столов по занятости
  const filteredObjects = useMemo(() => {
    if (!reservationObjects) {
      return [];
    }

    if (!filterDate || !filterTimeSlot) {
      return reservationObjects.map((obj) => ({ ...obj, isOccupied: false }));
    }

    const [hours, minutes] = filterTimeSlot.split(':').map(Number);
    const filterStart = new Date(filterDate);
    filterStart.setHours(hours, minutes, 0, 0);
    const filterEnd = new Date(filterStart);
    filterEnd.setHours(hours + 2, minutes, 0, 0);

    return reservationObjects.map((obj) => {
      const isOccupied = allReservations?.some((reservation) => {
        if (reservation.reservationObjectId !== obj.id || reservation.status === 'CANCELLED') {
          return false;
        }
        const resStart = new Date(reservation.startDateTime);
        const resEnd = new Date(reservation.endDateTime);
        // Проверяем пересечение временных интервалов
        return resStart < filterEnd && resEnd > filterStart;
      });

      return {
        ...obj,
        isOccupied: !!isOccupied,
      };
    });
  }, [reservationObjects, allReservations, filterDate, filterTimeSlot]);

  const handleTableClick = (objectId: number) => {
    setSelectedObjectId(objectId);
    setSelectedDate(filterDate || new Date());
    setSelectedTime(filterTimeSlot || '');
    setDrawerOpen(true);
  };

  const handleBookTable = async () => {
    if (!selectedVenueId || !selectedDate || !selectedTime || !selectedObjectId || !clientName || !clientPhone) {
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(hours + 2, minutes, 0, 0);

    try {
      await createReservation.mutateAsync({
        reservationObjectId: selectedObjectId,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        notes: notes || undefined,
      });
      setDrawerOpen(false);
      setSelectedTime('');
      setSelectedObjectId(null);
      setNotes('');
      setClientName('');
      setClientPhone('');
      setActiveTab(1);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleCancelReservation = async (id: number) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Отмена бронирования',
      message: 'Вы уверены, что хотите отменить это бронирование?',
      confirmText: 'Отменить',
      cancelText: 'Нет',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        await cancelReservation.mutateAsync(id);
      } catch (error) {
        console.error('Error canceling reservation:', error);
      }
    }
  };

  const selectedObject = reservationObjects?.find((obj) => obj.id === selectedObjectId);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
          paddingTop: { xs: '48px', sm: '64px' },
          paddingBottom: '64px',
        }}
      >
        <Container maxWidth="lg">
          {/* Блок выбора заведения */}
          <Grow in={mounted} timeout={600}>
            <Card
              sx={{
                backgroundColor: 'white',
                borderRadius: '24px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                marginBottom: '32px',
                padding: { xs: '24px', sm: '32px' },
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '24px', width: '100%', alignItems: { xs: 'flex-start', md: 'center' } }}>
                {selectedVenue ? (
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        color: '#1F2937',
                        marginBottom: '8px',
                        letterSpacing: '-0.02em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {selectedVenue.name}
                    </Typography>
                    {selectedVenue.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                        <LocationOnIcon sx={{ fontSize: '18px' }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.875rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {selectedVenue.address}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#9CA3AF',
                        fontSize: '0.9375rem',
                      }}
                    >
                      Выберите заведение
                    </Typography>
                  </Box>
                )}
                <FormControl
                  sx={{
                    minWidth: { xs: '100%', md: '280px' },
                    backgroundColor: '#F9FAFB',
                    borderRadius: '12px',
                  }}
                >
                  <Select
                    value={selectedVenueId || ''}
                    onChange={(e) => setSelectedVenueId(e.target.value as number)}
                    sx={{
                      color: '#1F2937',
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    {venues?.map((venue) => (
                      <MenuItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Card>
          </Grow>

          {selectedVenueId && (
            <>
              {/* Табы */}
              <Grow in={mounted} timeout={800} style={{ transitionDelay: '200ms' }}>
                <Box
                  sx={{
                    marginBottom: '32px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        minHeight: '56px',
                        padding: '12px 24px',
                        color: '#6B7280',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                          color: '#1F2937',
                        },
                      },
                      '& .Mui-selected': {
                        color: '#667eea',
                        backgroundColor: '#F3F4F6',
                      },
                      '& .MuiTabs-indicator': {
                        display: 'none',
                      },
                    }}
                  >
                    <Tab
                      label="Забронировать"
                      icon={<CalendarIcon sx={{ fontSize: '20px', marginRight: '8px' }} />}
                      iconPosition="start"
                    />
                    <Tab
                      label="Мои бронирования"
                      icon={<TableIcon sx={{ fontSize: '20px', marginRight: '8px' }} />}
                      iconPosition="start"
                    />
                  </Tabs>
                </Box>
              </Grow>

              {activeTab === 0 && (
                <Fade in={activeTab === 0} timeout={300}>
                  <Box>
                    {/* Фильтр по времени */}
                    <Card
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                        marginBottom: '32px',
                        padding: '24px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <TimeIcon sx={{ fontSize: '24px', color: '#667eea' }} />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            color: '#1F2937',
                          }}
                        >
                          Фильтр по времени
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                          gap: '20px',
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px',
                            }}
                          >
                            <CalendarIcon sx={{ fontSize: '20px', color: '#667eea' }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#374151',
                              }}
                            >
                              Дата
                            </Typography>
                          </Box>
                          <DatePicker
                            value={filterDate}
                            onChange={(newValue) => setFilterDate(newValue)}
                            format="dd MMMM yyyy"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                variant: 'outlined',
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#F9FAFB',
                                    '&:hover': {
                                      backgroundColor: '#F3F4F6',
                                    },
                                    '&.Mui-focused': {
                                      backgroundColor: 'white',
                                    },
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#E5E7EB',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D1D5DB',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#667eea',
                                    borderWidth: '2px',
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px',
                            }}
                          >
                            <TimeIcon sx={{ fontSize: '20px', color: '#667eea' }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#374151',
                              }}
                            >
                              Время
                            </Typography>
                          </Box>
                          <FormControl fullWidth>
                            <Select
                              value={filterTimeSlot}
                              onChange={(e) => setFilterTimeSlot(e.target.value)}
                              displayEmpty
                              sx={{
                                borderRadius: '12px',
                                backgroundColor: '#F9FAFB',
                                '&:hover': {
                                  backgroundColor: '#F3F4F6',
                                },
                                '&.Mui-focused': {
                                  backgroundColor: 'white',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#E5E7EB',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#D1D5DB',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#667eea',
                                  borderWidth: '2px',
                                },
                              }}
                            >
                              <MenuItem value="">
                                <em>Все время</em>
                              </MenuItem>
                              {timeSlots.map((time) => (
                                <MenuItem key={time} value={time}>
                                  {time}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Card>

                    {/* Список столов */}
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <RestaurantIcon sx={{ fontSize: '24px', color: '#667eea' }} />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            color: '#1F2937',
                          }}
                        >
                          Доступные столы
                        </Typography>
                      </Box>
                      {reservationObjects && reservationObjects.length > 0 ? (
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              sm: 'repeat(2, 1fr)',
                              md: 'repeat(3, 1fr)',
                            },
                            gap: '16px',
                          }}
                        >
                          {filteredObjects.map((obj, index) => (
                            <Grow
                              in={mounted}
                              timeout={600}
                              style={{ transitionDelay: `${index * 100}ms` }}
                              key={obj.id}
                            >
                              <Card
                                onClick={() => !obj.isOccupied && handleTableClick(obj.id)}
                                sx={{
                                  backgroundColor: obj.isOccupied ? '#F9FAFB' : 'white',
                                  border: `2px solid ${obj.isOccupied ? '#E5E7EB' : '#E5E7EB'}`,
                                  borderRadius: '16px',
                                  cursor: obj.isOccupied ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s ease-in-out',
                                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                  overflow: 'hidden',
                                  opacity: obj.isOccupied ? 0.6 : 1,
                                  position: 'relative',
                                  '&:hover': {
                                    transform: obj.isOccupied ? 'none' : 'translateY(-4px)',
                                    boxShadow: obj.isOccupied ? '0 1px 3px rgba(0, 0, 0, 0.05)' : '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: obj.isOccupied ? '#E5E7EB' : '#667eea',
                                  },
                                }}
                              >
                                {obj.isOccupied && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: '12px',
                                      right: '12px',
                                      zIndex: 1,
                                    }}
                                  >
                                    <Chip
                                      label="Занят"
                                      size="small"
                                      sx={{
                                        backgroundColor: '#EF4444',
                                        color: 'white',
                                        fontWeight: 600,
                                      }}
                                    />
                                  </Box>
                                )}
                                {obj.imageUrl ? (
                                  <Box
                                    component="img"
                                    src={obj.imageUrl}
                                    alt={obj.name}
                                    sx={{
                                      width: '100%',
                                      height: '200px',
                                      objectFit: 'cover',
                                      display: 'block',
                                    }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      width: '100%',
                                      height: '200px',
                                      backgroundColor: '#F3F4F6',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <RestaurantIcon sx={{ fontSize: '64px', color: '#D1D5DB' }} />
                                  </Box>
                                )}
                                <CardContent sx={{ padding: '20px !important' }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: '1rem',
                                      color: obj.isOccupied ? '#9CA3AF' : '#1F2937',
                                      marginBottom: '12px',
                                    }}
                                  >
                                    {obj.name}
                                  </Typography>
                                  {obj.description && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: '0.875rem',
                                        color: obj.isOccupied ? '#D1D5DB' : '#6B7280',
                                        marginBottom: '12px',
                                      }}
                                    >
                                      {obj.description}
                                    </Typography>
                                  )}
                                  {obj.capacity && (
                                    <Chip
                                      icon={<PersonIcon sx={{ fontSize: '16px !important' }} />}
                                      label={`До ${obj.capacity} чел.`}
                                      size="small"
                                      sx={{
                                        backgroundColor: obj.isOccupied ? '#E5E7EB' : '#F3F4F6',
                                        color: obj.isOccupied ? '#9CA3AF' : '#6B7280',
                                        fontWeight: 500,
                                      }}
                                    />
                                  )}
                                </CardContent>
                              </Card>
                            </Grow>
                          ))}
                        </Box>
                      ) : (
                        <Card
                          sx={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                            padding: '48px',
                            textAlign: 'center',
                          }}
                        >
                          <RestaurantIcon sx={{ fontSize: '64px', color: '#D1D5DB', marginBottom: '16px' }} />
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#6B7280',
                              marginBottom: '8px',
                              fontWeight: 600,
                            }}
                          >
                            Нет доступных столов
                          </Typography>
                        </Card>
                      )}
                    </Box>
                  </Box>
                </Fade>
              )}

              {activeTab === 1 && (
                <Fade in={activeTab === 1} timeout={300}>
                  <Box>
                    <Card
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                        padding: '32px',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.5rem',
                          color: '#1F2937',
                          marginBottom: '24px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        Мои бронирования
                      </Typography>
                      <ReservationsTable
                        reservations={myReservations || []}
                        showActions
                        onCancel={handleCancelReservation}
                      />
                    </Card>
                  </Box>
                </Fade>
              )}
            </>
          )}

          {!selectedVenueId && (
            <Alert
              severity="info"
              sx={{
                borderRadius: '16px',
                padding: '20px',
                fontSize: '0.9375rem',
              }}
            >
              Выберите заведение для бронирования стола
            </Alert>
          )}

          {/* Drawer для бронирования */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: { xs: '100%', sm: '480px' },
                padding: '0',
              },
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Заголовок Drawer */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  Бронирование стола
                </Typography>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Контент Drawer */}
              <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                {selectedObject && (
                  <Box sx={{ marginBottom: '24px' }}>
                    {selectedObject.imageUrl ? (
                      <Box
                        component="img"
                        src={selectedObject.imageUrl}
                        alt={selectedObject.name}
                        sx={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          marginBottom: '16px',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '200px',
                          backgroundColor: '#F3F4F6',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <RestaurantIcon sx={{ fontSize: '64px', color: '#D1D5DB' }} />
                      </Box>
                    )}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: '#1F2937',
                        marginBottom: '8px',
                      }}
                    >
                      {selectedObject.name}
                    </Typography>
                    {selectedObject.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          color: '#6B7280',
                          marginBottom: '12px',
                        }}
                      >
                        {selectedObject.description}
                      </Typography>
                    )}
                    {selectedObject.capacity && (
                      <Chip
                        icon={<PersonIcon sx={{ fontSize: '16px !important' }} />}
                        label={`До ${selectedObject.capacity} чел.`}
                        size="small"
                        sx={{
                          backgroundColor: '#F3F4F6',
                          color: '#6B7280',
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </Box>
                )}

                {/* Дата и время */}
                <Box sx={{ marginBottom: '24px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <CalendarIcon sx={{ fontSize: '20px', color: '#667eea' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Дата бронирования
                    </Typography>
                  </Box>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    format="dd MMMM yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#F9FAFB',
                            '&:hover': {
                              backgroundColor: '#F3F4F6',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                            },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E7EB',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#D1D5DB',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#667eea',
                            borderWidth: '2px',
                          },
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ marginBottom: '24px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <TimeIcon sx={{ fontSize: '20px', color: '#667eea' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Время бронирования
                    </Typography>
                  </Box>
                  <FormControl fullWidth>
                    <Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      sx={{
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#E5E7EB',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#D1D5DB',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      }}
                    >
                      {timeSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ marginBottom: '24px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: '20px', color: '#667eea' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Количество гостей
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 2)}
                    inputProps={{ min: 1, max: 20 }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                    }}
                  />
                </Box>

                {/* Данные клиента */}
                <Box sx={{ marginBottom: '24px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: '20px', color: '#667eea' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                      }}
                    >
                      Ваши данные
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Ваше имя"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    variant="outlined"
                    sx={{
                      marginBottom: '16px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Телефон"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ marginRight: '8px', color: '#6B7280' }}>
                          <PhoneIcon sx={{ fontSize: '20px' }} />
                        </Box>
                      ),
                    }}
                    sx={{
                      marginBottom: '16px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Примечания (необязательно)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Особые пожелания, аллергии, предпочтения..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        '&:hover': {
                          backgroundColor: '#F3F4F6',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E5E7EB',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: '2px',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Кнопка бронирования */}
              <Box sx={{ padding: '24px', borderTop: '1px solid #E5E7EB' }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleBookTable}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    !selectedObjectId ||
                    !clientName ||
                    !clientPhone ||
                    createReservation.isPending
                  }
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 700,
                    padding: '16px 32px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                    '&:disabled': {
                      background: '#E5E7EB',
                      color: '#9CA3AF',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {createReservation.isPending ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Забронировать стол'
                  )}
                </Button>
              </Box>
            </Box>
          </Drawer>

          <ConfirmDialog
            open={confirmDialog.open}
            title={confirmDialog.options.title}
            message={confirmDialog.options.message}
            confirmText={confirmDialog.options.confirmText}
            cancelText={confirmDialog.options.cancelText}
            confirmColor={confirmDialog.options.confirmColor}
            onConfirm={confirmDialog.handleConfirm}
            onCancel={confirmDialog.handleCancel}
          />
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default UserPage;
