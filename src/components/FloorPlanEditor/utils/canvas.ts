import { MIN_ZOOM, MAX_ZOOM } from '../constants'

export const clampZoom = (zoom: number): number => {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
}

export const getStagePointer = (
  stage: any,
  position: { x: number; y: number },
  scale: number,
  snapToGrid: (value: number) => number
): { x: number; y: number } => {
  if (!stage) return { x: 0, y: 0 }
  
  const pointerPos = stage.getPointerPosition()
  if (!pointerPos) return { x: 0, y: 0 }
  
  const x = (pointerPos.x - position.x) / scale
  const y = (pointerPos.y - position.y) / scale
  
  return { x: snapToGrid(x), y: snapToGrid(y) }
}

export const getStageCenter = (
  stageSize: { width: number; height: number },
  position: { x: number; y: number },
  scale: number
): { x: number; y: number } => {
  const centerX = (stageSize.width / 2 - position.x) / scale
  const centerY = (stageSize.height / 2 - position.y) / scale
  return { x: centerX, y: centerY }
}

export const getCenteredPosition = (
  point: { x: number; y: number },
  stageSize: { width: number; height: number },
  scale: number
): { x: number; y: number } => {
  return {
    x: stageSize.width / 2 - point.x * scale,
    y: stageSize.height / 2 - point.y * scale,
  }
}

