import type { FloorPlanElement, FloorPlanData, Floor } from '../../../types/floorPlan'

export type ToolType = 'select' | 'table' | 'wall' | 'door' | 'window'

export interface FloorPlanEditorProps {
  clientName?: string
  venueName?: string
  initialFloorPlan?: FloorPlanData | null
  onSave?: (floorPlanData: FloorPlanData, clientName: string, venueName: string) => void
}

export interface SelectionState {
  selectedId: string | null
  selectedIds: string[]
}

export interface CanvasState {
  scale: number
  position: { x: number; y: number }
  showGrid: boolean
  snapToGrid: boolean
}

export interface DrawingState {
  isDrawingWall: boolean
  wallStart: { x: number; y: number } | null
  tempWall: { x: number; y: number; width: number; height: number } | null
}

export interface SelectionBoxState {
  isSelecting: boolean
  selectionStart: { x: number; y: number } | null
  selectionBox: { x: number; y: number; width: number; height: number } | null
}

export interface PanningState {
  isPanning: boolean
  panStart: { x: number; y: number } | null
}

export type ContextMenuState = {
  mouseX: number
  mouseY: number
  elementId: string
} | null

export interface FloorPlanEditorState {
  elements: FloorPlanElement[]
  floors: Floor[]
  currentFloorId: string
  selectedTool: ToolType
  tableNumber: number
  isSpacePressed: boolean
  draggedTool: ToolType | null
  isDraggingTool: boolean
  editingTableId: string | null
  editingFloorId: string | null
  editingFloorName: string
  drawerOpen: boolean
  saveDialogOpen: boolean
  tableConstructorOpen: boolean
  contextMenu: ContextMenuState
  stageSize: { width: number; height: number }
}

export type { FloorPlanElement, FloorPlanData, Floor }

