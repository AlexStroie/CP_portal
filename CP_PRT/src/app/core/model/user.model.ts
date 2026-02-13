import {Role} from '../../shared/types/role';

export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  activationLink: string;
  cabinetId: string;
}

export interface UserRequest {
  fullName: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  cabinetId: string;
}

export interface SwitchRequest {
  username: string;
  cabinetId: number;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;

  username: string;
  role: Role;
  activeRole: Role;
  cabinetId?: number;
  delegated?: boolean;
}
