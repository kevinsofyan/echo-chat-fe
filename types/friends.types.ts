export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export type FriendRequestAction = 'accept' | 'reject';

export type FriendBlockAction = 'block' | 'unblock';

export interface IFriend {
  friendship_id: string;
  user_id: string;
  username: string;
  full_name: string;
  avatar: string;
  is_online: boolean;
  status: FriendshipStatus;
  created_at: string;
  email: string;
}

