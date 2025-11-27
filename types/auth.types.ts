import type { IApiResponse } from './http-client.types';

export interface IUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar?: string;
  is_online?: boolean;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse extends IApiResponse<{
    token: string;
    user: IUser;
}> {
  message?: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

