'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { walletService } from '@/services/wallet';

interface WalletContextType {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  updateBalance: (newBalance: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = async () => {
    if (!user) {
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const walletData = await walletService.getBalance();
      setBalance(walletData.balance);
    } catch (err) {
      console.error('Failed to fetch wallet balance:', err);
      setError('Failed to fetch wallet balance');
      setBalance('0.00');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = (newBalance: string) => {
    setBalance(newBalance);
  };

  useEffect(() => {
    refreshBalance();
  }, [user]);

  const value = {
    balance,
    isLoading,
    error,
    refreshBalance,
    updateBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}