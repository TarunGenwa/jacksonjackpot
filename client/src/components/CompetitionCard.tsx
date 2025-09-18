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
import { FaClock, FaTicketAlt, FaTrophy, FaGift, FaBolt, FaCalendarDay, FaCircle } from 'react-icons/fa';
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

  const getCategoryInfo = (category?: string) => {
    switch (category) {
      case 'Mystery Box':
        return { icon: FaGift, color: 'purple' };
      case 'Instant Win':
        return { icon: FaBolt, color: 'orange' };
      case 'Daily Free':
        return { icon: FaCalendarDay, color: 'green' };
      case 'Instant Spin':
        return { icon: FaCircle, color: 'blue' };
      default:
        return { icon: FaTrophy, color: 'gray' };
    }
  };

  const categoryInfo = getCategoryInfo((localCompetition as any).category);


  return (
    <Card
      w="full"
      shadow="xl"
      _hover={{ shadow: "2xl", transform: "translateY(-2px)", borderColor: "purple.400" }}
      transition="all 0.3s"
      overflow="hidden"
      cursor="pointer"
      onClick={handleCardClick}
      bgGradient="linear(to-br, purple.900, blue.900)"
      borderRadius="lg"
      border="1px"
      borderColor="purple.800"
    >
      <CardBody p={0}>
        <VStack spacing={0} align="stretch">
          {/* Top - Image Section */}
          <Box position="relative" w="full" aspectRatio={1}>
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
                bgGradient="linear(to-br, purple.700, blue.700)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaTrophy} color="white" boxSize={10} />
              </Box>
            )}

            {/* Status and Category Badges */}
            <HStack
              position="absolute"
              top={4}
              left={4}
              spacing={2}
            >
              {(localCompetition as any).category && (
                <Badge
                  colorScheme={categoryInfo.color}
                  variant="solid"
                  fontSize="sm"
                  borderRadius="md"
                  px={3}
                  py={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={categoryInfo.icon} boxSize={3} />
                  {(localCompetition as any).category}
                </Badge>
              )}
              <Badge
                colorScheme={getStatusColor(localCompetition.status)}
                variant="solid"
                fontSize="sm"
                borderRadius="md"
                px={3}
                py={1}
              >
                {localCompetition.status}
              </Badge>
            </HStack>

            {/* Price Badge */}
            <Badge
              position="absolute"
              top={4}
              right={4}
              bg="green.400"
              color="gray.900"
              fontSize="md"
              px={3}
              py={1}
              borderRadius="md"
              fontWeight="bold"
            >
              {formatPrice(localCompetition.ticketPrice)}
            </Badge>
          </Box>

          {/* Bottom - Content */}
          <VStack p={4} spacing={3} align="stretch">
            {/* Title */}
            <Heading
              as="h3"
              size="md"
              color="white"
              lineHeight="1.3"
              noOfLines={2}
            >
              {localCompetition.title}
            </Heading>

            {/* Description */}
            {localCompetition.description && (
              <Text
                color="gray.400"
                fontSize="sm"
                noOfLines={2}
              >
                {localCompetition.description}
              </Text>
            )}

            {/* Stats Grid */}
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between" py={1}>
                <HStack spacing={1}>
                  <Icon as={FaTrophy} boxSize={3} color="yellow.400" />
                  <Text fontSize="xs" color="gray.400">Prize</Text>
                </HStack>
                <Text fontWeight="bold" color="green.400" fontSize="sm">
                  {getPrizePool()}
                </Text>
              </HStack>

              <HStack justify="space-between" py={1}>
                <HStack spacing={1}>
                  <Icon as={FaClock} boxSize={3} color="blue.400" />
                  <Text fontSize="xs" color="gray.400">Time Left</Text>
                </HStack>
                <Text fontWeight="semibold" color="gray.200" fontSize="sm">
                  {getRemainingTime()}
                </Text>
              </HStack>

              <HStack justify="space-between" py={1}>
                <HStack spacing={1}>
                  <Icon as={FaTicketAlt} boxSize={3} color="purple.400" />
                  <Text fontSize="xs" color="gray.400">Tickets</Text>
                </HStack>
                <Text fontWeight="semibold" color="gray.200" fontSize="sm">
                  {localCompetition.ticketsSold} / {localCompetition.maxTickets}
                </Text>
              </HStack>
            </VStack>

            {/* Progress Bar */}
            <Box>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.300">
                  Progress
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="purple.400">
                  {getProgressPercentage()}%
                </Text>
              </Flex>
              <Progress
                value={getProgressPercentage()}
                colorScheme="purple"
                size="sm"
                borderRadius="full"
                bg="blackAlpha.400"
              />
            </Box>

            {/* Additional Details */}
            <HStack spacing={4} pt={1}>
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.400">Draw</Text>
                <Text fontSize="xs" fontWeight="semibold" color="gray.200">
                  {formatDate(localCompetition.drawDate)}
                </Text>
              </VStack>
              {localCompetition.charity && (
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="gray.400">Charity</Text>
                  <Text fontSize="xs" fontWeight="semibold" color="purple.400" noOfLines={1}>
                    {localCompetition.charity.name}
                  </Text>
                </VStack>
              )}
            </HStack>

            {/* Action Button */}
            <Button
              size="md"
              bg="green.400"
              color="gray.900"
              _hover={{
                bg: "green.300",
                transform: "translateY(-1px)"
              }}
              variant="solid"
              w="full"
              onClick={handleViewDetailsClick}
              fontSize="sm"
              h="40px"
              fontWeight="semibold"
              mt={1}
            >
              View Details
            </Button>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}