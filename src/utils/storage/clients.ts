// Утилиты для работы с клиентами в localStorage

const STORAGE_KEY_CLIENTS = 'restoreserve_clients'

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

