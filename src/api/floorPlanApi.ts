import { venuesApi } from '../domain/api/venues'
import type { FloorPlanData } from '../types/floorPlan'

export const floorPlanApi = {
  save: async (data: FloorPlanData): Promise<{ success: boolean; id?: string }> => {
    const response = await venuesApi.createVenue({ floorPlan: data })
    return { success: true, id: String(response.id) }
  },

  load: async (id: string): Promise<FloorPlanData> => {
    const response = await venuesApi.getVenueById(Number(id))
    return response.floorPlan
  },
}

