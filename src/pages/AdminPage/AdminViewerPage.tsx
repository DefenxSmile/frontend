import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material'
import FloorPlanViewer from '../../components/FloorPlanViewer/FloorPlanViewer'
import { getClient, getFloorPlanByClientId } from '../../utils/storage'
import type { FloorPlanData } from '../../types/floorPlan'
import './AdminViewerPage.scss'

const AdminViewerPage = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanData | null>(null)
  const [clientName, setClientName] = useState('')
  const [venueName, setVenueName] = useState('')

  useEffect(() => {
    if (!clientId) {
      navigate('/admin')
      return
    }

    const client = getClient(clientId)
    if (!client) {
      navigate('/admin')
      return
    }

    setClientName(client.name)
    setVenueName(client.venueName)

    if (client.hasFloorPlan) {
      const plan = getFloorPlanByClientId(clientId)
      if (plan) {
        setFloorPlanData(plan.data)
      }
    }
  }, [clientId, navigate])

  const handleEdit = () => {
    navigate(`/admin/editor/${clientId}`)
  }

  if (!floorPlanData) {
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
              {venueName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Клиент: {clientName}
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

