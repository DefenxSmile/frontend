const getEnvVar = (key: string, isCritical = true): string => {
  if (!import.meta.env[key] && isCritical) {
    throw new Error(`Env variable ${key} is required`);
  }

  return import.meta.env[key] || '';
};

export const VITE_IS_DEV = getEnvVar('VITE_IS_DEV', false) === 'true';
export const VITE_API_URL = getEnvVar('VITE_API_URL', false);
