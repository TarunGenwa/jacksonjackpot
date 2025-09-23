'use client';

import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  useDisclosure,
  Collapse,
  Icon,
  Flex
} from '@chakra-ui/react';
import { FaTicketAlt, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useUnrevealedTickets } from '@/contexts/UnrevealedTicketsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import InstantWinSpinner from './InstantWinSpinner';

export default function UnrevealedTicketsNotification() {
  const { unrevealedTickets, markTicketsAsRevealed, hasUnrevealedTickets } = useUnrevealedTickets();
  const { getThemeColor } = useTheme();
  const { isOpen: isExpanded, onToggle } = useDisclosure();
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<any[]>([]);

  if (!hasUnrevealedTickets) {
    return null;
  }

  // Group tickets by competition
  const ticketsByCompetition = unrevealedTickets.reduce((acc, ticket) => {
    if (!acc[ticket.competitionId]) {
      acc[ticket.competitionId] = {
        title: ticket.competitionTitle,
        tickets: []
      };
    }
    acc[ticket.competitionId].tickets.push(ticket);
    return acc;
  }, {} as Record<string, { title: string; tickets: any[] }>);

  const handleRevealTickets = (competitionTickets: any[]) => {
    setSelectedTickets(competitionTickets);
    setShowSpinner(true);
  };

  const handleTicketRevealed = (ticketNumber: string) => {
    markTicketsAsRevealed([ticketNumber]);
  };

  const handleSpinnerComplete = () => {
    setShowSpinner(false);
    setSelectedTickets([]);
  };

  const handleSpinnerClose = () => {
    setShowSpinner(false);
    setSelectedTickets([]);
  };

  return (
    <>
      <Box
        position="fixed"
        top="80px"
        right="20px"
        zIndex={1500}
        maxW="400px"
        w="full"
      >
        <Alert
          status="info"
          variant="left-accent"
          borderRadius="lg"
          bg={getThemeColor('light')}
          borderColor={getThemeColor('primary')}
          color={getThemeColor('dark')}
          shadow="xl"
          border="2px"
        >
          <AlertIcon color={getThemeColor('primary')} />
          <VStack align="stretch" flex={1} spacing={2}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <AlertTitle fontSize="md" color={getThemeColor('dark')}>
                  Unrevealed Tickets!
                </AlertTitle>
                <AlertDescription fontSize="sm" color={getThemeColor('gray700')}>
                  You have {unrevealedTickets.length} ticket{unrevealedTickets.length > 1 ? 's' : ''} with unrevealed instant wins
                </AlertDescription>
              </VStack>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggle}
                color={getThemeColor('primary')}
                _hover={{ bg: getThemeColor('secondary') }}
              >
                <Icon as={isExpanded ? FaChevronUp : FaChevronDown} />
              </Button>
            </HStack>

            <Collapse in={isExpanded}>
              <VStack spacing={3} align="stretch">
                {Object.entries(ticketsByCompetition).map(([competitionId, { title, tickets }]) => (
                  <Box
                    key={competitionId}
                    p={3}
                    bg={getThemeColor('white')}
                    borderRadius="md"
                    border="1px"
                    borderColor={getThemeColor('secondary')}
                  >
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="semibold" color={getThemeColor('dark')} noOfLines={1}>
                            {title}
                          </Text>
                          <HStack spacing={1}>
                            <Badge bg={getThemeColor('primary')} color={getThemeColor('white')} size="sm">
                              {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
                            </Badge>
                            <Text fontSize="xs" color={getThemeColor('gray500')}>
                              {tickets.map(t => t.ticketNumber).join(', ')}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                      <Button
                        size="sm"
                        bg={getThemeColor('accent')}
                        color={getThemeColor('white')}
                        _hover={{ bg: getThemeColor('accentDark') }}
                        leftIcon={<Icon as={FaEye} />}
                        onClick={() => handleRevealTickets(tickets)}
                        w="full"
                      >
                        Reveal Now
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Collapse>
          </VStack>
        </Alert>
      </Box>

      {/* Instant Win Spinner for unrevealed tickets */}
      <InstantWinSpinner
        isOpen={showSpinner}
        onClose={handleSpinnerClose}
        tickets={selectedTickets}
        onComplete={handleSpinnerComplete}
        onTicketRevealed={handleTicketRevealed}
      />
    </>
  );
}