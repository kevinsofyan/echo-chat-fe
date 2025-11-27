import type { IPaginatedResponse } from './http-client.types';

export interface IRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  avatar?: string;
  online?: boolean;
  participants?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type IRoomsResponse = IPaginatedResponse<IRoom>;

