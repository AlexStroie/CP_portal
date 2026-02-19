export interface Cabinet {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;

  logoUrl: string;

  planCode: string;
  subscriptionStatus: string;

  startDate: string;
  endDate: string;
  trialEndDate: string;

  createdAt: string;

  maxUsers: number;
  maxPatients: number;

  price: number;
  currency: string;

  autoRenew: boolean;
}

export interface CabinetRequest {

  // Cabinet
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  logoUrl?: string | null;

  // Subscription
  planCode: string;
  subscriptionStatus: string;

  startDate: string | null;
  endDate: string | null;
  trialEndDate: string | null;

  autoRenew: boolean;

  price: number | null;
  currency: string;
}
