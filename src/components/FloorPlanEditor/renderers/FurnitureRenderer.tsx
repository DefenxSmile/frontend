import { Group, Rect, Circle, Line } from 'react-konva'

interface FurnitureRendererProps {
  x: number
  y: number
  rotation: number
  furnitureType: 'chair' | 'sofa' | 'armchair' | undefined
  shape: 'straight' | 'curved' | 'l-shaped' | 'l-shaped-reverse' | 'round' | undefined
  scale?: number
}

/**
 * Рендерер для детальной визуализации мебели
 */
export const FurnitureRenderer = ({
  x,
  y,
  rotation,
  furnitureType = 'chair',
  shape = 'straight',
  scale = 1,
}: FurnitureRendererProps) => {
  const furnitureTypeValue = furnitureType || 'chair'
  const shapeValue = shape || 'straight'

  if (furnitureTypeValue === 'sofa') {
    return <SofaRenderer x={x} y={y} rotation={rotation} shape={shapeValue} scale={scale} />
  }

  if (furnitureTypeValue === 'armchair') {
    return <ArmchairRenderer x={x} y={y} rotation={rotation} shape={shapeValue} scale={scale} />
  }

  return <ChairRenderer x={x} y={y} rotation={rotation} shape={shapeValue} scale={scale} />
}

// Диван рендерер
const SofaRenderer = ({
  x,
  y,
  rotation,
  shape,
  scale,
}: {
  x: number
  y: number
  rotation: number
  shape: string
  scale: number
}) => {
  const sofaWidth = 28 * scale
  const sofaHeight = 14 * scale
  const sofaDepth = 3 * scale

  if (shape === 'l-shaped') {
    return (
      <Group x={x} y={y} rotation={rotation} listening={false}>
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2}
          width={sofaWidth}
          height={sofaHeight}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth={1.5 * scale}
          cornerRadius={3 * scale}
          shadowBlur={4 * scale}
          shadowColor="rgba(0, 0, 0, 0.25)"
        />
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2 - sofaDepth}
          width={sofaWidth}
          height={sofaDepth}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={2 * scale}
        />
        <Rect
          x={sofaWidth / 2 - 2 * scale}
          y={-sofaHeight / 2}
          width={sofaHeight + 2 * scale}
          height={sofaHeight}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth={1.5 * scale}
          cornerRadius={3 * scale}
          shadowBlur={4 * scale}
          shadowColor="rgba(0, 0, 0, 0.25)"
        />
        <Rect
          x={sofaWidth / 2 - 2 * scale}
          y={-sofaHeight / 2 - sofaDepth}
          width={sofaHeight + 2 * scale}
          height={sofaDepth}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={2 * scale}
        />
        <Rect
          x={sofaWidth / 2 + sofaHeight - 2 * scale}
          y={-sofaHeight / 2}
          width={sofaDepth}
          height={sofaHeight}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={1 * scale}
        />
        <Line
          points={[-sofaWidth / 4, -sofaHeight / 2, -sofaWidth / 4, sofaHeight / 2]}
          stroke="#66BB6A"
          strokeWidth={1 * scale}
          dash={[2, 2]}
        />
        <Line
          points={[sofaWidth / 4, -sofaHeight / 2, sofaWidth / 4, sofaHeight / 2]}
          stroke="#66BB6A"
          strokeWidth={1 * scale}
          dash={[2, 2]}
        />
      </Group>
    )
  }

  if (shape === 'l-shaped-reverse') {
    return (
      <Group x={x} y={y} rotation={rotation} listening={false}>
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2}
          width={sofaWidth}
          height={sofaHeight}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth={1.5 * scale}
          cornerRadius={3 * scale}
          shadowBlur={4 * scale}
          shadowColor="rgba(0, 0, 0, 0.25)"
        />
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2 - sofaDepth}
          width={sofaWidth}
          height={sofaDepth}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={2 * scale}
        />
        <Rect
          x={-sofaWidth / 2 - sofaHeight}
          y={-sofaHeight / 2}
          width={sofaHeight}
          height={sofaHeight}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth={1.5 * scale}
          cornerRadius={3 * scale}
          shadowBlur={4 * scale}
          shadowColor="rgba(0, 0, 0, 0.25)"
        />
        <Rect
          x={-sofaWidth / 2 - sofaHeight}
          y={-sofaHeight / 2 - sofaDepth}
          width={sofaHeight}
          height={sofaDepth}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={2 * scale}
        />
        <Rect
          x={-sofaWidth / 2 - sofaHeight - sofaDepth}
          y={-sofaHeight / 2}
          width={sofaDepth}
          height={sofaHeight}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={1 * scale}
        />
        <Line
          points={[-sofaWidth / 4, -sofaHeight / 2, -sofaWidth / 4, sofaHeight / 2]}
          stroke="#66BB6A"
          strokeWidth={1 * scale}
          dash={[2, 2]}
        />
      </Group>
    )
  }

  if (shape === 'curved') {
    return (
      <Group x={x} y={y} rotation={rotation} listening={false}>
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2}
          width={sofaWidth}
          height={sofaHeight}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth={1.5 * scale}
          cornerRadius={sofaHeight / 2}
          shadowBlur={4 * scale}
          shadowColor="rgba(0, 0, 0, 0.25)"
        />
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2 - sofaDepth}
          width={sofaWidth}
          height={sofaDepth}
          fill="#2E7D32"
          stroke="#1B5E20"
          strokeWidth={1 * scale}
          cornerRadius={sofaDepth / 2}
        />
        <Line
          points={[-sofaWidth / 3, -sofaHeight / 2, -sofaWidth / 3, sofaHeight / 2]}
          stroke="#66BB6A"
          strokeWidth={1 * scale}
          dash={[2, 2]}
        />
        <Line
          points={[sofaWidth / 3, -sofaHeight / 2, sofaWidth / 3, sofaHeight / 2]}
          stroke="#66BB6A"
          strokeWidth={1 * scale}
          dash={[2, 2]}
        />
      </Group>
    )
  }

  // Прямой диван
  return (
    <Group x={x} y={y} rotation={rotation} listening={false}>
      <Rect
        x={-sofaWidth / 2}
        y={-sofaHeight / 2}
        width={sofaWidth}
        height={sofaHeight}
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth={1.5 * scale}
        cornerRadius={3 * scale}
        shadowBlur={4 * scale}
        shadowColor="rgba(0, 0, 0, 0.25)"
      />
      <Rect
        x={-sofaWidth / 2}
        y={-sofaHeight / 2 - sofaDepth}
        width={sofaWidth}
        height={sofaDepth}
        fill="#2E7D32"
        stroke="#1B5E20"
        strokeWidth={1 * scale}
        cornerRadius={2 * scale}
      />
      <Rect
        x={-sofaWidth / 2 - sofaDepth}
        y={-sofaHeight / 2}
        width={sofaDepth}
        height={sofaHeight}
        fill="#2E7D32"
        stroke="#1B5E20"
        strokeWidth={1 * scale}
        cornerRadius={1 * scale}
      />
      <Rect
        x={sofaWidth / 2}
        y={-sofaHeight / 2}
        width={sofaDepth}
        height={sofaHeight}
        fill="#2E7D32"
        stroke="#1B5E20"
        strokeWidth={1 * scale}
        cornerRadius={1 * scale}
      />
      <Line
        points={[-sofaWidth / 3, -sofaHeight / 2, -sofaWidth / 3, sofaHeight / 2]}
        stroke="#66BB6A"
        strokeWidth={1 * scale}
        dash={[2, 2]}
      />
      <Line
        points={[sofaWidth / 3, -sofaHeight / 2, sofaWidth / 3, sofaHeight / 2]}
        stroke="#66BB6A"
        strokeWidth={1 * scale}
        dash={[2, 2]}
      />
    </Group>
  )
}

