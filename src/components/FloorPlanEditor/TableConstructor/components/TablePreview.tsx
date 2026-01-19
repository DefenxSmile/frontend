import { Stage, Layer, Circle, Rect, Text, Group } from 'react-konva'
import { Box } from '@mui/material'
import type { TableConfig } from '../types'
import { PREVIEW_SIZE, PREVIEW_SCALE, GRID_COLORS } from '../constants'
import { generateGridLines, generateGridPoints } from '../utils/grid'
import { FurnitureRenderer } from '../../renderers/FurnitureRenderer'
import { calculateFurniturePosition } from '../utils/furniturePosition'

interface TablePreviewProps {
  config: TableConfig
  onFurnitureZoneClick?: (side: string, position: { x: number; y: number }) => void
}

/**
 * Компонент превью стола в конструкторе
 */
export const TablePreview = ({ config }: TablePreviewProps) => {
  const centerX = PREVIEW_SIZE / 2
  const centerY = PREVIEW_SIZE / 2
  const scale = PREVIEW_SCALE

  const renderTable = () => {
    switch (config.shape) {
      case 'circle': {
        const radius = config.radius || Math.min(config.width, config.height) / 2
        return (
          <Group>
            <Circle
              x={centerX + 2}
              y={centerY + 2}
              radius={radius * scale}
              fill="rgba(0, 0, 0, 0.1)"
              listening={false}
            />
            <Circle
              x={centerX}
              y={centerY}
              radius={radius * scale}
              fill="#A8D5BA"
              stroke="#4CAF50"
              strokeWidth={2.5 * scale}
              shadowBlur={4 * scale}
              shadowColor="rgba(0, 0, 0, 0.2)"
              listening={false}
            />
            <Circle
              x={centerX}
              y={centerY}
              radius={radius * scale - 3 * scale}
              fill="rgba(255, 255, 255, 0.2)"
              listening={false}
            />
          </Group>
        )
      }
      case 'square':
      case 'rectangle': {
        return (
          <Group>
            <Rect
              x={centerX - (config.width * scale) / 2 + 2}
              y={centerY - (config.height * scale) / 2 + 2}
              width={config.width * scale}
              height={config.height * scale}
              fill="rgba(0, 0, 0, 0.1)"
              cornerRadius={6 * scale}
              listening={false}
            />
            <Rect
              x={centerX - (config.width * scale) / 2}
              y={centerY - (config.height * scale) / 2}
              width={config.width * scale}
              height={config.height * scale}
              fill="#A8D5BA"
              stroke="#4CAF50"
              strokeWidth={2.5 * scale}
              cornerRadius={6 * scale}
              shadowBlur={4 * scale}
              shadowColor="rgba(0, 0, 0, 0.2)"
              listening={false}
            />
            <Rect
              x={centerX - (config.width * scale) / 2 + 3 * scale}
              y={centerY - (config.height * scale) / 2 + 3 * scale}
              width={config.width * scale - 6 * scale}
              height={config.height * scale - 6 * scale}
              fill="rgba(255, 255, 255, 0.2)"
              cornerRadius={4 * scale}
              listening={false}
            />
          </Group>
        )
      }
      case 'oval': {
        return (
          <Rect
            x={centerX - (config.width * scale) / 2}
            y={centerY - (config.height * scale) / 2}
            width={config.width * scale}
            height={config.height * scale}
            fill="#A8D5BA"
            stroke="#4CAF50"
            strokeWidth={2 * scale}
            cornerRadius={(config.height * scale) / 2}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <Box
      sx={{
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        backgroundColor: GRID_COLORS.background,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Stage width={PREVIEW_SIZE} height={PREVIEW_SIZE}>
        <Layer>
          {generateGridLines(scale)}
          {generateGridPoints(scale)}
          {renderTable()}
          <Circle x={centerX} y={centerY} radius={3} fill="#FF6B01" listening={false} />
          {config.label && (
            <Text
              x={centerX}
              y={
                centerY +
                (config.shape === 'circle'
                  ? (config.radius || 0) * scale
                  : (config.height * scale) / 2) +
                20
              }
              text={config.label}
              fontSize={12 * scale}
              fill="#333"
              align="center"
              listening={false}
              offsetX={(config.label.length * 3 * scale) / 2}
            />
          )}
          {config.showFurniture &&
            config.furniturePositions &&
            config.furniturePositions.length > 0 &&
            config.furniturePositions.map((pos, index) => {
              const { x, y, rotation } = calculateFurniturePosition(pos, index, config, scale)
              return (
                <FurnitureRenderer
                  key={`furniture-${index}`}
                  x={centerX + x}
                  y={centerY + y}
                  rotation={rotation}
                  furnitureType={config.furnitureType}
                  shape={pos.shape || config.furnitureShape}
                  scale={scale}
                />
              )
            })}
          <Text
            x={centerX}
            y={centerY}
            text={`${config.furniturePositions?.length || 0} мест`}
            fontSize={10 * scale}
            fill="#666"
            align="center"
            listening={false}
            offsetX={20 * scale}
          />
        </Layer>
      </Stage>
    </Box>
  )
}

