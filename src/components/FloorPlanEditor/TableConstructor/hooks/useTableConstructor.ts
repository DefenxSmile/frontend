import { useState, useEffect, useCallback } from 'react'
import type { TableConfig } from '../types'
import { DEFAULT_CONFIG } from '../constants'

interface UseTableConstructorProps {
  initialConfig?: Partial<TableConfig>
  onSave: (config: TableConfig) => void
  open: boolean
}

interface UseTableConstructorReturn {
  config: TableConfig
  updateConfig: (updates: Partial<TableConfig>) => void
  handleShapeChange: (shape: TableConfig['shape']) => void
  handleDimensionChange: (field: 'width' | 'height' | 'radius' | 'corners', delta: number) => void
  handleRotationChange: (delta: number) => void
  handleFurnitureTypeChange: (type: TableConfig['furnitureType']) => void
  handleFurnitureShapeChange: (shape: TableConfig['furnitureShape']) => void
  handleFurnitureZoneClick: (side: string, position: { x: number; y: number }) => void
  handleRemoveFurniture: (index: number) => void
  handleSave: () => void
  resetConfig: () => void
}

/**
 * Хук для управления состоянием конструктора стола
 */
export const useTableConstructor = ({
  initialConfig,
  onSave,
  open,
}: UseTableConstructorProps): UseTableConstructorReturn => {
  const [config, setConfig] = useState<TableConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig,
  })

  // Сброс конфигурации при открытии модалки
  useEffect(() => {
    if (open) {
      setConfig({
        ...DEFAULT_CONFIG,
        ...(initialConfig || {}),
      })
    }
  }, [open, initialConfig])

  const updateConfig = useCallback((updates: Partial<TableConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const handleShapeChange = useCallback((shape: TableConfig['shape']) => {
    setConfig((prev) => {
      const newConfig = { ...prev, shape }
      if (shape === 'circle' && !newConfig.radius) {
        newConfig.radius = Math.min(prev.width, prev.height) / 2
      }
      return newConfig
    })
  }, [])

  const handleDimensionChange = useCallback(
    (field: 'width' | 'height' | 'radius' | 'corners', delta: number) => {
      setConfig((prev) => {
        const newValue = (prev[field] || 0) + delta
        const minValue = field === 'corners' ? 3 : 10
        const maxValue = field === 'corners' ? 12 : 500
        return {
          ...prev,
          [field]: Math.max(minValue, Math.min(maxValue, newValue)),
        }
      })
    },
    []
  )

  const handleRotationChange = useCallback((delta: number) => {
    setConfig((prev) => ({
      ...prev,
      rotation: (prev.rotation + delta + 360) % 360,
    }))
  }, [])

  const handleFurnitureTypeChange = useCallback((type: TableConfig['furnitureType']) => {
    setConfig((prev) => ({ ...prev, furnitureType: type }))
  }, [])

  const handleFurnitureShapeChange = useCallback((shape: TableConfig['furnitureShape']) => {
    setConfig((prev) => ({ ...prev, furnitureShape: shape }))
  }, [])

  const handleFurnitureZoneClick = useCallback(
    (side: string, position: { x: number; y: number }) => {
      setConfig((prev) => {
        const newPositions = [...(prev.furniturePositions || [])]
        const existingIndex = newPositions.findIndex(
          (p) => p.side === side && Math.abs(p.index - position.x) < 5 && Math.abs(p.index - position.y) < 5
        )

        if (existingIndex >= 0) {
          // Удаляем существующую позицию
          newPositions.splice(existingIndex, 1)
        } else {
          // Добавляем новую позицию
          const sidePositions = newPositions.filter((p) => p.side === side)
          const newPosition = {
            side: side as any,
            index: sidePositions.length,
            offset: 18,
            shape: prev.furnitureShape,
          }
          newPositions.push(newPosition)
        }

        return {
          ...prev,
          furniturePositions: newPositions,
          capacity: newPositions.length,
        }
      })
    },
    []
  )

  const handleRemoveFurniture = useCallback((index: number) => {
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
  }, [])

  const handleSave = useCallback(() => {
    onSave(config)
  }, [config, onSave])

  const resetConfig = useCallback(() => {
    setConfig({
      ...DEFAULT_CONFIG,
      ...(initialConfig || {}),
    })
  }, [initialConfig])

  return {
    config,
    updateConfig,
    handleShapeChange,
    handleDimensionChange,
    handleRotationChange,
    handleFurnitureTypeChange,
    handleFurnitureShapeChange,
    handleFurnitureZoneClick,
    handleRemoveFurniture,
    handleSave,
    resetConfig,
  }
}

