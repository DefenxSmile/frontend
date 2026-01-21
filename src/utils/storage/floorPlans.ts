// Утилиты для работы с планами этажей в localStorage

import { getClient, saveClient } from './clients'
import type { FloorPlanData } from '../../types/floorPlan'

const STORAGE_KEY_FLOOR_PLANS = 'restoreserve_floor_plans'

export interface StoredFloorPlan {
  id: string
  clientId: string
  data: FloorPlanData
  createdAt: string
  updatedAt: string
}

export const getFloorPlans = (): StoredFloorPlan[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_FLOOR_PLANS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const getFloorPlanByClientId = (clientId: string): StoredFloorPlan | null => {
  const plans = getFloorPlans()
  return plans.find((p) => p.clientId === clientId) || null
}

export const getFloorPlan = (id: string): StoredFloorPlan | null => {
  const plans = getFloorPlans()
  return plans.find((p) => p.id === id) || null
}

export const saveFloorPlan = (plan: StoredFloorPlan): void => {
  const plans = getFloorPlans()
  const existingIndex = plans.findIndex((p) => p.id === plan.id)
  
  if (existingIndex >= 0) {
    plans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() }
  } else {
    plans.push(plan)
  }
  
  localStorage.setItem(STORAGE_KEY_FLOOR_PLANS, JSON.stringify(plans))
  
  const client = getClient(plan.clientId)
  if (client) {
    saveClient({
      ...client,
      hasFloorPlan: true,
      floorPlanId: plan.id,
      updatedAt: new Date().toISOString(),
    })
  }
}

export const deleteFloorPlan = (id: string): void => {
  const plans = getFloorPlans()
  const filtered = plans.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY_FLOOR_PLANS, JSON.stringify(filtered))
}

export const deleteFloorPlanByClientId = (clientId: string): void => {
  const plans = getFloorPlans()
  const filtered = plans.filter((p) => p.clientId !== clientId)
  localStorage.setItem(STORAGE_KEY_FLOOR_PLANS, JSON.stringify(filtered))
}

