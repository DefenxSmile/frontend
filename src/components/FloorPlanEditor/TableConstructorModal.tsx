import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  RotateRight as RotateIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { Stage, Layer, Circle, Rect, Text, Line, Group } from 'react-konva'
import type { TableShape } from '../../types/floorPlan'
import './TableConstructorModal.scss'

interface TableConstructorModalProps {
  open: boolean
  onClose: () => void
  onSave: (tableConfig: TableConfig) => void
  initialConfig?: Partial<TableConfig>
}

export type FurnitureType = 'chair' | 'sofa' | 'armchair'
export type FurnitureShape = 'straight' | 'curved' | 'l-shaped' | 'l-shaped-reverse' | 'round'

export interface FurniturePosition {
  side: 'top' | 'right' | 'bottom' | 'left' | 'circle'
  index: number
  angle?: number
  offset?: number
  shape?: FurnitureShape
}

export interface TableConfig {
  shape: TableShape
  width: number
  height: number
  radius?: number
  label: string
  capacity: number
  rotation: number
  corners?: number
  furnitureType: FurnitureType
  furnitureShape?: FurnitureShape
  showFurniture: boolean
  furniturePositions: FurniturePosition[]
}

const DEFAULT_CONFIG: TableConfig = {
  shape: 'square',
  width: 60,
  height: 60,
  label: 'Стол',
  capacity: 4,
  rotation: 0,
  corners: 3,
  furnitureType: 'chair',
  furnitureShape: 'straight',
  showFurniture: true,
  furniturePositions: [],
}

const PREVIEW_SIZE = 360
const PREVIEW_SCALE = 1.2

