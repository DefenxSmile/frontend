import type { FloorPlanElement } from '../../../types/floorPlan'

export const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const isPointInRect = (
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}

export const isPointInCircle = (
  point: { x: number; y: number },
  circle: { x: number; y: number; radius: number }
): boolean => {
  const dx = point.x - circle.x
  const dy = point.y - circle.y
  return dx * dx + dy * dy <= circle.radius * circle.radius
}

export const isRectIntersecting = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean => {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  )
}

export const getElementBounds = (element: FloorPlanElement): {
  x: number
  y: number
  width: number
  height: number
} => {
  if (element.type === 'table' && element.tableShape === 'circle' && element.radius) {
    return {
      x: element.x - element.radius,
      y: element.y - element.radius,
      width: element.radius * 2,
      height: element.radius * 2,
    }
  }

  return {
    x: element.x,
    y: element.y,
    width: element.width || 0,
    height: element.height || 0,
  }
}

export const isElementInSelectionBox = (
  element: FloorPlanElement,
  selectionBox: { x: number; y: number; width: number; height: number }
): boolean => {
  const bounds = getElementBounds(element)
  return isRectIntersecting(bounds, selectionBox)
}

export const normalizeAngle = (angle: number): number => {
  while (angle < 0) angle += 360
  while (angle >= 360) angle -= 360
  return angle
}

