// Canvas constants
export const STAGE_WIDTH = 2000
export const STAGE_HEIGHT = 1500
export const GRID_SIZE = 20
export const MIN_ZOOM = 0.5
export const MAX_ZOOM = 3
export const DEFAULT_SCALE = 1
export const DEFAULT_POSITION = { x: 0, y: 0 }

// Default floor
export const DEFAULT_FLOOR = {
  id: 'floor-1',
  name: 'Первый этаж',
  level: 1,
  elements: [],
}

// Element defaults
export const DEFAULT_TABLE_RADIUS = 30
export const DEFAULT_TABLE_WIDTH = 60
export const DEFAULT_TABLE_HEIGHT = 60
export const DEFAULT_WALL_WIDTH = 200
export const DEFAULT_WALL_HEIGHT = 20
export const DEFAULT_DOOR_WIDTH = 80
export const DEFAULT_DOOR_HEIGHT = 20
export const DEFAULT_WINDOW_WIDTH = 100
export const DEFAULT_WINDOW_HEIGHT = 20

// Colors
export const COLORS = {
  TABLE_FILL: '#A8D5BA',
  TABLE_STROKE: '#4CAF50',
  WALL_FILL: '#E8E8E8',
  WALL_STROKE: '#9E9E9E',
  DOOR_FILL: '#F5E6D3',
  DOOR_STROKE: '#8D6E63',
  WINDOW_FILL: '#E3F2FD',
  WINDOW_STROKE: '#2196F3',
  SELECTION: '#FF6B01',
  GRID_CENTER: '#FF6B01',
  GRID_LINE: '#E8EAED',
} as const

