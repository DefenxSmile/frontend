import { baseApi } from './baseApi';
import type { SendCodeRequest, VerifyCodeRequest, AuthResponse } from '../../types';

export const authApi = {
  sendCode: async (data: SendCodeRequest): Promise<void> => {
    return baseApi.post<void>('/auth/send-code', data);
  },

  verifyCode: async (data: VerifyCodeRequest): Promise<AuthResponse> => {
    const response = await baseApi.post<AuthResponse>('/auth/verify-code', data);
    if (response.token) {
      baseApi.setToken(response.token);
    }
    return response;
  },

  logout: () => {
    baseApi.clearToken();
  },
};

