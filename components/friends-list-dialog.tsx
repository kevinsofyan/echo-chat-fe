'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Loader2, Users as UsersIcon, UserCheck, Clock, Shield, Send } from 'lucide-react';
import { friendsApi } from '@/api/friends';
import { roomsApi } from '@/api/rooms';
import type { IFriend, FriendshipStatus } from '@/types';

interface FriendsListDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = 'accepted' | 'pending' | 'sent' | 'blocked';

type LoadingState = {
  type: 'accept' | 'reject' | 'block' | 'unblock' | 'message';
  id: string;
} | null;

const FILTER_OPTIONS: { 
  value: FilterType; 
  label: string; 
  icon: typeof UserCheck; 
  status?: FriendshipStatus;
}[] = [
  { value: 'accepted', label: 'All Friends', icon: UserCheck, status: 'accepted' },
  { value: 'pending', label: 'Pending Approval', icon: Clock, status: 'pending' },
  { value: 'sent', label: 'Sent Requests', icon: Send, status: 'pending' },
  { value: 'blocked', label: 'Blocked', icon: Shield, status: 'blocked' },
];

export function FriendsListDialog({ isOpen, onClose }: FriendsListDialogProps) {
  const router = useRouter();
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('accepted');
  const [actionLoading, setActionLoading] = useState<LoadingState>(null);

  const handleMessage = async (userId: string, friendshipId: string) => {
    setActionLoading({ type: 'message', id: friendshipId });
    try {
      const response = await roomsApi.createDirectRoom(userId);
      onClose();
      router.push(`/?room=${response.data.id}`);
    } catch (error) {
      console.error('Failed to create direct room:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    setActionLoading({ type: 'accept', id: friendshipId });
    try {
      await friendsApi.manageRequest(friendshipId, 'accept');
      setFriends(prev => prev.map(f => 
        f.friendship_id === friendshipId ? { ...f, status: 'accepted' as FriendshipStatus } : f
      ));
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    setActionLoading({ type: 'reject', id: friendshipId });
    try {
      await friendsApi.manageRequest(friendshipId, 'reject');
      setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId));
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockUser = async (userId: string, friendshipId: string) => {
    setActionLoading({ type: 'block', id: friendshipId });
    try {
      await friendsApi.manageBlock(userId, 'block');
      setFriends(prev => prev.map(f => 
        f.friendship_id === friendshipId ? { ...f, status: 'blocked' as FriendshipStatus } : f
      ));
    } catch (error) {
      console.error('Failed to block user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId: string, friendshipId: string) => {
    setActionLoading({ type: 'unblock', id: friendshipId });
    try {
      await friendsApi.manageBlock(userId, 'unblock');
      setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId));
    } catch (error) {
      console.error('Failed to unblock user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const fetchFriends = async (filter: FilterType) => {
    setIsLoading(true);
    try {
      const filterOption = FILTER_OPTIONS.find(f => f.value === filter);
      const response = await friendsApi.getAll({
        limit: 100,
        offset: 0,
        status: filterOption?.status,
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriends(activeFilter);
    }
  }, [isOpen, activeFilter]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const getStatusBadge = (status: FriendshipStatus, isSent: boolean) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-500">
            Friends
          </span>
        );
      case 'pending':
        return (
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            isSent 
              ? 'bg-blue-500/10 text-blue-500' 
              : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {isSent ? 'Request Sent' : 'Needs Approval'}
          </span>
        );
      case 'blocked':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-500">
            Blocked
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-surface rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-text-primary">Friends</h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
          {FILTER_OPTIONS.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange(filter.value)}
                className="whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </Button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-base font-medium mb-1">No friends found</p>
              <p className="text-sm">
                {activeFilter === 'accepted' && 'Add some friends to get started!'}
                {activeFilter === 'pending' && 'No friend requests to approve'}
                {activeFilter === 'sent' && 'No sent friend requests'}
                {activeFilter === 'blocked' && 'No blocked users'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {friends.filter(friend => friend.status === activeFilter).map((friend) => (
                <div
                  key={friend.friendship_id}
                  className="flex items-center justify-between p-4 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors border border-border"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-lg">
                        {friend.full_name.charAt(0).toUpperCase()}
                      </div>
                      {friend.is_online && friend.status === 'accepted' && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-surface"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary truncate">
                          {friend.full_name}
                        </h3>
                        {getStatusBadge(friend.status, activeFilter === 'sent')}
                      </div>
                      <p className="text-sm text-text-secondary truncate">
                        {friend.email}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {friend.status === 'accepted' && `Friends since ${formatDate(friend.created_at)}`}
                        {friend.status === 'pending' && activeFilter === 'sent' && `Sent ${formatDate(friend.created_at)}`}
                        {friend.status === 'pending' && activeFilter === 'pending' && `Received ${formatDate(friend.created_at)}`}
                        {friend.status === 'blocked' && `Blocked ${formatDate(friend.created_at)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4 shrink-0">
                    {friend.status === 'pending' && activeFilter === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleAcceptRequest(friend.friendship_id)}
                          disabled={actionLoading?.id === friend.friendship_id}
                        >
                          {actionLoading?.type === 'accept' && actionLoading.id === friend.friendship_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : 'Accept'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectRequest(friend.friendship_id)}
                          disabled={actionLoading?.id === friend.friendship_id}
                        >
                          {actionLoading?.type === 'reject' && actionLoading.id === friend.friendship_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : 'Decline'}
                        </Button>
                      </>
                    )}
                    {friend.status === 'pending' && activeFilter === 'sent' && (
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                    )}
                    {friend.status === 'accepted' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleMessage(friend.user_id, friend.friendship_id)}
                          disabled={actionLoading?.id === friend.friendship_id}
                        >
                          {actionLoading?.type === 'message' && actionLoading.id === friend.friendship_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : 'Message'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBlockUser(friend.user_id, friend.friendship_id)}
                          disabled={actionLoading?.id === friend.friendship_id}
                        >
                          {actionLoading?.type === 'block' && actionLoading.id === friend.friendship_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : 'Block'}
                        </Button>
                      </>
                    )}
                    {friend.status === 'blocked' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleUnblockUser(friend.user_id, friend.friendship_id)}
                        disabled={actionLoading?.id === friend.friendship_id}
                      >
                        {actionLoading?.type === 'unblock' && actionLoading.id === friend.friendship_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : 'Unblock'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              {friends.length} {activeFilter === 'accepted' ? 'friends' : activeFilter} 
            </span>
       
          </div>
        </div>
      </div>
    </div>
  );
}

