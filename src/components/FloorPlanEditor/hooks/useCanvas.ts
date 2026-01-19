import { useState, useCallback, useEffect } from 'react'
import { clampZoom, getCenteredPosition } from '../utils/canvas'
import { DEFAULT_SCALE, DEFAULT_POSITION, STAGE_WIDTH, STAGE_HEIGHT } from '../constants'
import type { CanvasState } from '../types'

interface UseCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>
  initialScale?: number
  initialPosition?: { x: number; y: number }
}

interface UseCanvasReturn {
  canvasState: CanvasState
  setScale: (scale: number) => void
  setPosition: (position: { x: number; y: number }) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  fitToScreen: () => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  stageSize: { width: number; height: number }
}

/**
 * Хук для управления состоянием канваса (zoom, pan, grid)
 */
export const useCanvas = ({
  containerRef,
  initialScale = DEFAULT_SCALE,
  initialPosition = DEFAULT_POSITION,
}: UseCanvasProps): UseCanvasReturn => {
  const [scale, setScaleState] = useState(initialScale)
  const [position, setPositionState] = useState(initialPosition)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 })

  // Обновление размеров Stage при изменении размера окна
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const newSize = {
          width: Math.max(800, rect.width),
          height: Math.max(600, rect.height),
        }
        setStageSize(newSize)
      }
    }

    if (containerRef.current) {
      updateStageSize()
      const resizeObserver = new ResizeObserver(updateStageSize)
      resizeObserver.observe(containerRef.current)

      window.addEventListener('resize', updateStageSize)
      return () => {
        resizeObserver.disconnect()
        window.removeEventListener('resize', updateStageSize)
      }
    }
  }, [containerRef])

  // Центрирование Stage при первой загрузке
  useEffect(() => {
    if (stageSize.width > 0 && stageSize.height > 0) {
      const centerX = (stageSize.width - STAGE_WIDTH) / 2
      const centerY = (stageSize.height - STAGE_HEIGHT) / 2
      setPositionState({ x: centerX, y: centerY })
    }
  }, [stageSize.width, stageSize.height])

  const setScale = useCallback((newScale: number) => {
    setScaleState(clampZoom(newScale))
  }, [])

  const setPosition = useCallback((newPosition: { x: number; y: number }) => {
    setPositionState(newPosition)
  }, [])

  const zoomIn = useCallback(() => {
    setScaleState((prev) => clampZoom(prev * 1.2))
  }, [])

  const zoomOut = useCallback(() => {
    setScaleState((prev) => clampZoom(prev / 1.2))
  }, [])

  const resetZoom = useCallback(() => {
    setScaleState(DEFAULT_SCALE)
  }, [])

  const fitToScreen = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const scaleX = rect.width / STAGE_WIDTH
      const scaleY = rect.height / STAGE_HEIGHT
      const newScale = clampZoom(Math.min(scaleX, scaleY) * 0.9)
      setScaleState(newScale)

      const center = getCenteredPosition({ x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 }, rect, newScale)
      setPositionState(center)
    }
  }, [containerRef])

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev)
  }, [])

  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid((prev) => !prev)
  }, [])

  return {
    canvasState: {
      scale,
      position,
      showGrid,
      snapToGrid,
    },
    setScale,
    setPosition,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    toggleGrid,
    toggleSnapToGrid,
    stageSize,
  }
}