const TableConstructorModal = ({
  open,
  onClose,
  onSave,
  initialConfig,
}: TableConstructorModalProps) => {
  const [config, setConfig] = useState<TableConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })

  useEffect(() => {
    if (open) {
      setConfig({
        ...DEFAULT_CONFIG,
        ...(initialConfig || {}),
      })
    }
  }, [open, initialConfig])

  const handleShapeChange = (shape: TableShape) => {
    setConfig((prev) => {
      const newConfig = { ...prev, shape }
      if (shape === 'circle' && !newConfig.radius) {
        newConfig.radius = Math.min(prev.width, prev.height) / 2
      }
      return newConfig
    })
  }

  const handleDimensionChange = (field: 'width' | 'height' | 'radius' | 'corners', delta: number) => {
    setConfig((prev) => {
      const newValue = (prev[field] || 0) + delta
      const minValue = field === 'corners' ? 3 : 10
      const maxValue = field === 'corners' ? 12 : 500
      return {
        ...prev,
        [field]: Math.max(minValue, Math.min(maxValue, newValue)),
      }
    })
  }

  const handleRotationChange = (delta: number) => {
    setConfig((prev) => ({
      ...prev,
      rotation: (prev.rotation + delta + 360) % 360,
    }))
  }

  const handleRemoveFurniture = (index: number) => {
    setConfig((prev) => {
      const newPositions = [...(prev.furniturePositions || [])]
      if (index >= 0 && index < newPositions.length) {
        newPositions.splice(index, 1)
        const updatedPositions = newPositions.map((pos, idx) => {
          const sameSidePositions = newPositions.filter((p, i) => p.side === pos.side && i <= idx)
          return {
            ...pos,
            index: sameSidePositions.length - 1,
          }
        })
        return {
          ...prev,
          furniturePositions: updatedPositions,
          capacity: updatedPositions.length,
        }
      }
      return prev
    })
  }

  const handleSave = () => {
    onSave(config)
    onClose()
  }

  const renderTablePreview = () => {
    const centerX = PREVIEW_SIZE / 2
    const centerY = PREVIEW_SIZE / 2
    const scale = PREVIEW_SCALE

    let tableElement: React.ReactElement | null = null

    switch (config.shape) {
      case 'circle':
        const radius = config.radius || Math.min(config.width, config.height) / 2
        tableElement = (
          <Group>
            {/* Тень стола */}
            <Circle
              x={centerX + 2}
              y={centerY + 2}
              radius={radius * scale}
              fill="rgba(0, 0, 0, 0.1)"
              listening={false}
            />
            {/* Основание стола */}
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
            {/* Внутренний круг для объема */}
            <Circle
              x={centerX}
              y={centerY}
              radius={radius * scale - 3 * scale}
              fill="rgba(255, 255, 255, 0.2)"
              listening={false}
            />
          </Group>
        )
        break
      case 'square':
        tableElement = (
          <Group>
            {/* Тень стола */}
            <Rect
              x={centerX - (config.width * scale) / 2 + 2}
              y={centerY - (config.height * scale) / 2 + 2}
              width={config.width * scale}
              height={config.height * scale}
              fill="rgba(0, 0, 0, 0.1)"
              cornerRadius={6 * scale}
              listening={false}
            />
            {/* Основание стола */}
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
            {/* Внутренняя рамка для объема */}
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
        break
      case 'rectangle':
        tableElement = (
          <Rect
            x={centerX - (config.width * scale) / 2}
            y={centerY - (config.height * scale) / 2}
            width={config.width * scale}
            height={config.height * scale}
            fill="#A8D5BA"
            stroke="#4CAF50"
            strokeWidth={2 * scale}
            cornerRadius={4 * scale}
          />
        )
        break
      case 'oval':
        tableElement = (
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
        break
    }

    // Улучшенная сетка с красными пунктирными линиями и плюсами
    const gridSize = 20 * scale
    const gridLines: React.ReactElement[] = []
    const gridPoints: React.ReactElement[] = []
    
    for (let i = 0; i <= PREVIEW_SIZE; i += gridSize) {
      const isCenterLine = Math.abs(i - PREVIEW_SIZE / 2) < gridSize / 2
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, PREVIEW_SIZE]}
          stroke={isCenterLine ? '#F44336' : '#BBDEFB'}
          strokeWidth={isCenterLine ? 1 : 0.5}
          dash={isCenterLine ? [4, 4] : undefined}
          listening={false}
        />
      )
      for (let j = 0; j <= PREVIEW_SIZE; j += gridSize) {
        gridPoints.push(
          <Group key={`point-${i}-${j}`} listening={false}>
            <Line points={[i - 3, j, i + 3, j]} stroke="#757575" strokeWidth={0.5} />
            <Line points={[i, j - 3, i, j + 3]} stroke="#757575" strokeWidth={0.5} />
          </Group>
        )
      }
    }
    
    for (let i = 0; i <= PREVIEW_SIZE; i += gridSize) {
      const isCenterLine = Math.abs(i - PREVIEW_SIZE / 2) < gridSize / 2
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, PREVIEW_SIZE, i]}
          stroke={isCenterLine ? '#F44336' : '#BBDEFB'}
          strokeWidth={isCenterLine ? 1 : 0.5}
          dash={isCenterLine ? [4, 4] : undefined}
          listening={false}
        />
      )
    }

    return (
      <Box
        sx={{
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          border: '1px solid #E0E0E0',
          borderRadius: '4px',
          backgroundColor: '#E3F2FD',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stage width={PREVIEW_SIZE} height={PREVIEW_SIZE}>
          <Layer>
            {gridLines}
            {gridPoints}
            {tableElement}
            <Circle x={centerX} y={centerY} radius={3} fill="#FF6B01" listening={false} />
            {config.label && (
              <Text
                x={centerX}
                y={centerY + (config.shape === 'circle' ? (config.radius || 0) * scale : (config.height * scale) / 2) + 20}
                text={config.label}
                fontSize={12 * scale}
                fill="#333"
                align="center"
                listening={false}
                offsetX={(config.label.length * 3 * scale) / 2}
              />
            )}
            {config.showFurniture && config.furniturePositions && config.furniturePositions.length > 0 && renderFurniture(centerX, centerY, scale)}
            {config.showFurniture && renderFurnitureZones(centerX, centerY, scale)}
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

  const renderFurniture = (centerX: number, centerY: number, scale: number) => {
    if (!config.furniturePositions || config.furniturePositions.length === 0) {
      return null
    }

    const furnitureElements: React.ReactElement[] = []
    const furnitureType = config.furnitureType || 'chair'
    const furnitureShape = config.furnitureShape || 'straight'

    config.furniturePositions.forEach((pos, index) => {
      let seatX = centerX
      let seatY = centerY
      let rotation = 0

      if (config.shape === 'circle' && pos.side === 'circle') {
        const radius = config.radius || Math.min(config.width, config.height) / 2
        const seatRadius = radius * scale + (pos.offset || 18) * scale
        const angle = pos.angle !== undefined ? (pos.angle * Math.PI) / 180 : (index * 2 * Math.PI) / config.furniturePositions.length - Math.PI / 2
        seatX = centerX + Math.cos(angle) * seatRadius
        seatY = centerY + Math.sin(angle) * seatRadius
        rotation = pos.angle || 0
      } else {
        const width = config.width * scale
        const height = config.height * scale
        const seatOffset = (pos.offset || 18) * scale
        const sidePositions = config.furniturePositions.filter(p => p.side === pos.side)
        const sideIndex = sidePositions.indexOf(pos)
        const totalOnSide = sidePositions.length

        switch (pos.side) {
          case 'top':
            seatX = centerX - width / 2 + ((sideIndex + 1) * width) / (totalOnSide + 1)
            seatY = centerY - height / 2 - seatOffset
            rotation = 0
            break
          case 'right':
            seatX = centerX + width / 2 + seatOffset
            seatY = centerY - height / 2 + ((sideIndex + 1) * height) / (totalOnSide + 1)
            rotation = 90
            break
          case 'bottom':
            seatX = centerX - width / 2 + ((sideIndex + 1) * width) / (totalOnSide + 1)
            seatY = centerY + height / 2 + seatOffset
            rotation = 180
            break
          case 'left':
            seatX = centerX - width / 2 - seatOffset
            seatY = centerY - height / 2 + ((sideIndex + 1) * height) / (totalOnSide + 1)
            rotation = 270
            break
        }
      }

      const shape = pos.shape || furnitureShape

      if (furnitureType === 'sofa') {
        // Диваны - реалистичная визуализация как у конкурента
        const sofaWidth = 28 * scale
        const sofaHeight = 14 * scale
        const sofaDepth = 3 * scale
        
        if (shape === 'l-shaped') {
          // L-образный диван - реалистичная форма
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Основная часть дивана - сиденье */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2}
                width={sofaWidth}
                height={sofaHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={3 * scale}
                shadowBlur={4 * scale}
                shadowColor="rgba(0, 0, 0, 0.25)"
                listening={false}
              />
              {/* Спинка основной части */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2 - sofaDepth}
                width={sofaWidth}
                height={sofaDepth}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* L-образная часть - сиденье */}
              <Rect
                x={sofaWidth / 2 - 2 * scale}
                y={-sofaHeight / 2}
                width={sofaHeight + 2 * scale}
                height={sofaHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={3 * scale}
                shadowBlur={4 * scale}
                shadowColor="rgba(0, 0, 0, 0.25)"
                listening={false}
              />
              {/* Спинка L-образной части */}
              <Rect
                x={sofaWidth / 2 - 2 * scale}
                y={-sofaHeight / 2 - sofaDepth}
                width={sofaHeight + 2 * scale}
                height={sofaDepth}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* Подлокотник */}
              <Rect
                x={sofaWidth / 2 + sofaHeight - 2 * scale}
                y={-sofaHeight / 2}
                width={sofaDepth}
                height={sofaHeight}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Детали - подушки */}
              <Line
                points={[-sofaWidth / 4, -sofaHeight / 2, -sofaWidth / 4, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              <Line
                points={[sofaWidth / 4, -sofaHeight / 2, sofaWidth / 4, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={sofaWidth / 2 + sofaHeight / 2}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        } else if (shape === 'l-shaped-reverse') {
          // Обратный L-образный диван
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Основная часть дивана */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2}
                width={sofaWidth}
                height={sofaHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={3 * scale}
                shadowBlur={4 * scale}
                shadowColor="rgba(0, 0, 0, 0.25)"
                listening={false}
              />
              {/* Спинка основной части */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2 - sofaDepth}
                width={sofaWidth}
                height={sofaDepth}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* L-образная часть (слева) */}
              <Rect
                x={-sofaWidth / 2 - sofaHeight}
                y={-sofaHeight / 2}
                width={sofaHeight}
                height={sofaHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={3 * scale}
                shadowBlur={4 * scale}
                shadowColor="rgba(0, 0, 0, 0.25)"
                listening={false}
              />
              {/* Спинка L-образной части */}
              <Rect
                x={-sofaWidth / 2 - sofaHeight}
                y={-sofaHeight / 2 - sofaDepth}
                width={sofaHeight}
                height={sofaDepth}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* Подлокотник */}
              <Rect
                x={-sofaWidth / 2 - sofaHeight - sofaDepth}
                y={-sofaHeight / 2}
                width={sofaDepth}
                height={sofaHeight}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Детали - подушки */}
              <Line
                points={[-sofaWidth / 4, -sofaHeight / 2, -sofaWidth / 4, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={-sofaWidth / 2 - sofaHeight / 2}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        } else if (shape === 'curved') {
          // Кривой диван - более реалистичная форма
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Сиденье */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2}
                width={sofaWidth}
                height={sofaHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={sofaHeight / 2}
                shadowBlur={4 * scale}
                shadowColor="rgba(0, 0, 0, 0.25)"
                listening={false}
              />
              {/* Спинка кривая */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2 - sofaDepth}
                width={sofaWidth}
                height={sofaDepth}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={sofaDepth / 2}
                listening={false}
              />
              {/* Детали - подушки */}
              <Line
                points={[-sofaWidth / 3, -sofaHeight / 2, -sofaWidth / 3, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              <Line
                points={[sofaWidth / 3, -sofaHeight / 2, sofaWidth / 3, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={0}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        } else {
          // Прямой диван - реалистичная форма
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Сиденье */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2}
                width={sofaWidth}
                height={sofaHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={3 * scale}
                shadowBlur={4 * scale}
                shadowColor="rgba(0, 0, 0, 0.25)"
                listening={false}
              />
              {/* Спинка */}
              <Rect
                x={-sofaWidth / 2}
                y={-sofaHeight / 2 - sofaDepth}
                width={sofaWidth}
                height={sofaDepth}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* Подлокотники */}
              <Rect
                x={-sofaWidth / 2 - sofaDepth}
                y={-sofaHeight / 2}
                width={sofaDepth}
                height={sofaHeight}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              <Rect
                x={sofaWidth / 2}
                y={-sofaHeight / 2}
                width={sofaDepth}
                height={sofaHeight}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Детали - подушки (разделители) */}
              <Line
                points={[-sofaWidth / 3, -sofaHeight / 2, -sofaWidth / 3, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              <Line
                points={[sofaWidth / 3, -sofaHeight / 2, sofaWidth / 3, sofaHeight / 2]}
                stroke="#66BB6A"
                strokeWidth={1 * scale}
                dash={[2, 2]}
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={0}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        }
      } else if (furnitureType === 'armchair') {
        // Кресла - реалистичная форма как у конкурента
        const chairWidth = 12 * scale
        const chairHeight = 12 * scale
        const chairDepth = 2 * scale
        
        if (shape === 'curved') {
          // Кривое кресло
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Сиденье */}
              <Rect
                x={-chairWidth / 2}
                y={-chairHeight / 2}
                width={chairWidth}
                height={chairHeight}
                fill="#FF9800"
                stroke="#F57C00"
                strokeWidth={1.5 * scale}
                cornerRadius={chairHeight / 2}
                shadowBlur={3 * scale}
                shadowColor="rgba(0, 0, 0, 0.3)"
                listening={false}
              />
              {/* Спинка */}
              <Rect
                x={-chairWidth / 2}
                y={-chairHeight / 2 - chairDepth * 2}
                width={chairWidth}
                height={chairDepth * 2}
                fill="#F57C00"
                stroke="#E65100"
                strokeWidth={1 * scale}
                cornerRadius={chairDepth}
                listening={false}
              />
              {/* Подлокотники */}
              <Rect
                x={-chairWidth / 2 - chairDepth}
                y={-chairHeight / 2}
                width={chairDepth}
                height={chairHeight}
                fill="#F57C00"
                stroke="#E65100"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              <Rect
                x={chairWidth / 2}
                y={-chairHeight / 2}
                width={chairDepth}
                height={chairHeight}
                fill="#F57C00"
                stroke="#E65100"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={0}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        } else {
          // Прямое кресло
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Сиденье */}
              <Rect
                x={-chairWidth / 2}
                y={-chairHeight / 2}
                width={chairWidth}
                height={chairHeight}
                fill="#FF9800"
                stroke="#F57C00"
                strokeWidth={1.5 * scale}
                cornerRadius={2 * scale}
                shadowBlur={3 * scale}
                shadowColor="rgba(0, 0, 0, 0.3)"
                listening={false}
              />
              {/* Спинка */}
              <Rect
                x={-chairWidth / 2}
                y={-chairHeight / 2 - chairDepth * 2.5}
                width={chairWidth}
                height={chairDepth * 2.5}
                fill="#F57C00"
                stroke="#E65100"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* Подлокотники */}
              <Rect
                x={-chairWidth / 2 - chairDepth}
                y={-chairHeight / 2}
                width={chairDepth}
                height={chairHeight}
                fill="#F57C00"
                stroke="#E65100"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              <Rect
                x={chairWidth / 2}
                y={-chairHeight / 2}
                width={chairDepth}
                height={chairHeight}
                fill="#F57C00"
                stroke="#E65100"
                strokeWidth={1 * scale}
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Детали - внутренняя часть */}
              <Rect
                x={-chairWidth / 2 + 1 * scale}
                y={-chairHeight / 2 + 1 * scale}
                width={chairWidth - 2 * scale}
                height={chairHeight - 2 * scale}
                fill="rgba(255, 255, 255, 0.1)"
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={0}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        }
      } else {
        // Стулья - реалистичная форма как у конкурента
        const chairWidth = 10 * scale
        const chairHeight = 10 * scale
        const chairBackHeight = 6 * scale
        
        if (shape === 'round') {
          // Круглый стул без спинки
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Сиденье */}
              <Circle
                x={0}
                y={0}
                radius={chairWidth / 2}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                shadowBlur={3 * scale}
                shadowColor="rgba(46, 125, 50, 0.4)"
                listening={false}
              />
              {/* Внутренний круг */}
              <Circle
                x={0}
                y={0}
                radius={chairWidth / 2 - 2 * scale}
                fill="#66BB6A"
                listening={false}
              />
              {/* Ножки (4 точки) */}
              <Circle x={-chairWidth / 3} y={chairWidth / 3} radius={1 * scale} fill="#2E7D32" listening={false} />
              <Circle x={chairWidth / 3} y={chairWidth / 3} radius={1 * scale} fill="#2E7D32" listening={false} />
              <Circle x={-chairWidth / 3} y={-chairWidth / 3} radius={1 * scale} fill="#2E7D32" listening={false} />
              <Circle x={chairWidth / 3} y={-chairWidth / 3} radius={1 * scale} fill="#2E7D32" listening={false} />
              {/* Кнопка удаления */}
              <Circle
                x={0}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        } else {
          // Обычный стул со спинкой
          furnitureElements.push(
            <Group key={`furniture-${index}`} x={seatX} y={seatY} rotation={rotation}>
              {/* Сиденье */}
              <Rect
                x={-chairWidth / 2}
                y={-chairHeight / 2}
                width={chairWidth}
                height={chairHeight}
                fill="#4CAF50"
                stroke="#2E7D32"
                strokeWidth={1.5 * scale}
                cornerRadius={2 * scale}
                shadowBlur={3 * scale}
                shadowColor="rgba(46, 125, 50, 0.4)"
                listening={false}
              />
              {/* Внутренняя часть сиденья */}
              <Rect
                x={-chairWidth / 2 + 1 * scale}
                y={-chairHeight / 2 + 1 * scale}
                width={chairWidth - 2 * scale}
                height={chairHeight - 2 * scale}
                fill="#66BB6A"
                cornerRadius={1 * scale}
                listening={false}
              />
              {/* Спинка */}
              <Rect
                x={-chairWidth / 2 + 2 * scale}
                y={-chairHeight / 2 - chairBackHeight}
                width={chairWidth - 4 * scale}
                height={chairBackHeight}
                fill="#2E7D32"
                stroke="#1B5E20"
                strokeWidth={1 * scale}
                cornerRadius={2 * scale}
                listening={false}
              />
              {/* Ножки (4 угла) */}
              <Rect
                x={-chairWidth / 2 - 1 * scale}
                y={chairHeight / 2 - 2 * scale}
                width={2 * scale}
                height={2 * scale}
                fill="#2E7D32"
                listening={false}
              />
              <Rect
                x={chairWidth / 2 - 1 * scale}
                y={chairHeight / 2 - 2 * scale}
                width={2 * scale}
                height={2 * scale}
                fill="#2E7D32"
                listening={false}
              />
              <Rect
                x={-chairWidth / 2 - 1 * scale}
                y={-chairHeight / 2}
                width={2 * scale}
                height={2 * scale}
                fill="#2E7D32"
                listening={false}
              />
              <Rect
                x={chairWidth / 2 - 1 * scale}
                y={-chairHeight / 2}
                width={2 * scale}
                height={2 * scale}
                fill="#2E7D32"
                listening={false}
              />
              {/* Кнопка удаления */}
              <Circle
                x={0}
                y={0}
                radius={5 * scale}
                fill="#FF6B01"
                stroke="#FFFFFF"
                strokeWidth={2 * scale}
                listening={true}
                onClick={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
                onTap={(e) => {
                  e.cancelBubble = true
                  handleRemoveFurniture(index)
                }}
              />
            </Group>
          )
        }
      }
    })

    return <>{furnitureElements}</>
  }

  const handleFurnitureZoneClick = (side: 'top' | 'right' | 'bottom' | 'left' | 'circle', angle?: number) => {
    if (!config.showFurniture) return

    const newPosition: FurniturePosition = {
      side,
      index: (config.furniturePositions || []).filter(p => p.side === side).length,
      angle,
      offset: 18,
      shape: config.furnitureShape || 'straight',
    }

    setConfig((prev) => ({
      ...prev,
      furniturePositions: [...(prev.furniturePositions || []), newPosition],
      capacity: (prev.furniturePositions?.length || 0) + 1,
    }))
  }

  const renderFurnitureZones = (centerX: number, centerY: number, scale: number) => {
    const zones: React.ReactElement[] = []
    const zoneSize = 20 * scale
    const zoneOffset = 18 * scale

    if (config.shape === 'circle' || config.shape === 'oval') {
      const radius = config.shape === 'circle' 
        ? (config.radius || Math.min(config.width, config.height) / 2) * scale
        : Math.min(config.width, config.height) * scale / 2
      const zoneRadius = radius + zoneOffset
      const numZones = 8

      for (let i = 0; i < numZones; i++) {
        const angle = (i * 2 * Math.PI) / numZones - Math.PI / 2
        const zoneX = centerX + Math.cos(angle) * zoneRadius
        const zoneY = centerY + Math.sin(angle) * zoneRadius
        const angleDegrees = (angle * 180) / Math.PI

        zones.push(
          <Group key={`zone-circle-${i}`}>
            <Circle
              x={zoneX}
              y={zoneY}
              radius={zoneSize / 2}
              fill="rgba(76, 175, 80, 0.1)"
              stroke="rgba(76, 175, 80, 0.5)"
              strokeWidth={1}
              onClick={() => handleFurnitureZoneClick('circle', angleDegrees)}
              onTap={() => handleFurnitureZoneClick('circle', angleDegrees)}
              listening={true}
            />
            <Text
              x={zoneX}
              y={zoneY}
              text="+"
              fontSize={16 * scale}
              fill="#4CAF50"
              align="center"
              verticalAlign="middle"
              offsetX={4 * scale}
              offsetY={8 * scale}
              listening={false}
            />
          </Group>
        )
      }
    } else {
      const width = config.width * scale
      const height = config.height * scale
      const sides: Array<{ side: 'top' | 'right' | 'bottom' | 'left'; positions: Array<{ x: number; y: number }> }> = [
        {
          side: 'top',
          positions: Array.from({ length: Math.max(2, Math.ceil(width / (zoneSize * 2))) }).map((_, i) => ({
            x: centerX - width / 2 + (i + 0.5) * (width / Math.max(2, Math.ceil(width / (zoneSize * 2)))),
            y: centerY - height / 2 - zoneOffset,
          })),
        },
        {
          side: 'right',
          positions: Array.from({ length: Math.max(2, Math.ceil(height / (zoneSize * 2))) }).map((_, i) => ({
            x: centerX + width / 2 + zoneOffset,
            y: centerY - height / 2 + (i + 0.5) * (height / Math.max(2, Math.ceil(height / (zoneSize * 2)))),
          })),
        },
        {
          side: 'bottom',
          positions: Array.from({ length: Math.max(2, Math.ceil(width / (zoneSize * 2))) }).map((_, i) => ({
            x: centerX - width / 2 + (i + 0.5) * (width / Math.max(2, Math.ceil(width / (zoneSize * 2)))),
            y: centerY + height / 2 + zoneOffset,
          })),
        },
        {
          side: 'left',
          positions: Array.from({ length: Math.max(2, Math.ceil(height / (zoneSize * 2))) }).map((_, i) => ({
            x: centerX - width / 2 - zoneOffset,
            y: centerY - height / 2 + (i + 0.5) * (height / Math.max(2, Math.ceil(height / (zoneSize * 2)))),
          })),
        },
      ]

      sides.forEach(({ side, positions }) => {
        positions.forEach((pos, idx) => {
          zones.push(
            <Group key={`zone-${side}-${idx}`}>
              <Circle
                x={pos.x}
                y={pos.y}
                radius={zoneSize / 2}
                fill="rgba(76, 175, 80, 0.1)"
                stroke="rgba(76, 175, 80, 0.5)"
                strokeWidth={1}
                onClick={() => handleFurnitureZoneClick(side)}
                onTap={() => handleFurnitureZoneClick(side)}
                listening={true}
              />
              <Text
                x={pos.x}
                y={pos.y}
                text="+"
                fontSize={16 * scale}
                fill="#4CAF50"
                align="center"
                verticalAlign="middle"
                offsetX={4 * scale}
                offsetY={8 * scale}
                listening={false}
              />
            </Group>
          )
        })
      })
    }

    return <>{zones}</>
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Верхняя панель */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#FF6B01',
            '&:hover': { backgroundColor: '#E55A00' },
            textTransform: 'none',
            fontWeight: 700,
            minWidth: 140,
          }}
          startIcon={<AddIcon />}
        >
          СОХРАНИТЬ
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
          КОНСТРУКТОР СТОЛА
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 0,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Выбор формы стола */}
          <Box sx={{ p: 2, borderBottom: '1px solid #E0E0E0' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant={config.shape === 'square' ? 'contained' : 'outlined'}
                onClick={() => handleShapeChange('square')}
                sx={{
                  minWidth: 120,
                  textTransform: 'none',
                  backgroundColor: config.shape === 'square' ? '#FF6B01' : 'transparent',
                  borderColor: '#FF6B01',
                  color: config.shape === 'square' ? '#FFFFFF' : '#FF6B01',
                  '&:hover': {
                    backgroundColor: config.shape === 'square' ? '#E55A00' : 'rgba(255, 107, 1, 0.1)',
                  },
                }}
              >
                Квадратный
              </Button>
              <Button
                variant={config.shape === 'circle' ? 'contained' : 'outlined'}
                onClick={() => handleShapeChange('circle')}
                sx={{
                  minWidth: 120,
                  textTransform: 'none',
                  backgroundColor: config.shape === 'circle' ? '#4CAF50' : 'transparent',
                  borderColor: '#4CAF50',
                  color: config.shape === 'circle' ? '#FFFFFF' : '#4CAF50',
                  '&:hover': {
                    backgroundColor: config.shape === 'circle' ? '#45a049' : 'rgba(76, 175, 80, 0.1)',
                  },
                }}
              >
                Круглый
              </Button>
            </Box>
          </Box>

          {/* Превью */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, overflow: 'auto', backgroundColor: '#F5F5F5' }}>
            {renderTablePreview()}
          </Box>

          {/* Контролы размеров */}
          <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0', backgroundColor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              {config.shape !== 'circle' && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ minWidth: 60, fontSize: '14px' }}>Ширина:</Typography>
                    <IconButton onClick={() => handleDimensionChange('width', -1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField value={config.width} onChange={(e) => setConfig((prev) => ({ ...prev, width: Math.max(10, parseInt(e.target.value) || 0) }))} type="number" size="small" sx={{ width: 60 }} inputProps={{ min: 10, max: 500 }} />
                    <IconButton onClick={() => handleDimensionChange('width', 1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ minWidth: 60, fontSize: '14px' }}>Высота:</Typography>
                    <IconButton onClick={() => handleDimensionChange('height', -1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField value={config.height} onChange={(e) => setConfig((prev) => ({ ...prev, height: Math.max(10, parseInt(e.target.value) || 0) }))} type="number" size="small" sx={{ width: 60 }} inputProps={{ min: 10, max: 500 }} />
                    <IconButton onClick={() => handleDimensionChange('height', 1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              )}
              {config.shape === 'circle' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ minWidth: 60, fontSize: '14px' }}>Радиус:</Typography>
                  <IconButton onClick={() => handleDimensionChange('radius', -1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField value={config.radius || 0} onChange={(e) => setConfig((prev) => ({ ...prev, radius: Math.max(10, parseInt(e.target.value) || 0) }))} type="number" size="small" sx={{ width: 60 }} inputProps={{ min: 10, max: 250 }} />
                  <IconButton onClick={() => handleDimensionChange('radius', 1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ minWidth: 60, fontSize: '14px' }}>Углы:</Typography>
                <IconButton onClick={() => handleDimensionChange('corners', -1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }} disabled={!config.corners || config.corners <= 3 ? true : false}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField value={config.corners || 3} onChange={(e) => setConfig((prev) => ({ ...prev, corners: Math.max(3, Math.min(12, parseInt(e.target.value) || 3)) }))} type="number" size="small" sx={{ width: 60 }} inputProps={{ min: 3, max: 12 }} />
                <IconButton onClick={() => handleDimensionChange('corners', 1)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }} disabled={config.corners ? config.corners >= 12 : false}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ minWidth: 60, fontSize: '14px' }}>Поворот:</Typography>
                <IconButton onClick={() => handleRotationChange(-15)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                  <RotateIcon fontSize="small" sx={{ transform: 'scaleX(-1)' }} />
                </IconButton>
                <TextField value={config.rotation} onChange={(e) => { const value = parseInt(e.target.value) || 0; setConfig((prev) => ({ ...prev, rotation: ((value % 360) + 360) % 360 })) }} onBlur={(e) => { const value = parseInt(e.target.value) || 0; setConfig((prev) => ({ ...prev, rotation: ((value % 360) + 360) % 360 })) }} type="number" size="small" sx={{ width: 60 }} inputProps={{ min: 0, max: 360 }} />
                <IconButton onClick={() => handleRotationChange(15)} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: '4px' }}>
                  <RotateIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Палитра мебели */}
          <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0', backgroundColor: '#FAFAFA' }}>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {/* Кресла */}
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'armchair', furnitureShape: 'straight' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'armchair' && config.furnitureShape === 'straight' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ width: 30, height: 30, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>КРЕСЛО</Typography>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'armchair', furnitureShape: 'curved' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'armchair' && config.furnitureShape === 'curved' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ width: 30, height: 20, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>КРЕСЛО</Typography>
              </Button>

              {/* Стулья */}
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'chair', furnitureShape: 'straight' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'chair' && config.furnitureShape === 'straight' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ width: 24, height: 24, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>СТУЛ</Typography>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'chair', furnitureShape: 'round' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'chair' && config.furnitureShape === 'round' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ width: 20, height: 20, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>СТУЛ</Typography>
              </Button>

              {/* Диваны */}
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'sofa', furnitureShape: 'straight' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'sofa' && config.furnitureShape === 'straight' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ width: 40, height: 16, backgroundColor: '#4CAF50', borderRadius: '2px' }} />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>ДИВАН</Typography>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'sofa', furnitureShape: 'l-shaped' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'sofa' && config.furnitureShape === 'l-shaped' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: 20, height: 16, backgroundColor: '#4CAF50', borderRadius: '2px 0 0 2px' }} />
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#4CAF50', borderRadius: '0 2px 2px 0', ml: '-2px', mt: '8px' }} />
                </Box>
                <Typography variant="caption" sx={{ fontSize: '10px' }}>ДИВАН</Typography>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'sofa', furnitureShape: 'l-shaped-reverse' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'sofa' && config.furnitureShape === 'l-shaped-reverse' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#4CAF50', borderRadius: '2px 0 0 2px', mt: '8px' }} />
                  <Box sx={{ width: 20, height: 16, backgroundColor: '#4CAF50', borderRadius: '0 2px 2px 0', ml: '-2px' }} />
                </Box>
                <Typography variant="caption" sx={{ fontSize: '10px' }}>ДИВАН</Typography>
              </Button>
              <Button
                variant="outlined"
                onClick={() => setConfig((prev) => ({ ...prev, furnitureType: 'sofa', furnitureShape: 'curved' }))}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  backgroundColor: config.furnitureType === 'sofa' && config.furnitureShape === 'curved' ? '#FFB3BA' : 'transparent',
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box sx={{ width: 40, height: 16, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>ДИВАН</Typography>
              </Button>

              {/* ПОВОРОТ */}
              <Button
                variant="outlined"
                onClick={() => handleRotationChange(90)}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  borderColor: '#757575',
                  color: '#757575',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <RotateIcon />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>ПОВОРОТ</Typography>
              </Button>

              {/* УДАЛИТЬ */}
              <Button
                variant="outlined"
                onClick={() => {
                  setConfig((prev) => ({
                    ...prev,
                    furniturePositions: [],
                  }))
                }}
                sx={{
                  minWidth: 80,
                  height: 60,
                  textTransform: 'none',
                  borderColor: '#F44336',
                  color: '#F44336',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <DeleteIcon />
                <Typography variant="caption" sx={{ fontSize: '10px' }}>УДАЛИТЬ</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default TableConstructorModal