// Кресло рендерер
const ArmchairRenderer = ({
  x,
  y,
  rotation,
  shape,
  scale,
}: {
  x: number
  y: number
  rotation: number
  shape: string
  scale: number
}) => {
  const chairWidth = 12 * scale
  const chairHeight = 12 * scale
  const chairDepth = 2 * scale

  if (shape === 'curved') {
    return (
      <Group x={x} y={y} rotation={rotation} listening={false}>
        <Rect
          x={-chairWidth / 2}
          y={-chairHeight / 2}
          width={chairWidth}
          height={chairHeight}
          fill="#FF9800"
          stroke="#F57C00"
          strokeWidth={1.5 * scale}
          cornerRadius={chairHeight / 2}
          shadowBlur={3 * scale}
          shadowColor="rgba(0, 0, 0, 0.3)"
        />
        <Rect
          x={-chairWidth / 2}
          y={-chairHeight / 2 - chairDepth * 2}
          width={chairWidth}
          height={chairDepth * 2}
          fill="#F57C00"
          stroke="#E65100"
          strokeWidth={1 * scale}
          cornerRadius={chairDepth}
        />
        <Rect
          x={-chairWidth / 2 - chairDepth}
          y={-chairHeight / 2}
          width={chairDepth}
          height={chairHeight}
          fill="#F57C00"
          stroke="#E65100"
          strokeWidth={1 * scale}
          cornerRadius={1 * scale}
        />
        <Rect
          x={chairWidth / 2}
          y={-chairHeight / 2}
          width={chairDepth}
          height={chairHeight}
          fill="#F57C00"
          stroke="#E65100"
          strokeWidth={1 * scale}
          cornerRadius={1 * scale}
        />
      </Group>
    )
  }

  return (
    <Group x={x} y={y} rotation={rotation} listening={false}>
      <Rect
        x={-chairWidth / 2}
        y={-chairHeight / 2}
        width={chairWidth}
        height={chairHeight}
        fill="#FF9800"
        stroke="#F57C00"
        strokeWidth={1.5 * scale}
        cornerRadius={2 * scale}
        shadowBlur={3 * scale}
        shadowColor="rgba(0, 0, 0, 0.3)"
      />
      <Rect
        x={-chairWidth / 2}
        y={-chairHeight / 2 - chairDepth * 2.5}
        width={chairWidth}
        height={chairDepth * 2.5}
        fill="#F57C00"
        stroke="#E65100"
        strokeWidth={1 * scale}
        cornerRadius={2 * scale}
      />
      <Rect
        x={-chairWidth / 2 - chairDepth}
        y={-chairHeight / 2}
        width={chairDepth}
        height={chairHeight}
        fill="#F57C00"
        stroke="#E65100"
        strokeWidth={1 * scale}
        cornerRadius={1 * scale}
      />
      <Rect
        x={chairWidth / 2}
        y={-chairHeight / 2}
        width={chairDepth}
        height={chairHeight}
        fill="#F57C00"
        stroke="#E65100"
        strokeWidth={1 * scale}
        cornerRadius={1 * scale}
      />
      <Rect
        x={-chairWidth / 2 + 1 * scale}
        y={-chairHeight / 2 + 1 * scale}
        width={chairWidth - 2 * scale}
        height={chairHeight - 2 * scale}
        fill="rgba(255, 255, 255, 0.1)"
        cornerRadius={1 * scale}
      />
    </Group>
  )
}

