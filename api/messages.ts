import { httpClient } from '@/lib/http-client';
import type { IPaginatedResponse } from '@/types/http-client.types';
import type { IMessage } from '@/types/messages.type';

type IMessagesResponse = IPaginatedResponse<IMessage>;

interface IGetMessagesParams {
  limit?: number;
  offset?: number;
}

export const messagesApi = {
  getRoomMessages: (
    roomId: string,
    params: IGetMessagesParams = { limit: 50, offset: 0 }
  ) => {
    const queryParams = new URLSearchParams({
      limit: params.limit?.toString() || '50',
      offset: params.offset?.toString() || '0',
    });

    return httpClient<IMessagesResponse>(
      `/rooms/${roomId}/messages?${queryParams.toString()}`,
      {
        method: 'GET',
      }
    );
  },
};

export type { IMessagesResponse };

