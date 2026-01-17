export interface Client {
  id: string
  name: string
  venueName: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
  hasFloorPlan: boolean
}

export interface ClientWithPlan extends Client {
  floorPlanId?: string
}

