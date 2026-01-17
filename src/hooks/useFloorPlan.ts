import { useMutation, useQueryClient } from '@tanstack/react-query'
import { floorPlanApi } from '../api/floorPlanApi'
import type { FloorPlanData } from '../types/floorPlan'

export const useSaveFloorPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FloorPlanData) => floorPlanApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floorPlans'] })
    },
  })
}

