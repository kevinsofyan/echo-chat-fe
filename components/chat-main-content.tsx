'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, MessageCircle, WifiOff, Loader2 } from 'lucide-react';
import type { IRoom } from '@/types';
import { useChatSocket } from '@/lib/websocket/chat-socket';
import { messagesApi } from '@/api/messages';
import { useUserStore } from '@/store/user.store';
import type { IMessage } from '@/types/messages.type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface IChatMainContentProps {
  currentRoom?: IRoom;
  token: string;
}

const messagesCache = new Map<string, IMessage[]>();
const fetchedRooms = new Set<string>();

function useRoomMessages(roomId: string) {
  const [messages, setMessagesState] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!roomId) {
      setMessagesState([]);
      return;
    }

    if (messagesCache.has(roomId)) {
      setMessagesState(messagesCache.get(roomId) || []);
      return;
    }

    if (fetchedRooms.has(roomId)) {
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
        fetchedRooms.add(roomId);
        setMessagesState(messages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  const addMessage = useCallback((newMessage: IMessage) => {
    setMessagesState((prev) => {
      const updated = [...prev, newMessage];
      if (roomId) {
        messagesCache.set(roomId, updated);
      }
      return updated;
    });
  }, [roomId]);

  return { messages, isLoading, error, addMessage };
}

export function ChatMainContent({ currentRoom, token }: IChatMainContentProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();

  const { messages, isLoading: isLoadingMessages, error: messagesError, addMessage } = useRoomMessages(
    currentRoom?.id || ''
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { isConnected, sendMessage: sendWebSocketMessage } = useChatSocket({
    roomId: currentRoom?.id || '',
    userId: user?.id,
    token,
    onMessage: addMessage,
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !isConnected) return;
   
    const success = sendWebSocketMessage(message);
  
    if (success) {
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentRoom) {
    return (
      <main className="flex-1 flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-semibold mb-2">Welcome to Echo Chat</p>
          <p className="text-sm">Select a conversation to start chatting</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
              {currentRoom.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-text-primary flex items-center gap-2">
                {currentRoom.name}
                {!isConnected && (
                  <span title="Disconnected">
                    <WifiOff className="w-4 h-4 text-red-500" />
                  </span>
                )}
              </h2>
              <p className="text-xs text-text-secondary">
                {isConnected ? (currentRoom.online ? 'Online' : 'Offline') : 'Connecting...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm">
              <Phone />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Video />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : messagesError ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p className="text-sm">{messagesError}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                
                <div
                  className={`max-w-[70%] ${
                    msg.sender_id === user?.id
                      ? 'bg-primary-200 text-white'
                      : 'bg-slate-800 text-text-primary'
                  } rounded-lg px-4 py-2`}
                >
                  {msg.sender_id !== user?.id && msg.sender?.full_name && (
                    <p className="text-xs font-semibold mb-1 text-primary-500">
                      {msg.sender.full_name}
                    </p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender_id === user?.id ? 'text-white/70' : 'text-text-tertiary'
                    }`}
                  >
                    {dayjs(msg.created_at).fromNow()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Smile />
            </Button>
          </div>
          <Button onClick={handleSend} className="shrink-0" disabled={!isConnected}>
            <Send />
            Send
          </Button>
        </div>
      </div>
    </main>
  );
}
