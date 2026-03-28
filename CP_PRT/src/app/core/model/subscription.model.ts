export interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  maxUsers: number;
  maxPatients: number;
  price: number;
  currency: string;
  createdAt: string;
}
