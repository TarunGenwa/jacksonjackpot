'use client';

import { useState } from 'react';
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
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  Icon,
  Flex,
  Box,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { FaTicketAlt, FaPoundSign, FaCalculator } from 'react-icons/fa';
import { Competition } from '@/types/api';
import { ticketsService, PurchaseTicketRequest } from '@/services/tickets';
import { useAuth } from '@/contexts/AuthContext';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition;
  onPurchaseSuccess?: () => void;
}

export default function TicketPurchaseModal({ 
  isOpen, 
  onClose, 
  competition, 
  onPurchaseSuccess 
}: TicketPurchaseModalProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticketPrice = parseFloat(competition.ticketPrice);
  const totalCost = ticketPrice * quantity;
  const availableTickets = competition.maxTickets - competition.ticketsSold;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const maxAllowed = Math.min(availableTickets, 10); // Limit to 10 tickets per purchase
    setQuantity(Math.max(1, Math.min(value, maxAllowed)));
  };

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
      const purchaseData: PurchaseTicketRequest = {
        competitionId: competition.id,
        quantity,
        paymentMethod: 'WALLET',
      };

      const result = await ticketsService.purchaseTickets(purchaseData);

      toast({
        title: 'Purchase Successful! 🎉',
        description: `You've successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''} for ${competition.title}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      });

      // Show ticket numbers in a follow-up toast
      const ticketNumbers = result.tickets.map(t => t.ticketNumber).join(', ');
      setTimeout(() => {
        toast({
          title: 'Your Ticket Numbers',
          description: `Ticket${quantity > 1 ? 's' : ''}: ${ticketNumbers}`,
          status: 'info',
          duration: 8000,
          isClosable: true,
        });
      }, 1000);

      onPurchaseSuccess?.();
      onClose();
      
    } catch (err: any) {
      console.error('Purchase failed:', err);
      const errorMessage = err.message || 'Purchase failed. Please try again.';
      setError(errorMessage);
      
      toast({
        title: 'Purchase Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setQuantity(1);
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  const getAvailabilityColor = () => {
    if (availableTickets === 0) return 'red';
    if (availableTickets < 100) return 'orange';
    return 'green';
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" closeOnOverlayClick={!isLoading}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FaTicketAlt} color="blue.500" />
            <Text>Purchase Tickets</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Competition Info */}
            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                {competition.title}
              </Text>
              <HStack spacing={2} mb={3}>
                <Text fontSize="sm" color="gray.600">
                  Supporting: {competition.charity.name}
                </Text>
                {competition.charity.isVerified && (
                  <Badge colorScheme="blue" size="sm">✓ Verified</Badge>
                )}
              </HStack>
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {competition.description}
              </Text>
            </Box>

            <Divider />

            {/* Availability Status */}
            <Alert status={availableTickets > 0 ? 'success' : 'error'} variant="subtle" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">
                  {availableTickets > 0 ? 'Tickets Available' : 'Sold Out'}
                </Text>
                <Text fontSize="sm">
                  {availableTickets > 0 
                    ? `${availableTickets.toLocaleString()} of ${competition.maxTickets.toLocaleString()} tickets remaining`
                    : 'All tickets have been sold for this competition'
                  }
                </Text>
              </VStack>
            </Alert>

            {availableTickets > 0 && (
              <>
                {/* Quantity Selector */}
                <FormControl>
                  <FormLabel>
                    <HStack spacing={2}>
                      <Text>Number of Tickets</Text>
                      <Badge colorScheme="blue" variant="outline">
                        Max: {Math.min(availableTickets, 10)}
                      </Badge>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={1}
                    max={Math.min(availableTickets, 10)}
                    size="lg"
                  />
                </FormControl>

                {/* Price Breakdown */}
                <Box bg="gray.50" p={4} borderRadius="md">
                  <VStack spacing={3}>
                    <Flex justify="space-between" w="full" align="center">
                      <HStack spacing={2}>
                        <Icon as={FaCalculator} boxSize={4} color="gray.600" />
                        <Text fontWeight="medium">Price Breakdown</Text>
                      </HStack>
                    </Flex>
                    
                    <VStack spacing={2} w="full">
                      <Flex justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Ticket Price:
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatPrice(ticketPrice)}
                        </Text>
                      </Flex>
                      
                      <Flex justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Quantity:
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {quantity}
                        </Text>
                      </Flex>
                      
                      <Divider />
                      
                      <Flex justify="space-between" w="full">
                        <Text fontWeight="bold" color="blue.600">
                          Total Cost:
                        </Text>
                        <Text fontWeight="bold" fontSize="lg" color="blue.600">
                          {formatPrice(totalCost)}
                        </Text>
                      </Flex>
                    </VStack>
                  </VStack>
                </Box>

                {/* Draw Date */}
                <Alert status="info" variant="left-accent" borderRadius="md">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" fontSize="sm">
                      Draw Date: {new Date(competition.drawDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </VStack>
                </Alert>

                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} isDisabled={isLoading}>
              Cancel
            </Button>
            {availableTickets > 0 && (
              <Button
                colorScheme="blue"
                onClick={handlePurchase}
                isLoading={isLoading}
                loadingText="Processing..."
                leftIcon={isLoading ? <Spinner size="sm" /> : <Icon as={FaPoundSign} />}
                size="lg"
              >
                Purchase {quantity} Ticket{quantity > 1 ? 's' : ''} - {formatPrice(totalCost)}
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}