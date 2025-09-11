import Image from 'next/image';
import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  Text, 
  Button, 
  Badge, 
  Progress, 
  VStack, 
  HStack, 
  Avatar, 
  Alert, 
  AlertIcon, 
  Flex,
  Spacer,
  useDisclosure
} from '@chakra-ui/react';
import { Competition } from '@/types/api';
import TicketPurchaseModal from './TicketPurchaseModal';
import { useAuth } from '@/contexts/AuthContext';

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [localCompetition, setLocalCompetition] = useState(competition);
  const formatPrice = (price: string) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getProgressPercentage = () => {
    if (localCompetition.maxTickets === 0) return 0;
    return Math.round((localCompetition.ticketsSold / localCompetition.maxTickets) * 100);
  };

  const handlePurchaseSuccess = () => {
    // Refresh competition data or update local state
    // In a real app, you might want to refetch the competition data
    // For now, we'll just show the modal closed
    console.log('Purchase successful');
  };

  const handlePurchaseClick = () => {
    if (!user) {
      // Could redirect to login or show login modal
      alert('Please log in to purchase tickets');
      return;
    }
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'UPCOMING': return 'blue';
      case 'SOLD_OUT': return 'red';
      case 'COMPLETED': return 'gray';
      default: return 'gray';
    }
  };

  const getButtonProps = () => {
    if (localCompetition.status === 'SOLD_OUT') 
      return { colorScheme: 'red', isDisabled: true };
    if (localCompetition.status === 'COMPLETED') 
      return { colorScheme: 'gray', isDisabled: true };
    if (localCompetition.status === 'UPCOMING') 
      return { colorScheme: 'blue', isDisabled: true };
    return { colorScheme: 'blue', isDisabled: false };
  };

  const getButtonText = () => {
    switch (localCompetition.status) {
      case 'SOLD_OUT': return 'Sold Out';
      case 'COMPLETED': return 'Completed';
      case 'UPCOMING': return 'Coming Soon';
      default: return 'Buy Tickets';
    }
  };

  return (
    <Card 
      maxW="sm" 
      shadow="xl" 
      _hover={{ shadow: "2xl" }} 
      transition="all 0.3s"
      overflow="hidden"
    >
      {/* Competition Image */}
      <Box position="relative" h="200px">
        {localCompetition.imageUrl ? (
          <Image
            src={localCompetition.imageUrl}
            alt={localCompetition.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box 
            w="full" 
            h="full" 
            bgGradient="linear(to-br, blue.500, purple.600)" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Text color="white" fontSize="xl" fontWeight="semibold">
              No Image
            </Text>
          </Box>
        )}
        
        {/* Status Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={getStatusColor(localCompetition.status)}
          variant="solid"
          borderRadius="md"
        >
          {localCompetition.status.replace('_', ' ')}
        </Badge>
      </Box>

      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Charity Info */}
          <HStack spacing={2}>
            <Avatar
              size="xs"
              src={localCompetition.charity.logoUrl}
              name={localCompetition.charity.name}
            />
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {localCompetition.charity.name}
              {localCompetition.charity.isVerified && (
                <Badge ml={1} colorScheme="blue" variant="solid" fontSize="xs">
                  ✓
                </Badge>
              )}
            </Text>
          </HStack>

          {/* Title */}
          <Heading 
            as="h3" 
            size="md" 
            noOfLines={2}
            color="gray.800"
          >
            {localCompetition.title}
          </Heading>

          {/* Description */}
          <Text 
            fontSize="sm" 
            color="gray.600" 
            noOfLines={3}
          >
            {localCompetition.description}
          </Text>

          {/* Progress Bar */}
          <Box>
            <Flex justify="space-between" fontSize="sm" color="gray.600" mb={2}>
              <Text>{localCompetition.ticketsSold} tickets sold</Text>
              <Text>{localCompetition.maxTickets} max</Text>
            </Flex>
            <Progress 
              value={getProgressPercentage()} 
              colorScheme="blue" 
              size="md" 
              borderRadius="md"
            />
            <Text 
              textAlign="center" 
              fontSize="xs" 
              color="gray.500" 
              mt={1}
            >
              {getProgressPercentage()}% sold
            </Text>
          </Box>

          {/* Prizes Info */}
          <Alert status="info" borderRadius="md" py={2}>
            <AlertIcon boxSize={4} />
            <Box fontSize="xs">
              <Text fontWeight="semibold">
                {localCompetition._count.prizes} prize{localCompetition._count.prizes !== 1 ? 's' : ''}
              </Text>
              {localCompetition.prizes.length > 0 && (
                <Text>
                  Top: {localCompetition.prizes[0].name} ({formatPrice(localCompetition.prizes[0].value)})
                </Text>
              )}
            </Box>
          </Alert>

          {/* Ticket Price & Draw Date */}
          <Flex justify="space-between" align="center">
            <Badge 
              colorScheme="green" 
              variant="solid" 
              fontSize="sm" 
              px={3} 
              py={1}
              borderRadius="md"
            >
              {formatPrice(localCompetition.ticketPrice)} per ticket
            </Badge>
            <Text fontSize="sm" color="gray.600">
              Draw: {formatDate(localCompetition.drawDate)}
            </Text>
          </Flex>

          {/* Action Button */}
          <Button 
            {...getButtonProps()}
            w="full"
            size="md"
            onClick={localCompetition.status === 'ACTIVE' ? handlePurchaseClick : undefined}
          >
            {getButtonText()}
          </Button>
        </VStack>
      </CardBody>

      {/* Purchase Modal */}
      <TicketPurchaseModal
        isOpen={isOpen}
        onClose={onClose}
        competition={localCompetition}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </Card>
  );
}