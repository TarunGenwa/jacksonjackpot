'use client';

import { useState, useRef } from 'react';
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
}

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
  100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
`;

export default function InstantWinSpinner({
  isOpen,
  onClose,
  tickets,
  onComplete
}: InstantWinSpinnerProps) {
  const { getColor, getThemeColor } = useTheme();
  const toast = useToast();
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedPrize, setRevealedPrize] = useState<InstantPrize | null>(null);
  const [allRevealed, setAllRevealed] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const generatePrizePool = (hasWin: boolean): InstantPrize[] => {
    const commonPrizes: InstantPrize[] = [
      { id: '1', name: 'Better Luck Next Time', value: 0, icon: FaStar, color: getThemeColor('text.muted'), isWin: false },
      { id: '2', name: 'Try Again', value: 0, icon: FaStar, color: getThemeColor('text.muted'), isWin: false },
      { id: '3', name: 'Almost There', value: 0, icon: FaStar, color: getThemeColor('text.muted'), isWin: false },
      { id: '4', name: 'Keep Playing', value: 0, icon: FaStar, color: getThemeColor('text.muted'), isWin: false },
    ];

    let winningPrize: InstantPrize | null = null;

    if (hasWin && tickets[currentTicketIndex]?.instantWin?.prize) {
      const prize = tickets[currentTicketIndex].instantWin.prize;
      winningPrize = {
        id: 'win',
        name: prize.name,
        value: prize.value,
        icon: prize.value > 100 ? FaTrophy : prize.value > 50 ? FaGift : FaCoins,
        color: prize.value > 100 ? getThemeColor('semantic.warning.light') : prize.value > 50 ? getThemeColor('brand.electricViolet') : getThemeColor('semantic.success.light'),
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

  const handleSpin = () => {
    if (isSpinning) return;

    const currentTicket = tickets[currentTicketIndex];
    const hasWin = !!currentTicket?.instantWin?.prize;
    const prizes = generatePrizePool(hasWin);

    setIsSpinning(true);

    if (spinnerRef.current) {
      const targetPosition = -1800; // Center position for the 10th item
      const duration = 3000 + Math.random() * 1000;

      spinnerRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      spinnerRef.current.style.transform = `translateX(${targetPosition}px)`;

      setTimeout(() => {
        setRevealedPrize(prizes[10]);
        setIsSpinning(false);

        if (hasWin) {
          toast({
            title: '🎉 Congratulations!',
            description: `You won: ${prizes[10].name}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top'
          });
        }
      }, duration);
    }
  };

  const handleNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      setCurrentTicketIndex(currentTicketIndex + 1);
      setRevealedPrize(null);
      if (spinnerRef.current) {
        spinnerRef.current.style.transition = 'none';
        spinnerRef.current.style.transform = 'translateX(0)';
      }
    } else {
      setAllRevealed(true);
      onComplete?.();
    }
  };

  const handleCloseModal = () => {
    if (!isSpinning) {
      onClose();
      setCurrentTicketIndex(0);
      setRevealedPrize(null);
      setAllRevealed(false);
    }
  };

  const currentTicket = tickets[currentTicketIndex];
  const prizes = generatePrizePool(!!currentTicket?.instantWin?.prize);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="4xl"
      closeOnOverlayClick={!isSpinning}
      isCentered
    >
      <ModalOverlay bg={getThemeColor('ui.overlay.dark')} backdropFilter="blur(8px)" />
      <ModalContent
        bg={getThemeColor('brand.valentino')}
        border="2px"
        borderColor={getColor('primary.600')}
        color={getColor('text.primary')}
        shadow="2xl"
        maxW="900px"
      >
        <ModalHeader borderBottom="1px" borderColor={getThemeColor('ui.border.light')}>
          <VStack spacing={2} align="center">
            <Text fontSize="2xl" fontWeight="bold" color={getThemeColor('brand.razzmatazz')}>
              Instant Prize Reveal
            </Text>
            <HStack spacing={3}>
              <Badge colorScheme="purple" variant="solid" fontSize="md" px={3} py={1}>
                Ticket: {currentTicket?.ticketNumber}
              </Badge>
              <Badge colorScheme="blue" variant="outline" fontSize="sm">
                {currentTicketIndex + 1} of {tickets.length}
              </Badge>
            </HStack>
          </VStack>
        </ModalHeader>

        <ModalBody py={8}>
          <VStack spacing={6}>
            {!allRevealed ? (
              <>
                <Text
                  fontSize="lg"
                  textAlign="center"
                  color={getColor('text.secondary')}
                  fontWeight="medium"
                >
                  {!revealedPrize
                    ? 'Spin to reveal if you\'ve won an instant prize!'
                    : revealedPrize.isWin
                      ? '🎊 WINNER! 🎊'
                      : 'Better luck with the main draw!'}
                </Text>

                <Box
                  position="relative"
                  w="full"
                  h="200px"
                  overflow="hidden"
                  borderRadius="lg"
                  border="3px solid"
                  borderColor={revealedPrize?.isWin ? getThemeColor('semantic.warning.light') : getColor('primary.500')}
                  bg={getThemeColor('ui.overlay.medium')}
                  animation={revealedPrize?.isWin ? `${pulseGlow} 2s infinite` : undefined}
                >
                  <Center
                    position="absolute"
                    left="50%"
                    top="0"
                    h="full"
                    w="2px"
                    bg={getColor('error.400')}
                    zIndex={2}
                    transform="translateX(-50%)"
                  >
                    <Box
                      position="absolute"
                      top="-10px"
                      w="0"
                      h="0"
                      borderLeft="10px solid transparent"
                      borderRight="10px solid transparent"
                      borderTop={`15px solid ${getColor('error.400')}`}
                    />
                    <Box
                      position="absolute"
                      bottom="-10px"
                      w="0"
                      h="0"
                      borderLeft="10px solid transparent"
                      borderRight="10px solid transparent"
                      borderBottom={`15px solid ${getColor('error.400')}`}
                    />
                  </Center>

                  <HStack
                    ref={spinnerRef}
                    position="absolute"
                    h="full"
                    spacing={4}
                    px={4}
                    align="center"
                    style={{ transform: 'translateX(0)' }}
                  >
                    {prizes.map((prize) => (
                      <Flex
                        key={prize.id}
                        direction="column"
                        align="center"
                        justify="center"
                        minW="150px"
                        h="150px"
                        bg={prize.isWin ? getThemeColor('semantic.warning.dark') : getThemeColor('ui.overlay.light')}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={prize.isWin ? getThemeColor('semantic.warning.light') : getThemeColor('ui.border.light')}
                        p={4}
                        position="relative"
                        _hover={{ transform: isSpinning ? 'none' : 'scale(1.05)' }}
                        transition="transform 0.2s"
                      >
                        <Icon as={prize.icon} boxSize={10} color={prize.color} mb={2} />
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          textAlign="center"
                          color={prize.isWin ? getThemeColor('semantic.warning.light') : getColor('text.primary')}
                        >
                          {prize.name}
                        </Text>
                        {prize.value > 0 && (
                          <Badge
                            colorScheme="green"
                            variant="solid"
                            mt={2}
                            fontSize="md"
                          >
                            £{prize.value}
                          </Badge>
                        )}
                      </Flex>
                    ))}
                  </HStack>
                </Box>

                {revealedPrize && (
                  <Box
                    p={6}
                    bg={revealedPrize.isWin ? getThemeColor('semantic.warning.dark') : getThemeColor('ui.overlay.light')}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={revealedPrize.isWin ? getThemeColor('semantic.warning.light') : getThemeColor('ui.border.light')}
                    w="full"
                    textAlign="center"
                  >
                    <VStack spacing={3}>
                      <Icon
                        as={revealedPrize.icon}
                        boxSize={16}
                        color={revealedPrize.color}
                      />
                      <Text fontSize="xl" fontWeight="bold" color={getColor('text.primary')}>
                        {revealedPrize.name}
                      </Text>
                      {revealedPrize.value > 0 && (
                        <Text fontSize="3xl" fontWeight="bold" color={getThemeColor('semantic.success.light')}>
                          £{revealedPrize.value}
                        </Text>
                      )}
                      {revealedPrize.description && (
                        <Text fontSize="md" color={getColor('text.secondary')}>
                          {revealedPrize.description}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={8}>
                <Icon as={FaTrophy} boxSize={20} color={getThemeColor('semantic.warning.light')} mb={4} />
                <Text fontSize="2xl" fontWeight="bold" mb={2} color={getColor('text.primary')}>
                  All Tickets Revealed!
                </Text>
                <Text fontSize="lg" color={getColor('text.secondary')}>
                  Good luck in the main draw!
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px" borderColor={getThemeColor('ui.border.light')}>
          <HStack spacing={3}>
            {!allRevealed && (
              <>
                {!revealedPrize && (
                  <Button
                    size="lg"
                    bg={getColor('success.400')}
                    color={getColor('neutral.900')}
                    _hover={{ bg: getColor('success.300'), transform: 'translateY(-2px)' }}
                    _active={{ bg: getColor('success.500') }}
                    onClick={handleSpin}
                    isLoading={isSpinning}
                    loadingText="Spinning..."
                    leftIcon={<Icon as={FaGift} />}
                    shadow="lg"
                    fontWeight="bold"
                    px={8}
                  >
                    Spin to Reveal
                  </Button>
                )}
                {revealedPrize && currentTicketIndex < tickets.length - 1 && (
                  <Button
                    size="lg"
                    colorScheme="purple"
                    onClick={handleNextTicket}
                    rightIcon={<Text>→</Text>}
                  >
                    Next Ticket ({currentTicketIndex + 2}/{tickets.length})
                  </Button>
                )}
                {revealedPrize && currentTicketIndex === tickets.length - 1 && (
                  <Button
                    size="lg"
                    colorScheme="green"
                    onClick={handleCloseModal}
                  >
                    Complete
                  </Button>
                )}
              </>
            )}
            {allRevealed && (
              <Button
                size="lg"
                colorScheme="purple"
                onClick={handleCloseModal}
              >
                Close
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}