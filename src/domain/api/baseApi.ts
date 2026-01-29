import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

const API_BASE_URL = '/api';

let authToken: string | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const normalizePaginationParams = (params: Record<string, unknown>): Record<string, unknown> => {
  const normalized = { ...params };

  if ('page' in normalized) {
    const page = Number(normalized.page);
    normalized.page = isNaN(page) || page < 1 ? 1 : Math.floor(page);
  }

  if ('pageSize' in normalized && !('limit' in normalized)) {
    const pageSize = Number(normalized.pageSize);
    normalized.pageSize = isNaN(pageSize) ? 30 : Math.min(Math.floor(pageSize), 50);
  }

  if ('limit' in normalized) {
    const limit = Number(normalized.limit);
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const DEFAULT_LIMIT = 30;

    if (isNaN(limit) || limit < MIN_LIMIT) {
      normalized.limit = DEFAULT_LIMIT;
    } else if (limit > MAX_LIMIT) {
      normalized.limit = MAX_LIMIT;
    } else {
      normalized.limit = Math.floor(limit);
    }
  }

  if ('sort' in normalized && !normalized.sort) {
    normalized.sort = 'desc';
  }

  return normalized;
};

const buildQueryString = (params?: Record<string, unknown>): string => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const normalizedParams = normalizePaginationParams(params);

  const queryParams = new URLSearchParams();

  Object.entries(normalizedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.append(key, value.join(','));
        }
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        authToken = null;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
      }

      const data = error.response.data as {
        message?: string;
        error?: string;
      };
      const errorMessage =
        data?.message || data?.error || `HTTP error! status: ${error.response.status}`;

      throw new Error(errorMessage);
    }
    throw error;
  },
);

const api = {
  get: <T, P = Record<string, unknown>>(
    url: string,
    params?: P,
    config?: Parameters<AxiosInstance['get']>[1],
  ) => {
    const queryString = buildQueryString(params as Record<string, unknown> | undefined);
    const fullUrl = `${url}${queryString}`;
    return axiosInstance.get<T>(fullUrl, config).then((res) => res.data);
  },

  post: <T>(url: string, data?: unknown, config?: Parameters<AxiosInstance['post']>[2]) => {
    return axiosInstance.post<T>(url, data, config).then((res) => res.data);
  },

  put: <T>(url: string, data?: unknown, config?: Parameters<AxiosInstance['put']>[2]) => {
    return axiosInstance.put<T>(url, data, config).then((res) => res.data);
  },

  patch: <T>(url: string, data?: unknown, config?: Parameters<AxiosInstance['patch']>[2]) => {
    return axiosInstance.patch<T>(url, data, config).then((res) => res.data);
  },

  delete: <T>(url: string, config?: Parameters<AxiosInstance['delete']>[1]) => {
    return axiosInstance.delete<T>(url, config).then((res) => res.data);
  },
};


export const baseApi = {
  ...api,
  setToken: (token: string | null) => {
    authToken = token;
  },
  getToken: (): string | null => {
    return authToken;
  },
  clearToken: () => {
    authToken = null;
  },
};

