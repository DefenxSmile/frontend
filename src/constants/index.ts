export const STORAGE_KEYS = {
  CLIENTS: 'restoreserve_clients',
  FLOOR_PLANS: 'restoreserve_floor_plans',
} as const

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_EDITOR: (clientId: string) => `/admin/editor/${clientId}`,
  ADMIN_VIEWER: (clientId: string) => `/admin/viewer/${clientId}`,
  USER: '/user',
} as const

export const DEFAULTS = {
  CLIENT: {
    NAME: '',
    VENUE_NAME: '',
  },
  FLOOR_PLAN: {
    STAGE_WIDTH: 2000,
    STAGE_HEIGHT: 1500,
    SCALE: 1,
  },
} as const

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
} as const

