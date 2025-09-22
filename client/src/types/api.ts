export interface Charity {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Prize {
  id: string;
  name: string;
  description?: string;
  value: number;
  type: 'DRAW' | 'INSTANT_WIN';
  position?: number;
  quantity: number;
  allocatedTickets?: number;
  imageUrl?: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'MYSTERYBOXES' | 'INSTANT_WINS' | 'DAILY_FREE' | 'INSTANT_SPINS';
  ticketPrice: string;
  totalPrizeValue: string;
  maxTickets: number;
  ticketsSold: number;
  minTickets?: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  status: 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'SOLD_OUT' | 'DRAWING' | 'COMPLETED' | 'CANCELLED';
  imageUrl?: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
  charity: {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    isVerified: boolean;
  };
  prizes: Prize[];
  _count: {
    tickets: number;
    prizes: number;
  };
}

export interface CompetitionsResponse {
  data?: Competition[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}