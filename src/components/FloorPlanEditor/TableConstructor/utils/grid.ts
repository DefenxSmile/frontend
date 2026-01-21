import React from 'react'
import { Line, Group } from 'react-konva'
import { PREVIEW_SIZE, GRID_SIZE, GRID_COLORS } from '../constants'

export const generateGridLines = (scale: number): React.ReactElement[] => {
  const gridSize = GRID_SIZE * scale
  const lines: React.ReactElement[] = []

  for (let i = 0; i <= PREVIEW_SIZE; i += gridSize) {
    const isCenterLine = Math.abs(i - PREVIEW_SIZE / 2) < gridSize / 2
    lines.push(
      React.createElement(Line, {
        key: `v-${i}`,
        points: [i, 0, i, PREVIEW_SIZE],
        stroke: isCenterLine ? GRID_COLORS.centerLine : GRID_COLORS.regularLine,
        strokeWidth: isCenterLine ? 1 : 0.5,
        dash: isCenterLine ? [4, 4] : undefined,
        listening: false,
      })
    )
  }

  for (let i = 0; i <= PREVIEW_SIZE; i += gridSize) {
    const isCenterLine = Math.abs(i - PREVIEW_SIZE / 2) < gridSize / 2
    lines.push(
      React.createElement(Line, {
        key: `h-${i}`,
        points: [0, i, PREVIEW_SIZE, i],
        stroke: isCenterLine ? GRID_COLORS.centerLine : GRID_COLORS.regularLine,
        strokeWidth: isCenterLine ? 1 : 0.5,
        dash: isCenterLine ? [4, 4] : undefined,
        listening: false,
      })
    )
  }

  return lines
}

export const generateGridPoints = (scale: number): React.ReactElement[] => {
  const gridSize = GRID_SIZE * scale
  const points: React.ReactElement[] = []

  for (let i = 0; i <= PREVIEW_SIZE; i += gridSize) {
    for (let j = 0; j <= PREVIEW_SIZE; j += gridSize) {
      points.push(
        React.createElement(
          Group,
          { key: `point-${i}-${j}`, listening: false },
          React.createElement(Line, {
            points: [i - 3, j, i + 3, j],
            stroke: GRID_COLORS.point,
            strokeWidth: 0.5,
          }),
          React.createElement(Line, {
            points: [i, j - 3, i, j + 3],
            stroke: GRID_COLORS.point,
            strokeWidth: 0.5,
          })
        )
      )
    }
  }

  return points
}

