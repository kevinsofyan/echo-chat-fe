import { httpClient } from '@/lib/http-client';
import type { IFriend, FriendshipStatus, FriendRequestAction, FriendBlockAction } from '@/types';
import type { IPaginatedResponse } from '@/types/http-client.types';

export const friendsApi = {
  getAll: (params?: { 
    offset?: number; 
    limit?: number; 
    status?: FriendshipStatus;
  }) =>
    httpClient<IPaginatedResponse<IFriend>>('/friends', {
      method: 'GET',
      params,
    }),

  manageRequest: (id: string, action: FriendRequestAction) =>
    httpClient<IFriend>(`/friends/request/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }),

  manageBlock: (userId: string, action: FriendBlockAction) =>
    httpClient<IFriend>(`/friends/block/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }),
};

