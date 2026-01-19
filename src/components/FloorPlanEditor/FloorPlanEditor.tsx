import { useState, useRef, useCallback, useEffect } from 'react'
import { Stage, Layer, Group, Circle, Rect, Text, Transformer, Line } from 'react-konva'
import {
  Box,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Drawer,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  TableRestaurant as TableIcon,
  Square as WallIcon,
  DoorFront as DoorIcon,
  Window as WindowIcon,
  ContentCopy as SelectIcon,
  Delete as DeleteIcon,
  DeleteOutline as DeleteFloorIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  GridOn as GridIcon,
  FitScreen as FitScreenIcon,
  Group as GroupIcon,
  GroupOff as UngroupIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useSaveFloorPlan } from '../../hooks/useFloorPlan'
import type { FloorPlanElement, FloorPlanData, TableShape, Floor } from '../../types/floorPlan'
import PropertiesPanel from './PropertiesPanel'
import TableShapeSelector from './TableShapeSelector'
import TableConstructorModal, { type TableConfig } from './TableConstructorModal'
import { FurnitureRenderer } from './renderers/FurnitureRenderer'
import { snapToGrid as snapToGridUtil } from './utils/grid'
import { clampZoom } from './utils/canvas'
import { STAGE_WIDTH, STAGE_HEIGHT, GRID_SIZE } from './constants'
import './FloorPlanEditor.scss'

interface FloorPlanEditorProps {
  clientName?: string
  venueName?: string
  initialFloorPlan?: FloorPlanData | null
  onSave?: (floorPlanData: FloorPlanData, clientName: string, venueName: string) => void
}

type ToolType = 'select' | 'table' | 'wall' | 'door' | 'window'

