import { useState, useEffect, useCallback, useRef } from 'react';
import { messagesApi } from '@/api/messages';
import { IMessage } from '@/types/messages.type';

interface UseMessagesOptions {
  roomId: string;
  userId?: string;
  enabled?: boolean;
}

interface UseMessagesReturn {
  messages: IMessage[];
  isLoading: boolean;
  error: string;
  addMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
}

const messagesCache = new Map<string, IMessage[]>();

export function useMessages({ roomId, userId, enabled = true }: UseMessagesOptions): UseMessagesReturn {
  const [messages, setMessagesState] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fetchedRooms = useRef(new Set<string>());

  useEffect(() => {
    if (!roomId || !enabled) {
      setMessagesState([]);
      return;
    }

    if (messagesCache.has(roomId)) {
      setMessagesState(messagesCache.get(roomId) || []);
      return;
    }

    if (fetchedRooms.current.has(roomId)) {
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await messagesApi.getRoomMessages(roomId, {
          limit: 50,
          offset: 0,
        });
        
        const messages = response.data;
        messagesCache.set(roomId, messages);
        fetchedRooms.current.add(roomId);
        setMessagesState(messages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId, enabled]);

  const addMessage = useCallback((newMessage: IMessage) => {
    setMessagesState((prev) => {
      const updated = [...prev, newMessage];
      if (roomId) {
        messagesCache.set(roomId, updated);
      }
      return updated;
    });
  }, [roomId]);

  const setMessages = useCallback((newMessages: IMessage[]) => {
    setMessagesState(newMessages);
    if (roomId) {
      messagesCache.set(roomId, newMessages);
    }
  }, [roomId]);

  return {
    messages,
    isLoading,
    error,
    addMessage,
    setMessages,
  };
}