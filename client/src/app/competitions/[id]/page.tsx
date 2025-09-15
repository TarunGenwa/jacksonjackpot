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
      if (!params.id || typeof params.id !== 'string') return;

      try {
        setLoading(true);
        const data = await competitionsService.getById(params.id);
        setCompetition(data);
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
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
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

          {/* Unified Main Content Panel */}
          <Card shadow="lg" overflow="hidden">
            <CardBody p={4}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                {/* Left Column - Image and Charity */}
                <VStack spacing={3} align="stretch">
                  {/* Competition Image with embedded info */}
                  <Box position="relative" h="250px" borderRadius="md" overflow="hidden">
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
                      left={3}
                      colorScheme={getStatusColor(competition.status)}
                      variant="solid"
                      borderRadius="md"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      {competition.status.replace('_', ' ')}
                    </Badge>
                  </Box>

                  {/* Charity Info */}
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <HStack spacing={3}>
                      <Avatar
                        src={competition.charity.logoUrl}
                        name={competition.charity.name}
                        size="sm"
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" color="gray.600">Supporting</Text>
                        <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                          {competition.charity.name}
                        </Text>
                        {competition.charity.isVerified && (
                          <Badge colorScheme="green" variant="subtle" size="xs">
                            Verified
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                </VStack>

                {/* Right Column - All Details */}
                <VStack spacing={3} align="stretch">
                  {/* Title, Description, and Key Stats */}
                  <VStack spacing={2} align="stretch">
                    <Heading as="h1" size="md" color="gray.800" lineHeight="1.2">
                      {competition.title}
                    </Heading>
                    <Text color="gray.600" lineHeight="1.5" fontSize="xs" noOfLines={2}>
                      {competition.description}
                    </Text>
                  </VStack>

                  {/* Compact Stats Grid */}
                  <SimpleGrid columns={2} spacing={2}>
                    <Box textAlign="center" bg="green.50" p={2} borderRadius="md">
                      <HStack justify="center" spacing={1}>
                        <Icon as={FaTicketAlt} boxSize={3} color="green.600" />
                        <Text fontSize="xs" color="gray.600">Price</Text>
                      </HStack>
                      <Text fontWeight="bold" color="green.600" fontSize="sm">
                        {formatPrice(competition.ticketPrice)}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="purple.50" p={2} borderRadius="md">
                      <HStack justify="center" spacing={1}>
                        <Icon as={FaTrophy} boxSize={3} color="purple.600" />
                        <Text fontSize="xs" color="gray.600">Prize</Text>
                      </HStack>
                      <Text fontWeight="bold" color="purple.600" fontSize="sm">
                        £{competition.prizes[0]?.value || '0'}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="blue.50" p={2} borderRadius="md">
                      <HStack justify="center" spacing={1}>
                        <Icon as={FaUsers} boxSize={3} color="blue.600" />
                        <Text fontSize="xs" color="gray.600">Sold</Text>
                      </HStack>
                      <Text fontWeight="bold" color="blue.600" fontSize="sm">
                        {competition.ticketsSold}/{competition.maxTickets}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="orange.50" p={2} borderRadius="md">
                      <HStack justify="center" spacing={1}>
                        <Icon as={FaClock} boxSize={3} color="orange.600" />
                        <Text fontSize="xs" color="gray.600">Time</Text>
                      </HStack>
                      <Text fontWeight="bold" color="orange.600" fontSize="sm">
                        {getRemainingTime()}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Progress Bar */}
                  <Box>
                    <Flex w="full" justify="space-between" align="center" mb={1}>
                      <Text fontWeight="medium" color="gray.700" fontSize="xs">
                        Progress
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {getProgressPercentage()}% sold
                      </Text>
                    </Flex>
                    <Progress
                      value={getProgressPercentage()}
                      colorScheme="blue"
                      size="sm"
                      borderRadius="md"
                      w="full"
                    />
                    <Flex w="full" justify="space-between" align="center" mt={1}>
                      <Text fontSize="xs" color="gray.600">
                        {competition.ticketsSold} sold
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {competition.maxTickets - competition.ticketsSold} left
                      </Text>
                    </Flex>
                  </Box>

                  {/* Purchase Section */}
                  <Box bg="blue.50" p={3} borderRadius="md" border="1px" borderColor="blue.200">
                    <VStack spacing={2}>
                      <Text textAlign="center" fontSize="sm" fontWeight="medium" color="gray.800">
                        Ready to enter?
                      </Text>
                      <Button
                        {...getButtonProps()}
                        size="md"
                        w="full"
                        onClick={handlePurchaseClick}
                      >
                        {getButtonText()}
                      </Button>
                      <Text fontSize="xs" color="gray.600" textAlign="center">
                        Supporting {competition.charity.name}
                      </Text>
                    </VStack>
                  </Box>

                  {/* Important Dates */}
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="xs" fontWeight="medium" color="gray.800" mb={2}>
                      Important Dates
                    </Text>
                    <VStack spacing={1}>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600" fontSize="xs">Started:</Text>
                        <Text fontWeight="medium" fontSize="xs">{formatDate(competition.startDate)}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600" fontSize="xs">Sales End:</Text>
                        <Text fontWeight="medium" fontSize="xs">{formatDate(competition.endDate)}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600" fontSize="xs">Draw:</Text>
                        <Text fontWeight="medium" color="orange.600" fontSize="xs">
                          {formatDate(competition.drawDate)}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Purchase Modal */}
      {competition && (
        <TicketPurchaseModal
          isOpen={isOpen}
          onClose={onClose}
          competition={competition}
          onPurchaseSuccess={async () => {
            console.log('Purchase successful');
            // Refresh competition data to show updated ticket count
            if (params.id && typeof params.id === 'string') {
              try {
                const data = await competitionsService.getById(params.id);
                setCompetition(data);
              } catch (err) {
                console.error('Failed to refresh competition:', err);
              }
            }
            onClose();
          }}
        />
      )}
    </Box>
  );
}