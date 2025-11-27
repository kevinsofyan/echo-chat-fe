'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { useRouter } from 'next/navigation';
import { roomsApi } from '@/api/rooms';
import type { IRoom } from '@/types';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatMainContent } from '@/components/chat-main-content';

export default function Home() {
  const router = useRouter();
  const { clearAuth, token } = useAuthStore();
  const { user, clearUser } = useUserStore();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsError, setRoomsError] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
 
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoadingRooms(true);
      setRoomsError('');
      
      try {
        const response = await roomsApi.getMyRooms();
        setRooms(response.data);
        if (response.data.length > 0 && !selectedRoom) {
          setSelectedRoom(response.data[0].id);
        }
      } catch (error) {
        setRoomsError(error instanceof Error ? error.message : 'Failed to load rooms');
      } finally {
        setIsLoadingRooms(false);
      }
    };
    
    fetchRooms();
  }, []);

  const handleLogout = async () => {
    clearAuth();
    clearUser();
    router.push('/login');
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
        onRoomSelect={setSelectedRoom}
        onLogout={handleLogout}
      />
      <ChatMainContent currentRoom={currentRoom} token={token || ''} />
    </div>
  );
}

