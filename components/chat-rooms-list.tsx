'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Users, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface IChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  avatar?: string;
  online?: boolean;
}

const mockRooms: IChatRoom[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'direct',
    lastMessage: 'Hey, how are you?',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Project Team',
    type: 'group',
    lastMessage: 'Meeting at 3 PM',
    lastMessageTime: '1h ago',
    unreadCount: 5,
  },
  {
    id: '3',
    name: 'general',
    type: 'channel',
    lastMessage: 'Welcome everyone!',
    lastMessageTime: '2h ago',
  },
  {
    id: '4',
    name: 'Sarah Smith',
    type: 'direct',
    lastMessage: 'Thanks for the help!',
    lastMessageTime: '1d ago',
    online: true,
  },
  {
    id: '5',
    name: 'Design Team',
    type: 'group',
    lastMessage: 'New mockups ready',
    lastMessageTime: '2d ago',
  },
];

export function ChatRoomsList() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = mockRooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoomIcon = (type: IChatRoom['type']) => {
    switch (type) {
      case 'channel':
        return <Hash className="w-4 h-4" />;
      case 'group':
        return <Users className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <Input
          type="search"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room.id)}
            className={cn(
              'w-full p-4 flex items-start gap-3 hover:bg-surface-secondary transition-colors border-l-2',
              selectedRoom === room.id
                ? 'bg-surface-secondary border-primary-500'
                : 'border-transparent'
            )}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                {getRoomIcon(room.type)}
              </div>
              {room.online && room.type === 'direct' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface"></div>
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-text-primary truncate">
                  {room.name}
                </h4>
                {room.lastMessageTime && (
                  <span className="text-xs text-text-tertiary shrink-0 ml-2">
                    {room.lastMessageTime}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary truncate">
                  {room.lastMessage || 'No messages yet'}
                </p>
                {room.unreadCount && room.unreadCount > 0 && (
                  <span className="shrink-0 ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

