import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TICKET_PURCHASE' | 'PRIZE_PAYOUT' | 'REFUND' | 'BONUS' | 'FEE';
  amount: string | number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  description: string;
  referenceNumber?: string;
  paymentProvider?: string;
  providerTransactionId?: string;
  metadata?: Record<string, unknown>;
  failureReason?: string;
  refundedAmount?: string;
  refundedAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

class TransactionsService {
  private async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        console.error('No authentication token found');
        return [];
      }

      const params = new URLSearchParams();
      if (filters) {
        if (filters.type && filters.type !== 'ALL') {
          params.append('type', filters.type);
        }
        if (filters.status && filters.status !== 'ALL') {
          params.append('status', filters.status);
        }
        if (filters.dateFrom) {
          params.append('dateFrom', filters.dateFrom);
        }
        if (filters.dateTo) {
          params.append('dateTo', filters.dateTo);
        }
        if (filters.minAmount !== undefined) {
          params.append('minAmount', filters.minAmount.toString());
        }
        if (filters.maxAmount !== undefined) {
          params.append('maxAmount', filters.maxAmount.toString());
        }
      }

      const queryString = params.toString();
      const url = `${API_BASE_URL}/wallet/transactions${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get<Transaction[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get<Transaction>(`${API_BASE_URL}/wallet/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error;
    }
  }

  async exportTransactions(format: 'csv' | 'pdf' = 'csv', filters?: TransactionFilters): Promise<Blob> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const params = new URLSearchParams();
      params.append('format', format);

      if (filters) {
        if (filters.type && filters.type !== 'ALL') {
          params.append('type', filters.type);
        }
        if (filters.status && filters.status !== 'ALL') {
          params.append('status', filters.status);
        }
        if (filters.dateFrom) {
          params.append('dateFrom', filters.dateFrom);
        }
        if (filters.dateTo) {
          params.append('dateTo', filters.dateTo);
        }
      }

      const response = await axios.get(`${API_BASE_URL}/wallet/transactions/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export transactions:', error);
      throw error;
    }
  }

  formatAmount(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(Math.abs(numAmount));
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'DEPOSIT': return 'green';
      case 'TICKET_PURCHASE': return 'blue';
      case 'WITHDRAWAL': return 'orange';
      case 'PRIZE_PAYOUT': return 'purple';
      case 'REFUND': return 'cyan';
      case 'BONUS': return 'teal';
      case 'FEE': return 'red';
      default: return 'gray';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'yellow';
      case 'PROCESSING': return 'blue';
      case 'FAILED': return 'red';
      case 'CANCELLED': return 'gray';
      case 'REFUNDED': return 'purple';
      default: return 'gray';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'DEPOSIT': return '↗️';
      case 'TICKET_PURCHASE': return '🎫';
      case 'WITHDRAWAL': return '↙️';
      case 'PRIZE_PAYOUT': return '🏆';
      case 'REFUND': return '↩️';
      case 'BONUS': return '🎁';
      case 'FEE': return '💸';
      default: return '💰';
    }
  }

  getTypeLabel(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}

export const transactionsService = new TransactionsService();