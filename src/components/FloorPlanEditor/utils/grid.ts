import { GRID_SIZE } from '../constants'

export const snapToGrid = (value: number, enabled: boolean = true): number => {
  if (!enabled) return value
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

export const snapPointToGrid = (
  point: { x: number; y: number },
  enabled: boolean = true
): { x: number; y: number } => {
  if (!enabled) return point
  return {
    x: snapToGrid(point.x, enabled),
    y: snapToGrid(point.y, enabled),
  }
}

export const getGridSize = (scale: number): number => {
  return GRID_SIZE * scale
}

