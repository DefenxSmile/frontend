import type { FurniturePosition, TableConfig } from '../types'

export const calculateCircleFurniturePosition = (
  position: FurniturePosition,
  index: number,
  config: TableConfig,
  scale: number
): { x: number; y: number; rotation: number } => {
  const radius = config.radius || Math.min(config.width, config.height) / 2
  const seatRadius = radius * scale + (position.offset || 18) * scale
  const angle =
    position.angle !== undefined
      ? (position.angle * Math.PI) / 180
      : (index * 2 * Math.PI) / config.furniturePositions.length - Math.PI / 2

  return {
    x: Math.cos(angle) * seatRadius,
    y: Math.sin(angle) * seatRadius,
    rotation: position.angle || 0,
  }
}

export const calculateRectFurniturePosition = (
  position: FurniturePosition,
  config: TableConfig,
  scale: number
): { x: number; y: number; rotation: number } => {
  const width = config.width * scale
  const height = config.height * scale
  const seatOffset = (position.offset || 18) * scale
  const sidePositions = config.furniturePositions.filter((p) => p.side === position.side)
  const sideIndex = sidePositions.indexOf(position)
  const totalOnSide = sidePositions.length

  let x = 0
  let y = 0
  let rotation = 0

  switch (position.side) {
    case 'top':
      x = -width / 2 + ((sideIndex + 1) * width) / (totalOnSide + 1)
      y = -height / 2 - seatOffset
      rotation = 0
      break
    case 'right':
      x = width / 2 + seatOffset
      y = -height / 2 + ((sideIndex + 1) * height) / (totalOnSide + 1)
      rotation = 90
      break
    case 'bottom':
      x = -width / 2 + ((sideIndex + 1) * width) / (totalOnSide + 1)
      y = height / 2 + seatOffset
      rotation = 180
      break
    case 'left':
      x = -width / 2 - seatOffset
      y = -height / 2 + ((sideIndex + 1) * height) / (totalOnSide + 1)
      rotation = 270
      break
  }

  return { x, y, rotation   }
}

export const calculateFurniturePosition = (
  position: FurniturePosition,
  index: number,
  config: TableConfig,
  scale: number
): { x: number; y: number; rotation: number } => {
  if (config.shape === 'circle' && position.side === 'circle') {
    return calculateCircleFurniturePosition(position, index, config, scale)
  }
  return calculateRectFurniturePosition(position, config, scale)
}

