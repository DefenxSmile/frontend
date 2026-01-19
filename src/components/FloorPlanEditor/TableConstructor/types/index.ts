import type { TableShape } from '../../../../types/floorPlan'

export type FurnitureType = 'chair' | 'sofa' | 'armchair'
export type FurnitureShape = 'straight' | 'curved' | 'l-shaped' | 'l-shaped-reverse' | 'round'

export interface FurniturePosition {
  side: 'top' | 'right' | 'bottom' | 'left' | 'circle'
  index: number
  angle?: number
  offset?: number
  shape?: FurnitureShape
}

export interface TableConfig {
  shape: TableShape
  width: number
  height: number
  radius?: number
  label: string
  capacity: number
  rotation: number
  corners?: number
  furnitureType: FurnitureType
  furnitureShape?: FurnitureShape
  showFurniture: boolean
  furniturePositions: FurniturePosition[]
}

export interface TableConstructorModalProps {
  open: boolean
  onClose: () => void
  onSave: (tableConfig: TableConfig) => void
  initialConfig?: Partial<TableConfig>
}