const FloorPlanEditor = ({ 
  clientName: initialClientName, 
  venueName: initialVenueName,
  initialFloorPlan,
  onSave,
}: FloorPlanEditorProps = {}) => {
  const [clientName, setClientName] = useState(initialClientName || '')
  const [venueName, setVenueName] = useState(initialVenueName || '')
  const [elements, setElements] = useState<FloorPlanElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([]) // Multi-select
  const [selectedTool, setSelectedTool] = useState<ToolType>('select')
  const [isSpacePressed, setIsSpacePressed] = useState(false) // Для отслеживания Space
  const [tableNumber, setTableNumber] = useState(1)
  const [draggedTool, setDraggedTool] = useState<ToolType | null>(null) // Инструмент, который перетаскивается
  const [isDraggingTool, setIsDraggingTool] = useState(false) // Флаг для отслеживания перетаскивания инструмента
  // Этажи
  const [floors, setFloors] = useState<Floor[]>([
    { id: 'floor-1', name: 'Первый этаж', level: 1, elements: [] },
  ])
  const [currentFloorId, setCurrentFloorId] = useState<string>('floor-1')

  // Загрузка начального плана этажа
  useEffect(() => {
    if (initialFloorPlan) {
      setClientName(initialFloorPlan.metadata?.clientName || '')
      setVenueName(initialFloorPlan.metadata?.venueName || '')
      
      if (initialFloorPlan.floors && initialFloorPlan.floors.length > 0) {
        setFloors(initialFloorPlan.floors)
        setCurrentFloorId(initialFloorPlan.currentFloorId || initialFloorPlan.floors[0].id)
        
        const currentFloor = initialFloorPlan.floors.find((f) => f.id === initialFloorPlan.currentFloorId)
        if (currentFloor) {
          setElements(currentFloor.elements)
        }
      }
      
      if (initialFloorPlan.stage?.scale) {
        setScale(initialFloorPlan.stage.scale)
      }
      if (initialFloorPlan.stage?.offsetX !== undefined && initialFloorPlan.stage?.offsetY !== undefined) {
        setPosition({ x: initialFloorPlan.stage.offsetX, y: initialFloorPlan.stage.offsetY })
      }
    }
  }, [initialFloorPlan])

  // Синхронизация элементов с текущим этажом
  useEffect(() => {
    const currentFloor = floors.find((f) => f.id === currentFloorId)
    if (currentFloor) {
      setElements(currentFloor.elements)
    }
  }, [currentFloorId, floors])
  const [selectedTableShape, setSelectedTableShape] = useState<TableShape>('circle')
  const [showJsonDialog, setShowJsonDialog] = useState(false)
  const [jsonToSave, setJsonToSave] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tableConstructorOpen, setTableConstructorOpen] = useState(false)
  const [editingTableId, setEditingTableId] = useState<string | null>(null) // ID редактируемого стола
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    elementId: string | null
  } | null>(null)
  const [editingFloorId, setEditingFloorId] = useState<string | null>(null)
  const [editingFloorName, setEditingFloorName] = useState<string>('')
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  // Для рисования стен
  const [isDrawingWall, setIsDrawingWall] = useState(false)
  const [wallStart, setWallStart] = useState<{ x: number; y: number } | null>(null)
  const [tempWall, setTempWall] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  // Для selection box (выделение зоны)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  // Для панорамирования (Space + drag или средняя кнопка мыши)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null)

  const transformerRef = useRef<any>(null)
  const stageRef = useRef<any>(null)
  const layerRef = useRef<any>(null)
  const transformerLayerRef = useRef<any>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const pendingTablePosition = useRef<{ x: number; y: number } | null>(null)
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 })
  const saveMutation = useSaveFloorPlan()

  // Обновление размеров Stage при изменении размера окна
  useEffect(() => {
    const updateStageSize = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect()
        const newSize = {
          width: Math.max(800, rect.width),
          height: Math.max(600, rect.height),
        }
        setStageSize(newSize)
      }
    }

    // Используем ResizeObserver для отслеживания изменений размера контейнера
    if (canvasContainerRef.current) {
      updateStageSize()
      const resizeObserver = new ResizeObserver(updateStageSize)
      resizeObserver.observe(canvasContainerRef.current)
      
      window.addEventListener('resize', updateStageSize)
      return () => {
        resizeObserver.disconnect()
        window.removeEventListener('resize', updateStageSize)
      }
    }
  }, [])

  // Центрирование Stage при первой загрузке
  useEffect(() => {
    if (stageSize.width > 0 && stageSize.height > 0) {
      // Центрируем Stage: смещаем так, чтобы центр Stage (1000, 750) был в центре viewport
      const centerX = (stageSize.width - STAGE_WIDTH) / 2
      const centerY = (stageSize.height - STAGE_HEIGHT) / 2
      setPosition({ x: centerX, y: centerY })
    }
  }, [stageSize.width, stageSize.height])

  // Обновление трансформера при изменении выбранного элемента
  const handleSelect = useCallback(
    (id: string | null, addToSelection = false) => {
      let newSelectedIds: string[] = []
      let newSelectedId: string | null = null

      if (addToSelection && id) {
        setSelectedIds((prev) => {
          if (prev.includes(id)) {
            newSelectedIds = prev.filter((i) => i !== id)
            newSelectedId = newSelectedIds.length === 1 ? newSelectedIds[0] : null
          } else {
            newSelectedIds = [...prev, id]
            newSelectedId = id
          }
          setSelectedId(newSelectedId)
          return newSelectedIds
        })
      } else {
        newSelectedId = id
        newSelectedIds = id ? [id] : []
        setSelectedId(newSelectedId)
        setSelectedIds(newSelectedIds)
      }

      // Обновляем трансформер с правильными значениями
      requestAnimationFrame(() => {
        if (transformerRef.current && transformerLayerRef.current) {
          const stage = transformerLayerRef.current.getStage()
          if (!stage) return

          const nodes = newSelectedIds
            .map((nodeId) => stage.findOne(`#${nodeId}`))
            .filter((node) => node !== null && node !== undefined)

          if (nodes.length > 0) {
            transformerRef.current.nodes(nodes)
            transformerLayerRef.current.batchDraw()
          } else {
            transformerRef.current.nodes([])
            transformerLayerRef.current.batchDraw()
          }
        }
      })
    },
    []
  )

  // Snap to grid функция
  const snapToGridValue = useCallback(
    (value: number) => {
      return snapToGridUtil(value, snapToGrid)
    },
    [snapToGrid]
  )

  // Получение координат с учетом масштаба и позиции stage
  const getStagePointer = (e: any) => {
    const stage = e.target.getStage()
    if (!stage) return { x: 0, y: 0 }
    const pointerPos = stage.getPointerPosition()
    if (!pointerPos) return { x: 0, y: 0 }
    // Учитываем масштаб и позицию stage
    const x = (pointerPos.x - position.x) / scale
    const y = (pointerPos.y - position.y) / scale
    return { x: snapToGridValue(x), y: snapToGridValue(y) }
  }

  // Обработка начала рисования стены
  const handleWallMouseDown = (e: any) => {
    if (selectedTool !== 'wall') return
    // Не начинаем рисование если кликнули на элемент
    if (e.target !== e.target.getStage() && e.target !== e.target.getStage().findOne('Line')) return
    
    const { x, y } = getStagePointer(e)
    setIsDrawingWall(true)
    setWallStart({ x, y })
    setTempWall({ x, y, width: 0, height: 0 })
  }

  // Обработка движения мыши при рисовании стены
  const handleWallMouseMove = (e: any) => {
    if (!isDrawingWall || !wallStart || selectedTool !== 'wall') return
    
    const { x: currentX, y: currentY } = getStagePointer(e)
    
    const width = currentX - wallStart.x
    const height = currentY - wallStart.y
    
    setTempWall({
      x: Math.min(wallStart.x, currentX),
      y: Math.min(wallStart.y, currentY),
      width: Math.abs(width),
      height: Math.abs(height),
    })
  }

  // Обработка окончания рисования стены
  const handleWallMouseUp = () => {
    if (!isDrawingWall || !wallStart || !tempWall) return
    
    if (tempWall.width > 10 && tempWall.height > 10) {
      const newElement: FloorPlanElement = {
        id: `wall-${Date.now()}`,
        type: 'wall',
        x: tempWall.x,
        y: tempWall.y,
        width: tempWall.width,
        height: Math.max(tempWall.height, 20), // Минимальная высота стены
        fill: '#E0E0E0',
        stroke: '#757575',
        strokeWidth: 2,
        zIndex: 1, // Стены внизу
      }
      const updatedElements = [...elements, newElement]
      updateCurrentFloorElements(updatedElements)
      handleSelect(newElement.id)
    }
    
    setIsDrawingWall(false)
    setWallStart(null)
    setTempWall(null)
    setSelectedTool('select')
  }

  // Обработка начала выделения зоны
  const handleSelectionStart = (e: any) => {
    // Не начинаем выделение если панорамируем, рисуем стену или перетаскиваем инструмент
    if (isDrawingWall || isPanning || isSpacePressed || isDraggingTool) return
    
    // Проверяем что кликнули на пустое место
    const stage = e.target.getStage()
    const target = e.target
    const className = target.getClassName ? target.getClassName() : ''
    const clickedOnEmpty = target === stage || className === 'Line' || (className === 'Rect' && target.attrs && target.attrs.listening === false)
    
    if (!clickedOnEmpty) return

    // Только если выбран инструмент выбора
    if (selectedTool !== 'select') return

    const { x, y } = getStagePointer(e)
    setIsSelecting(true)
    setSelectionStart({ x, y })
    setSelectionBox({ x, y, width: 0, height: 0 })
    
    // Сбрасываем выделение перед началом нового
    handleSelect(null)
    
    // Предотвращаем всплытие события
    if (e.evt) {
      e.evt.preventDefault()
      e.evt.stopPropagation()
    }
  }

  // Обработка движения мыши при выделении зоны
  const handleSelectionMove = (e: any) => {
    if (!isSelecting || !selectionStart) return

    const { x: currentX, y: currentY } = getStagePointer(e)
    const width = currentX - selectionStart.x
    const height = currentY - selectionStart.y

    setSelectionBox({
      x: Math.min(selectionStart.x, currentX),
      y: Math.min(selectionStart.y, currentY),
      width: Math.abs(width),
      height: Math.abs(height),
    })
  }

  // Обработка окончания выделения зоны
  const handleSelectionEnd = () => {
    if (!isSelecting || !selectionBox || !selectionStart) {
      setIsSelecting(false)
      setSelectionStart(null)
      setSelectionBox(null)
      return
    }

    // Минимальный размер для выделения
    if (selectionBox.width < 5 || selectionBox.height < 5) {
      setIsSelecting(false)
      setSelectionStart(null)
      setSelectionBox(null)
      return
    }

    // Находим все элементы внутри selection box
    // Учитываем, что координаты selection box уже в координатах stage (через getStagePointer)
    const boxLeft = selectionBox.x
    const boxRight = selectionBox.x + selectionBox.width
    const boxTop = selectionBox.y
    const boxBottom = selectionBox.y + selectionBox.height

    const selectedElements = elements.filter((el) => {
      if (el.isGroup) return false // Пропускаем группы
      
      const elX = el.x
      const elY = el.y
      // Для круглых элементов используем радиус
      let elWidth = el.width || 0
      let elHeight = el.height || 0
      
      if (el.radius) {
        // Для круга используем диаметр
        elWidth = el.radius * 2
        elHeight = el.radius * 2
        
        // Упрощенная проверка для круга: проверяем пересечение bounding box
        const circleLeft = elX
        const circleRight = elX + elWidth
        const circleTop = elY
        const circleBottom = elY + elHeight
        
        return !(
          circleRight < boxLeft ||
          circleLeft > boxRight ||
          circleBottom < boxTop ||
          circleTop > boxBottom
        )
      }
      
      const elRight = elX + elWidth
      const elBottom = elY + elHeight

      // Проверяем пересечение (элемент должен быть хотя бы частично внутри selection box)
      // Исправленная логика: элемент пересекается если его границы пересекаются с границами box
      const intersects = !(
        elRight < boxLeft ||
        elX > boxRight ||
        elBottom < boxTop ||
        elY > boxBottom
      )

      return intersects
    })

    if (selectedElements.length > 0) {
      const ids = selectedElements.map((el) => el.id)
      setSelectedIds(ids)
      setSelectedId(null) // Сбрасываем одиночное выделение
      
      // Обновляем трансформер для множественного выделения
      requestAnimationFrame(() => {
        if (transformerRef.current && transformerLayerRef.current) {
          const stage = transformerLayerRef.current.getStage()
          if (!stage) return
          
          const nodes = ids
            .map((id) => {
              // Ищем элемент во всех слоях
              const node = stage.findOne(`#${id}`)
              return node
            })
            .filter((node) => node !== null && node !== undefined)
          
          if (nodes.length > 0) {
            transformerRef.current.nodes(nodes)
            transformerLayerRef.current.batchDraw()
          } else {
            // Если не нашли узлы, попробуем обновить через setTimeout
            setTimeout(() => {
              const nodes = ids
                .map((id) => stage.findOne(`#${id}`))
                .filter((node) => node !== null && node !== undefined)
              if (nodes.length > 0 && transformerRef.current) {
                transformerRef.current.nodes(nodes)
                transformerLayerRef.current.batchDraw()
              }
            }, 50)
          }
        }
      })
    } else {
      handleSelect(null)
    }

    setIsSelecting(false)
    setSelectionStart(null)
    setSelectionBox(null)
  }

  // Обработка нажатия клавиш для панорамирования
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(false)
        if (isPanning) {
          handlePanEnd()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isPanning])

  // Обработка начала панорамирования (Space + drag или средняя кнопка мыши)
  const handlePanStart = (e: any) => {
    const stage = e.target.getStage()
    const pointerPos = stage.getPointerPosition()
    setIsPanning(true)
    setPanStart({ x: pointerPos.x - position.x, y: pointerPos.y - position.y })
  }

  // Обработка движения при панорамировании
  const handlePanMove = (e: any) => {
    if (!isPanning || !panStart) return

    const stage = e.target.getStage()
    const pointerPos = stage.getPointerPosition()
    setPosition({
      x: pointerPos.x - panStart.x,
      y: pointerPos.y - panStart.y,
    })
  }

  // Обработка окончания панорамирования
  const handlePanEnd = () => {
    setIsPanning(false)
    setPanStart(null)
  }

  // Обработка клика на canvas
  const handleStageClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.getClassName() === 'Line'

    // Если рисуем стену, не обрабатываем клик
    if (isDrawingWall) return

    // Если выбран инструмент выбора
    if (selectedTool === 'select') {
      if (clickedOnEmpty) {
        handleSelect(null)
      } else {
        const id = e.target.id() || e.target.getParent()?.id()
        if (id) {
          // Multi-select с Ctrl/Cmd
          const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey
          handleSelect(id, isMultiSelect)
        }
      }
      return
    }

    // Если выбран инструмент создания и кликнули на пустое место
    if (clickedOnEmpty && selectedTool !== 'wall') {
      const { x, y } = getStagePointer(e)

      switch (selectedTool) {
        case 'table':
          // Для стола открываем конструктор и сохраняем позицию для добавления после закрытия
          pendingTablePosition.current = { x, y }
          setTableConstructorOpen(true)
          break
        case 'door':
          addDoor(x, y)
          break
        case 'window':
          addWindow(x, y)
          break
      }
    }
  }

  const addTable = (x: number, y: number, shape?: TableShape) => {
    const tableShape = shape || selectedTableShape
    const baseSize = 60
    
    let elementProps: Partial<FloorPlanElement> = {}
    
    switch (tableShape) {
      case 'circle':
        elementProps = {
          radius: baseSize / 2,
          x: snapToGridValue(x - baseSize / 2),
          y: snapToGridValue(y - baseSize / 2),
        }
        break
      case 'square':
        elementProps = {
          width: baseSize,
          height: baseSize,
          x: snapToGridValue(x - baseSize / 2),
          y: snapToGridValue(y - baseSize / 2),
        }
        break
      case 'rectangle':
        elementProps = {
          width: baseSize * 1.5,
          height: baseSize,
          x: snapToGridValue(x - (baseSize * 1.5) / 2),
          y: snapToGridValue(y - baseSize / 2),
        }
        break
      case 'oval':
        elementProps = {
          width: baseSize * 1.5,
          height: baseSize,
          x: snapToGridValue(x - (baseSize * 1.5) / 2),
          y: snapToGridValue(y - baseSize / 2),
        }
        break
    }

    const newElement: FloorPlanElement = {
      id: `table-${Date.now()}`,
      type: 'table',
      x: elementProps.x || 0,
      y: elementProps.y || 0,
      ...elementProps,
      fill: '#A8D5BA',
      stroke: '#4CAF50',
      strokeWidth: 2,
      label: `Стол ${tableNumber}`,
      tableShape: tableShape,
      capacity: 4,
      zIndex: 4, // Столы поверх всего
    }
    const updatedElements = [...elements, newElement]
    updateCurrentFloorElements(updatedElements)
    setTableNumber((prev) => prev + 1)
    handleSelect(newElement.id)
    setSelectedTool('select')
  }

  const addTableFromConstructor = (x: number, y: number, config: TableConfig) => {
    let elementProps: Partial<FloorPlanElement> = {}
    
    switch (config.shape) {
      case 'circle':
        const radius = config.radius || Math.min(config.width, config.height) / 2
        elementProps = {
          radius: radius,
          x: snapToGridValue(x - radius),
          y: snapToGridValue(y - radius),
        }
        break
      case 'square':
        elementProps = {
          width: config.width,
          height: config.height,
          x: snapToGridValue(x - config.width / 2),
          y: snapToGridValue(y - config.height / 2),
        }
        break
      case 'rectangle':
        elementProps = {
          width: config.width,
          height: config.height,
          x: snapToGridValue(x - config.width / 2),
          y: snapToGridValue(y - config.height / 2),
        }
        break
      case 'oval':
        elementProps = {
          width: config.width,
          height: config.height,
          x: snapToGridValue(x - config.width / 2),
          y: snapToGridValue(y - config.height / 2),
        }
        break
    }

    const newElement: FloorPlanElement = {
      id: `table-${Date.now()}`,
      type: 'table',
      x: elementProps.x || 0,
      y: elementProps.y || 0,
      ...elementProps,
      fill: '#A8D5BA',
      stroke: '#4CAF50',
      strokeWidth: 2,
      label: config.label || `Стол ${tableNumber}`,
      tableShape: config.shape,
      capacity: config.furniturePositions?.length || config.capacity,
      rotation: config.rotation,
      furnitureType: config.furnitureType,
      showFurniture: config.showFurniture,
      furniturePositions: config.furniturePositions,
      zIndex: 4,
    }
    const updatedElements = [...elements, newElement]
    updateCurrentFloorElements(updatedElements)
    setTableNumber((prev) => prev + 1)
    handleSelect(newElement.id)
    setSelectedTool('select')
  }

  const handleTableConstructorSave = (config: TableConfig) => {
    // Если редактируем существующий стол
    if (editingTableId) {
      const existingElement = elements.find(el => el.id === editingTableId)
      if (existingElement) {
        const updatedElement: FloorPlanElement = {
          ...existingElement,
          tableShape: config.shape,
          width: config.width,
          height: config.height,
          radius: config.radius,
          rotation: config.rotation,
          label: config.label,
          capacity: config.furniturePositions?.length || config.capacity,
          furnitureType: config.furnitureType,
          showFurniture: config.showFurniture,
          furniturePositions: config.furniturePositions,
        }
        handleUpdate(editingTableId, updatedElement)
        setEditingTableId(null)
      }
    } else {
      // Создаем новый стол - используем сохраненную позицию или центр canvas
      if (pendingTablePosition.current) {
        addTableFromConstructor(pendingTablePosition.current.x, pendingTablePosition.current.y, config)
        pendingTablePosition.current = null
      } else if (stageRef.current) {
        const stage = stageRef.current.getStage()
        const stageWidth = stage.width()
        const stageHeight = stage.height()
        const centerX = (stageWidth / 2 - position.x) / scale
        const centerY = (stageHeight / 2 - position.y) / scale
        addTableFromConstructor(centerX, centerY, config)
      }
    }
  }

  const handleEditTableInConstructor = (tableId: string) => {
    const table = elements.find(el => el.id === tableId && el.type === 'table')
    if (table) {
      setEditingTableId(tableId)
      setTableConstructorOpen(true)
      setDrawerOpen(false)
      setContextMenu(null)
    }
  }

  const addDoor = (x: number, y: number) => {
    const newElement: FloorPlanElement = {
      id: `door-${Date.now()}`,
      type: 'door',
      x: snapToGridValue(x),
      y: snapToGridValue(y),
      width: 80,
      height: 20,
      fill: '#D7CCC8',
      stroke: '#8D6E63',
      strokeWidth: 2,
      label: 'Дверь',
      zIndex: 2, // Двери поверх стен
    }
    const updatedElements = [...elements, newElement]
    updateCurrentFloorElements(updatedElements)
    handleSelect(newElement.id)
    setSelectedTool('select')
  }

  const addWindow = (x: number, y: number) => {
    const newElement: FloorPlanElement = {
      id: `window-${Date.now()}`,
      type: 'window',
      x: snapToGridValue(x),
      y: snapToGridValue(y),
      width: 100,
      height: 20,
      fill: '#BBDEFB',
      stroke: '#2196F3',
      strokeWidth: 2,
      label: 'Окно',
      zIndex: 2, // Окна поверх стен
    }
    const updatedElements = [...elements, newElement]
    updateCurrentFloorElements(updatedElements)
    handleSelect(newElement.id)
    setSelectedTool('select')
  }

  // Обработка drag-and-drop через события мыши (для Konva)
  useEffect(() => {
    const handleMouseMove = () => {
      if (isDraggingTool && draggedTool && draggedTool !== 'select' && draggedTool !== 'wall') {
        // Обновляем курсор при перетаскивании
        if (canvasWrapperRef.current) {
          canvasWrapperRef.current.style.cursor = 'crosshair'
        }
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (isDraggingTool && draggedTool && draggedTool !== 'select' && draggedTool !== 'wall' && stageRef.current) {
        const stage = stageRef.current
        const container = canvasWrapperRef.current
        if (!container || !stage) {
          setIsDraggingTool(false)
          setDraggedTool(null)
          if (canvasWrapperRef.current) {
            canvasWrapperRef.current.style.cursor = ''
          }
          return
        }
        
        // Проверяем что клик был внутри canvas
        const stageContainer = stage.getStage().getContainer()
        const stageRect = stageContainer.getBoundingClientRect()
        
        if (
          e.clientX >= stageRect.left &&
          e.clientX <= stageRect.right &&
          e.clientY >= stageRect.top &&
          e.clientY <= stageRect.bottom
        ) {
          // Получаем позицию указателя относительно stage с учетом масштаба и позиции
          // Используем координаты мыши относительно stage контейнера
          const stageX = e.clientX - stageRect.left
          const stageY = e.clientY - stageRect.top
          
          // Преобразуем в координаты stage с учетом масштаба и позиции
          const relativeX = (stageX - position.x) / scale
          const relativeY = (stageY - position.y) / scale
          const snappedX = snapToGridValue(relativeX)
          const snappedY = snapToGridValue(relativeY)
          
          switch (draggedTool) {
            case 'table':
              addTable(snappedX, snappedY)
              break
            case 'door':
              addDoor(snappedX, snappedY)
              break
            case 'window':
              addWindow(snappedX, snappedY)
              break
          }
          
          // Автоматически переключаемся на инструмент выбора после добавления
          setSelectedTool('select')
        }
        
        setIsDraggingTool(false)
        setDraggedTool(null)
        if (canvasWrapperRef.current) {
          canvasWrapperRef.current.style.cursor = ''
        }
      }
    }

    if (isDraggingTool) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingTool, draggedTool, scale, position, snapToGridValue, addTable, addDoor, addWindow])

  const handleDelete = (id?: string) => {
    const idToDelete = id || selectedId
    if (idToDelete) {
      // Если удаляем несколько элементов
      if (selectedIds.length > 0 && !id) {
        const updatedElements = elements.filter((el) => !selectedIds.includes(el.id))
        updateCurrentFloorElements(updatedElements)
        handleSelect(null)
      } else {
        const updatedElements = elements.filter((el) => el.id !== idToDelete)
        updateCurrentFloorElements(updatedElements)
        if (idToDelete === selectedId || selectedIds.includes(idToDelete)) {
          handleSelect(null)
        }
      }
    }
  }

  // Улучшенное копирование с поддержкой множественного выделения
  const handleCopy = () => {
    const idsToCopy = selectedIds.length > 0 ? selectedIds : (selectedId ? [selectedId] : [])
    if (idsToCopy.length === 0) return

    const elementsToCopy = elements.filter((el) => idsToCopy.includes(el.id))
    const offset = 50 // Смещение для копий

    const newElements = elementsToCopy.map((el) => ({
      ...el,
      id: `${el.type}-${Date.now()}-${Math.random()}`,
      x: snapToGridValue(el.x + offset),
      y: snapToGridValue(el.y + offset),
      label: el.label ? `${el.label} (копия)` : undefined,
    }))

    const updatedElements = [...elements, ...newElements]
    updateCurrentFloorElements(updatedElements)
    
    if (newElements.length === 1) {
      handleSelect(newElements[0].id)
    } else if (newElements.length > 1) {
      const newIds = newElements.map((el) => el.id)
      setSelectedIds(newIds)
      setSelectedId(newIds[0])
      requestAnimationFrame(() => {
        if (transformerRef.current && transformerLayerRef.current) {
          const stage = transformerLayerRef.current.getStage()
          const nodes = newIds
            .map((id) => stage.findOne(`#${id}`))
            .filter((node) => node !== null && node !== undefined)
          if (nodes.length > 0) {
            transformerRef.current.nodes(nodes)
            transformerLayerRef.current.batchDraw()
          }
        }
      })
    }
  }

  const handleUpdate = (id: string, updates: Partial<FloorPlanElement>) => {
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    updateCurrentFloorElements(updatedElements)
    // Обновить трансформер если элемент выбран
    if (id === selectedId && transformerRef.current && transformerLayerRef.current) {
      setTimeout(() => {
        const stage = transformerLayerRef.current.getStage()
        const node = stage.findOne(`#${id}`)
        if (node) {
          transformerRef.current.nodes([node])
          transformerLayerRef.current.batchDraw()
        }
      }, 0)
    }
  }

  const handleDuplicate = (id: string) => {
    const element = elements.find((el) => el.id === id)
    if (element) {
      const newElement: FloorPlanElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: snapToGridValue(element.x + 50),
        y: snapToGridValue(element.y + 50),
        label: element.label ? `${element.label} (копия)` : undefined,
      }
      const updatedElements = [...elements, newElement]
      updateCurrentFloorElements(updatedElements)
      handleSelect(newElement.id)
    }
  }

  // Группировка элементов
  const handleGroup = () => {
    const idsToGroup = selectedIds.length > 0 ? selectedIds : (selectedId ? [selectedId] : [])
    if (idsToGroup.length < 2) return

    const selectedElements = elements.filter((el) => idsToGroup.includes(el.id))
    if (selectedElements.length < 2) return

    // Вычисляем границы группы
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    selectedElements.forEach((el) => {
      const elX = el.x
      const elY = el.y
      const elWidth = el.width || (el.radius ? (el.radius || 0) * 2 : 0)
      const elHeight = el.height || (el.radius ? (el.radius || 0) * 2 : 0)

      minX = Math.min(minX, elX)
      minY = Math.min(minY, elY)
      maxX = Math.max(maxX, elX + elWidth)
      maxY = Math.max(maxY, elY + elHeight)
    })

    const groupId = `group-${Date.now()}`
    const groupElement: FloorPlanElement = {
      id: groupId,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      fill: 'transparent',
      stroke: '#FF6B01',
      strokeWidth: 2,
      isGroup: true,
      children: idsToGroup,
      label: `Группа ${idsToGroup.length}`,
      zIndex: 5,
    }

    // Обновляем позиции дочерних элементов относительно группы
    const updatedElements = elements.map((el) => {
      if (idsToGroup.includes(el.id)) {
        return {
          ...el,
          x: el.x - minX,
          y: el.y - minY,
        }
      }
      return el
    })

    updateCurrentFloorElements([...updatedElements, groupElement])
    handleSelect(groupId)
  }

  // Разгруппировка элементов
  const handleUngroup = () => {
    const selectedElement = elements.find((el) => el.id === selectedId)
    if (!selectedElement || !selectedElement.isGroup || !selectedElement.children) return

    const groupX = selectedElement.x
    const groupY = selectedElement.y

    // Восстанавливаем позиции дочерних элементов
    const updatedElements = elements
      .filter((el) => el.id !== selectedId)
      .map((el) => {
        if (selectedElement.children?.includes(el.id)) {
          return {
            ...el,
            x: el.x + groupX,
            y: el.y + groupY,
          }
        }
        return el
      })

    updateCurrentFloorElements(updatedElements)
    handleSelect(null)
  }

  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите очистить весь план?')) {
      updateCurrentFloorElements([])
      setTableNumber(1)
      handleSelect(null)
    }
  }

  const handleDragEnd = (id: string, e: any) => {
    const node = e.target
    const x = snapToGridValue(node.x())
    const y = snapToGridValue(node.y())
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, x, y } : el))
    updateCurrentFloorElements(updatedElements)
    node.position({ x, y })
  }

  const handleTransformEnd = (id: string, e: any) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    const updatedElements = elements.map((el) => {
      if (el.id === id) {
        const newWidth = el.width ? snapToGridValue(el.width * scaleX) : undefined
        const newHeight = el.height ? snapToGridValue(el.height * scaleY) : undefined
        const newRadius = el.radius ? snapToGridValue(el.radius * Math.max(scaleX, scaleY)) : undefined
        const newX = snapToGridValue(node.x())
        const newY = snapToGridValue(node.y())

        return {
          ...el,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
          radius: newRadius,
          rotation: node.rotation(),
        }
      }
      return el
    })
    updateCurrentFloorElements(updatedElements)
  }

  const handleZoom = (delta: number) => {
    setScale((prev) => clampZoom(prev + delta))
  }

  const handleFitScreen = () => {
    setScale(1)
    // Центрируем Stage
    const centerX = (stageSize.width - STAGE_WIDTH) / 2
    const centerY = (stageSize.height - STAGE_HEIGHT) / 2
    setPosition({ x: centerX, y: centerY })
  }

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    const oldScale = scale
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.95 : oldScale * 1.05
    const clampedScale = clampZoom(newScale)

    setScale(clampedScale)
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }


  const prepareJsonData = (): FloorPlanData => {
    // Перед сохранением синхронизируем текущий этаж с элементами
    const updatedFloors = floors.map((floor) =>
      floor.id === currentFloorId ? { ...floor, elements } : floor
    )

    return {
      stage: {
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        scale,
        offsetX: position.x,
        offsetY: position.y,
      },
      floors: updatedFloors, // Все этажи с их элементами
      currentFloorId, // ID текущего активного этажа
      metadata: {
        clientName,
        venueName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
  }

  const handleSave = () => {
    // Генерируем JSON сразу при открытии диалога
    const data = prepareJsonData()
    const jsonString = JSON.stringify(data, null, 2)
    setJsonToSave(jsonString)
    // Показываем диалог с полями для ввода клиента и заведения
    setShowJsonDialog(true)
  }

  const handleConfirmSave = async () => {
    if (!clientName.trim() || !venueName.trim()) {
      alert('Пожалуйста, заполните все поля')
      return
    }
    
    const data = prepareJsonData()
    
    // Если передан onSave callback, используем его
    if (onSave) {
      onSave(data, clientName, venueName)
      setShowJsonDialog(false)
      return
    }
    
    // Иначе используем стандартное сохранение через API
    try {
      await saveMutation.mutateAsync(data)
      setShowJsonDialog(false)
      alert('План успешно сохранен!')
    } catch (error) {
      console.error('Error saving floor plan:', error)
      alert('Ошибка при сохранении плана')
    }
  }

  // Рендер сетки с центром Stage
  const renderGrid = () => {
    const lines: any[] = []
    const width = STAGE_WIDTH
    const height = STAGE_HEIGHT
    const centerX = width / 2
    const centerY = height / 2

    if (showGrid) {
      for (let i = 0; i <= width / GRID_SIZE; i++) {
        const x = i * GRID_SIZE
        const isCenterLine = Math.abs(x - centerX) < 1
        lines.push(
          <Line
            key={`v-${i}`}
            points={[x, 0, x, height]}
            stroke={isCenterLine ? '#FF6B01' : '#E8EAED'}
            strokeWidth={isCenterLine ? 1 : 0.5}
            listening={false}
            opacity={isCenterLine ? 0.8 : 0.6}
            dash={isCenterLine ? [5, 5] : undefined}
          />
        )
      }

      for (let i = 0; i <= height / GRID_SIZE; i++) {
        const y = i * GRID_SIZE
        const isCenterLine = Math.abs(y - centerY) < 1
        lines.push(
          <Line
            key={`h-${i}`}
            points={[0, y, width, y]}
            stroke={isCenterLine ? '#FF6B01' : '#E8EAED'}
            strokeWidth={isCenterLine ? 1 : 0.5}
            listening={false}
            opacity={isCenterLine ? 0.8 : 0.6}
            dash={isCenterLine ? [5, 5] : undefined}
          />
        )
      }
    }

    // Центр Stage - крест для ориентации (всегда видимый)
    lines.push(
      <Circle
        key="center-point"
        x={centerX}
        y={centerY}
        radius={4}
        fill="#FF6B01"
        stroke="#FFFFFF"
        strokeWidth={2}
        listening={false}
        shadowBlur={4}
        shadowColor="rgba(255, 107, 1, 0.5)"
      />,
      <Line
        key="center-h"
        points={[centerX - 20, centerY, centerX + 20, centerY]}
        stroke="#FF6B01"
        strokeWidth={2}
        listening={false}
        shadowBlur={2}
        shadowColor="rgba(255, 107, 1, 0.3)"
      />,
      <Line
        key="center-v"
        points={[centerX, centerY - 20, centerX, centerY + 20]}
        stroke="#FF6B01"
        strokeWidth={2}
        listening={false}
        shadowBlur={2}
        shadowColor="rgba(255, 107, 1, 0.3)"
      />
    )

    return lines
  }

  // Используем FurnitureRenderer для рендеринга мебели

  const renderElement = (element: FloorPlanElement) => {
    const isSelected = element.id === selectedId || selectedIds.includes(element.id)
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation || 0,
      draggable: selectedTool === 'select' && !isDrawingWall && !isSelecting && !isPanning && !isSpacePressed,
      onClick: (e: any) => {
        e.cancelBubble = true
        // Не обрабатываем клик если идет выделение зоны
        if (isSelecting) {
          e.evt.stopPropagation()
          return
        }
        if (!isDrawingWall) {
          const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey
          handleSelect(element.id, isMultiSelect)
        }
      },
      onContextMenu: (e: any) => {
        e.evt.preventDefault()
        e.evt.stopPropagation()
        e.cancelBubble = true
        
        const stage = e.target.getStage()
        const pointerPos = stage.getPointerPosition()
        
        setContextMenu({
          mouseX: pointerPos.x,
          mouseY: pointerPos.y,
          elementId: element.id,
        })
      },
      onDragStart: (e: any) => {
        e.cancelBubble = true
        // Останавливаем выделение зоны если начали перетаскивать элемент
        if (isSelecting) {
          setIsSelecting(false)
          setSelectionStart(null)
          setSelectionBox(null)
        }
      },
      onDragEnd: (e: any) => {
        e.cancelBubble = true
        handleDragEnd(element.id, e)
      },
      onTransformEnd: (e: any) => {
        e.cancelBubble = true
        handleTransformEnd(element.id, e)
      },
      shadowBlur: isSelected ? 8 : 0,
      shadowColor: isSelected ? '#FF6B01' : 'transparent',
      shadowOpacity: isSelected ? 0.5 : 0,
      listening: true,
    }

    switch (element.type) {
      case 'table':
        const tableShape = element.tableShape || 'circle'
        const radius = element.radius || 30
        const width = element.width || 60
        const height = element.height || 60
        const capacity = element.capacity || 4
        
        // Вычисляем центр для текста
        let centerX = 0
        let textWidth = width
        let labelY = -height / 2 - 20
        let capacityY = height / 2 + 20
        
        if (tableShape === 'circle') {
          centerX = 0
          textWidth = radius * 2 + 40
          labelY = -radius - 20
          capacityY = radius + 20
        } else {
          centerX = 0
          textWidth = width + 40
        }
        
        let tableShapeElement: any = null
        
        switch (tableShape) {
          case 'circle':
            tableShapeElement = (
              <>
                {/* Тень стола */}
                <Circle
                  radius={radius + 1}
                  fill="rgba(0, 0, 0, 0.05)"
                  x={2}
                  y={2}
                  listening={false}
                />
                {/* Основной стол */}
                <Circle
                  radius={radius}
                  fill={element.fill || '#FFFFFF'}
                  stroke={element.stroke || '#4CAF50'}
                  strokeWidth={element.strokeWidth || 3}
                  shadowBlur={6}
                  shadowColor="rgba(76, 175, 80, 0.3)"
                  shadowOffsetX={0}
                  shadowOffsetY={2}
                />
                {/* Внутренний круг для объема */}
                <Circle
                  radius={radius - 4}
                  fill="rgba(76, 175, 80, 0.05)"
                  listening={false}
                />
                {/* Места вокруг стола - детальная визуализация */}
                {element.showFurniture !== false && element.furniturePositions && element.furniturePositions.length > 0
                  ? element.furniturePositions.filter(pos => pos.side === 'circle').map((pos, i) => {
                      const furniturePositions = element.furniturePositions || []
                      const angle = pos.angle !== undefined ? (pos.angle * Math.PI) / 180 : (i * 2 * Math.PI) / furniturePositions.length - Math.PI / 2
                      const seatRadius = radius + (pos.offset || 18)
                      const seatX = Math.cos(angle) * seatRadius
                      const seatY = Math.sin(angle) * seatRadius
                      const rotation = pos.angle || 0
                      return (
                        <FurnitureRenderer
                          key={`circle-${i}`}
                          x={seatX}
                          y={seatY}
                          rotation={rotation}
                          furnitureType={element.furnitureType}
                          shape={pos.shape}
                          scale={1}
                        />
                      )
                    })
                  : Array.from({ length: capacity }).map((_, i) => {
                      const angle = (i * 2 * Math.PI) / capacity - Math.PI / 2
                      const seatRadius = radius + 18
                      const seatX = Math.cos(angle) * seatRadius
                      const seatY = Math.sin(angle) * seatRadius
                      return (
                        <FurnitureRenderer
                          key={`circle-${i}`}
                          x={seatX}
                          y={seatY}
                          rotation={0}
                          furnitureType={element.furnitureType || 'chair'}
                          shape="straight"
                          scale={1}
                        />
                      )
                    })
                }
              </>
            )
            break
          case 'square':
          case 'rectangle':
            const seatsPerSide = Math.ceil(capacity / 4)
            tableShapeElement = (
              <>
                {/* Тень стола */}
                <Rect
                  x={2}
                  y={2}
                  width={width}
                  height={height}
                  fill="rgba(0, 0, 0, 0.05)"
                  cornerRadius={tableShape === 'square' ? 4 : 8}
                  listening={false}
                />
                {/* Основной стол */}
                <Rect
                  width={width}
                  height={height}
                  fill={element.fill || '#FFFFFF'}
                  stroke={element.stroke || '#4CAF50'}
                  strokeWidth={element.strokeWidth || 3}
                  cornerRadius={tableShape === 'square' ? 4 : 8}
                  shadowBlur={6}
                  shadowColor="rgba(76, 175, 80, 0.3)"
                  shadowOffsetX={0}
                  shadowOffsetY={2}
                />
                {/* Внутренний прямоугольник для объема */}
                <Rect
                  x={4}
                  y={4}
                  width={width - 8}
                  height={height - 8}
                  fill="rgba(76, 175, 80, 0.05)"
                  cornerRadius={tableShape === 'square' ? 2 : 6}
                  listening={false}
                />
                {/* Места вокруг стола - детальная визуализация */}
                {element.showFurniture !== false && element.furniturePositions && element.furniturePositions.length > 0
                  ? element.furniturePositions.filter(pos => pos.side !== 'circle').map((pos, i) => {
                      const width = element.width || 60
                      const height = element.height || 60
                      const seatOffset = pos.offset || 18
                      const sidePositions = element.furniturePositions?.filter(p => p.side === pos.side) || []
                      const sideIndex = sidePositions.indexOf(pos)
                      const totalOnSide = sidePositions.length
                      
                      let seatX = 0
                      let seatY = 0
                      let rotation = 0
                      
                      switch (pos.side) {
                        case 'top':
                          seatX = -width / 2 + ((sideIndex + 1) * width) / (totalOnSide + 1)
                          seatY = -height / 2 - seatOffset
                          rotation = 0
                          break
                        case 'right':
                          seatX = width / 2 + seatOffset
                          seatY = -height / 2 + ((sideIndex + 1) * height) / (totalOnSide + 1)
                          rotation = 90
                          break
                        case 'bottom':
                          seatX = -width / 2 + ((sideIndex + 1) * width) / (totalOnSide + 1)
                          seatY = height / 2 + seatOffset
                          rotation = 180
                          break
                        case 'left':
                          seatX = -width / 2 - seatOffset
                          seatY = -height / 2 + ((sideIndex + 1) * height) / (totalOnSide + 1)
                          rotation = 270
                          break
                      }
                      
                      return (
                        <FurnitureRenderer
                          key={`${pos.side}-${i}`}
                          x={seatX}
                          y={seatY}
                          rotation={rotation}
                          furnitureType={element.furnitureType}
                          shape={pos.shape}
                          scale={1}
                        />
                      )
                    })
                  : Array.from({ length: 4 }).map((_, side) => {
                      const seats = side === 3 ? capacity - seatsPerSide * 3 : seatsPerSide
                      return Array.from({ length: seats }).map((_, i) => {
                        let seatX = 0
                        let seatY = 0
                        const totalSeats = side === 3 ? capacity - seatsPerSide * 3 : seatsPerSide
                        const spacing = totalSeats > 1 ? width / (totalSeats + 1) : width / 2
                        const offset = (i + 1) * spacing - width / 2
                        const seatOffset = 18
                        let rotation = 0
                        
                        if (side === 0) {
                          seatX = offset
                          seatY = -height / 2 - seatOffset
                          rotation = 0
                        } else if (side === 1) {
                          seatX = width / 2 + seatOffset
                          seatY = offset
                          rotation = 90
                        } else if (side === 2) {
                          seatX = offset
                          seatY = height / 2 + seatOffset
                          rotation = 180
                        } else {
                          seatX = -width / 2 - seatOffset
                          seatY = offset
                          rotation = 270
                        }
                        
                        return (
                          <FurnitureRenderer
                            key={`${side}-${i}`}
                            x={seatX}
                            y={seatY}
                            rotation={rotation}
                            furnitureType={element.furnitureType || 'chair'}
                            shape="straight"
                            scale={1}
                          />
                        )
                      })
                    })
                }
              </>
            )
            break
          case 'oval':
            tableShapeElement = (
              <>
                {/* Тень стола */}
                <Rect
                  x={2}
                  y={2}
                  width={width}
                  height={height}
                  fill="rgba(0, 0, 0, 0.05)"
                  cornerRadius={Math.min(width, height) / 2}
                  listening={false}
                />
                {/* Основной стол */}
                <Rect
                  width={width}
                  height={height}
                  fill={element.fill || '#FFFFFF'}
                  stroke={element.stroke || '#4CAF50'}
                  strokeWidth={element.strokeWidth || 3}
                  cornerRadius={Math.min(width, height) / 2}
                  shadowBlur={6}
                  shadowColor="rgba(76, 175, 80, 0.3)"
                  shadowOffsetX={0}
                  shadowOffsetY={2}
                />
                {/* Внутренний овал для объема */}
                <Rect
                  x={4}
                  y={4}
                  width={width - 8}
                  height={height - 8}
                  fill="rgba(76, 175, 80, 0.05)"
                  cornerRadius={Math.min(width - 8, height - 8) / 2}
                  listening={false}
                />
                {/* Места вокруг овального стола - детальная визуализация */}
                {element.showFurniture !== false && element.furniturePositions && element.furniturePositions.length > 0
                  ? element.furniturePositions.filter(pos => pos.side === 'circle').map((pos, i) => {
                      const seatRadiusX = width / 2 + (pos.offset || 18)
                      const seatRadiusY = height / 2 + (pos.offset || 18)
                      const furniturePositions = element.furniturePositions || []
                      const angle = pos.angle !== undefined ? (pos.angle * Math.PI) / 180 : (i * 2 * Math.PI) / furniturePositions.length - Math.PI / 2
                      const seatX = Math.cos(angle) * seatRadiusX
                      const seatY = Math.sin(angle) * seatRadiusY
                      const rotation = pos.angle || 0
                      return (
                        <FurnitureRenderer
                          key={`oval-${i}`}
                          x={seatX}
                          y={seatY}
                          rotation={rotation}
                          furnitureType={element.furnitureType}
                          shape={pos.shape}
                          scale={1}
                        />
                      )
                    })
                  : Array.from({ length: capacity }).map((_, i) => {
                      const angle = (i * 2 * Math.PI) / capacity - Math.PI / 2
                      const seatRadiusX = width / 2 + 18
                      const seatRadiusY = height / 2 + 18
                      const seatX = Math.cos(angle) * seatRadiusX
                      const seatY = Math.sin(angle) * seatRadiusY
                      return (
                        <FurnitureRenderer
                          key={`oval-${i}`}
                          x={seatX}
                          y={seatY}
                          rotation={0}
                          furnitureType={element.furnitureType || 'chair'}
                          shape="straight"
                          scale={1}
                        />
                      )
                    })
                }
              </>
            )
            break
        }
        
        return (
          <Group key={element.id} {...commonProps}>
            {tableShapeElement}
            {/* Название стола - улучшенный стиль */}
            {element.label && (
              <Group listening={false}>
                {/* Фон для текста */}
                <Rect
                  x={centerX - textWidth / 2}
                  y={labelY - 10}
                  width={textWidth}
                  height={18}
                  fill="rgba(255, 255, 255, 0.9)"
                  cornerRadius={4}
                  shadowBlur={4}
                  shadowColor="rgba(0, 0, 0, 0.1)"
                />
                <Text
                  text={element.label}
                  x={centerX}
                  y={labelY}
                  fontSize={12}
                  fill="#1A1A1A"
                  fontFamily="Inter, sans-serif"
                  fontWeight="700"
                  align="center"
                  width={textWidth}
                  offsetX={textWidth / 2}
                />
              </Group>
            )}
            {/* Количество мест - улучшенный стиль */}
            {capacity > 0 && (
              <Group listening={false}>
                {/* Фон для текста */}
                <Rect
                  x={centerX - textWidth / 2}
                  y={capacityY - 8}
                  width={textWidth}
                  height={16}
                  fill="rgba(255, 255, 255, 0.9)"
                  cornerRadius={4}
                  shadowBlur={4}
                  shadowColor="rgba(0, 0, 0, 0.1)"
                />
                <Text
                  text={`${capacity} мест`}
                  x={centerX}
                  y={capacityY}
                  fontSize={10}
                  fill="#666666"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                  align="center"
                  width={textWidth}
                  offsetX={textWidth / 2}
                />
              </Group>
            )}
          </Group>
        )

      case 'wall':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width || 200}
              height={element.height || 20}
              fill={element.fill || '#E8E8E8'}
              stroke={element.stroke || '#9E9E9E'}
              strokeWidth={element.strokeWidth || 2}
              cornerRadius={4}
              shadowBlur={isSelected ? 6 : 0}
              shadowColor={isSelected ? '#FF6B01' : 'transparent'}
              shadowOpacity={isSelected ? 0.4 : 0}
            />
          </Group>
        )

      case 'door':
        const doorWidth = element.width || 80
        const doorHeight = element.height || 20
        const isHorizontal = doorWidth > doorHeight
        
        return (
          <Group key={element.id} {...commonProps}>
            {/* Основная панель двери */}
            <Rect
              width={doorWidth}
              height={doorHeight}
              fill={element.fill || '#F5E6D3'}
              stroke={element.stroke || '#8D6E63'}
              strokeWidth={element.strokeWidth || 2}
              cornerRadius={isHorizontal ? 4 : 6}
              shadowBlur={isSelected ? 6 : 0}
              shadowColor={isSelected ? '#FF6B01' : 'transparent'}
              shadowOpacity={isSelected ? 0.4 : 0}
            />
            {/* Дверная панель (внутренняя) */}
            <Rect
              x={isHorizontal ? 4 : 4}
              y={isHorizontal ? 4 : 4}
              width={isHorizontal ? doorWidth - 8 : doorWidth - 8}
              height={isHorizontal ? doorHeight - 8 : doorHeight - 8}
              fill="rgba(255, 255, 255, 0.3)"
              cornerRadius={isHorizontal ? 2 : 4}
              listening={false}
            />
            {/* Дверная ручка */}
            <Circle
              x={isHorizontal ? doorWidth - 12 : doorWidth / 2}
              y={isHorizontal ? doorHeight / 2 : doorHeight - 12}
              radius={4}
              fill="#8D6E63"
              stroke="#5D4037"
              strokeWidth={1}
              listening={false}
            />
            {/* Линия открытия двери (дуга) */}
            {isHorizontal ? (
              <Line
                points={[doorWidth, doorHeight / 2, doorWidth + 15, doorHeight / 2 - 10]}
                stroke="#8D6E63"
                strokeWidth={1.5}
                dash={[4, 4]}
                listening={false}
                opacity={0.6}
              />
            ) : (
              <Line
                points={[doorWidth / 2, doorHeight, doorWidth / 2 - 10, doorHeight + 15]}
                stroke="#8D6E63"
                strokeWidth={1.5}
                dash={[4, 4]}
                listening={false}
                opacity={0.6}
              />
            )}
            {/* Название двери */}
            {element.label && (
              <Text
                text={element.label}
                x={isHorizontal ? doorWidth / 2 : -doorWidth / 2 - 8}
                y={isHorizontal ? -doorHeight / 2 - 8 : doorHeight / 2}
                fontSize={11}
                fontWeight="500"
                fill="#8D6E63"
                fontFamily="Inter, -apple-system, sans-serif"
                align={isHorizontal ? 'center' : 'right'}
                width={isHorizontal ? doorWidth : undefined}
                offsetX={isHorizontal ? doorWidth / 2 : 0}
              />
            )}
          </Group>
        )

      case 'window':
        const windowWidth = element.width || 100
        const windowHeight = element.height || 20
        const isWindowHorizontal = windowWidth > windowHeight
        
        return (
          <Group key={element.id} {...commonProps}>
            {/* Рама окна */}
            <Rect
              width={windowWidth}
              height={windowHeight}
              fill={element.fill || '#E3F2FD'}
              stroke={element.stroke || '#2196F3'}
              strokeWidth={element.strokeWidth || 2}
              cornerRadius={6}
              shadowBlur={isSelected ? 6 : 0}
              shadowColor={isSelected ? '#FF6B01' : 'transparent'}
              shadowOpacity={isSelected ? 0.4 : 0}
            />
            {/* Внутренняя панель окна */}
            <Rect
              x={3}
              y={3}
              width={windowWidth - 6}
              height={windowHeight - 6}
              fill="rgba(255, 255, 255, 0.5)"
              cornerRadius={4}
              listening={false}
            />
            {/* Перегородки окна */}
            {isWindowHorizontal ? (
              <>
                {/* Вертикальная перегородка */}
                <Line
                  points={[windowWidth / 2, 3, windowWidth / 2, windowHeight - 3]}
                  stroke="#2196F3"
                  strokeWidth={1.5}
                  listening={false}
                />
                {/* Горизонтальные линии (имитация стекла) */}
                {[windowHeight / 3, (windowHeight / 3) * 2].map((y, i) => (
                  <Line
                    key={i}
                    points={[3, y, windowWidth - 3, y]}
                    stroke="#90CAF9"
                    strokeWidth={0.5}
                    dash={[2, 2]}
                    listening={false}
                    opacity={0.5}
                  />
                ))}
              </>
            ) : (
              <>
                {/* Горизонтальная перегородка */}
                <Line
                  points={[3, windowHeight / 2, windowWidth - 3, windowHeight / 2]}
                  stroke="#2196F3"
                  strokeWidth={1.5}
                  listening={false}
                />
                {/* Вертикальные линии (имитация стекла) */}
                {[windowWidth / 3, (windowWidth / 3) * 2].map((x, i) => (
                  <Line
                    key={i}
                    points={[x, 3, x, windowHeight - 3]}
                    stroke="#90CAF9"
                    strokeWidth={0.5}
                    dash={[2, 2]}
                    listening={false}
                    opacity={0.5}
                  />
                ))}
              </>
            )}
            {/* Название окна */}
            {element.label && (
              <Text
                text={element.label}
                x={isWindowHorizontal ? windowWidth / 2 : -windowWidth / 2 - 8}
                y={isWindowHorizontal ? -windowHeight / 2 - 8 : windowHeight / 2}
                fontSize={11}
                fontWeight="500"
                fill="#2196F3"
                fontFamily="Inter, -apple-system, sans-serif"
                align={isWindowHorizontal ? 'center' : 'right'}
                width={isWindowHorizontal ? windowWidth : undefined}
                offsetX={isWindowHorizontal ? windowWidth / 2 : 0}
              />
            )}
          </Group>
        )

      case 'group':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width || 200}
              height={element.height || 200}
              fill={element.fill || 'transparent'}
              stroke={element.stroke}
              strokeWidth={element.strokeWidth}
              cornerRadius={4}
              dash={[10, 5]}
            />
            {element.label && (
              <Text
                text={element.label}
                x={10}
                y={10}
                fontSize={14}
                fill={element.stroke}
                fontFamily="Inter, sans-serif"
                fontStyle="bold"
              />
            )}
          </Group>
        )

      default:
        return null
    }
  }

  // Обновление элементов текущего этажа
  const updateCurrentFloorElements = (newElements: FloorPlanElement[]) => {
    setFloors((prev) =>
      prev.map((floor) =>
        floor.id === currentFloorId ? { ...floor, elements: newElements } : floor
      )
    )
    setElements(newElements)
  }

  // Добавление нового этажа
  const handleAddFloor = () => {
    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      name: `Этаж ${floors.length + 1}`,
      level: floors.length + 1,
      elements: [],
    }
    setFloors((prev) => [...prev, newFloor])
    setCurrentFloorId(newFloor.id)
    setElements([])
    handleSelect(null)
  }

  // Переключение этажа
  const handleFloorChange = (floorId: string) => {
    // Сохраняем текущие элементы в текущий этаж перед переключением
    const updatedFloors = floors.map((floor) =>
      floor.id === currentFloorId ? { ...floor, elements } : floor
    )
    setFloors(updatedFloors)
    
    // Переключаемся на новый этаж
    setCurrentFloorId(floorId)
    const newFloor = updatedFloors.find((f) => f.id === floorId)
    if (newFloor) {
      setElements(newFloor.elements)
    }
    handleSelect(null)
  }

  // Удаление этажа
  const handleDeleteFloor = (floorId: string) => {
    if (floors.length <= 1) {
      alert('Нельзя удалить единственный этаж')
      return
    }

    if (window.confirm('Вы уверены, что хотите удалить этот этаж? Все элементы на нем будут удалены.')) {
      const updatedFloors = floors.filter((floor) => floor.id !== floorId)
      setFloors(updatedFloors)
      
      // Если удалили текущий этаж, переключаемся на первый доступный
      if (currentFloorId === floorId) {
        const firstFloor = updatedFloors[0]
        if (firstFloor) {
          setCurrentFloorId(firstFloor.id)
          setElements(firstFloor.elements)
        }
      }
      handleSelect(null)
    }
  }

  // Начало редактирования названия этажа
  const handleStartEditFloorName = (floorId: string, currentName: string) => {
    setEditingFloorId(floorId)
    setEditingFloorName(currentName)
  }

  // Сохранение названия этажа
  const handleSaveFloorName = (floorId: string) => {
    if (!editingFloorName.trim()) {
      alert('Название этажа не может быть пустым')
      return
    }
    
    const updatedFloors = floors.map((floor) =>
      floor.id === floorId ? { ...floor, name: editingFloorName.trim() } : floor
    )
    setFloors(updatedFloors)
    setEditingFloorId(null)
    setEditingFloorName('')
  }

  // Отмена редактирования названия этажа
  const handleCancelEditFloorName = () => {
    setEditingFloorId(null)
    setEditingFloorName('')
  }

  const tools = [
    { id: 'select' as ToolType, icon: SelectIcon, label: 'Выбрать', color: '#FF6B01' },
    { id: 'table' as ToolType, icon: TableIcon, label: 'Стол', color: '#4CAF50' },
    { id: 'wall' as ToolType, icon: WallIcon, label: 'Стена', color: '#757575' },
    { id: 'door' as ToolType, icon: DoorIcon, label: 'Дверь', color: '#8D6E63' },
    { id: 'window' as ToolType, icon: WindowIcon, label: 'Окно', color: '#2196F3' },
  ]

  return (
    <Box 
      className="floor-plan-editor"
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      <Box className="floor-plan-editor__container">
        {/* Боковая панель инструментов */}
        <Paper 
          className="floor-plan-editor__sidebar" 
          elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ flex: '0 0 auto' }}>
            <Typography variant="h6" className="floor-plan-editor__sidebar-title">
              Инструменты
            </Typography>
            <Typography variant="caption" sx={{ color: '#757575', display: 'block', mb: 2, fontSize: '11px' }}>
              Панорамирование: Space + перетаскивание или средняя кнопка мыши
              <br />
              Выделение зоны: перетаскивание на пустом месте
              <br />
              Добавление элементов: перетащите инструмент на canvas или кликните
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box className="floor-plan-editor__tools">
              {tools.map((tool) => {
                const Icon = tool.icon
                const isActive = selectedTool === tool.id
                return (
                  <Tooltip key={tool.id} title={`${tool.label}${tool.id !== 'select' ? ' (перетащите на canvas)' : ''}`} placement="right">
                    <Button
                      className={`floor-plan-editor__tool ${isActive ? 'active' : ''}`}
                      onMouseDown={(e) => {
                        if (tool.id === 'table') {
                          // Для стола открываем конструктор
                          e.preventDefault()
                          e.stopPropagation()
                          setTableConstructorOpen(true)
                          setSelectedTool('select')
                        } else if (tool.id !== 'select' && tool.id !== 'wall') {
                          e.preventDefault()
                          e.stopPropagation()
                          setDraggedTool(tool.id)
                          setIsDraggingTool(true)
                          // Изменяем курсор на canvas
                          if (canvasWrapperRef.current) {
                            canvasWrapperRef.current.style.cursor = 'crosshair'
                          }
                        }
                      }}
                      onClick={() => {
                        // Если не было перетаскивания, просто выбираем инструмент
                        if (!isDraggingTool && tool.id !== 'table') {
                          setSelectedTool(tool.id)
                          if (tool.id !== 'select') {
                            handleSelect(null)
                          }
                        }
                      }}
                      variant={isActive ? 'contained' : 'outlined'}
                      sx={{
                        minWidth: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        mb: 0.75,
                        borderColor: isActive ? tool.color : '#E8E8E8',
                        backgroundColor: isActive ? tool.color : 'transparent',
                        borderWidth: isActive ? 2 : 1,
                        cursor: tool.id !== 'select' ? 'grab' : 'pointer',
                        '&:active': {
                          cursor: tool.id !== 'select' ? 'grabbing' : 'pointer',
                        },
                        '&:hover': {
                          backgroundColor: isActive ? tool.color : '#FAFAFA',
                          borderColor: tool.color,
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <Icon sx={{ color: isActive ? '#fff' : '#666' }} />
                    </Button>
                  </Tooltip>
                )
              })}
            </Box>

            {/* Селектор формы стола */}
            {selectedTool === 'table' && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <TableShapeSelector
                  selectedShape={selectedTableShape}
                  onShapeChange={setSelectedTableShape}
                />
              </>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Группировка */}
            <Box className="floor-plan-editor__actions">
              <Tooltip title="Группировать (Ctrl+G)">
                <span>
                  <IconButton
                    onClick={handleGroup}
                    disabled={(selectedIds.length < 2 && !selectedId) || elements.find((el) => el.id === selectedId)?.isGroup}
                    color="primary"
                    size="large"
                  >
                    <GroupIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Разгруппировать">
                <span>
                  <IconButton
                    onClick={handleUngroup}
                    disabled={!selectedId || !elements.find((el) => el.id === selectedId)?.isGroup}
                    color="primary"
                    size="large"
                  >
                    <UngroupIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Этажи */}
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '13px' }}>
              Этажи
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
              {floors.map((floor) => (
                <Box
                  key={floor.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {editingFloorId === floor.id ? (
                    <Box sx={{ flex: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <TextField
                        value={editingFloorName}
                        onChange={(e) => setEditingFloorName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveFloorName(floor.id)
                          } else if (e.key === 'Escape') {
                            handleCancelEditFloorName()
                          }
                        }}
                        size="small"
                        autoFocus
                        sx={{
                          flex: 1,
                          '& .MuiInputBase-root': {
                            height: '36px',
                            fontSize: '13px',
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <Tooltip title="Сохранить">
                        <IconButton
                          size="small"
                          onClick={() => handleSaveFloorName(floor.id)}
                          sx={{
                            color: '#4CAF50',
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' },
                          }}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Отмена">
                        <IconButton
                          size="small"
                          onClick={handleCancelEditFloorName}
                          sx={{
                            color: '#757575',
                            '&:hover': { backgroundColor: 'rgba(117, 117, 117, 0.08)' },
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <>
                      <Button
                        variant={currentFloorId === floor.id ? 'contained' : 'outlined'}
                        onClick={() => handleFloorChange(floor.id)}
                        onDoubleClick={() => handleStartEditFloorName(floor.id, floor.name)}
                        size="small"
                        sx={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          fontSize: '13px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: currentFloorId === floor.id ? '#FF6B01' : 'transparent',
                          borderColor: currentFloorId === floor.id ? '#FF6B01' : '#E8E8E8',
                          color: currentFloorId === floor.id ? '#FFFFFF' : '#666',
                          fontWeight: currentFloorId === floor.id ? 600 : 500,
                          '&:hover': {
                            backgroundColor: currentFloorId === floor.id ? '#E55A00' : '#FAFAFA',
                            borderColor: '#FF6B01',
                          },
                        }}
                      >
                        {floor.name}
                      </Button>
                      <Tooltip title="Редактировать название">
                        <IconButton
                          size="small"
                          onClick={() => handleStartEditFloorName(floor.id, floor.name)}
                          sx={{
                            color: '#666',
                            '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {floors.length > 1 && (
                        <Tooltip title="Удалить этаж">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteFloor(floor.id)}
                            sx={{
                              color: '#F44336',
                              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
                            }}
                          >
                            <DeleteFloorIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddFloor}
                size="small"
                startIcon={<AddIcon sx={{ fontSize: '16px' }} />}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontSize: '13px',
                  height: '36px',
                  borderRadius: '8px',
                  borderStyle: 'dashed',
                  borderColor: '#E0E0E0',
                  color: '#999',
                  '&:hover': {
                    borderColor: '#FF6B01',
                    color: '#FF6B01',
                    backgroundColor: 'rgba(255, 107, 1, 0.05)',
                  },
                }}
              >
                Добавить этаж
              </Button>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Действия */}
            <Box className="floor-plan-editor__actions">
              <Tooltip title="Копировать (Ctrl+C)">
                <span>
                  <IconButton
                    onClick={handleCopy}
                    disabled={!selectedId && selectedIds.length === 0}
                    size="medium"
                    sx={{
                      color: '#666',
                      '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
                      '&:disabled': { color: '#CCC' },
                    }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Удалить (Delete)">
                <span>
                  <IconButton
                    onClick={() => handleDelete()}
                    disabled={!selectedId && selectedIds.length === 0}
                    size="medium"
                    sx={{
                      color: '#F44336',
                      '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
                      '&:disabled': { color: '#CCC' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Очистить все">
                <IconButton
                  onClick={handleClear}
                  size="medium"
                  sx={{
                    color: '#FF9800',
                    '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.08)' },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Статистика */}
            <Box className="floor-plan-editor__stats">
              <Chip
                label={`Элементов: ${elements.length}`}
                size="small"
                variant="outlined"
                sx={{ mb: 1, width: '100%' }}
              />
              <Chip
                label={`Столов: ${elements.filter((e) => e.type === 'table').length}`}
                size="small"
                variant="outlined"
                sx={{ width: '100%' }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Основная область с канвасом */}
        <Box sx={{ flex: 1, display: 'flex', gap: 2, minWidth: 0 }}>
        <Paper 
          ref={canvasWrapperRef}
          className="floor-plan-editor__canvas-wrapper" 
          elevation={1}
          sx={{
            position: 'relative',
          }}
        >
          {/* Кнопка сохранения - справа вверху */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={elements.length === 0}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                backgroundColor: '#FF6B01',
                color: '#FFFFFF',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(255, 107, 1, 0.4)',
                '&:hover': {
                  backgroundColor: '#E55A00',
                  boxShadow: '0 6px 16px rgba(255, 107, 1, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  backgroundColor: '#E0E0E0',
                  color: '#9E9E9E',
                  boxShadow: 'none',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Сохранить план
            </Button>
          </Box>
          <Box 
            ref={canvasContainerRef}
            className="floor-plan-editor__canvas-container" 
            sx={{ 
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Элементы управления на канвасе - левый верхний угол */}
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1000,
                p: 1,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <Tooltip title="Увеличить">
                <IconButton
                  onClick={() => handleZoom(0.1)}
                  size="small"
                  sx={{
                    color: '#666',
                    '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Уменьшить">
                <IconButton
                  onClick={() => handleZoom(-0.1)}
                  size="small"
                  sx={{
                    color: '#666',
                    '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
                  }}
                >
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Вместить в экран">
                <IconButton
                  onClick={handleFitScreen}
                  size="small"
                  sx={{
                    color: '#666',
                    '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.08)' },
                  }}
                >
                  <FitScreenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Tooltip title={showGrid ? 'Скрыть сетку' : 'Показать сетку'}>
                <IconButton
                  onClick={() => setShowGrid(!showGrid)}
                  size="small"
                  sx={{
                    color: showGrid ? '#FF6B01' : '#666',
                    backgroundColor: showGrid ? 'rgba(255, 107, 1, 0.08)' : 'transparent',
                    '&:hover': { color: '#FF6B01', backgroundColor: 'rgba(255, 107, 1, 0.12)' },
                  }}
                >
                  <GridIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
            
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onClick={handleStageClick}
              onTap={handleStageClick}
              onMouseDown={(e) => {
                const stage = e.target.getStage()
                const clickedOnEmpty = e.target === stage || e.target.getClassName() === 'Line'
                
                // Проверяем среднюю кнопку мыши или Space для панорамирования
                if (e.evt.button === 1 || (isSpacePressed && clickedOnEmpty)) {
                  e.evt.preventDefault()
                  handlePanStart(e)
                  return
                }

                // Если кликнули на элемент, не обрабатываем как клик по stage
                if (!clickedOnEmpty) {
                  // Если начали кликать на элемент во время выделения, отменяем выделение
                  if (isSelecting) {
                    setIsSelecting(false)
                    setSelectionStart(null)
                    setSelectionBox(null)
                  }
                  return
                }

                // Если выбран инструмент стены
                if (selectedTool === 'wall') {
                  handleWallMouseDown(e)
                  return
                }

                // Если перетаскиваем инструмент, обрабатываем drop
                if (isDraggingTool && draggedTool && draggedTool !== 'select' && draggedTool !== 'wall') {
                  e.evt.preventDefault()
                  e.evt.stopPropagation()
                  // Drop будет обработан в useEffect через mouseup
                  return
                }

                // Если выбран инструмент выбора и кликнули на пустое место - начинаем выделение зоны
                if (selectedTool === 'select' && clickedOnEmpty && !isSpacePressed && !isDraggingTool) {
                  e.evt.preventDefault()
                  e.evt.stopPropagation()
                  handleSelectionStart(e)
                }
              }}
              onMouseMove={(e) => {
                // Игнорируем движение мыши если перетаскиваем инструмент (обрабатывается в useEffect)
                if (isDraggingTool) {
                  return
                }
                
                if (isPanning || (isSpacePressed && e.evt.buttons === 1)) {
                  handlePanMove(e)
                } else if (isSelecting) {
                  e.evt.preventDefault()
                  handleSelectionMove(e)
                } else if (isDrawingWall) {
                  handleWallMouseMove(e)
                }
              }}
              onMouseUp={(e) => {
                // Игнорируем mouseup если перетаскиваем инструмент (обрабатывается в useEffect)
                if (isDraggingTool) {
                  return
                }
                
                if (isPanning) {
                  handlePanEnd()
                } else if (isSelecting) {
                  if (e.evt) {
                    e.evt.preventDefault()
                    e.evt.stopPropagation()
                  }
                  handleSelectionEnd()
                } else if (isDrawingWall) {
                  handleWallMouseUp()
                }
              }}
              onMouseLeave={() => {
                // Если мышь покинула stage во время выделения, завершаем его
                if (isSelecting) {
                  handleSelectionEnd()
                }
              }}
              onWheel={handleWheel}
              draggable={false} // Отключаем стандартное перетаскивание stage
              scaleX={scale}
              scaleY={scale}
              x={position.x}
              y={position.y}
              style={{
                backgroundColor: '#FAFBFC',
                cursor: isPanning || isSpacePressed
                  ? 'grabbing'
                  : selectedTool === 'wall'
                  ? 'crosshair'
                  : selectedTool === 'select' && isSelecting
                  ? 'crosshair'
                  : selectedTool === 'select'
                  ? 'default'
                  : 'crosshair',
              }}
            >
              {/* Слой сетки (фон) */}
              <Layer>
                {renderGrid()}
              </Layer>

              {/* Слой стен (нижний) */}
              <Layer>
                {elements
                  .filter((el) => el.type === 'wall')
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => renderElement(element))}
              </Layer>

              {/* Слой дверей и окон (средний) */}
              <Layer>
                {elements
                  .filter((el) => el.type === 'door' || el.type === 'window')
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => renderElement(element))}
              </Layer>

              {/* Слой столов (верхний) */}
              <Layer ref={layerRef}>
                {elements
                  .filter((el) => el.type === 'table' && !el.isGroup)
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => renderElement(element))}
              </Layer>

              {/* Слой групп */}
              <Layer>
                {elements
                  .filter((el) => el.isGroup)
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => renderElement(element))}
                {/* Временная стена при рисовании */}
                {tempWall && (
                  <Rect
                    x={tempWall.x}
                    y={tempWall.y}
                    width={tempWall.width}
                    height={Math.max(tempWall.height, 20)}
                    fill="#E0E0E0"
                    stroke="#757575"
                    strokeWidth={2}
                    opacity={0.6}
                    cornerRadius={2}
                    listening={false}
                  />
                )}
              </Layer>

              {/* Selection box (прямоугольник выделения) - должен быть поверх всех элементов */}
              {isSelecting && selectionBox && selectionBox.width > 2 && selectionBox.height > 2 && (
                <Layer>
                  <Rect
                    x={selectionBox.x}
                    y={selectionBox.y}
                    width={selectionBox.width}
                    height={selectionBox.height}
                    fill="rgba(255, 107, 1, 0.1)"
                    stroke="#FF6B01"
                    strokeWidth={2}
                    dash={[6, 3]}
                    cornerRadius={4}
                    listening={false}
                    shadowBlur={6}
                    shadowColor="rgba(255, 107, 1, 0.4)"
                    shadowOpacity={0.5}
                  />
                </Layer>
              )}

              {/* Слой трансформера (самый верхний) */}
              <Layer ref={transformerLayerRef}>
                {(selectedId || selectedIds.length > 0) && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                        return oldBox
                      }
                      return newBox
                    }}
                    borderStroke="#FF6B01"
                    borderStrokeWidth={2}
                    anchorFill="#FF6B01"
                    anchorStroke="#fff"
                    anchorSize={8}
                  />
                )}
              </Layer>
            </Stage>
          </Box>
          
          {/* Информационная панель */}
          <Box className="floor-plan-editor__info">
            <Chip
              label={`Масштаб: ${Math.round(scale * 100)}%`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={snapToGrid ? 'Привязка: Вкл' : 'Привязка: Выкл'}
              size="small"
              variant="outlined"
              onClick={() => setSnapToGrid(!snapToGrid)}
              sx={{ cursor: 'pointer' }}
            />
            <Typography variant="body2" color="text.secondary">
              Используйте колесо мыши для масштабирования, зажмите и перетащите для перемещения
            </Typography>
          </Box>
        </Paper>

      </Box>
      </Box>

      {/* Drawer для редактирования свойств */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 360,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Редактирование элемента
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <ClearIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {selectedId && (
            <PropertiesPanel
              element={elements.find((el) => el.id === selectedId) || null}
              onUpdate={handleUpdate}
              onDelete={(id) => {
                handleDelete(id)
                setDrawerOpen(false)
              }}
              onDuplicate={handleDuplicate}
            />
          )}
        </Box>
      </Drawer>

      {/* Контекстное меню */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: 180,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (contextMenu?.elementId) {
              const element = elements.find(el => el.id === contextMenu.elementId)
              if (element?.type === 'table') {
                // Для столов открываем конструктор
                handleEditTableInConstructor(contextMenu.elementId)
              } else {
                // Для других элементов открываем обычный редактор
                handleSelect(contextMenu.elementId)
                setDrawerOpen(true)
              }
              setContextMenu(null)
            }
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu?.elementId) {
              handleDuplicate(contextMenu.elementId)
              setContextMenu(null)
            }
          }}
        >
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Дублировать</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (contextMenu?.elementId) {
              handleDelete(contextMenu.elementId)
              setContextMenu(null)
            }
          }}
          sx={{ color: '#F44336' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#F44336' }} />
          </ListItemIcon>
          <ListItemText>Удалить</ListItemText>
        </MenuItem>
      </Menu>

      {/* Диалог сохранения с полями для клиента и заведения */}
      <Dialog
        open={showJsonDialog}
        onClose={() => setShowJsonDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Сохранение плана</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              fullWidth
              label="Имя клиента"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <TextField
              fullWidth
              label="Название заведения"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <Divider />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              JSON для сохранения на бекенде
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={jsonToSave}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              sx={{
                fontFamily: 'monospace',
                fontSize: '12px',
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '12px',
                },
                '& .MuiInputBase-root': {
                  backgroundColor: '#F5F5F5',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJsonDialog(false)}>Отмена</Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            disabled={saveMutation.isPending || !clientName.trim() || !venueName.trim()}
          >
            {saveMutation.isPending ? 'Сохранение...' : 'Сохранить на бекенде'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модалка конструктора стола */}
      <TableConstructorModal
        open={tableConstructorOpen}
        onClose={() => {
          setTableConstructorOpen(false)
          setEditingTableId(null)
          pendingTablePosition.current = null
        }}
        onSave={handleTableConstructorSave}
        initialConfig={
          editingTableId
            ? (() => {
                const table = elements.find(el => el.id === editingTableId && el.type === 'table')
                if (table) {
                  return {
                    shape: table.tableShape || 'square',
                    width: table.width || 60,
                    height: table.height || 60,
                    radius: table.radius,
                    label: table.label || 'Стол',
                    capacity: table.capacity || 4,
                    rotation: table.rotation || 0,
                    furnitureType: table.furnitureType || 'chair',
                    showFurniture: table.showFurniture !== false,
                    furniturePositions: table.furniturePositions || [],
                  }
                }
                return undefined
              })()
            : undefined
        }
      />
    </Box>
  )
}

export default FloorPlanEditor
