'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Progress,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  Flex,
  Spacer,
  Avatar,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaTrophy, FaUsers, FaClock, FaTicketAlt, FaHeart } from 'react-icons/fa';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';
import { useAuth } from '@/contexts/AuthContext';
import TicketPurchaseModal from '@/components/TicketPurchaseModal';

export default function CompetitionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the specific competition by ID
        // For now, we'll simulate it with a mock competition
        const mockCompetition: Competition = {
          id: params.id as string,
          title: 'Win a Dream Vacation to the Maldives',
          description: 'Experience luxury at its finest with a 7-day all-inclusive vacation to the beautiful Maldives. This prize includes flights, accommodation at a 5-star resort, meals, and exciting water activities.',
          imageUrl: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
          ticketPrice: '5.00',
          maxTickets: 1000,
          ticketsSold: 750,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-03-01T00:00:00Z',
          drawDate: '2024-03-15T12:00:00Z',
          status: 'ACTIVE',
          charity: {
            id: '1',
            name: 'Ocean Conservation Fund',
            description: 'Protecting marine life worldwide',
            logoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop',
            website: 'https://oceanconservation.org',
            email: 'contact@oceanconservation.org',
            taxId: 'REG123456',
            isVerified: true,
            bankAccountNumber: '',
            bankSortCode: '',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          prizes: [
            {
              id: '1',
              competitionId: params.id as string,
              name: 'Maldives Vacation',
              description: '7-day luxury vacation',
              value: '8000.00',
              position: 1,
              quantity: 1,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCompetition(mockCompetition);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch competition:', err);
        setError('Failed to load competition. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompetition();
    }
  }, [params.id]);

  const formatPrice = (price: string) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRemainingTime = () => {
    if (!competition) return '';

    const now = new Date();
    const drawDate = new Date(competition.drawDate);
    const diffMs = drawDate.getTime() - now.getTime();

    if (diffMs <= 0) return 'Draw closed';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!competition || competition.maxTickets === 0) return 0;
    return Math.round((competition.ticketsSold / competition.maxTickets) * 100);
  };

  const getPrizePool = () => {
    if (!competition) return '£0';
    const ticketPrice = parseFloat(competition.ticketPrice);
    const ticketsSold = competition.ticketsSold;
    const prizePool = ticketPrice * ticketsSold;
    return formatPrice(prizePool.toString());
  };

  const handlePurchaseClick = () => {
    if (!user) {
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
    if (!competition) return { colorScheme: 'gray', isDisabled: true };

    if (competition.status === 'SOLD_OUT')
      return { colorScheme: 'red', isDisabled: true };
    if (competition.status === 'COMPLETED')
      return { colorScheme: 'gray', isDisabled: true };
    if (competition.status === 'UPCOMING')
      return { colorScheme: 'blue', isDisabled: true };
    return { colorScheme: 'blue', isDisabled: false };
  };

  const getButtonText = () => {
    if (!competition) return 'Loading...';

    switch (competition.status) {
      case 'SOLD_OUT': return 'Sold Out';
      case 'COMPLETED': return 'Completed';
      case 'UPCOMING': return 'Coming Soon';
      default: return 'Buy Tickets';
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Loading competition...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error || !competition) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Alert status="error" maxW="md" borderRadius="md">
                <AlertIcon />
                {error || 'Competition not found'}
              </Alert>
              <Button
                colorScheme="blue"
                onClick={() => router.push('/competitions')}
                leftIcon={<ArrowBackIcon />}
              >
                Back to Competitions
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/competitions">Competitions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{competition.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Main Content */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Left Column - Image and Basic Info */}
            <VStack spacing={6} align="stretch">
              {/* Competition Image */}
              <Card overflow="hidden" shadow="xl">
                <Box position="relative" h="400px">
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
                    top={4}
                    left={4}
                    colorScheme={getStatusColor(competition.status)}
                    variant="solid"
                    borderRadius="md"
                    fontSize="sm"
                    px={3}
                    py={1}
                  >
                    {competition.status.replace('_', ' ')}
                  </Badge>
                </Box>
              </Card>

              {/* Charity Info */}
              <Card shadow="lg">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.800">
                      Supporting Charity
                    </Heading>
                    <HStack spacing={4}>
                      <Avatar
                        src={competition.charity.logoUrl}
                        name={competition.charity.name}
                        size="lg"
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading size="sm" color="blue.600">
                          {competition.charity.name}
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          {competition.charity.description}
                        </Text>
                        {competition.charity.isVerified && (
                          <Badge colorScheme="green" variant="subtle">
                            Verified Charity
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Right Column - Details and Purchase */}
            <VStack spacing={6} align="stretch">
              {/* Title and Description */}
              <Card shadow="lg">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Heading as="h1" size="xl" color="gray.800">
                      {competition.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="tall">
                      {competition.description}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Stats */}
              <SimpleGrid columns={2} spacing={4}>
                <Card shadow="md">
                  <CardBody textAlign="center">
                    <Stat>
                      <StatLabel>
                        <Icon as={FaTicketAlt} mr={2} />
                        Ticket Price
                      </StatLabel>
                      <StatNumber color="green.500">
                        {formatPrice(competition.ticketPrice)}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card shadow="md">
                  <CardBody textAlign="center">
                    <Stat>
                      <StatLabel>
                        <Icon as={FaTrophy} mr={2} />
                        Prize Value
                      </StatLabel>
                      <StatNumber color="purple.500">
                        £{competition.prizes[0]?.value || '0'}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>

                <Card shadow="md">
                  <CardBody textAlign="center">
                    <Stat>
                      <StatLabel>
                        <Icon as={FaUsers} mr={2} />
                        Tickets Sold
                      </StatLabel>
                      <StatNumber color="blue.500">
                        {competition.ticketsSold.toLocaleString()}
                      </StatNumber>
                      <StatHelpText>
                        of {competition.maxTickets.toLocaleString()}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card shadow="md">
                  <CardBody textAlign="center">
                    <Stat>
                      <StatLabel>
                        <Icon as={FaClock} mr={2} />
                        Time Left
                      </StatLabel>
                      <StatNumber color="orange.500" fontSize="lg">
                        {getRemainingTime()}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Progress */}
              <Card shadow="lg">
                <CardBody>
                  <VStack spacing={4}>
                    <Flex w="full" justify="space-between" align="center">
                      <Text fontWeight="semibold" color="gray.700">
                        Competition Progress
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {getProgressPercentage()}% sold
                      </Text>
                    </Flex>
                    <Progress
                      value={getProgressPercentage()}
                      colorScheme="blue"
                      size="lg"
                      borderRadius="md"
                      w="full"
                    />
                    <Flex w="full" justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600">
                        {competition.ticketsSold} tickets sold
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {competition.maxTickets - competition.ticketsSold} remaining
                      </Text>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>

              {/* Purchase Button */}
              <Card shadow="lg" bg="blue.50" borderColor="blue.200">
                <CardBody>
                  <VStack spacing={4}>
                    <Text textAlign="center" fontSize="lg" fontWeight="semibold" color="gray.800">
                      Ready to enter this competition?
                    </Text>
                    <Button
                      {...getButtonProps()}
                      size="lg"
                      w="full"
                      onClick={handlePurchaseClick}
                    >
                      {getButtonText()}
                    </Button>
                    <Text fontSize="xs" color="gray.600" textAlign="center">
                      All proceeds support {competition.charity.name}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Important Dates */}
              <Card shadow="lg">
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    <Heading size="md" color="gray.800">
                      Important Dates
                    </Heading>
                    <HStack justify="space-between">
                      <Text color="gray.600">Competition Started:</Text>
                      <Text fontWeight="semibold">{formatDate(competition.startDate)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.600">Sales End:</Text>
                      <Text fontWeight="semibold">{formatDate(competition.endDate)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.600">Draw Date:</Text>
                      <Text fontWeight="semibold" color="orange.600">
                        {formatDate(competition.drawDate)}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Purchase Modal */}
      {competition && (
        <TicketPurchaseModal
          isOpen={isOpen}
          onClose={onClose}
          competition={competition}
          onPurchaseSuccess={() => {
            console.log('Purchase successful');
            onClose();
          }}
        />
      )}
    </Box>
  );
}