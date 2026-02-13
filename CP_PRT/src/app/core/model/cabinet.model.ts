export interface Cabinet {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt?: string;
}
