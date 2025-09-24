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
import { useState, useEffect } from 'react';
import InstantWinSpinner from './InstantWinSpinner';

export default function UnrevealedTicketsNotification() {
  const { unrevealedTickets, markTicketsAsRevealed, hasUnrevealedTickets } = useUnrevealedTickets();
  const { getThemeColor } = useTheme();
  const [showSpinner, setShowSpinner] = useState(false);
  const [hasAutoShown, setHasAutoShown] = useState(false);

  // Auto-show spinner when component mounts if there are unrevealed tickets
  useEffect(() => {
    if (hasUnrevealedTickets && !hasAutoShown) {
      // Small delay to ensure smooth rendering
      const timer = setTimeout(() => {
        setShowSpinner(true);
        setHasAutoShown(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasUnrevealedTickets, hasAutoShown]);

  if (!hasUnrevealedTickets) {
    return null;
  }

  const handleSpinnerComplete = () => {
    // Mark ALL tickets as revealed when spinner completes
    const allTicketNumbers = unrevealedTickets.map(ticket => ticket.ticketNumber);
    markTicketsAsRevealed(allTicketNumbers);
    setShowSpinner(false);
    setHasAutoShown(true); // Prevent auto-showing again in this session
  };

  const handleSpinnerClose = () => {
    // Mark ALL tickets as revealed when user closes the spinner
    const allTicketNumbers = unrevealedTickets.map(ticket => ticket.ticketNumber);
    markTicketsAsRevealed(allTicketNumbers);
    setShowSpinner(false);
    setHasAutoShown(true);
  };

  // Don't show any notification UI - only the spinner modal
  return (
    <>
      {/* Instant Win Spinner for unrevealed tickets */}
      <InstantWinSpinner
        isOpen={showSpinner}
        onClose={handleSpinnerClose}
        tickets={unrevealedTickets}
        onComplete={handleSpinnerComplete}
        onTicketRevealed={() => {}} // We handle all reveals at once in onComplete
      />
    </>
  );
}