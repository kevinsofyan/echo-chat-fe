import { httpClient } from '@/lib/http-client';
import type { IUser } from '@/types';
import type { IApiResponse, IPaginatedResponse } from '@/types/http-client.types';

export const usersApi = {
  getMe: () =>
    httpClient<IApiResponse<IUser>>('/users/me', {
      method: 'GET',
    }),

  getAll: (params?: { offset?: number; limit?: number; email?: string }) =>
    httpClient<IPaginatedResponse<IUser>>('/users', {
      method: 'GET',
      params,
    }),

  getById: (id: string) =>
    httpClient<IApiResponse<IUser>>(`/users/${id}`, {
      method: 'GET',
    }),
};
