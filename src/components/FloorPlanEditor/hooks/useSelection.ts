import { useState, useCallback } from 'react'
import type { SelectionState } from '../types'

interface UseSelectionReturn {
  selection: SelectionState
  select: (id: string | null, addToSelection?: boolean) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
}

/**
 * Хук для управления выделением элементов
 */
export const useSelection = (): UseSelectionReturn => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const select = useCallback((id: string | null, addToSelection = false) => {
    if (addToSelection && id) {
      setSelectedIds((prev) => {
        if (prev.includes(id)) {
          const newSelectedIds = prev.filter((i) => i !== id)
          const newSelectedId = newSelectedIds.length === 1 ? newSelectedIds[0] : null
          setSelectedId(newSelectedId)
          return newSelectedIds
        } else {
          const newSelectedIds = [...prev, id]
          setSelectedId(id)
          return newSelectedIds
        }
      })
    } else {
      setSelectedId(id)
      setSelectedIds(id ? [id] : [])
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
    setSelectedIds([])
  }, [])

  const isSelected = useCallback(
    (id: string) => {
      return selectedId === id || selectedIds.includes(id)
    },
    [selectedId, selectedIds]
  )

  return {
    selection: {
      selectedId,
      selectedIds,
    },
    select,
    clearSelection,
    isSelected,
  }
}

