import Image from 'next/image';
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
  Spacer
} from '@chakra-ui/react';
import { Competition } from '@/types/api';

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
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
    if (competition.maxTickets === 0) return 0;
    return Math.round((competition.ticketsSold / competition.maxTickets) * 100);
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
    if (competition.status === 'SOLD_OUT') 
      return { colorScheme: 'red', isDisabled: true };
    if (competition.status === 'COMPLETED') 
      return { colorScheme: 'gray', isDisabled: true };
    if (competition.status === 'UPCOMING') 
      return { colorScheme: 'blue', isDisabled: true };
    return { colorScheme: 'blue', isDisabled: false };
  };

  const getButtonText = () => {
    switch (competition.status) {
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
        {competition.imageUrl ? (
          <Image
            src={competition.imageUrl}
            alt={competition.title}
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
          colorScheme={getStatusColor(competition.status)}
          variant="solid"
          borderRadius="md"
        >
          {competition.status.replace('_', ' ')}
        </Badge>
      </Box>

      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Charity Info */}
          <HStack spacing={2}>
            <Avatar
              size="xs"
              src={competition.charity.logoUrl}
              name={competition.charity.name}
            />
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {competition.charity.name}
              {competition.charity.isVerified && (
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
            {competition.title}
          </Heading>

          {/* Description */}
          <Text 
            fontSize="sm" 
            color="gray.600" 
            noOfLines={3}
          >
            {competition.description}
          </Text>

          {/* Progress Bar */}
          <Box>
            <Flex justify="space-between" fontSize="sm" color="gray.600" mb={2}>
              <Text>{competition.ticketsSold} tickets sold</Text>
              <Text>{competition.maxTickets} max</Text>
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
                {competition._count.prizes} prize{competition._count.prizes !== 1 ? 's' : ''}
              </Text>
              {competition.prizes.length > 0 && (
                <Text>
                  Top: {competition.prizes[0].name} ({formatPrice(competition.prizes[0].value)})
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
              {formatPrice(competition.ticketPrice)} per ticket
            </Badge>
            <Text fontSize="sm" color="gray.600">
              Draw: {formatDate(competition.drawDate)}
            </Text>
          </Flex>

          {/* Action Button */}
          <Button 
            {...getButtonProps()}
            w="full"
            size="md"
          >
            {getButtonText()}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}