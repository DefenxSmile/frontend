import type { FloorPlanData } from '../types/floorPlan'
import { config } from '../config/env'

const API_BASE_URL = config.apiUrl

export const floorPlanApi = {
  save: async (data: FloorPlanData): Promise<{ success: boolean; id?: string }> => {
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
    const response = await fetch(`${API_BASE_URL}/floor-plans/${id}`)

    if (!response.ok) {
      throw new Error('Failed to load floor plan')
    }

    return response.json()
  },
}

