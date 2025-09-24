'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Icon,
  Badge,
  Flex,
  useToast,
  Center
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaTrophy, FaGift, FaCoins, FaStar } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface InstantPrize {
  id: string;
  name: string;
  value: number;
  icon: IconType;
  color: string;
  isWin: boolean;
  description?: string;
}

interface TicketReveal {
  ticketNumber: string;
  isSpinning: boolean;
  revealedPrize: InstantPrize | null;
  prizes: InstantPrize[];
  spinnerRef: React.RefObject<HTMLDivElement>;
}

interface InstantWinSpinnerProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Array<{
    ticketNumber: string;
    instantWin?: {
      prize?: {
        name: string;
        value: number;
        description?: string;
      };
    };
  }>;
  onComplete?: () => void;
  onTicketRevealed?: (ticketNumber: string) => void;
}

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(252, 163, 17, 0.3); }
  50% { box-shadow: 0 0 20px rgba(252, 163, 17, 0.6); }
  100% { box-shadow: 0 0 10px rgba(252, 163, 17, 0.3); }
`;


export default function InstantWinSpinner({
  isOpen,
  onClose,
  tickets,
  onComplete,
  onTicketRevealed
}: InstantWinSpinnerProps) {
  const { getThemeColor } = useTheme();
  const toast = useToast();
  const [ticketReveals, setTicketReveals] = useState<TicketReveal[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);
  const [totalWins, setTotalWins] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Initialize ticket reveals
  useEffect(() => {
    if (tickets.length > 0 && ticketReveals.length === 0) {
      const reveals = tickets.map(ticket => ({
        ticketNumber: ticket.ticketNumber,
        isSpinning: false,
        revealedPrize: null,
        prizes: generatePrizePool(!!ticket.instantWin?.prize, ticket),
        spinnerRef: React.createRef<HTMLDivElement>()
      }));
      setTicketReveals(reveals);
    }
  }, [tickets]);

  const generatePrizePool = (hasWin: boolean, ticket: typeof tickets[0]): InstantPrize[] => {
    const commonPrizes: InstantPrize[] = [
      { id: '1', name: 'Better Luck', value: 0, icon: FaStar, color: getThemeColor('gray500'), isWin: false },
      { id: '2', name: 'Try Again', value: 0, icon: FaStar, color: getThemeColor('gray500'), isWin: false },
      { id: '3', name: 'Almost', value: 0, icon: FaStar, color: getThemeColor('gray500'), isWin: false },
      { id: '4', name: 'Keep Playing', value: 0, icon: FaStar, color: getThemeColor('gray500'), isWin: false },
    ];

    let winningPrize: InstantPrize | null = null;

    if (hasWin && ticket?.instantWin?.prize) {
      const prize = ticket.instantWin.prize;
      winningPrize = {
        id: 'win',
        name: prize.name,
        value: prize.value,
        icon: prize.value > 100 ? FaTrophy : prize.value > 50 ? FaGift : FaCoins,
        color: prize.value > 100 ? getThemeColor('warning') : prize.value > 50 ? getThemeColor('primary') : getThemeColor('success'),
        isWin: true,
        description: prize.description
      };
    }

    const prizes: InstantPrize[] = [];
    for (let i = 0; i < 20; i++) {
      if (i === 10 && winningPrize) {
        prizes.push(winningPrize);
      } else {
        prizes.push({ ...commonPrizes[i % commonPrizes.length], id: `prize-${i}` });
      }
    }

    return prizes;
  };

  const handleRevealAll = () => {
    if (isRevealing) return;

    setIsRevealing(true);
    let wins = 0;
    let value = 0;

    // Start all spinners with slight delays
    ticketReveals.forEach((ticketReveal, index) => {
      setTimeout(() => {
        const spinnerRef = ticketReveal.spinnerRef.current;
        if (spinnerRef) {
          const targetPosition = -900; // Adjusted for smaller size
          const duration = 2500 + Math.random() * 500;

          spinnerRef.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
          spinnerRef.style.transform = `translateX(${targetPosition}px)`;

          setTimeout(() => {
            const prize = ticketReveal.prizes[10];
            setTicketReveals(prev => {
              const updated = [...prev];
              updated[index] = {
                ...updated[index],
                revealedPrize: prize,
                isSpinning: false
              };
              return updated;
            });

            // Track wins
            if (prize.isWin) {
              wins++;
              value += prize.value;
              onTicketRevealed?.(ticketReveal.ticketNumber);
            }

            // Check if all are revealed
            if (index === ticketReveals.length - 1) {
              setTimeout(() => {
                setIsRevealing(false);
                setAllRevealed(true);
                setTotalWins(wins);
                setTotalValue(value);

                if (wins > 0) {
                  toast({
                    title: '🎉 Congratulations!',
                    description: `You won ${wins} instant prize${wins > 1 ? 's' : ''} worth £${value}!`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                  });
                }
              }, 500);
            }
          }, duration);
        }
      }, index * 100); // Stagger starts by 100ms
    });
  };

  const handleCloseModal = () => {
    if (!isRevealing) {
      // Call onComplete when closing after all reveals are done
      if (allRevealed) {
        onComplete?.();
      }
      onClose();
      setTicketReveals([]);
      setAllRevealed(false);
      setTotalWins(0);
      setTotalValue(0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="6xl"
      closeOnOverlayClick={!isRevealing}
      isCentered
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(8px)" />
      <ModalContent
        bg={getThemeColor('dark')}
        border="2px"
        borderColor={getThemeColor('primary')}
        color={getThemeColor('white')}
        shadow="2xl"
        maxW="1200px"
      >
        <ModalHeader borderBottom="1px" borderColor={getThemeColor('secondary')}>
          <VStack spacing={2} align="center">
            <Text fontSize="2xl" fontWeight="bold" color={getThemeColor('accent')}>
              Instant Prize Reveal
            </Text>
            <Badge bg={getThemeColor('primary')} color={getThemeColor('white')} variant="solid" fontSize="md" px={3} py={1}>
              {tickets.length} Ticket{tickets.length > 1 ? 's' : ''}
            </Badge>
          </VStack>
        </ModalHeader>

        <ModalBody py={6} maxH="70vh" overflowY="auto">
          <VStack spacing={4}>
            {!allRevealed && (
              <Text
                fontSize="lg"
                textAlign="center"
                color={getThemeColor('gray300')}
                fontWeight="medium"
                mb={2}
              >
                All your tickets will spin simultaneously to reveal instant prizes!
              </Text>
            )}

            {allRevealed && totalWins > 0 && (
              <Box
                w="full"
                p={4}
                bg={getThemeColor('warning')}
                borderRadius="lg"
                textAlign="center"
                animation={`${pulseGlow} 2s infinite`}
              >
                <Text fontSize="xl" fontWeight="bold" color={getThemeColor('dark')}>
                  🎊 {totalWins} WINNING TICKET{totalWins > 1 ? 'S' : ''}! Total: £{totalValue} 🎊
                </Text>
              </Box>
            )}

            {/* Ticket Grid */}
            <VStack spacing={2} w="full">
              {ticketReveals.map((ticketReveal) => (
                <Box key={ticketReveal.ticketNumber} w="full">
                  <HStack spacing={2} mb={1}>
                    <Badge variant="outline" colorScheme="cyan" fontSize="xs">
                      #{ticketReveal.ticketNumber}
                    </Badge>
                  </HStack>

                  <Box
                    position="relative"
                    w="full"
                    h="80px"
                    overflow="hidden"
                    borderRadius="md"
                    border="2px solid"
                    borderColor={ticketReveal.revealedPrize?.isWin ? getThemeColor('warning') : getThemeColor('secondary')}
                    bg={getThemeColor('light')}
                    animation={ticketReveal.revealedPrize?.isWin ? `${pulseGlow} 2s infinite` : undefined}
                  >
                    {/* Center indicator */}
                    <Center
                      position="absolute"
                      left="50%"
                      top="0"
                      h="full"
                      w="1px"
                      bg={getThemeColor('error')}
                      zIndex={2}
                      transform="translateX(-50%)"
                    >
                      <Box
                        position="absolute"
                        top="-6px"
                        w="0"
                        h="0"
                        borderLeft="6px solid transparent"
                        borderRight="6px solid transparent"
                        borderTop={`8px solid ${getThemeColor('error')}`}
                      />
                      <Box
                        position="absolute"
                        bottom="-6px"
                        w="0"
                        h="0"
                        borderLeft="6px solid transparent"
                        borderRight="6px solid transparent"
                        borderBottom={`8px solid ${getThemeColor('error')}`}
                      />
                    </Center>

                    {/* Prize spinner */}
                    <HStack
                      ref={ticketReveal.spinnerRef}
                      position="absolute"
                      h="full"
                      spacing={2}
                      px={2}
                      align="center"
                      style={{ transform: 'translateX(0)' }}
                    >
                      {ticketReveal.prizes.map((prize) => (
                        <Flex
                          key={prize.id}
                          direction="column"
                          align="center"
                          justify="center"
                          minW="80px"
                          h="60px"
                          bg={prize.isWin ? getThemeColor('warning') : getThemeColor('secondary')}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={prize.isWin ? getThemeColor('accent') : getThemeColor('dark')}
                          p={2}
                        >
                          <Icon as={prize.icon} boxSize={5} color={prize.color} mb={1} />
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            textAlign="center"
                            color={prize.isWin ? getThemeColor('dark') : getThemeColor('gray300')}
                            noOfLines={1}
                          >
                            {prize.name}
                          </Text>
                          {prize.value > 0 && (
                            <Badge
                              bg={getThemeColor('success')}
                              color={getThemeColor('white')}
                              variant="solid"
                              fontSize="xs"
                              mt={1}
                            >
                              £{prize.value}
                            </Badge>
                          )}
                        </Flex>
                      ))}
                    </HStack>

                    {/* Result overlay */}
                    {ticketReveal.revealedPrize && (
                      <Center
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        bg={ticketReveal.revealedPrize.isWin ? getThemeColor('success') : getThemeColor('gray700')}
                        borderRadius="md"
                        px={3}
                        py={1}
                      >
                        <Text fontSize="sm" fontWeight="bold" color="white">
                          {ticketReveal.revealedPrize.isWin ? `WON £${ticketReveal.revealedPrize.value}!` : 'No Win'}
                        </Text>
                      </Center>
                    )}
                  </Box>
                </Box>
              ))}
            </VStack>

            {allRevealed && (
              <Box textAlign="center" pt={4}>
                {totalWins === 0 ? (
                  <>
                    <Icon as={FaStar} boxSize={12} color={getThemeColor('gray500')} mb={2} />
                    <Text fontSize="lg" color={getThemeColor('gray300')}>
                      No instant wins this time, but you&apos;re still in the main draw!
                    </Text>
                  </>
                ) : (
                  <>
                    <Icon as={FaTrophy} boxSize={12} color={getThemeColor('warning')} mb={2} />
                    <Text fontSize="lg" color={getThemeColor('white')}>
                      Plus you&apos;re entered in the main draw!
                    </Text>
                  </>
                )}
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px" borderColor={getThemeColor('secondary')}>
          <HStack spacing={3}>
            {!allRevealed && !isRevealing && (
              <Button
                size="lg"
                bg={getThemeColor('success')}
                color={getThemeColor('white')}
                _hover={{ bg: getThemeColor('primaryDark'), transform: 'translateY(-2px)' }}
                _active={{ bg: getThemeColor('primaryDark') }}
                onClick={handleRevealAll}
                leftIcon={<Icon as={FaGift} />}
                shadow="lg"
                fontWeight="bold"
                px={8}
              >
                Reveal All Tickets
              </Button>
            )}
            {isRevealing && (
              <Button
                size="lg"
                isLoading
                loadingText="Revealing..."
                bg={getThemeColor('primary')}
                color={getThemeColor('white')}
              />
            )}
            {allRevealed && (
              <Button
                size="lg"
                bg={getThemeColor('primary')}
                color={getThemeColor('white')}
                _hover={{ bg: getThemeColor('primaryDark') }}
                onClick={handleCloseModal}
              >
                Continue
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}