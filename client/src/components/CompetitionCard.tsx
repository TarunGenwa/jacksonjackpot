import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaClock, FaTicketAlt, FaTrophy } from 'react-icons/fa';
import { Competition } from '@/types/api';

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const router = useRouter();
  const [localCompetition, setLocalCompetition] = useState(competition);

  // Update local state when prop changes
  useEffect(() => {
    setLocalCompetition(competition);
  }, [competition]);
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
      w="full"
      h="220px"
      shadow="md"
      _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
      transition="all 0.2s"
      overflow="hidden"
      cursor="pointer"
      onClick={handleCardClick}
      bg="white"
    >
      <CardBody p={0} h="full">
        <HStack spacing={0} h="full">
          {/* Left side - Image */}
          <Box position="relative" w="140px" h="full" flexShrink={0}>
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
                <Icon as={FaTrophy} color="white" boxSize={6} />
              </Box>
            )}

            {/* Status Badge */}
            <Badge
              position="absolute"
              top={2}
              left={2}
              colorScheme={getStatusColor(localCompetition.status)}
              variant="solid"
              fontSize="xs"
              borderRadius="sm"
            >
              {localCompetition.status}
            </Badge>
          </Box>

          {/* Right side - Content */}
          <VStack flex={1} p={4} spacing={3} align="stretch" h="full">
            {/* Title and Price */}
            <Flex justify="space-between" align="flex-start" mb={1}>
              <Heading
                as="h3"
                size="md"
                noOfLines={2}
                color="gray.800"
                flex={1}
                mr={3}
                lineHeight="1.4"
                fontSize="16px"
              >
                {localCompetition.title}
              </Heading>
              <Badge
                colorScheme="green"
                variant="solid"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="md"
                flexShrink={0}
                fontWeight="bold"
              >
                {formatPrice(localCompetition.ticketPrice)}
              </Badge>
            </Flex>

            {/* Key Info Row */}
            <HStack spacing={3} fontSize="sm" color="gray.600" flexWrap="wrap">
              <HStack spacing={1} minW="fit-content">
                <Icon as={FaClock} boxSize={3} />
                <Text fontWeight="medium" whiteSpace="nowrap">{getRemainingTime()}</Text>
              </HStack>
              <HStack spacing={1} minW="fit-content">
                <Icon as={FaTicketAlt} boxSize={3} />
                <Text whiteSpace="nowrap">{localCompetition.ticketsSold}/{localCompetition.maxTickets}</Text>
              </HStack>
              <HStack spacing={1} minW="fit-content">
                <Icon as={FaTrophy} boxSize={3} />
                <Text fontWeight="medium" color="green.600" whiteSpace="nowrap">{getPrizePool()}</Text>
              </HStack>
            </HStack>

            {/* Progress Bar */}
            <Box>
              <Progress
                value={getProgressPercentage()}
                colorScheme="blue"
                size="md"
                borderRadius="md"
                bg="gray.100"
              />
              <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                {getProgressPercentage()}% sold
              </Text>
            </Box>

            {/* Action Button */}
            <Button
              size="md"
              colorScheme="blue"
              variant="solid"
              w="full"
              onClick={handleViewDetailsClick}
              fontSize="sm"
              h="36px"
              fontWeight="semibold"
            >
              Buy Tickets
            </Button>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
}