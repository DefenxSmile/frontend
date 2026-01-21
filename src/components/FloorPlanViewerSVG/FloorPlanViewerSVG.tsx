import { useState, useMemo, useRef } from 'react'
import { Box, Paper, IconButton, Tooltip, Chip } from '@mui/material'
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitScreenIcon,
  GridOn as GridIcon,
} from '@mui/icons-material'
import type { FloorPlanElement, FloorPlanData } from '../../types/floorPlan'
import type { Booking } from '../../types/booking'
import './FloorPlanViewerSVG.scss'

interface FloorPlanViewerSVGProps {
  data: FloorPlanData
  bookings?: Booking[]
  onTableClick?: (table: FloorPlanElement) => void
  selectedTableId?: string | null
  interactive?: boolean
}

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const GRID_SIZE = 20

const FloorPlanViewerSVG = ({
  data,
  bookings = [],
  onTableClick,
  selectedTableId = null,
  interactive = false,
}: FloorPlanViewerSVGProps) => {
  const [scale, setScale] = useState(data.stage.scale || 1)
  const [position, setPosition] = useState({
    x: data.stage.offsetX || 0,
    y: data.stage.offsetY || 0,
  })
  const [showGrid, setShowGrid] = useState(false) // По умолчанию скрыта на мобильных
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentFloorId, setCurrentFloorId] = useState<string>(
    data.currentFloorId || (data.floors.length > 0 ? data.floors[0].id : '')
  )
  
  // Touch жесты
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance: number } | null>(null)
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null)

  const svgRef = useRef<SVGSVGElement | null>(null)

  // Получаем элементы текущего этажа
  const elements = useMemo(() => {
    const currentFloor = data.floors.find((f) => f.id === currentFloorId)
    return currentFloor ? currentFloor.elements : []
  }, [data.floors, currentFloorId])

  // Получаем статус стола
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

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    handleZoom(delta)
  }

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0 && !interactive) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging && !interactive) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch обработчики для мобильных устройств
  const getTouchDistance = (touches: React.TouchList | TouchList): number => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      // Одно касание - начало панорамирования
      setIsDragging(true)
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y })
    } else if (e.touches.length === 2) {
      // Два касания - начало зума
      e.preventDefault()
      const distance = getTouchDistance(e.touches)
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      setTouchStart({ x: midX, y: midY, distance })
      setLastTouchDistance(distance)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1 && isDragging && !interactive) {
      // Панорамирование одним пальцем
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    } else if (e.touches.length === 2 && touchStart) {
      // Зум двумя пальцами
      e.preventDefault()
      const distance = getTouchDistance(e.touches)
      if (lastTouchDistance !== null && lastTouchDistance > 0) {
        const scaleChange = distance / lastTouchDistance
        const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale * scaleChange))
        setScale(newScale)
      }
      setLastTouchDistance(distance)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTouchStart(null)
    setLastTouchDistance(null)
  }

  // Рендер сетки
  const renderGrid = () => {
    if (!showGrid) return null
    const lines = []
    const width = data.stage.width
    const height = data.stage.height

    // Вертикальные линии
    for (let x = 0; x <= width; x += GRID_SIZE) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#E0E0E0"
          strokeWidth={0.5}
        />
      )
    }

    // Горизонтальные линии
    for (let y = 0; y <= height; y += GRID_SIZE) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#E0E0E0"
          strokeWidth={0.5}
        />
      )
    }

    return <g className="grid-layer">{lines}</g>
  }

  // Рендер элемента
  const renderElement = (element: FloorPlanElement) => {
    const isSelected = selectedTableId === element.id
    const tableStatus = element.type === 'table' ? getTableStatus(element.id) : null
    const isInteractive = interactive && element.type === 'table' && (element.isAvailable !== false)

    // Цвета для столов по статусу
    const statusColors = {
      available: { fill: '#FFFFFF', stroke: '#4CAF50', strokeWidth: 2 },
      occupied: { fill: '#FFEBEE', stroke: '#F44336', strokeWidth: 2 },
      selected: { fill: '#E3F2FD', stroke: '#2196F3', strokeWidth: 3 },
    }

    const commonProps = {
      key: element.id,
      onClick: isInteractive && onTableClick ? () => onTableClick(element) : undefined,
      style: {
        cursor: isInteractive ? 'pointer' : 'default',
      },
    }

    switch (element.type) {
      case 'table':
        const tableFill = tableStatus ? statusColors[tableStatus].fill : element.fill || '#FFFFFF'
        const tableStroke = tableStatus ? statusColors[tableStatus].stroke : element.stroke || '#4CAF50'
        const tableStrokeWidth = tableStatus ? statusColors[tableStatus].strokeWidth : element.strokeWidth || 2

        if (element.tableShape === 'circle' || !element.tableShape) {
          const radius = element.radius || 40
          const capacity = element.capacity || 4
          const seatsPerSide = Math.ceil(capacity / 4)
          const seatRadius = 7
          const seatOffset = radius + 18

          return (
            <g {...commonProps}>
              {/* Тень стола */}
              <circle
                cx={element.x + 1}
                cy={element.y + 1}
                r={radius}
                fill="rgba(0,0,0,0.1)"
                opacity={0.3}
              />
              {/* Стол */}
              <circle
                cx={element.x}
                cy={element.y}
                r={radius}
                fill={tableFill}
                stroke={tableStroke}
                strokeWidth={tableStrokeWidth}
                filter={isSelected ? 'url(#shadow)' : undefined}
              />
              {/* Места вокруг стола */}
              {Array.from({ length: 4 }).map((_, side) => {
                const seats = side === 3 ? capacity - seatsPerSide * 3 : seatsPerSide
                return Array.from({ length: seats }).map((_, i) => {
                  const angle = (side * Math.PI) / 2 + (i + 1) * (Math.PI / 2 / (seats + 1))
                  const seatX = element.x + Math.cos(angle) * seatOffset
                  const seatY = element.y + Math.sin(angle) * seatOffset
                  return (
                    <circle
                      key={`seat-${side}-${i}`}
                      cx={seatX}
                      cy={seatY}
                      r={seatRadius}
                      fill="#4CAF50"
                      stroke="#2E7D32"
                      strokeWidth={1}
                      opacity={0.8}
                    />
                  )
                })
              })}
              {/* Название стола */}
              {element.label && (
                <text
                  x={element.x}
                  y={element.y - radius - 12}
                  textAnchor="middle"
                  fontSize={scale < 0.8 ? "11" : "13"}
                  fontWeight="600"
                  fill="#212121"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none"
                >
                  {element.label}
                </text>
              )}
              {capacity && (
                <text
                  x={element.x}
                  y={element.y + 5}
                  textAnchor="middle"
                  fontSize={scale < 0.8 ? "9" : "11"}
                  fontWeight="500"
                  fill="#757575"
                  fontFamily="Inter, sans-serif"
                  className="pointer-events-none"
                >
                  {capacity} мест
                </text>
              )}
            </g>
          )
        } else if (element.tableShape === 'square') {
          const size = element.width || 80
          return (
            <g {...commonProps}>
              <rect
                x={element.x - size / 2}
                y={element.y - size / 2}
                width={size}
                height={size}
                fill={tableFill}
                stroke={tableStroke}
                strokeWidth={tableStrokeWidth}
                rx={4}
                filter={isSelected ? 'url(#shadow)' : undefined}
              />
              {element.label && (
                <text
                  x={element.x}
                  y={element.y - size / 2 - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#212121"
                  fontFamily="Inter, sans-serif"
                >
                  {element.label}
                </text>
              )}
              {element.capacity && (
                <text
                  x={element.x}
                  y={element.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#757575"
                  fontFamily="Inter, sans-serif"
                >
                  {element.capacity}
                </text>
              )}
            </g>
          )
        } else {
          // Rectangle или oval
          const width = element.width || 100
          const height = element.height || 60
          const rx = element.tableShape === 'oval' ? Math.min(width, height) / 2 : 4
          return (
            <g {...commonProps}>
              <rect
                x={element.x - width / 2}
                y={element.y - height / 2}
                width={width}
                height={height}
                fill={tableFill}
                stroke={tableStroke}
                strokeWidth={tableStrokeWidth}
                rx={rx}
                filter={isSelected ? 'url(#shadow)' : undefined}
              />
              {element.label && (
                <text
                  x={element.x}
                  y={element.y - height / 2 - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#212121"
                  fontFamily="Inter, sans-serif"
                >
                  {element.label}
                </text>
              )}
              {element.capacity && (
                <text
                  x={element.x}
                  y={element.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#757575"
                  fontFamily="Inter, sans-serif"
                >
                  {element.capacity}
                </text>
              )}
            </g>
          )
        }

      case 'wall':
        return (
          <rect
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width || 100}
            height={element.height || 20}
            fill={element.fill || '#E8E8E8'}
            stroke={element.stroke || '#9E9E9E'}
            strokeWidth={element.strokeWidth || 2}
          />
        )

      case 'door':
        const doorWidth = element.width || 80
        const doorHeight = element.height || 20
        const isDoorHorizontal = doorWidth > doorHeight
        return (
          <g key={element.id}>
            <rect
              x={element.x}
              y={element.y}
              width={doorWidth}
              height={doorHeight}
              fill={element.fill || '#D7CCC8'}
              stroke={element.stroke || '#8D6E63'}
              strokeWidth={element.strokeWidth || 2}
              rx={2}
            />
            {isDoorHorizontal ? (
              <line
                x1={element.x + doorWidth / 2}
                y1={element.y}
                x2={element.x + doorWidth / 2}
                y2={element.y + doorHeight}
                stroke="#8D6E63"
                strokeWidth={1}
              />
            ) : (
              <line
                x1={element.x}
                y1={element.y + doorHeight / 2}
                x2={element.x + doorWidth}
                y2={element.y + doorHeight / 2}
                stroke="#8D6E63"
                strokeWidth={1}
              />
            )}
          </g>
        )

      case 'window':
        const windowWidth = element.width || 100
        const windowHeight = element.height || 20
        const isWindowHorizontal = windowWidth > windowHeight
        return (
          <g key={element.id}>
            <rect
              x={element.x}
              y={element.y}
              width={windowWidth}
              height={windowHeight}
              fill={element.fill || '#E3F2FD'}
              stroke={element.stroke || '#2196F3'}
              strokeWidth={element.strokeWidth || 2}
              rx={2}
            />
            {isWindowHorizontal ? (
              <>
                <line
                  x1={element.x + windowWidth / 3}
                  y1={element.y}
                  x2={element.x + windowWidth / 3}
                  y2={element.y + windowHeight}
                  stroke="#90CAF9"
                  strokeWidth={0.5}
                  strokeDasharray="2,2"
                />
                <line
                  x1={element.x + (windowWidth / 3) * 2}
                  y1={element.y}
                  x2={element.x + (windowWidth / 3) * 2}
                  y2={element.y + windowHeight}
                  stroke="#90CAF9"
                  strokeWidth={0.5}
                  strokeDasharray="2,2"
                />
              </>
            ) : (
              <>
                <line
                  x1={element.x}
                  y1={element.y + windowHeight / 3}
                  x2={element.x + windowWidth}
                  y2={element.y + windowHeight / 3}
                  stroke="#90CAF9"
                  strokeWidth={0.5}
                  strokeDasharray="2,2"
                />
                <line
                  x1={element.x}
                  y1={element.y + (windowHeight / 3) * 2}
                  x2={element.x + windowWidth}
                  y2={element.y + (windowHeight / 3) * 2}
                  stroke="#90CAF9"
                  strokeWidth={0.5}
                  strokeDasharray="2,2"
                />
              </>
            )}
          </g>
        )

      default:
        return null
    }
  }

  // Сортируем элементы по zIndex
  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
  }, [elements])

  return (
    <Box className="floor-plan-viewer-svg">
      <Paper className="floor-plan-viewer-svg__wrapper" elevation={1}>
        {/* Контролы */}
        <Box className="floor-plan-viewer-svg__controls">
          <Tooltip title="Увеличить">
            <IconButton size="small" onClick={() => handleZoom(0.1)}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Уменьшить">
            <IconButton size="small" onClick={() => handleZoom(-0.1)}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Подогнать под экран">
            <IconButton size="small" onClick={handleFitScreen}>
              <FitScreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={showGrid ? 'Скрыть сетку' : 'Показать сетку'}>
            <IconButton
              size="small"
              onClick={() => setShowGrid(!showGrid)}
              className={`${
                showGrid
                  ? 'text-[#FF6B01] bg-[rgba(255,107,1,0.08)] hover:text-[#FF6B01] hover:bg-[rgba(255,107,1,0.12)]'
                  : 'text-[#666] bg-transparent hover:text-[#FF6B01] hover:bg-[rgba(255,107,1,0.12)]'
              }`}
            >
              <GridIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {data.floors.length > 1 && (
            <Box className="ml-4 flex gap-2">
              {data.floors.map((floor) => (
                <Chip
                  key={floor.id}
                  label={floor.name}
                  size="small"
                  onClick={() => setCurrentFloorId(floor.id)}
                  color={currentFloorId === floor.id ? 'primary' : 'default'}
                  className="text-[11px]"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* SVG контейнер */}
        <Box className="floor-plan-viewer-svg__container">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${data.stage.width} ${data.stage.height}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`floor-plan-viewer-svg__canvas ${
              isDragging ? 'cursor-grabbing' : interactive ? 'cursor-default' : 'cursor-grab'
            } ${interactive ? 'touch-action-auto' : 'touch-action-none'}`}
          >
            {/* Фильтры для теней */}
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.2)" />
              </filter>
            </defs>

            {/* Группа для трансформации */}
            <g
              transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
              className="origin-top-left"
            >
              {/* Сетка */}
              {renderGrid()}

              {/* Элементы */}
              {sortedElements.map((element) => renderElement(element))}
            </g>
          </svg>
        </Box>
      </Paper>
    </Box>
  )
}

export default FloorPlanViewerSVG

