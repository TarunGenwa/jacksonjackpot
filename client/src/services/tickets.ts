import apiClient from '@/lib/api';

export interface PurchaseTicketRequest {
  competitionId: string;
  quantity: number;
  paymentMethod?: string;
}

export interface PurchaseTicketResponse {
  success: boolean;
  transaction: {
    id: string;
    reference: string;
    amount: string;
    status: string;
  };
  tickets: Array<{
    id: string;
    ticketNumber: string;
    competitionTitle: string;
    drawDate: string;
    purchasePrice: string;
    status: string;
  }>;
  wallet: {
    newBalance: string;
  };
}

export interface UserTicket {
  id: string;
  ticketNumber: string;
  purchasePrice: string;
  status: string;
  createdAt: string;
  competition: {
    id: string;
    title: string;
    description: string;
    drawDate: string;
    status: string;
    imageUrl?: string;
    charity: {
      id: string;
      name: string;
      logoUrl?: string;
    };
  };
}

export interface TicketFilters {
  competitionId?: string;
  status?: string;
}

export const ticketsService = {
  purchaseTickets: async (data: PurchaseTicketRequest): Promise<PurchaseTicketResponse> => {
    return apiClient.post<PurchaseTicketResponse>('/tickets/purchase', data);
  },

  getMyTickets: async (filters?: TicketFilters): Promise<UserTicket[]> => {
    const params = new URLSearchParams();
    if (filters?.competitionId) params.append('competitionId', filters.competitionId);
    if (filters?.status) params.append('status', filters.status);
    
    const endpoint = `/tickets/my-tickets${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get<UserTicket[]>(endpoint);
  },

  getTicketById: async (ticketId: string): Promise<UserTicket> => {
    return apiClient.get<UserTicket>(`/tickets/${ticketId}`);
  },
};