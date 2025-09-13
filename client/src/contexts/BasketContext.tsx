'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TicketItem } from '@/components/BetSlip';

interface BasketContextType {
  tickets: TicketItem[];
  addTicket: (ticket: Omit<TicketItem, 'quantity'>) => void;
  removeTicket: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearBasket: () => void;
  getTotalAmount: () => number;
  getTotalTickets: () => number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  // Load basket from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem('ticketBasket');
    if (savedBasket) {
      try {
        const parsedBasket = JSON.parse(savedBasket);
        setTickets(parsedBasket);
      } catch (error) {
        console.error('Error loading basket from localStorage:', error);
      }
    }
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ticketBasket', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = useCallback((newTicket: Omit<TicketItem, 'quantity'>) => {
    setTickets(prevTickets => {
      const existingTicket = prevTickets.find(t => t.competitionId === newTicket.competitionId);

      if (existingTicket) {
        // If ticket already exists, increment quantity
        return prevTickets.map(t =>
          t.competitionId === newTicket.competitionId
            ? { ...t, quantity: t.quantity + 1 }
            : t
        );
      } else {
        // Add new ticket with quantity 1
        return [...prevTickets, { ...newTicket, quantity: 1 }];
      }
    });
  }, []);

  const removeTicket = useCallback((id: string) => {
    setTickets(prevTickets => prevTickets.filter(t => t.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeTicket(id);
      return;
    }

    setTickets(prevTickets =>
      prevTickets.map(t =>
        t.id === id ? { ...t, quantity } : t
      )
    );
  }, [removeTicket]);

  const clearBasket = useCallback(() => {
    setTickets([]);
  }, []);

  const getTotalAmount = useCallback(() => {
    return tickets.reduce((sum, ticket) => sum + (ticket.ticketPrice * ticket.quantity), 0);
  }, [tickets]);

  const getTotalTickets = useCallback(() => {
    return tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }, [tickets]);

  const value: BasketContextType = {
    tickets,
    addTicket,
    removeTicket,
    updateQuantity,
    clearBasket,
    getTotalAmount,
    getTotalTickets,
  };

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}