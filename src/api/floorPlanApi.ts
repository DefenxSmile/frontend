import type { FloorPlanData } from '../types/floorPlan'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const floorPlanApi = {
  save: async (data: FloorPlanData): Promise<{ success: boolean; id?: string }> => {
    // TODO: Заменить на реальный API endpoint
    const response = await fetch(`${API_BASE_URL}/floor-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to save floor plan')
    }

    return response.json()
  },

  load: async (id: string): Promise<FloorPlanData> => {
    // TODO: Заменить на реальный API endpoint
    const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`)

    if (!response.ok) {
      throw new Error('Failed to load floor plan')
    }

    return response.json()
  },
}

