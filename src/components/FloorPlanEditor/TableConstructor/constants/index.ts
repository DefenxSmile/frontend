import type { TableConfig } from '../types'

export const PREVIEW_SIZE = 360
export const PREVIEW_SCALE = 1.2
export const GRID_SIZE = 20

export const DEFAULT_CONFIG: TableConfig = {
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

// Цвета для сетки
export const GRID_COLORS = {
  centerLine: '#F44336',
  regularLine: '#BBDEFB',
  point: '#757575',
  background: '#E3F2FD',
} as const

// Размеры мебели (в единицах scale)
export const FURNITURE_SIZES = {
  sofa: {
    width: 28,
    height: 14,
    depth: 3,
  },
  armchair: {
    width: 12,
    height: 12,
    depth: 2,
  },
  chair: {
    width: 10,
    height: 10,
    backHeight: 6,
  },
} as const

// Цвета мебели
export const FURNITURE_COLORS = {
  sofa: {
    fill: '#4CAF50',
    stroke: '#2E7D32',
    back: '#2E7D32',
    backStroke: '#1B5E20',
    detail: '#66BB6A',
  },
  armchair: {
    fill: '#FF9800',
    stroke: '#F57C00',
    back: '#F57C00',
    backStroke: '#E65100',
  },
  chair: {
    fill: '#4CAF50',
    stroke: '#2E7D32',
    inner: '#66BB6A',
    back: '#2E7D32',
    backStroke: '#1B5E20',
  },
} as const

