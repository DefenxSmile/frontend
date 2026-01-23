export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  USER: '/user',
} as const


export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]+$/,
} as const

