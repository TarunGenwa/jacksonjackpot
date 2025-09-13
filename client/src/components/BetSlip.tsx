'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Badge,
  Divider,
  Flex,
  Slide,
  useDisclosure,
  Card,
  CardBody,
  CloseButton,
  Heading,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FaShoppingCart, FaTrash, FaTimes, FaTicketAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export interface TicketItem {
  id: string;
  competitionId: string;
  competitionTitle: string;
  charityName: string;
  ticketPrice: number;
  quantity: number;
  maxTickets?: number;
}

interface BetSlipProps {
  tickets: TicketItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveTicket: (id: string) => void;
  onCheckout: () => void;
  onClearAll: () => void;
}

export default function BetSlip({ tickets, onUpdateQuantity, onRemoveTicket, onCheckout, onClearAll }: BetSlipProps) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const [isMinimized, setIsMinimized] = useState(false);

  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const totalAmount = tickets.reduce((sum, ticket) => sum + (ticket.ticketPrice * ticket.quantity), 0);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    if (tickets.length > 0 && !isOpen) {
      onToggle();
    }
  }, [tickets.length]);

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Box
          position="fixed"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          zIndex={1500}
        >
          <Tooltip label="Open Ticket Basket" placement="left">
            <IconButton
              aria-label="Open bet slip"
              icon={
                <Box position="relative">
                  <FaShoppingCart size={20} />
                  {totalTickets > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      fontSize="xs"
                      minW="20px"
                      h="20px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {totalTickets}
                    </Badge>
                  )}
                </Box>
              }
              size="lg"
              colorScheme="blue"
              borderRadius="full"
              shadow="lg"
              onClick={onToggle}
              _hover={{ transform: 'scale(1.1)' }}
              transition="all 0.2s"
            />
          </Tooltip>
        </Box>
      )}

      {/* Bet Slip Panel */}
      <Slide direction="right" in={isOpen} style={{ zIndex: 1400 }}>
        <Box
          position="fixed"
          right={0}
          top={0}
          h="100vh"
          w={isMinimized ? "60px" : { base: "100%", sm: "380px", md: "400px" }}
          bg="white"
          shadow="2xl"
          transition="width 0.3s ease"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Box
            bg="blue.600"
            color="white"
            p={4}
            position="relative"
          >
            <HStack justify="space-between" align="center">
              {!isMinimized && (
                <>
                  <HStack spacing={2}>
                    <FaShoppingCart />
                    <Heading size="md">Ticket Basket</Heading>
                    {totalTickets > 0 && (
                      <Badge colorScheme="yellow" variant="solid" fontSize="sm">
                        {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
                      </Badge>
                    )}
                  </HStack>
                  <HStack spacing={1}>
                    <Tooltip label="Minimize">
                      <IconButton
                        aria-label="Minimize"
                        icon={<FaChevronRight />}
                        size="sm"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: 'blue.700' }}
                        onClick={() => setIsMinimized(true)}
                      />
                    </Tooltip>
                    <Tooltip label="Close">
                      <IconButton
                        aria-label="Close"
                        icon={<FaTimes />}
                        size="sm"
                        variant="ghost"
                        color="white"
                        _hover={{ bg: 'blue.700' }}
                        onClick={onToggle}
                      />
                    </Tooltip>
                  </HStack>
                </>
              )}
              {isMinimized && (
                <VStack spacing={2} w="full">
                  <IconButton
                    aria-label="Expand"
                    icon={<FaChevronLeft />}
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'blue.700' }}
                    onClick={() => setIsMinimized(false)}
                  />
                  <Badge colorScheme="yellow" variant="solid" fontSize="xs">
                    {totalTickets}
                  </Badge>
                </VStack>
              )}
            </HStack>
          </Box>

          {!isMinimized && (
            <>
              {/* Ticket Items */}
              <Box flex={1} overflowY="auto" p={4}>
                {tickets.length === 0 ? (
                  <VStack spacing={4} py={8}>
                    <FaTicketAlt size={48} color="#CBD5E0" />
                    <Text color="gray.500" textAlign="center">
                      Your basket is empty
                    </Text>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      Add competition tickets to get started
                    </Text>
                  </VStack>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id} variant="outline" size="sm">
                        <CardBody>
                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between" align="start">
                              <Box flex={1}>
                                <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                                  {ticket.competitionTitle}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  {ticket.charityName}
                                </Text>
                              </Box>
                              <Tooltip label="Remove from basket">
                                <IconButton
                                  aria-label="Remove ticket"
                                  icon={<FaTrash />}
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => onRemoveTicket(ticket.id)}
                                />
                              </Tooltip>
                            </HStack>

                            <HStack justify="space-between" align="center">
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" color="gray.500">
                                  Price per ticket
                                </Text>
                                <Text fontSize="sm" fontWeight="semibold">
                                  {formatPrice(ticket.ticketPrice)}
                                </Text>
                              </VStack>

                              <HStack spacing={2}>
                                <Text fontSize="xs" color="gray.500">Qty:</Text>
                                <NumberInput
                                  size="sm"
                                  min={1}
                                  max={ticket.maxTickets || 100}
                                  value={ticket.quantity}
                                  onChange={(_, value) => onUpdateQuantity(ticket.id, value)}
                                  w="70px"
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </HStack>
                            </HStack>

                            <HStack justify="space-between">
                              <Text fontSize="xs" color="gray.500">
                                Subtotal
                              </Text>
                              <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                {formatPrice(ticket.ticketPrice * ticket.quantity)}
                              </Text>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}

                    {tickets.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        leftIcon={<FaTrash />}
                        onClick={onClearAll}
                      >
                        Clear All
                      </Button>
                    )}
                  </VStack>
                )}
              </Box>

              {/* Footer with Total and Checkout */}
              {tickets.length > 0 && (
                <Box
                  p={4}
                  borderTop="1px"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Total Tickets:
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold">
                        {totalTickets}
                      </Text>
                    </HStack>

                    <Divider />

                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        Total:
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        {formatPrice(totalAmount)}
                      </Text>
                    </HStack>

                    <Button
                      colorScheme="blue"
                      size="lg"
                      w="full"
                      onClick={onCheckout}
                      leftIcon={<FaShoppingCart />}
                    >
                      Proceed to Checkout
                    </Button>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Secure checkout powered by Stripe
                    </Text>
                  </VStack>
                </Box>
              )}
            </>
          )}

          {/* Minimized View */}
          {isMinimized && (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => setIsMinimized(false)}
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
            >
              <VStack spacing={2}>
                <FaShoppingCart size={20} color="#3182CE" />
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="blue.600"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  BASKET
                </Text>
              </VStack>
            </Box>
          )}
        </Box>
      </Slide>
    </>
  );
}