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
  // Для столов
  tableShape?: TableShape
  capacity?: number
  isAvailable?: boolean // Доступен ли стол для бронирования (по умолчанию true)
  // Для стен (начальная и конечная точка при рисовании)
  startX?: number
  startY?: number
  // Z-index для управления порядком отрисовки
  zIndex?: number
  // Для групп
  children?: string[] // IDs дочерних элементов
  isGroup?: boolean
}

export interface Floor {
  id: string
  name: string
  level: number // Номер этажа (0, 1, 2, -1 для подвала и т.д.)
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

