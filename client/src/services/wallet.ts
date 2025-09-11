import apiClient from '@/lib/api';

export interface Wallet {
  id: string;
  balance: string;
  currency: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
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
};