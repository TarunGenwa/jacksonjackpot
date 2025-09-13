'use client';

import { useToast } from '@chakra-ui/react';
import { useBasket } from '@/contexts/BasketContext';

interface AddToBasketParams {
  competitionId: string;
  competitionTitle: string;
  charityName: string;
  ticketPrice: number;
  maxTickets?: number;
}

export function useAddToBasket() {
  const toast = useToast();
  const { addTicket } = useBasket();

  const handleAddToBasket = (params: AddToBasketParams) => {
    const ticketId = `${params.competitionId}-${Date.now()}`;

    addTicket({
      id: ticketId,
      competitionId: params.competitionId,
      competitionTitle: params.competitionTitle,
      charityName: params.charityName,
      ticketPrice: params.ticketPrice,
      maxTickets: params.maxTickets,
    });

    toast({
      title: 'Added to basket',
      description: `${params.competitionTitle} ticket added to your basket`,
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return { handleAddToBasket };
}