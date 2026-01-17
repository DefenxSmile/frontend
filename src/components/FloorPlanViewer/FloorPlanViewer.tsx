import { useState, useRef } from 'react'
import { Stage, Layer, Group, Circle, Rect, Text, Line } from 'react-konva'
import { Box, Paper, IconButton, Tooltip } from '@mui/material'
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitScreenIcon,
  GridOn as GridIcon,
} from '@mui/icons-material'
import type { FloorPlanElement, FloorPlanData } from '../../types/floorPlan'
import type { Booking } from '../../types/booking'
import './FloorPlanViewer.scss'

interface FloorPlanViewerProps {
  data: FloorPlanData
  bookings?: Booking[] // Бронирования для отображения статуса столов
  onTableClick?: (table: FloorPlanElement) => void // Обработчик клика на стол
  selectedTableId?: string | null // ID выбранного стола
  interactive?: boolean // Режим интерактивности (для бронирования)
}

const STAGE_WIDTH = 2000
const STAGE_HEIGHT = 1500
const GRID_SIZE = 20
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3

const FloorPlanViewer = ({
  data,
  bookings = [],
  onTableClick,
  selectedTableId = null,
  interactive = false,
}: FloorPlanViewerProps) => {
  const [scale, setScale] = useState(data.stage.scale || 1)
  const [position, setPosition] = useState({
    x: data.stage.offsetX || 0,
    y: data.stage.offsetY || 0,
  })
  const [showGrid, setShowGrid] = useState(true)
  const [currentFloorId, setCurrentFloorId] = useState<string>(
    data.currentFloorId || (data.floors.length > 0 ? data.floors[0].id : '')
  )

  const stageRef = useRef<any>(null)

  // Получаем элементы текущего этажа
  const getCurrentFloorElements = (): FloorPlanElement[] => {
    const currentFloor = data.floors.find((f) => f.id === currentFloorId)
    return currentFloor ? currentFloor.elements : []
  }

  const elements = getCurrentFloorElements()

  // Получаем статус стола (занят/свободен)
  const getTableStatus = (tableId: string): 'available' | 'occupied' | 'selected' => {
    if (selectedTableId === tableId) return 'selected'
    const hasActiveBooking = bookings.some(
      (booking) => booking.tableId === tableId && booking.status !== 'cancelled'
    )
    return hasActiveBooking ? 'occupied' : 'available'
  }

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)))
  }

  const handleFitScreen = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    const oldScale = scale
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.95 : oldScale * 1.05
    const clampedScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale))

    setScale(clampedScale)
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }

  // Рендер сетки
  const renderGrid = () => {
    if (!showGrid) return null
    const lines = []
    const width = STAGE_WIDTH
    const height = STAGE_HEIGHT

    for (let i = 0; i <= width / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * GRID_SIZE, 0, i * GRID_SIZE, height]}
          stroke="#E8EAED"
          strokeWidth={0.5}
          listening={false}
          opacity={0.6}
        />
      )
    }

    for (let i = 0; i <= height / GRID_SIZE; i++) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i * GRID_SIZE, width, i * GRID_SIZE]}
          stroke="#E8EAED"
          strokeWidth={0.5}
          listening={false}
          opacity={0.6}
        />
      )
    }

    return lines
  }

  const renderElement = (element: FloorPlanElement) => {
    const isSelected = selectedTableId === element.id
    const tableStatus = element.type === 'table' ? getTableStatus(element.id) : null
    const isInteractive = interactive && element.type === 'table' && (element.isAvailable !== false)
    
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation || 0,
      listening: isInteractive,
      onClick: isInteractive && onTableClick
        ? () => onTableClick(element)
        : undefined,
      onMouseEnter: isInteractive
        ? (e: any) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'pointer'
            }
          }
        : undefined,
      onMouseLeave: isInteractive
        ? (e: any) => {
            const stage = e.target.getStage()
            if (stage) {
              stage.container().style.cursor = 'default'
            }
          }
        : undefined,
    }

    switch (element.type) {
      case 'table':
        const tableShape = element.tableShape || 'circle'
        const status: 'available' | 'occupied' | 'selected' = tableStatus || 'available'
        
        // Цвета в зависимости от статуса
        const statusColors: Record<'available' | 'occupied' | 'selected', { fill: string; stroke: string }> = {
          available: { fill: '#4CAF50', stroke: '#2E7D32' },
          occupied: { fill: '#F44336', stroke: '#C62828' },
          selected: { fill: '#FF6B01', stroke: '#E55A00' },
        }
        const colors = statusColors[status]
        
        let tableShapeElement: any = null

        switch (tableShape) {
          case 'circle':
            tableShapeElement = (
              <Circle
                radius={element.radius || 30}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={element.strokeWidth || 3}
                shadowBlur={isSelected ? 8 : 4}
                shadowColor={isSelected ? colors.stroke : 'rgba(0,0,0,0.2)'}
                shadowOpacity={isSelected ? 0.5 : 0.3}
              />
            )
            break
          case 'square':
          case 'rectangle':
            tableShapeElement = (
              <Rect
                width={element.width || 60}
                height={element.height || 60}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={element.strokeWidth || 3}
                cornerRadius={tableShape === 'square' ? 6 : 10}
                shadowBlur={isSelected ? 8 : 4}
                shadowColor={isSelected ? colors.stroke : 'rgba(0,0,0,0.2)'}
                shadowOpacity={isSelected ? 0.5 : 0.3}
              />
            )
            break
          case 'oval':
            tableShapeElement = (
              <Rect
                width={element.width || 90}
                height={element.height || 60}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={element.strokeWidth || 3}
                cornerRadius={Math.min((element.width || 90), (element.height || 60)) / 2}
                shadowBlur={isSelected ? 8 : 4}
                shadowColor={isSelected ? colors.stroke : 'rgba(0,0,0,0.2)'}
                shadowOpacity={isSelected ? 0.5 : 0.3}
              />
            )
            break
        }

        return (
          <Group key={element.id} {...commonProps}>
            {tableShapeElement}
            {element.label && (
              <Text
                text={element.label}
                x={element.width ? -element.width / 2 : -30}
                y={element.height ? -element.height / 2 - 12 : -12}
                fontSize={13}
                fontWeight="600"
                fill="#1A1A1A"
                fontFamily="Inter, -apple-system, sans-serif"
                align="center"
                width={element.width || 60}
              />
            )}
            {element.capacity && (
              <Text
                text={`${element.capacity}`}
                x={element.width ? -element.width / 2 : -15}
                y={(element.height || element.radius || 30) / 2 - 6}
                fontSize={12}
                fontWeight="500"
                fill="#FFFFFF"
                fontFamily="Inter, -apple-system, sans-serif"
                align="center"
                width={element.width || 30}
              />
            )}
          </Group>
        )

      case 'wall':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width || 200}
              height={element.height || 20}
              fill={element.fill || '#E8E8E8'}
              stroke={element.stroke || '#9E9E9E'}
              strokeWidth={element.strokeWidth || 2}
              cornerRadius={4}
            />
          </Group>
        )

      case 'door':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width || 80}
              height={element.height || 20}
              fill={element.fill || '#D7CCC8'}
              stroke={element.stroke || '#8D6E63'}
              strokeWidth={element.strokeWidth || 2}
              cornerRadius={6}
            />
            {/* Дверная ручка */}
            <Circle
              x={element.width ? element.width - 15 : 65}
              y={element.height ? element.height / 2 : 10}
              radius={3}
              fill="#8D6E63"
            />
            {element.label && (
              <Text
                text={element.label}
                x={8}
                y={-20}
                fontSize={11}
                fontWeight="500"
                fill="#8D6E63"
                fontFamily="Inter, -apple-system, sans-serif"
              />
            )}
          </Group>
        )

      case 'window':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width || 100}
              height={element.height || 20}
              fill={element.fill || '#E3F2FD'}
              stroke={element.stroke || '#2196F3'}
              strokeWidth={element.strokeWidth || 2}
              cornerRadius={6}
            />
            {/* Перегородки окна */}
            <Line
              points={[element.width ? element.width / 2 : 50, 0, element.width ? element.width / 2 : 50, element.height || 20]}
              stroke="#2196F3"
              strokeWidth={1}
              dash={[4, 4]}
            />
            {element.label && (
              <Text
                text={element.label}
                x={10}
                y={-20}
                fontSize={11}
                fontWeight="500"
                fill="#2196F3"
                fontFamily="Inter, -apple-system, sans-serif"
              />
            )}
          </Group>
        )

      case 'group':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              x={0}
              y={0}
              width={element.width || 10}
              height={element.height || 10}
              stroke={element.stroke || '#FF6B01'}
              strokeWidth={element.strokeWidth || 2}
              dash={[10, 5]}
              fill="rgba(255, 107, 1, 0.1)"
              listening={false}
            />
            {element.label && (
              <Text
                text={element.label}
                x={0}
                y={-20}
                fontSize={14}
                fill="#FF6B01"
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
                align="center"
                width={element.width || 10}
              />
            )}
          </Group>
        )

      default:
        return null
    }
  }

  return (
    <Box className="floor-plan-viewer">
      <Paper className="floor-plan-viewer__canvas-wrapper" elevation={1}>
        {/* Панель управления */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            display: 'flex',
            gap: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Tooltip title="Увеличить">
            <IconButton
              onClick={() => handleZoom(0.1)}
              size="small"
              sx={{
                color: '#666',
                '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
              }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Уменьшить">
            <IconButton
              onClick={() => handleZoom(-0.1)}
              size="small"
              sx={{
                color: '#666',
                '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
              }}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Вместить в экран">
            <IconButton
              onClick={handleFitScreen}
              size="small"
              sx={{
                color: '#666',
                '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
              }}
            >
              <FitScreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={showGrid ? 'Скрыть сетку' : 'Показать сетку'}>
            <IconButton
              onClick={() => setShowGrid(!showGrid)}
              size="small"
              sx={{
                color: showGrid ? '#FF6B01' : '#666',
                backgroundColor: showGrid ? 'rgba(255, 107, 1, 0.08)' : 'transparent',
                '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.12)' },
              }}
            >
              <GridIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Переключение этажей */}
        {data.floors.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              display: 'flex',
              gap: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {data.floors.map((floor) => (
              <Box
                key={floor.id}
                onClick={() => setCurrentFloorId(floor.id)}
                sx={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: currentFloorId === floor.id ? '#FF6B01' : 'transparent',
                  color: currentFloorId === floor.id ? '#FFFFFF' : '#666',
                  fontWeight: currentFloorId === floor.id ? 600 : 500,
                  fontSize: '13px',
                  '&:hover': {
                    backgroundColor: currentFloorId === floor.id ? '#E55A00' : 'rgba(255, 107, 1, 0.08)',
                  },
                }}
              >
                {floor.name}
              </Box>
            ))}
          </Box>
        )}

        <Box className="floor-plan-viewer__canvas-container">
          <Stage
            ref={stageRef}
            width={Math.max(800, (window.innerWidth || 1200) - 100)}
            height={Math.max(600, (window.innerHeight || 800) - 200)}
            onWheel={handleWheel}
            draggable={true}
            scaleX={scale}
            scaleY={scale}
            x={position.x}
            y={position.y}
            onDragEnd={(e) => {
              setPosition({
                x: e.target.x(),
                y: e.target.y(),
              })
            }}
            style={{
              backgroundColor: '#FAFBFC',
              cursor: 'grab',
            }}
          >
            {/* Слой сетки (фон) */}
            <Layer>{renderGrid()}</Layer>

            {/* Слой стен (нижний) */}
            <Layer>
              {elements
                .filter((el) => el.type === 'wall')
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((element) => renderElement(element))}
            </Layer>

            {/* Слой дверей и окон (средний) */}
            <Layer>
              {elements
                .filter((el) => el.type === 'door' || el.type === 'window')
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((element) => renderElement(element))}
            </Layer>

            {/* Слой столов (верхний) */}
            <Layer>
              {elements
                .filter((el) => el.type === 'table' && !el.isGroup)
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((element) => renderElement(element))}
            </Layer>

            {/* Слой групп */}
            <Layer>
              {elements
                .filter((el) => el.isGroup)
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((element) => renderElement(element))}
            </Layer>
          </Stage>
        </Box>
      </Paper>
    </Box>
  )
}

export default FloorPlanViewer

