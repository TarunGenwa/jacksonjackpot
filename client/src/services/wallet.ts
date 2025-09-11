import apiClient from '@/lib/api';

export interface Wallet {
  id: string;
  balance: string;
  currency: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddFundsDto {
  amount: number;
  currency?: string;
  description?: string;
}

export interface AddFundsResponse {
  success: boolean;
  message: string;
  wallet: Wallet;
}

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    return apiClient.get<Wallet>('/wallet');
  },

  getBalance: async (): Promise<{ balance: string; currency: string }> => {
    const wallet = await apiClient.get<Wallet>('/wallet');
    return {
      balance: wallet.balance,
      currency: wallet.currency
    };
  },

  addFunds: async (data: AddFundsDto): Promise<AddFundsResponse> => {
    return apiClient.post<AddFundsResponse>('/wallet/add-funds', data);
  },

  getTransactions: async (): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>('/wallet/transactions');
  },
};