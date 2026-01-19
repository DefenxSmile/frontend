import type { FloorPlanElement } from '../../../types/floorPlan'
import { DEFAULT_TABLE_RADIUS, DEFAULT_TABLE_WIDTH, DEFAULT_TABLE_HEIGHT } from '../constants'

/**
 * Создает новый элемент стола
 */
export const createTableElement = (
  x: number,
  y: number,
  shape: 'circle' | 'square' | 'rectangle' | 'oval',
  tableNumber: number
): FloorPlanElement => {
  const baseElement: FloorPlanElement = {
    id: `table-${Date.now()}`,
    type: 'table',
    x,
    y,
    fill: '#A8D5BA',
    stroke: '#4CAF50',
    strokeWidth: 2,
    label: `Стол ${tableNumber}`,
    tableShape: shape,
    capacity: 4,
    zIndex: 4,
  }

  if (shape === 'circle') {
    return {
      ...baseElement,
      radius: DEFAULT_TABLE_RADIUS,
      x: x - DEFAULT_TABLE_RADIUS,
      y: y - DEFAULT_TABLE_RADIUS,
    }
  }

  return {
    ...baseElement,
    width: DEFAULT_TABLE_WIDTH,
    height: DEFAULT_TABLE_HEIGHT,
    x: x - DEFAULT_TABLE_WIDTH / 2,
    y: y - DEFAULT_TABLE_HEIGHT / 2,
  }
}

/**
 * Создает новый элемент стены
 */
export const createWallElement = (
  x: number,
  y: number,
  width: number,
  height: number
): FloorPlanElement => {
  return {
    id: `wall-${Date.now()}`,
    type: 'wall',
    x,
    y,
    width,
    height,
    fill: '#E8E8E8',
    stroke: '#9E9E9E',
    strokeWidth: 2,
    zIndex: 1,
  }
}

/**
 * Создает новый элемент двери
 */
export const createDoorElement = (
  x: number,
  y: number,
  width: number = 80,
  height: number = 20
): FloorPlanElement => {
  return {
    id: `door-${Date.now()}`,
    type: 'door',
    x,
    y,
    width,
    height,
    fill: '#F5E6D3',
    stroke: '#8D6E63',
    strokeWidth: 2,
    zIndex: 2,
  }
}

/**
 * Создает новый элемент окна
 */
export const createWindowElement = (
  x: number,
  y: number,
  width: number = 100,
  height: number = 20
): FloorPlanElement => {
  return {
    id: `window-${Date.now()}`,
    type: 'window',
    x,
    y,
    width,
    height,
    fill: '#E3F2FD',
    stroke: '#2196F3',
    strokeWidth: 2,
    zIndex: 2,
  }
}

/**
 * Клонирует элемент с новым ID
 */
export const cloneElement = (element: FloorPlanElement): FloorPlanElement => {
  return {
    ...element,
    id: `${element.type}-${Date.now()}`,
    x: element.x + 20,
    y: element.y + 20,
  }
}

/**
 * Обновляет элемент, сохраняя неизменные свойства
 */
export const updateElement = (
  element: FloorPlanElement,
  updates: Partial<FloorPlanElement>
): FloorPlanElement => {
  return {
    ...element,
    ...updates,
  }
}

