export interface Prize {
  id: string;
  name: string;
  description?: string;
  value: number;
  position: number;
  quantity: number;
  competitionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  competitionId: string;
  userId: string;
  purchasePrice: number;
  status: 'ACTIVE' | 'WINNER' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
  competition?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TICKET_PURCHASE' | 'PRIZE_PAYOUT' | 'REFUND' | 'BONUS' | 'FEE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  amount: number;
  currency: string;
  description?: string;
  referenceId?: string;
  paymentMethod?: string;
  paymentProvider?: string;
  metadata?: Record<string, unknown>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Winner {
  id: string;
  competitionId: string;
  userId: string;
  ticketId: string;
  prizeId: string;
  status: 'PENDING' | 'NOTIFIED' | 'CLAIMED' | 'PAID' | 'EXPIRED';
  claimedAt?: string;
  paidOutAt?: string;
  createdAt: string;
  updatedAt: string;
  prize?: Prize;
  ticket?: Ticket;
  competition?: {
    id: string;
    title: string;
  };
}

export interface UserUpdateData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive?: boolean;
}

export interface CompetitionUpdateData {
  title?: string;
  description?: string;
  imageUrl?: string;
  ticketPrice?: number;
  maxTickets?: number;
  startDate?: string;
  endDate?: string;
  drawDate?: string;
  status?: string;
  charityId?: string;
}

export interface CompetitionCreateData {
  title: string;
  description: string;
  imageUrl?: string;
  ticketPrice: number;
  maxTickets: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  charityId: string;
  status?: string;
}

export interface CharityUpdateData {
  name?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  isVerified?: boolean;
}