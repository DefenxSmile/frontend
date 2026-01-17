import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { RadioButtonUnchecked, Square, CropFree, Checkroom } from '@mui/icons-material'
import type { TableShape } from '../../types/floorPlan'
import './TableShapeSelector.scss'

interface TableShapeSelectorProps {
  selectedShape: TableShape
  onShapeChange: (shape: TableShape) => void
}

const shapes: { shape: TableShape; icon: any; label: string }[] = [
  { shape: 'circle', icon: RadioButtonUnchecked, label: 'Круглый' },
  { shape: 'square', icon: Square, label: 'Квадратный' },
  { shape: 'rectangle', icon: CropFree, label: 'Прямоугольный' },
  { shape: 'oval', icon: Checkroom, label: 'Овальный' },
]

const TableShapeSelector = ({ selectedShape, onShapeChange }: TableShapeSelectorProps) => {
  return (
    <Box className="table-shape-selector">
      <Typography variant="caption" sx={{ mb: 1, display: 'block', color: '#757575' }}>
        Форма стола
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {shapes.map(({ shape, icon: Icon, label }) => (
          <Tooltip key={shape} title={label}>
            <IconButton
              onClick={() => onShapeChange(shape)}
              sx={{
                border: selectedShape === shape ? '2px solid #FF6B01' : '2px solid #E0E0E0',
                borderRadius: '8px',
                width: 48,
                height: 48,
                backgroundColor: selectedShape === shape ? '#FFF5F0' : 'transparent',
                '&:hover': {
                  backgroundColor: '#FFF5F0',
                  borderColor: '#FF6B01',
                },
              }}
            >
              <Icon
                sx={{
                  color: selectedShape === shape ? '#FF6B01' : '#757575',
                  fontSize: 24,
                }}
              />
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}

export default TableShapeSelector

