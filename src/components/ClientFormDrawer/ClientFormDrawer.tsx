import { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { saveClient, getClient, type StoredClient } from '../../utils/storage'
import { VALIDATION } from '../../constants'
import './ClientFormDrawer.scss'

interface ClientFormDrawerProps {
  open: boolean
  onClose: () => void
  clientId?: string | null
  onSave: () => void
}

const ClientFormDrawer = ({ open, onClose, clientId, onSave }: ClientFormDrawerProps) => {
  const isEditMode = !!clientId
  const [formData, setFormData] = useState({
    name: '',
    venueName: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (isEditMode && clientId) {
        const client = getClient(clientId)
        if (client) {
          setFormData({
            name: client.name || '',
            venueName: client.venueName || '',
            email: client.email || '',
            phone: client.phone || '',
          })
        }
      } else {
        // Сброс формы для нового клиента
        setFormData({
          name: '',
          venueName: '',
          email: '',
          phone: '',
        })
      }
      setErrors({})
    }
  }, [open, isEditMode, clientId])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя клиента обязательно'
    }

    if (!formData.venueName.trim()) {
      newErrors.venueName = 'Название заведения обязательно'
    }

    if (formData.email && !VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес'
    }

    if (formData.phone && !VALIDATION.PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const clientData: StoredClient = {
        id: clientId || `client-${Date.now()}`,
        name: formData.name.trim(),
        venueName: formData.venueName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        createdAt: isEditMode && clientId ? getClient(clientId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasFloorPlan: isEditMode && clientId ? getClient(clientId)?.hasFloorPlan || false : false,
        floorPlanId: isEditMode && clientId ? getClient(clientId)?.floorPlanId : undefined,
      }

      saveClient(clientData)
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving client:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEditMode ? 'Редактировать клиента' : 'Добавить клиента'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 1 }}>
              Пожалуйста, исправьте ошибки в форме
            </Alert>
          )}

          <TextField
            label="Имя клиента"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />

          <TextField
            label="Название заведения"
            required
            fullWidth
            value={formData.venueName}
            onChange={handleChange('venueName')}
            error={!!errors.venueName}
            helperText={errors.venueName}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email || 'Опционально'}
          />

          <TextField
            label="Телефон"
            fullWidth
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone || 'Опционально'}
            placeholder="+7 (999) 123-45-67"
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#FF6B01',
              '&:hover': {
                backgroundColor: '#E55A00',
              },
            }}
          >
            {isSubmitting ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Создать'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ClientFormDrawer

