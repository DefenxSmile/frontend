import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Alert } from '@mui/material'
import FloorPlanEditor from '../../../components/FloorPlanEditor/FloorPlanEditor'
import { useVenue, useCreateVenue, useUpdateVenue } from '../../../domain/hooks'
import type { FloorPlanData } from '../../../types/floorPlan'
import './index.scss'

const AdminEditorPage = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isNew = searchParams.get('new') === 'true'
  
  const venueId = clientId ? Number(clientId) : null
  const { data: venue, isLoading, error } = useVenue(venueId || 0, { enabled: !isNew && !!venueId })
  const createVenue = useCreateVenue()
  const updateVenue = useUpdateVenue()

  const handleSave = async (floorPlanData: FloorPlanData, clientName: string, venueName: string) => {
    const updatedFloorPlan: FloorPlanData = {
      ...floorPlanData,
      metadata: {
        ...floorPlanData.metadata,
        clientName,
        venueName,
        updatedAt: new Date().toISOString(),
      },
    }

    if (isNew) {
      createVenue.mutate(
        { floorPlan: updatedFloorPlan },
        {
          onSuccess: () => {
            navigate('/admin')
          },
        }
      )
    } else if (venueId) {
      updateVenue.mutate(
        { id: venueId, data: { floorPlan: updatedFloorPlan } },
        {
          onSuccess: () => {
            navigate('/admin')
          },
        }
      )
    }
  }

  if (isNew) {
    return (
      <Box 
        className="admin-editor-page" 
        sx={{ 
          height: 'calc(100vh - 64px)', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <FloorPlanEditor
            clientName=""
            venueName=""
            initialFloorPlan={null}
            onSave={handleSave}
          />
        </Box>
      </Box>
    )
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Alert severity="error">Ошибка загрузки данных: {error?.message || 'Заведение не найдено'}</Alert>
      </Box>
    )
  }

  const client = venue.floorPlan.metadata

  if (!client) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Alert severity="error">Ошибка: метаданные заведения не найдены</Alert>
      </Box>
    )
  }

  return (
    <Box 
      className="admin-editor-page" 
      sx={{ 
        height: 'calc(100vh - 64px)', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <FloorPlanEditor
          clientName={client.clientName}
          venueName={client.venueName}
          initialFloorPlan={venue.floorPlan}
          onSave={handleSave}
        />
      </Box>
    </Box>
  )
}

export default AdminEditorPage

