import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from '@chakra-ui/react';
import { Competition } from '@/types/api';

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const router = useRouter();
  const [localCompetition, setLocalCompetition] = useState(competition);
  const formatPrice = (price: string) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const formatPrizePool = (price: string) => {
    const amount = parseFloat(price);
    return `£${amount % 1 === 0 ? amount.toString() : amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRemainingTime = () => {
    const now = new Date();
    const drawDate = new Date(localCompetition.drawDate);
    const diffMs = drawDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Draw closed';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getProgressPercentage = () => {
    if (localCompetition.maxTickets === 0) return 0;
    return Math.round((localCompetition.ticketsSold / localCompetition.maxTickets) * 100);
  };

  const getPrizePool = () => {
    const ticketPrice = parseFloat(localCompetition.ticketPrice);
    const ticketsSold = localCompetition.ticketsSold;
    const prizePool = ticketPrice * ticketsSold;
    return formatPrizePool(prizePool.toString());
  };


  const handleCardClick = () => {
    router.push(`/competitions/${localCompetition.id}`);
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    router.push(`/competitions/${localCompetition.id}`);
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


  return (
    <Card
      maxW="sm"
      shadow="xl"
      _hover={{ shadow: "2xl", transform: "translateY(-2px)" }}
      transition="all 0.3s"
      overflow="hidden"
      cursor="pointer"
      onClick={handleCardClick}
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
        
        {/* Time Remaining Badge */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme="orange"
          variant="solid"
          borderRadius="md"
        >
          {getRemainingTime()}
        </Badge>
        
        {/* Ticket Price Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme="green"
          variant="solid"
          borderRadius="md"
          fontSize="sm"
          px={3}
          py={1}
        >
          {formatPrice(localCompetition.ticketPrice)}
        </Badge>
      </Box>

      <CardBody p={6}>
        <VStack spacing={4} align="stretch">

          {/* Title */}
          <Heading 
            as="h3" 
            size="md" 
            noOfLines={2}
            color="gray.800"
          >
            {localCompetition.title}
          </Heading>


          {/* Progress Bar */}
          <Box>
            <Progress
              value={getProgressPercentage()}
              colorScheme="blue"
              size="lg"
              borderRadius="md"
              bg="gray.100"
            />
            <Text
              textAlign="center"
              fontSize="md"
              color="green.600"
              mt={2}
              fontWeight="bold"
            >
              {getPrizePool()} to win
            </Text>
          </Box>

          {/* Action Button */}
          <Button
            variant="solid"
            colorScheme="blue"
            size="md"
            w="full"
            onClick={handleViewDetailsClick}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>

    </Card>
  );
}