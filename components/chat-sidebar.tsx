'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, Settings, MessageCircle, Hash, Users, Loader2, AlertCircle, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IRoom } from '@/types';
import { AddFriendsDialog } from './add-friends-dialog';
import { FriendsListDialog } from './friends-list-dialog';

interface IChatSidebarProps {
  user?: {
    username?: string;
    email?: string;
  };
  rooms: IRoom[];
  isLoadingRooms: boolean;
  roomsError: string;
  selectedRoom: string;
  onRoomSelect: (roomId: string) => void;
  onLogout: () => void;
}

export function ChatSidebar({
  user,
  rooms,
  isLoadingRooms,
  roomsError,
  selectedRoom,
  onRoomSelect,
  onLogout,
}: IChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFriendsOpen, setIsAddFriendsOpen] = useState(false);
  const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoomIcon = (type: IRoom['type']) => {
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
    <aside className="w-80 border-r border-border bg-surface flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">{user?.username}</h3>
            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onLogout}
            className="shrink-0"
          >
            <LogOut />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setIsAddFriendsOpen(true)}
          >
            <UserPlus />
            Add Friends
          </Button>
          <Button 
            variant="outline" 
            size="icon-sm"
            onClick={() => setIsFriendsListOpen(true)}
          >
            <Users />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Settings />
          </Button>
        </div>
      </div>

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
        {isLoadingRooms ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : roomsError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{roomsError}</AlertDescription>
            </Alert>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
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
          ))
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Online</span>
        </div>
      </div>

      <AddFriendsDialog 
        isOpen={isAddFriendsOpen}
        onClose={() => setIsAddFriendsOpen(false)}
      />
      <FriendsListDialog 
        isOpen={isFriendsListOpen}
        onClose={() => setIsFriendsListOpen(false)}
      />
    </aside>
  );
}

