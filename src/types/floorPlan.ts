export type ElementType = 'table' | 'wall' | 'door' | 'window' | 'group'
export type TableShape = 'circle' | 'rectangle' | 'oval' | 'square'

export interface FloorPlanElement {
  id: string
  type: ElementType
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  rotation?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  label?: string
  tableShape?: TableShape
  capacity?: number
  isAvailable?: boolean
  furnitureType?: 'chair' | 'sofa' | 'armchair'
  showFurniture?: boolean
  furniturePositions?: Array<{
    side: 'top' | 'right' | 'bottom' | 'left' | 'circle'
    index: number
    angle?: number
    offset?: number
    shape?: 'straight' | 'curved' | 'l-shaped' | 'l-shaped-reverse' | 'round'
  }>
  startX?: number
  startY?: number
  zIndex?: number
  children?: string[]
  isGroup?: boolean
}

export interface Floor {
  id: string
  name: string
  level: number
  elements: FloorPlanElement[]
  stage?: {
    scale?: number
    offsetX?: number
    offsetY?: number
  }
}

export interface FloorPlanData {
  stage: {
    width: number
    height: number
    scale?: number
    offsetX?: number
    offsetY?: number
  }
  floors: Floor[] // Обязательное поле - всегда есть хотя бы один этаж
  currentFloorId: string // ID текущего активного этажа
  metadata?: {
    clientId?: string // ID клиента (заведения)
    clientName?: string
    venueId?: string // ID заведения
    venueName?: string
    createdAt?: string
    updatedAt?: string
  }
  venueSettings?: {
    operatingHours?: {
      [key: string]: {
        open: string
        close: string
        isClosed?: boolean
      }
    }
    defaultBookingDuration?: number
    advanceBookingDays?: number
    timeSlotInterval?: number
  }
}

