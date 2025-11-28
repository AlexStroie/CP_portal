export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}

export interface UserRequest {
  fullName: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
}