// Стул рендерер
const ChairRenderer = ({
  x,
  y,
  rotation,
  shape,
  scale,
}: {
  x: number
  y: number
  rotation: number
  shape: string
  scale: number
}) => {
  const chairWidth = 10 * scale
  const chairHeight = 10 * scale
  const chairBackHeight = 6 * scale

  if (shape === 'round') {
    return (
      <Group x={x} y={y} rotation={rotation} listening={false}>
        <Circle
          x={0}
          y={0}
          radius={chairWidth / 2}
          fill="#4CAF50"
          stroke="#2E7D32"
          strokeWidth={1.5 * scale}
          shadowBlur={3 * scale}
          shadowColor="rgba(46, 125, 50, 0.4)"
        />
        <Circle x={0} y={0} radius={chairWidth / 2 - 2 * scale} fill="#66BB6A" />
        <Circle x={-chairWidth / 3} y={chairWidth / 3} radius={1 * scale} fill="#2E7D32" />
        <Circle x={chairWidth / 3} y={chairWidth / 3} radius={1 * scale} fill="#2E7D32" />
        <Circle x={-chairWidth / 3} y={-chairWidth / 3} radius={1 * scale} fill="#2E7D32" />
        <Circle x={chairWidth / 3} y={-chairWidth / 3} radius={1 * scale} fill="#2E7D32" />
      </Group>
    )
  }

  return (
    <Group x={x} y={y} rotation={rotation} listening={false}>
      <Rect
        x={-chairWidth / 2}
        y={-chairHeight / 2}
        width={chairWidth}
        height={chairHeight}
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth={1.5 * scale}
        cornerRadius={2 * scale}
        shadowBlur={3 * scale}
        shadowColor="rgba(46, 125, 50, 0.4)"
      />
      <Rect
        x={-chairWidth / 2 + 1 * scale}
        y={-chairHeight / 2 + 1 * scale}
        width={chairWidth - 2 * scale}
        height={chairHeight - 2 * scale}
        fill="#66BB6A"
        cornerRadius={1 * scale}
      />
      <Rect
        x={-chairWidth / 2 + 2 * scale}
        y={-chairHeight / 2 - chairBackHeight}
        width={chairWidth - 4 * scale}
        height={chairBackHeight}
        fill="#2E7D32"
        stroke="#1B5E20"
        strokeWidth={1 * scale}
        cornerRadius={2 * scale}
      />
      <Rect x={-chairWidth / 2 - 1 * scale} y={chairHeight / 2 - 2 * scale} width={2 * scale} height={2 * scale} fill="#2E7D32" />
      <Rect x={chairWidth / 2 - 1 * scale} y={chairHeight / 2 - 2 * scale} width={2 * scale} height={2 * scale} fill="#2E7D32" />
      <Rect x={-chairWidth / 2 - 1 * scale} y={-chairHeight / 2} width={2 * scale} height={2 * scale} fill="#2E7D32" />
      <Rect x={chairWidth / 2 - 1 * scale} y={-chairHeight / 2} width={2 * scale} height={2 * scale} fill="#2E7D32" />
    </Group>
  )
}

