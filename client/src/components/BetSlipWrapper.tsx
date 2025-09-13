'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import BetSlip from './BetSlip';
import { useBasket } from '@/contexts/BasketContext';
import { useAuth } from '@/contexts/AuthContext';

export default function BetSlipWrapper() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { tickets, updateQuantity, removeTicket, clearBasket } = useBasket();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to proceed to checkout',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      router.push('/login');
      return;
    }

    // Navigate to checkout page
    router.push('/checkout');
  };

  return (
    <BetSlip
      tickets={tickets}
      onUpdateQuantity={updateQuantity}
      onRemoveTicket={removeTicket}
      onCheckout={handleCheckout}
      onClearAll={clearBasket}
    />
  );
}