'use client';

import { useState } from 'react';
import InstantWinSpinner from './InstantWinSpinner';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  Icon,
  Box,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { FaTicketAlt, FaPoundSign, FaCheckCircle } from 'react-icons/fa';
import { Competition } from '@/types/api';
import { ticketsService, PurchaseTicketRequest } from '@/services/tickets';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUnrevealedTickets } from '@/contexts/UnrevealedTicketsContext';

interface TicketWithInstantWin {
  ticketNumber: string;
  instantWin?: {
    prize?: {
      name: string;
      value: number;
      description?: string;
    };
  };
}

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition;
  ticketQuantity: number;
  onPurchaseSuccess?: () => void;
}

export default function TicketPurchaseModal({
  isOpen,
  onClose,
  competition,
  ticketQuantity,
  onPurchaseSuccess
}: TicketPurchaseModalProps) {
  const { user } = useAuth();
  const { updateBalance } = useWallet();
  const { getColor, getSemanticColor, getThemeColor } = useTheme();
  const { addUnrevealedTickets, markTicketsAsRevealed } = useUnrevealedTickets();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstantWinSpinner, setShowInstantWinSpinner] = useState(false);
  const [purchasedTickets, setPurchasedTickets] = useState<TicketWithInstantWin[]>([]);

  const ticketPrice = parseFloat(competition.ticketPrice);
  const totalCost = ticketPrice * ticketQuantity;

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to purchase tickets.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: PurchaseTicketRequest = {
        competitionId: competition.id,
        quantity: ticketQuantity,
        paymentMethodId: 'wallet' // Using wallet as payment method
      };

      console.log('Purchase request:', request);
      console.log('Competition status:', competition.status);
      console.log('Competition details:', competition);

      const response = await ticketsService.purchaseTickets(request);

      // Update wallet balance
      await updateBalance();

      // Prepare tickets for instant win spinner
      const ticketsWithInstantWin = response.tickets.map((ticket: any) => ({
        ticketNumber: ticket.ticketNumber,
        instantWin: ticket.instantWin,
        competitionId: competition.id,
        competitionTitle: competition.title,
        purchaseDate: new Date().toISOString()
      }));

      setPurchasedTickets(ticketsWithInstantWin);

      // Add tickets with instant win potential to unrevealed tickets
      const instantWinTickets = ticketsWithInstantWin.filter((t: any) => t.instantWin);
      if (instantWinTickets.length > 0) {
        addUnrevealedTickets(instantWinTickets);
      }

      toast({
        title: 'Purchase successful!',
        description: `You have purchased ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''} for ${competition.title}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onPurchaseSuccess?.();

      // Show instant win spinner if there are instant win tickets
      if (instantWinTickets.length > 0) {
        setShowInstantWinSpinner(true);
        onClose(); // Close purchase modal
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Purchase failed:', err);
      setError(err.response?.data?.message || 'Failed to purchase tickets. Please try again.');
      toast({
        title: 'Purchase failed',
        description: err.response?.data?.message || 'Failed to purchase tickets. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantWinComplete = () => {
    setShowInstantWinSpinner(false);
    setPurchasedTickets([]);
  };

  const handleTicketRevealed = (ticketNumber: string) => {
    markTicketsAsRevealed([ticketNumber]);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bg={getThemeColor('secondary')}
          border="2px"
          borderColor={getThemeColor('primary')}
          color={getThemeColor('white')}
        >
          <ModalHeader borderBottom="1px" borderColor={getThemeColor('primaryDark')}>
            <HStack spacing={3}>
              <Icon as={FaCheckCircle} color={getThemeColor('accent')} />
              <Text>Confirm Purchase</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color={getThemeColor('white')} />

          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              {/* Competition Details */}
              <Box bg={getThemeColor('dark')} p={4} borderRadius="lg">
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color={getThemeColor('gray300')}>Competition</Text>
                  <Text fontSize="lg" fontWeight="bold" color={getThemeColor('white')}>
                    {competition.title}
                  </Text>
                  <HStack>
                    <Badge colorScheme="purple" variant="solid">
                      {competition.charity.name}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>

              {/* Purchase Summary */}
              <Box bg={getThemeColor('dark')} p={4} borderRadius="lg">
                <VStack spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Text color={getThemeColor('gray300')}>Tickets</Text>
                    <Text color={getThemeColor('white')} fontWeight="semibold">
                      {ticketQuantity} × £{ticketPrice.toFixed(2)}
                    </Text>
                  </HStack>

                  <Divider borderColor={getThemeColor('primaryDark')} />

                  <HStack justify="space-between" w="full">
                    <Text fontSize="lg" fontWeight="bold" color={getThemeColor('white')}>
                      Total
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={getThemeColor('accent')}>
                      £{totalCost.toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {/* Instant Win Info */}
              {competition.prizes?.some(p => p.type === 'INSTANT_WIN') && (
                <Alert
                  status="info"
                  bg={getThemeColor('primaryDark')}
                  color={getThemeColor('white')}
                  borderRadius="lg"
                  border="1px"
                  borderColor={getThemeColor('primary')}
                >
                  <AlertIcon color={getThemeColor('accent')} />
                  <Text fontSize="sm">
                    This competition includes instant win prizes! You'll find out immediately after purchase.
                  </Text>
                </Alert>
              )}

              {/* Error Message */}
              {error && (
                <Alert
                  status="error"
                  bg={getThemeColor('dark')}
                  color={getThemeColor('error')}
                  borderRadius="lg"
                >
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor={getThemeColor('primaryDark')}>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={onClose}
                isDisabled={isLoading}
                color={getThemeColor('gray300')}
                _hover={{ bg: getThemeColor('dark') }}
              >
                Cancel
              </Button>
              <Button
                bg={getThemeColor('accent')}
                color={getThemeColor('dark')}
                _hover={{ bg: getThemeColor('accentDark') }}
                leftIcon={isLoading ? <Spinner size="sm" /> : <Icon as={FaPoundSign} />}
                onClick={handlePurchase}
                isLoading={isLoading}
                loadingText="Processing..."
                size="md"
                fontWeight="bold"
              >
                Confirm Purchase - £{totalCost.toFixed(2)}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Instant Win Spinner Modal */}
      <InstantWinSpinner
        isOpen={showInstantWinSpinner}
        onClose={handleInstantWinComplete}
        tickets={purchasedTickets}
        onComplete={handleInstantWinComplete}
        onTicketRevealed={handleTicketRevealed}
      />
    </>
  );
}