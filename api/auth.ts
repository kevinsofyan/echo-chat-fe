import { httpClient } from '@/lib/http-client';
import type { ILoginRequest, ILoginResponse, IRegisterRequest } from '@/types';
import type { IApiResponse, IUser } from '@/types';

export const authApi = {
  login: (data: ILoginRequest) =>
    httpClient<ILoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: IRegisterRequest) =>
    httpClient<ILoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    httpClient('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    httpClient<IApiResponse<IUser>>('/auth/me', {
      method: 'GET',
    }),
};

