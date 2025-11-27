import { httpClient } from '@/lib/http-client';
import type { IRoom } from '@/types';
import type { IApiResponse } from '@/types/http-client.types';

export const roomsApi = {
  getMyRooms: () =>
    httpClient<IApiResponse<IRoom[]>>('/rooms/my', {
      method: 'GET',
    }),

  getRoomById: (roomId: string) =>
    httpClient<IApiResponse<IRoom>>(`/rooms/${roomId}`, {
      method: 'GET',
    }),

  createRoom: (data: { name: string; type: string; participants?: string[] }) =>
    httpClient<IApiResponse<IRoom>>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

