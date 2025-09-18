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
  Spinner,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark
} from '@chakra-ui/react';
import { FaTicketAlt, FaPoundSign, FaCalculator } from 'react-icons/fa';
import { Competition } from '@/types/api';
import { ticketsService, PurchaseTicketRequest } from '@/services/tickets';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { updateBalance } = useWallet();
  const { getColor, getSemanticColor } = useTheme();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticketPrice = parseFloat(competition.ticketPrice);
  const totalCost = ticketPrice * quantity;
  const availableTickets = competition.maxTickets - competition.ticketsSold;

  const handleQuantityChange = (value: number) => {
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

      // Update the wallet balance with the new balance from the response
      if (result.wallet?.newBalance) {
        updateBalance(result.wallet.newBalance);
      }

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
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent
        bgGradient={getColor('gradients.secondary')}
        border="1px"
        borderColor={getColor('primary.700')}
        color={getColor('text.primary')}
        shadow="2xl"
      >
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FaTicketAlt} color={getColor('success.400')} boxSize={5} />
            <Text color={getColor('text.primary')} fontWeight="bold">Purchase Tickets</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton isDisabled={isLoading} color={getColor('text.primary')} _hover={{ bg: "whiteAlpha.200" }} />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Competition Info */}
            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={2} color={getColor('text.primary')}>
                {competition.title}
              </Text>
              <HStack spacing={2} mb={3}>
                <Text fontSize="sm" color={getColor('text.secondary')}>
                  Supporting: {competition.charity.name}
                </Text>
                {competition.charity.isVerified && (
                  <Badge colorScheme="green" size="sm" variant="solid">✓ Verified</Badge>
                )}
              </HStack>
              <Text fontSize="sm" color={getColor('text.secondary')} noOfLines={2}>
                {competition.description}
              </Text>
            </Box>

            <Divider borderColor="whiteAlpha.300" />

            {/* Availability Status */}
            <Alert
              status={availableTickets > 0 ? 'success' : 'error'}
              variant="left-accent"
              borderRadius="md"
              bg={availableTickets > 0 ? getSemanticColor('alerts', 'success.bgDark') : getSemanticColor('alerts', 'error.bgDark')}
              borderColor={availableTickets > 0 ? getColor('success.600') : getColor('error.600')}
              color={getColor('text.primary')}
            >
              <AlertIcon color={availableTickets > 0 ? getColor('success.400') : getColor('error.400')} />
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium" color={getColor('text.primary')}>
                  {availableTickets > 0 ? 'Tickets Available' : 'Sold Out'}
                </Text>
                <Text fontSize="sm" color={getColor('text.secondary')}>
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
                    <Flex justify="space-between" align="center" w="full">
                      <HStack spacing={2}>
                        <Text color={getColor('text.primary')}>Number of Tickets</Text>
                        <Badge colorScheme="green" variant="solid" fontSize="md" px={2}>
                          {quantity}
                        </Badge>
                      </HStack>
                      <Badge colorScheme="purple" variant="outline" color={getColor('primary.300')} borderColor={getColor('primary.400')}>
                        Max: {Math.min(availableTickets, 10)}
                      </Badge>
                    </Flex>
                  </FormLabel>
                  <Box pt={6} pb={2}>
                    <Slider
                      value={quantity}
                      onChange={handleQuantityChange}
                      min={1}
                      max={Math.min(availableTickets, 10)}
                      step={1}
                      colorScheme="purple"
                    >
                      <SliderMark value={1} mt={3} ml={-2} fontSize="sm" color={getColor('text.secondary')}>
                        1
                      </SliderMark>
                      <SliderMark value={Math.min(availableTickets, 10)} mt={3} ml={-2} fontSize="sm" color={getColor('text.secondary')}>
                        {Math.min(availableTickets, 10)}
                      </SliderMark>
                      {Math.min(availableTickets, 10) > 5 && (
                        <SliderMark value={Math.ceil(Math.min(availableTickets, 10) / 2)} mt={3} ml={-2} fontSize="sm" color={getColor('text.secondary')}>
                          {Math.ceil(Math.min(availableTickets, 10) / 2)}
                        </SliderMark>
                      )}
                      <SliderTrack bg="whiteAlpha.300">
                        <SliderFilledTrack bg={getColor('primary.400')} />
                      </SliderTrack>
                      <SliderThumb boxSize={6} bg={getColor('primary.500')} border="2px" borderColor={getColor('text.primary')}>
                        <Box color={getColor('text.primary')} fontSize="xs" fontWeight="bold">
                          {quantity}
                        </Box>
                      </SliderThumb>
                    </Slider>
                  </Box>
                </FormControl>

                {/* Price Breakdown */}
                <Box bg="whiteAlpha.100" p={4} borderRadius="md" border="1px" borderColor="whiteAlpha.200">
                  <VStack spacing={3}>
                    <Flex justify="space-between" w="full" align="center">
                      <HStack spacing={2}>
                        <Icon as={FaCalculator} boxSize={4} color={getColor('success.400')} />
                        <Text fontWeight="medium" color={getColor('text.primary')}>Price Breakdown</Text>
                      </HStack>
                    </Flex>

                    <VStack spacing={2} w="full">
                      <Flex justify="space-between" w="full">
                        <Text fontSize="sm" color={getColor('text.secondary')}>
                          Ticket Price:
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={getColor('text.primary')}>
                          {formatPrice(ticketPrice)}
                        </Text>
                      </Flex>

                      <Flex justify="space-between" w="full">
                        <Text fontSize="sm" color={getColor('text.secondary')}>
                          Quantity:
                        </Text>
                        <Text fontSize="sm" fontWeight="medium" color={getColor('text.primary')}>
                          {quantity}
                        </Text>
                      </Flex>

                      <Divider borderColor="whiteAlpha.300" />

                      <Flex justify="space-between" w="full">
                        <Text fontWeight="bold" color={getColor('success.400')}>
                          Total Cost:
                        </Text>
                        <Text fontWeight="bold" fontSize="lg" color={getColor('success.400')}>
                          {formatPrice(totalCost)}
                        </Text>
                      </Flex>
                    </VStack>
                  </VStack>
                </Box>

                {/* Draw Date */}
                <Alert
                  status="info"
                  variant="left-accent"
                  borderRadius="md"
                  bg={getSemanticColor('alerts', 'info.bgDark')}
                  borderColor={getColor('secondary.600')}
                  color={getColor('text.primary')}
                >
                  <AlertIcon color={getColor('secondary.400')} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" fontSize="sm" color={getColor('text.primary')}>
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
                  <Alert
                    status="error"
                    borderRadius="md"
                    bg={getSemanticColor('alerts', 'error.bgDark')}
                    borderColor={getColor('error.600')}
                    color={getColor('text.primary')}
                    variant="left-accent"
                  >
                    <AlertIcon color={getColor('error.400')} />
                    <Text color={getColor('text.primary')}>{error}</Text>
                  </Alert>
                )}
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button
              variant="ghost"
              onClick={handleClose}
              isDisabled={isLoading}
              color={getColor('text.secondary')}
              _hover={{ bg: "whiteAlpha.200", color: getColor('text.primary') }}
            >
              Cancel
            </Button>
            {availableTickets > 0 && (
              <Button
                bg={getColor('success.400')}
                color={getColor('neutral.900')}
                _hover={{ bg: getColor('success.300'), transform: "translateY(-1px)" }}
                _active={{ bg: getColor('success.500') }}
                onClick={handlePurchase}
                isLoading={isLoading}
                loadingText="Processing..."
                leftIcon={isLoading ? <Spinner size="sm" /> : <Icon as={FaPoundSign} />}
                size="lg"
                fontWeight="bold"
                shadow="md"
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