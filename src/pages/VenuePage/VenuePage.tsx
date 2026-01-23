import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Chip,
  IconButton,
  Container,
  Fade,
  Grow,
} from '@mui/material';
import {
  Add as AddIcon,
  TableRestaurant as TableIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useVenues } from '../../domain/hooks/venues/useVenues';
import { useReservationObjects } from '../../domain/hooks/reservationObjects/useReservationObjects';
import { useDeleteReservationObject } from '../../domain/hooks/reservationObjects/useDeleteReservationObject';
import { useReservations } from '../../domain/hooks/bookings/useBookings';
import { useReservationObjectForm } from '../../hooks/useReservationObjectForm';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import {
  ReservationObjectForm,
  ReservationsTable,
  ConfirmDialog,
} from '../../components';
import './VenuePage.scss';

const VenuePage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);

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

  const { data: reservationObjects, isLoading: objectsLoading } = useReservationObjects(
    selectedVenueId ? { venueId: selectedVenueId } : undefined,
    { enabled: !!selectedVenueId }
  );
  const { data: reservations, isLoading: reservationsLoading } = useReservations(
    selectedVenueId ? { reservationObjectId: undefined } : undefined,
    { enabled: !!selectedVenueId }
  );

  const deleteObject = useDeleteReservationObject();
  const objectForm = useReservationObjectForm(selectedVenueId);
  const confirmDialog = useConfirmDialog();

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Удаление объекта бронирования',
      message: 'Вы уверены, что хотите удалить этот объект бронирования? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        await deleteObject.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting reservation object:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        paddingTop: { xs: '48px', sm: '64px' },
        paddingBottom: '64px',
      }}
    >
      <Container maxWidth="lg">
        {/* Заголовок и выбор заведения */}
        <Grow in={mounted} timeout={600}>
          <Box sx={{ marginBottom: '32px' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1F2937',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                marginBottom: '24px',
                letterSpacing: '-0.02em',
              }}
            >
              Управление заведением
            </Typography>
            <FormControl
              sx={{
                minWidth: { xs: '100%', sm: '400px' },
                backgroundColor: 'white',
                borderRadius: '12px',
              }}
            >
              <Select
                value={selectedVenueId || ''}
                onChange={(e) => setSelectedVenueId(e.target.value as number)}
                sx={{
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
                  value={selectedTab}
                  onChange={(_, newValue) => setSelectedTab(newValue)}
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
                    label="Объекты бронирования"
                    icon={<TableIcon sx={{ fontSize: '20px', marginRight: '8px' }} />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Бронирования"
                    icon={<EventIcon sx={{ fontSize: '20px', marginRight: '8px' }} />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
            </Grow>

            {selectedTab === 0 && (
              <Fade in={selectedTab === 0} timeout={300}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: '#1F2937',
                      }}
                    >
                      Объекты бронирования (столы, диваны)
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => objectForm.openForm()}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 700,
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                          boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                        },
                      }}
                    >
                      Добавить объект
                    </Button>
                  </Box>

                  {objectsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                      <CircularProgress />
                    </Box>
                  ) : reservationObjects && reservationObjects.length > 0 ? (
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
                      {reservationObjects.map((obj, index) => (
                        <Grow
                          in={mounted}
                          timeout={600}
                          style={{ transitionDelay: `${index * 100}ms` }}
                          key={obj.id}
                        >
                          <Card
                            sx={{
                              backgroundColor: 'white',
                              border: '2px solid #E5E7EB',
                              borderRadius: '16px',
                              transition: 'all 0.2s ease-in-out',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                              overflow: 'hidden',
                              position: 'relative',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                borderColor: '#667eea',
                              },
                            }}
                          >
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
                            <CardContent sx={{ padding: '20px !important', position: 'relative' }}>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '16px',
                                  right: '16px',
                                  display: 'flex',
                                  gap: '4px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  borderRadius: '8px',
                                  padding: '4px',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => objectForm.openForm(obj)}
                                  sx={{
                                    padding: '6px',
                                    color: '#667eea',
                                    '&:hover': {
                                      backgroundColor: '#F0F4FF',
                                    },
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: '18px' }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(obj.id)}
                                  sx={{
                                    padding: '6px',
                                    color: '#EF4444',
                                    '&:hover': {
                                      backgroundColor: '#FEE2E2',
                                    },
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: '18px' }} />
                                </IconButton>
                              </Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: '1rem',
                                  color: '#1F2937',
                                  marginBottom: '12px',
                                  paddingRight: '80px',
                                }}
                              >
                                {obj.name}
                              </Typography>
                              {obj.description && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: '0.875rem',
                                    color: '#6B7280',
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
                                    backgroundColor: '#F3F4F6',
                                    color: '#6B7280',
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
                      <TableIcon sx={{ fontSize: '64px', color: '#D1D5DB', marginBottom: '16px' }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#6B7280',
                          marginBottom: '8px',
                          fontWeight: 600,
                        }}
                      >
                        Нет объектов бронирования
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#9CA3AF',
                          marginBottom: '24px',
                        }}
                      >
                        Создайте первый объект бронирования для вашего заведения
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => objectForm.openForm()}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          textTransform: 'none',
                          fontWeight: 700,
                          padding: '12px 24px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                          },
                        }}
                      >
                        Добавить объект
                      </Button>
                    </Card>
                  )}
                </Box>
              </Fade>
            )}

            {selectedTab === 1 && (
              <Fade in={selectedTab === 1} timeout={300}>
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
                      Бронирования
                    </Typography>
                    {reservationsLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <ReservationsTable reservations={reservations || []} />
                    )}
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
            Выберите заведение для управления объектами бронирования и просмотра бронирований
          </Alert>
        )}

        <ReservationObjectForm
          open={objectForm.open}
          object={objectForm.editingObject}
          formData={objectForm.formData}
          isLoading={objectForm.isLoading}
          onClose={objectForm.closeForm}
          onSubmit={objectForm.submit}
          onChange={objectForm.setFormData}
        />

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
  );
};

export default VenuePage;
