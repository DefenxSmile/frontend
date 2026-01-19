import { useState, useEffect } from 'react'
import { Box, Paper, Typography, TextField, Divider, IconButton, Tooltip, Button } from '@mui/material'
import { Delete as DeleteIcon, ContentCopy as DuplicateIcon } from '@mui/icons-material'
import type { FloorPlanElement } from '../../types/floorPlan'
import './PropertiesPanel.scss'

interface PropertiesPanelProps {
  element: FloorPlanElement | null
  onUpdate: (id: string, updates: Partial<FloorPlanElement>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onEditInConstructor?: (id: string) => void // Для редактирования стола в конструкторе
}

const PropertiesPanel = ({ element, onUpdate, onDelete, onDuplicate, onEditInConstructor }: PropertiesPanelProps) => {
  const [localValues, setLocalValues] = useState<Partial<FloorPlanElement>>({})

  useEffect(() => {
    if (element) {
      setLocalValues({
        label: element.label || '',
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        radius: element.radius,
        rotation: element.rotation || 0,
        capacity: element.capacity,
        tableShape: element.tableShape,
      })
    }
  }, [element])

  if (!element) {
    return (
      <Paper className="properties-panel" elevation={2}>
        <Typography variant="h6" sx={{ p: 2, color: '#757575' }}>
          Выберите элемент для редактирования
        </Typography>
      </Paper>
    )
  }

  const handleBlur = (field: keyof FloorPlanElement) => {
    const value = localValues[field]
    if (value !== undefined && value !== element[field]) {
      onUpdate(element.id, { [field]: value })
    }
  }

  const handleChange = (field: keyof FloorPlanElement, value: any) => {
    setLocalValues((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Paper className="properties-panel" elevation={2}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {element.type === 'table' ? 'Стол' : element.type === 'wall' ? 'Стена' : element.type === 'door' ? 'Дверь' : 'Окно'}
          </Typography>
          <Box>
            <Tooltip title="Дублировать">
              <IconButton size="small" onClick={() => onDuplicate(element.id)}>
                <DuplicateIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton size="small" color="error" onClick={() => onDelete(element.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Название/Метка */}
        <TextField
          fullWidth
          label="Название"
          value={localValues.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          onBlur={() => handleBlur('label')}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Для столов - кнопка редактирования в конструкторе */}
        {element.type === 'table' && onEditInConstructor && (
          <Box sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onEditInConstructor(element.id)}
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45a049' },
                textTransform: 'none',
              }}
            >
              Редактировать в конструкторе
            </Button>
          </Box>
        )}

        {/* Позиция */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="X"
            type="number"
            value={Math.round(localValues.x || 0)}
            onChange={(e) => handleChange('x', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('x')}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Y"
            type="number"
            value={Math.round(localValues.y || 0)}
            onChange={(e) => handleChange('y', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('y')}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>

        {/* Размеры */}
        {element.width !== undefined && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Ширина"
              type="number"
              value={Math.round(localValues.width || 0)}
              onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
              onBlur={() => handleBlur('width')}
              size="small"
              sx={{ flex: 1 }}
            />
            {element.height !== undefined && (
              <TextField
                label="Высота"
                type="number"
                value={Math.round(localValues.height || 0)}
                onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('height')}
                size="small"
                sx={{ flex: 1 }}
              />
            )}
          </Box>
        )}

        {/* Радиус для круглых столов */}
        {element.radius !== undefined && (
          <TextField
            fullWidth
            label="Радиус"
            type="number"
            value={Math.round(localValues.radius || 0)}
            onChange={(e) => handleChange('radius', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('radius')}
            size="small"
            sx={{ mb: 2 }}
          />
        )}

        {/* Поворот */}
        <TextField
          fullWidth
          label="Поворот (градусы)"
          type="number"
          value={Math.round(localValues.rotation || 0)}
          onChange={(e) => handleChange('rotation', parseFloat(e.target.value) || 0)}
          onBlur={() => handleBlur('rotation')}
          size="small"
        />
      </Box>
    </Paper>
  )
}

export default PropertiesPanel

