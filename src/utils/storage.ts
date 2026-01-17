// Утилиты для работы с localStorage (временное решение до подключения бекенда)

const STORAGE_KEY_CLIENTS = 'restoreserve_clients'
const STORAGE_KEY_FLOOR_PLANS = 'restoreserve_floor_plans'

export interface StoredClient {
  id: string
  name: string
  venueName: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
  hasFloorPlan: boolean
  floorPlanId?: string
}

export interface StoredFloorPlan {
  id: string
  clientId: string
  data: any // FloorPlanData
  createdAt: string
  updatedAt: string
}

// Клиенты
export const getClients = (): StoredClient[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CLIENTS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveClient = (client: StoredClient): void => {
  const clients = getClients()
  const existingIndex = clients.findIndex((c) => c.id === client.id)
  
  if (existingIndex >= 0) {
    clients[existingIndex] = { ...client, updatedAt: new Date().toISOString() }
  } else {
    clients.push(client)
  }
  
  localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients))
}

export const getClient = (id: string): StoredClient | null => {
  const clients = getClients()
  return clients.find((c) => c.id === id) || null
}

export const deleteClient = (id: string): void => {
  const clients = getClients()
  const filtered = clients.filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(filtered))
}

// Планы этажей
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

export const saveFloorPlan = (plan: StoredFloorPlan): void => {
  const plans = getFloorPlans()
  const existingIndex = plans.findIndex((p) => p.id === plan.id)
  
  if (existingIndex >= 0) {
    plans[existingIndex] = { ...plan, updatedAt: new Date().toISOString() }
  } else {
    plans.push(plan)
  }
  
  localStorage.setItem(STORAGE_KEY_FLOOR_PLANS, JSON.stringify(plans))
  
  // Обновляем флаг hasFloorPlan у клиента
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

// Инициализация моковых данных
export const initializeMockData = (): void => {
  const clients = getClients()
  if (clients.length === 0) {
    const mockClients: StoredClient[] = [
      {
        id: 'client-1',
        name: 'Иван Петров',
        venueName: 'Ресторан "Уютный"',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasFloorPlan: false,
      },
      {
        id: 'client-2',
        name: 'Мария Сидорова',
        venueName: 'Кафе "Кофе и Книги"',
        email: 'maria@example.com',
        phone: '+7 (999) 234-56-78',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasFloorPlan: true,
        floorPlanId: 'plan-2',
      },
      {
        id: 'client-3',
        name: 'Алексей Смирнов',
        venueName: 'Бар "Вечерний"',
        email: 'alex@example.com',
        phone: '+7 (999) 345-67-89',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasFloorPlan: false,
      },
    ]
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(mockClients))
  }
}

