import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Box } from '@mui/material'
import FloorPlanEditor from '../../components/FloorPlanEditor/FloorPlanEditor'
import {
  getClient,
  getFloorPlanByClientId,
  saveClient,
  saveFloorPlan,
  type StoredClient,
  type StoredFloorPlan,
} from '../../utils/storage'
import type { FloorPlanData } from '../../types/floorPlan'
import './AdminEditorPage.scss'

const AdminEditorPage = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isNew = searchParams.get('new') === 'true'
  
  const [client, setClient] = useState<StoredClient | null>(null)
  const [initialFloorPlan, setInitialFloorPlan] = useState<FloorPlanData | null>(null)

  useEffect(() => {
    if (!clientId) {
      navigate('/admin')
      return
    }

    if (isNew) {
      // Создаем нового клиента
      const newClient: StoredClient = {
        id: clientId,
        name: '',
        venueName: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasFloorPlan: false,
      }
      setClient(newClient)
    } else {
      // Загружаем существующего клиента
      const existingClient = getClient(clientId)
      if (!existingClient) {
        navigate('/admin')
        return
      }
      setClient(existingClient)

      // Загружаем план этажа если есть
      if (existingClient.hasFloorPlan && existingClient.floorPlanId) {
        const plan = getFloorPlanByClientId(clientId)
        if (plan) {
          setInitialFloorPlan(plan.data)
        }
      }
    }
  }, [clientId, isNew, navigate])

  const handleSave = async (floorPlanData: FloorPlanData, clientName: string, venueName: string) => {
    if (!clientId) return

    // Сохраняем/обновляем клиента
    const clientToSave: StoredClient = {
      id: clientId,
      name: clientName,
      venueName: venueName,
      email: client?.email,
      phone: client?.phone,
      createdAt: client?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasFloorPlan: true,
      floorPlanId: `plan-${clientId}`,
    }
    saveClient(clientToSave)

    // Сохраняем план этажа
    const planToSave: StoredFloorPlan = {
      id: `plan-${clientId}`,
      clientId: clientId,
      data: floorPlanData,
      createdAt: client?.hasFloorPlan ? (getFloorPlanByClientId(clientId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveFloorPlan(planToSave)

    // Перенаправляем на страницу клиентов
    navigate('/admin')
  }

  if (!client) {
    return null
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
          clientName={client.name}
          venueName={client.venueName}
          initialFloorPlan={initialFloorPlan}
          onSave={handleSave}
        />
      </Box>
    </Box>
  )
}

export default AdminEditorPage

