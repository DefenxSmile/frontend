import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material'
import FloorPlanViewer from '../../../components/FloorPlanViewer/FloorPlanViewer'
import { useVenue } from '../../../domain/hooks'
import './index.scss'

const AdminViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const venueId = clientId ? Number(clientId) : null
  const { data: venue, isLoading, error } = useVenue(venueId || 0, { enabled: !!venueId })

  const handleEdit = () => {
    navigate(`/admin/editor/${clientId}`)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !venue) {
    return (
      <Box 
        className="admin-viewer-page" 
        sx={{ 
          minHeight: 'calc(100vh - 64px)', 
          py: 4,
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Ошибка загрузки данных: {error?.message || 'Заведение не найдено'}
            </Alert>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mt: 2 }}
            >
              Создать план
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  const floorPlanData = venue.floorPlan
  const client = venue.floorPlan.metadata

  if (!client) {
    return (
      <Box 
        className="admin-viewer-page" 
        sx={{ 
          minHeight: 'calc(100vh - 64px)', 
          py: 4,
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Ошибка: метаданные заведения не найдены
            </Alert>
          </Paper>
        </Container>
      </Box>
    )
  }

  if (!floorPlanData || !floorPlanData.floors || floorPlanData.floors.length === 0) {
    return (
      <Box 
        className="admin-viewer-page" 
        sx={{ 
          minHeight: 'calc(100vh - 64px)', 
          py: 4,
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              План этажа не найден
            </Typography>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mt: 2 }}
            >
              Создать план
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box 
      className="admin-viewer-page" 
      sx={{ 
        minHeight: 'calc(100vh - 64px)', 
        py: 4,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin')}
              sx={{ mb: 1 }}
            >
              Назад к списку клиентов
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#212121' }}>
              {client.venueName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Клиент: {client.clientName}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              backgroundColor: '#FF6B01',
              '&:hover': {
                backgroundColor: '#E55A00',
              },
            }}
          >
            Редактировать план
          </Button>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: '16px', overflow: 'hidden', p: 2 }}>
          <FloorPlanViewer data={floorPlanData} />
        </Paper>
      </Container>
    </Box>
  )
}

export default AdminViewerPage

