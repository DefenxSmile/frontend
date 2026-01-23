import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Container,
  Grow,
  Fade,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useVenues } from '../../domain/hooks/venues/useVenues';
import { useDeleteVenue } from '../../domain/hooks/venues/useDeleteVenue';
import { useVenueForm } from '../../hooks/useVenueForm';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import { VenueForm, ConfirmDialog } from '../../components';
import './AdminPage.scss';

const AdminPage = () => {
  const [mounted, setMounted] = useState(false);
  const { data: venues, isLoading, error } = useVenues();
  const deleteVenue = useDeleteVenue();
  const venueForm = useVenueForm();
  const confirmDialog = useConfirmDialog();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDialog.confirm({
      title: 'Удаление заведения',
      message: 'Вы уверены, что хотите удалить это заведение? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      confirmColor: 'error',
    });

    if (confirmed) {
      try {
        await deleteVenue.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting venue:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
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
          <Alert
            severity="error"
            sx={{
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            Ошибка загрузки заведений
          </Alert>
        </Container>
      </Box>
    );
  }

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
        {/* Заголовок и кнопка */}
        <Grow in={mounted} timeout={600}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: '16px',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: '#1F2937',
                letterSpacing: '-0.02em',
              }}
            >
              Управление заведениями
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => venueForm.openForm()}
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
              Добавить заведение
            </Button>
          </Box>
        </Grow>

        {/* Список заведений */}
        {venues && venues.length > 0 ? (
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
            {venues.map((venue, index) => (
              <Grow
                in={mounted}
                timeout={600}
                style={{ transitionDelay: `${index * 100}ms` }}
                key={venue.id}
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
                  {/* Изображение или иконка заведения */}
                  {venue.imageUrl ? (
                    <Box
                      component="img"
                      src={venue.imageUrl}
                      alt={venue.name}
                      sx={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '160px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: '64px', color: 'white', opacity: 0.9 }} />
                    </Box>
                  )}

                  <CardContent sx={{ padding: '20px !important', position: 'relative' }}>
                    {/* Кнопки действий */}
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
                        onClick={() => venueForm.openForm(venue)}
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
                        onClick={() => handleDelete(venue.id)}
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

                    {/* Название */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        color: '#1F2937',
                        marginBottom: '12px',
                        paddingRight: '80px',
                      }}
                    >
                      {venue.name}
                    </Typography>

                    {/* Адрес */}
                    {venue.address && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '12px',
                        }}
                      >
                        <LocationOnIcon sx={{ color: '#6B7280', fontSize: '18px', marginTop: '2px', flexShrink: 0 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6B7280',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {venue.address}
                        </Typography>
                      </Box>
                    )}

                    {/* Телефон */}
                    {venue.phone && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '12px',
                        }}
                      >
                        <PhoneIcon sx={{ color: '#6B7280', fontSize: '18px', flexShrink: 0 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6B7280',
                            fontSize: '0.875rem',
                          }}
                        >
                          {venue.phone}
                        </Typography>
                      </Box>
                    )}

                    {/* Описание */}
                    {venue.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          marginBottom: '12px',
                        }}
                      >
                        {venue.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Box>
        ) : (
          <Fade in={mounted} timeout={600}>
            <Card
              sx={{
                backgroundColor: 'white',
                borderRadius: '24px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                padding: '48px',
                textAlign: 'center',
              }}
            >
              <BusinessIcon sx={{ fontSize: '64px', color: '#D1D5DB', marginBottom: '16px' }} />
              <Typography
                variant="h6"
                sx={{
                  color: '#6B7280',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}
              >
                Нет заведений
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#9CA3AF',
                  marginBottom: '24px',
                }}
              >
                Создайте первое заведение, чтобы начать работу
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => venueForm.openForm()}
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
                Добавить заведение
              </Button>
            </Card>
          </Fade>
        )}

        <VenueForm
          open={venueForm.open}
          venue={venueForm.editingVenue}
          formData={venueForm.formData}
          isLoading={venueForm.isLoading}
          onClose={venueForm.closeForm}
          onSubmit={venueForm.submit}
          onChange={venueForm.setFormData}
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

export default AdminPage;
