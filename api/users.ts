import { httpClient } from '@/lib/http-client';
import type { IUser } from '@/types';
import type { IApiResponse } from '@/types/http-client.types';

export const usersApi = {
  getMe: () =>
    httpClient<IApiResponse<IUser>>('/users/me', {
      method: 'GET',
    }),

  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    httpClient<{ users: IUser[]; total: number }>('/users', {
      method: 'GET',
      params,
    }),

  getById: (id: string) =>
    httpClient<IApiResponse<IUser>>(`/users/${id}`, {
      method: 'GET',
    }),
};
