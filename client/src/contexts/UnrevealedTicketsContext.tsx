'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TicketWithInstantWin {
  ticketNumber: string;
  competitionId: string;
  competitionTitle: string;
  instantWin?: {
    prize?: {
      name: string;
      value: number;
      description?: string;
    };
  };
  purchaseDate: string;
}

interface UnrevealedTicketsContextType {
  unrevealedTickets: TicketWithInstantWin[];
  addUnrevealedTickets: (tickets: TicketWithInstantWin[]) => void;
  markTicketsAsRevealed: (ticketNumbers: string[]) => void;
  getUnrevealedTicketsForCompetition: (competitionId: string) => TicketWithInstantWin[];
  hasUnrevealedTickets: boolean;
  clearAllUnrevealed: () => void;
}

const UnrevealedTicketsContext = createContext<UnrevealedTicketsContextType | undefined>(undefined);

const STORAGE_KEY = 'jj_unrevealed_tickets';

export function UnrevealedTicketsProvider({ children }: { children: React.ReactNode }) {
  const [unrevealedTickets, setUnrevealedTickets] = useState<TicketWithInstantWin[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out tickets older than 30 days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        const validTickets = parsed.filter((ticket: TicketWithInstantWin) =>
          new Date(ticket.purchaseDate) > cutoffDate
        );

        setUnrevealedTickets(validTickets);

        // Update localStorage if we filtered out old tickets
        if (validTickets.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validTickets));
        }
      }
    } catch (error) {
      console.error('Failed to load unrevealed tickets from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unrevealedTickets));
    } catch (error) {
      console.error('Failed to save unrevealed tickets to localStorage:', error);
    }
  }, [unrevealedTickets]);

  const addUnrevealedTickets = (tickets: TicketWithInstantWin[]) => {
    setUnrevealedTickets(prev => {
      // Remove any existing tickets with the same numbers to avoid duplicates
      const existingTicketNumbers = new Set(prev.map(t => t.ticketNumber));
      const newTickets = tickets.filter(t => !existingTicketNumbers.has(t.ticketNumber));
      return [...prev, ...newTickets];
    });
  };

  const markTicketsAsRevealed = (ticketNumbers: string[]) => {
    setUnrevealedTickets(prev =>
      prev.filter(ticket => !ticketNumbers.includes(ticket.ticketNumber))
    );
  };

  const getUnrevealedTicketsForCompetition = (competitionId: string) => {
    return unrevealedTickets.filter(ticket => ticket.competitionId === competitionId);
  };

  const clearAllUnrevealed = () => {
    setUnrevealedTickets([]);
  };

  const hasUnrevealedTickets = unrevealedTickets.length > 0;

  const value: UnrevealedTicketsContextType = {
    unrevealedTickets,
    addUnrevealedTickets,
    markTicketsAsRevealed,
    getUnrevealedTicketsForCompetition,
    hasUnrevealedTickets,
    clearAllUnrevealed,
  };

  return (
    <UnrevealedTicketsContext.Provider value={value}>
      {children}
    </UnrevealedTicketsContext.Provider>
  );
}

export function useUnrevealedTickets() {
  const context = useContext(UnrevealedTicketsContext);
  if (context === undefined) {
    throw new Error('useUnrevealedTickets must be used within an UnrevealedTicketsProvider');
  }
  return context;
}