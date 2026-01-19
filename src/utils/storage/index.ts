// Централизованный экспорт всех утилит для работы с localStorage

export * from './clients'
export * from './floorPlans'

// Реэкспорт типов для обратной совместимости
export type { StoredClient } from './clients'
export type { StoredFloorPlan } from './floorPlans'

