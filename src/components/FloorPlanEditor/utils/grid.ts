import { GRID_SIZE } from '../constants'

/**
 * Округляет значение до ближайшей сетки
 */
export const snapToGrid = (value: number, enabled: boolean = true): number => {
  if (!enabled) return value
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

/**
 * Округляет координаты точки до ближайшей сетки
 */
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

/**
 * Вычисляет размер сетки с учетом масштаба
 */
export const getGridSize = (scale: number): number => {
  return GRID_SIZE * scale
}

