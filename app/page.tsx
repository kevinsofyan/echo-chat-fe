'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { roomsApi } from '@/api/rooms';
import type { IRoom } from '@/types';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatMainContent } from '@/components/chat-main-content';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearAuth, token } = useAuthStore();
  const { user, clearUser } = useUserStore();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  const fetchRooms = useCallback(async () => {
    setIsLoadingRooms(true);
    setRoomsError('');
    
    try {
      const response = await roomsApi.getMyRooms();
      setRooms(response.data);
      const roomParam = searchParams.get('room');
      if (roomParam) {
        setSelectedRoom(roomParam);
      } else if (response.data.length > 0 && !selectedRoom) {
        setSelectedRoom(response.data[0].id);
      }
    } catch (error) {
      setRoomsError(error instanceof Error ? error.message : 'Failed to load rooms');
    } finally {
      setIsLoadingRooms(false);
    }
  }, [searchParams, selectedRoom]);
 
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleLogout = async () => {
    clearAuth();
    clearUser();
    router.push('/login');
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    router.push(`/?room=${roomId}`);
  };

  const currentRoom = rooms.find((room) => room.id === selectedRoom);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar
        user={user ?? { username: '', email: '' }}
        rooms={rooms}
        isLoadingRooms={isLoadingRooms}
        roomsError={roomsError}
        selectedRoom={selectedRoom}
        onRoomSelect={handleRoomSelect}
        onLogout={handleLogout}
      />
      <ChatMainContent currentRoom={currentRoom} token={token || ''} />
    </div>
  );
}

