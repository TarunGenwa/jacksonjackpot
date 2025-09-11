'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  Image,
  Progress,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react';
import { SearchIcon, CalendarIcon } from '@chakra-ui/icons';
import { FaTicketAlt, FaTrophy, FaClock } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { ticketsService, UserTicket } from '@/services/tickets';

interface Ticket {
  id: string;
  ticketNumber: string;
  competitionId: string;
  competitionTitle: string;
  competitionDescription: string;
  competitionImageUrl?: string;
  charityName: string;
  ticketPrice: number;
  purchasePrice: number;
  status: string;
  purchasedAt: string;
  drawDate: string;
  isWinner?: boolean;
  prizeWon?: string;
  prizeValue?: number;
}

export default function MyTicketsPage() {
  const { user } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('purchasedAt');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userTickets = await ticketsService.getMyTickets();
        setTickets(userTickets);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  // Use real tickets or fallback to empty array
  const displayTickets = tickets.length > 0 ? tickets : [];

  const filteredTickets = displayTickets.filter(ticket => {
    const matchesSearch = ticket.competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.competition.charity.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'purchasedAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'drawDate':
        return new Date(a.competition.drawDate).getTime() - new Date(b.competition.drawDate).getTime();
      case 'competitionTitle':
        return a.competition.title.localeCompare(b.competition.title);
      case 'ticketPrice':
        return parseFloat(b.purchasePrice) - parseFloat(a.purchasePrice);
      default:
        return 0;
    }
  });

  const getStatusCounts = () => {
    return {
      ALL: displayTickets.length,
      ACTIVE: displayTickets.filter(t => t.status === 'ACTIVE').length,
      WINNER: displayTickets.filter(t => t.status === 'WINNER').length,
      EXPIRED: displayTickets.filter(t => t.status === 'EXPIRED').length,
    };
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'WINNER': return 'purple';
      case 'EXPIRED': return 'gray';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '🎫';
      case 'WINNER': return '🏆';
      case 'EXPIRED': return '⏰';
      case 'CANCELLED': return '❌';
      default: return '🎫';
    }
  };

  const isDrawSoon = (drawDate: string) => {
    const draw = new Date(drawDate);
    const now = new Date();
    const diffHours = (draw.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 48; // Draw is within 48 hours
  };

  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Please log in to view your tickets.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <VStack spacing={4} justify="center" minH="50vh">
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600">Loading your tickets...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <VStack spacing={4} justify="center" minH="50vh">
            <Alert status="error" maxW="md" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
            <Button 
              colorScheme="blue" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Icon as={FaTicketAlt} boxSize={16} color="blue.500" />
            <Heading as="h1" size="2xl" color="gray.800">
              My Tickets
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Track your competition entries and check for wins
            </Text>
          </VStack>

          {/* Statistics */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Card shadow="md" textAlign="center">
              <CardBody p={6}>
                <VStack spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                    {displayTickets.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Total Tickets
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card shadow="md" textAlign="center">
              <CardBody p={6}>
                <VStack spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">
                    {statusCounts.ACTIVE}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Active Entries
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card shadow="md" textAlign="center">
              <CardBody p={6}>
                <VStack spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                    {statusCounts.WINNER}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Winning Tickets
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card shadow="md" textAlign="center">
              <CardBody p={6}>
                <VStack spacing={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                    {formatAmount(displayTickets.reduce((sum, ticket) => sum + parseFloat(ticket.purchasePrice), 0))}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Total Spent
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Filters and Search */}
          <Card shadow="md">
            <CardBody>
              <VStack spacing={4}>
                {/* Search Bar */}
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by competition, ticket number, or charity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                  />
                </InputGroup>

                {/* Filters */}
                <Flex 
                  direction={{ base: 'column', md: 'row' }} 
                  gap={4} 
                  w="full" 
                  align={{ base: 'stretch', md: 'center' }}
                >
                  <VStack align="start" spacing={2} flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Filter by Status
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={statusFilter === status ? 'solid' : 'outline'}
                          colorScheme={statusFilter === status ? 'blue' : 'gray'}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status === 'ALL' ? 'All' : status} ({count})
                        </Button>
                      ))}
                    </HStack>
                  </VStack>

                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Sort by
                    </Text>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      size="sm"
                      maxW="200px"
                      bg="white"
                    >
                      <option value="purchasedAt">Purchase Date</option>
                      <option value="drawDate">Draw Date</option>
                      <option value="competitionTitle">Competition Name</option>
                      <option value="ticketPrice">Ticket Price</option>
                    </Select>
                  </VStack>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Results Summary */}
          <Flex justify="space-between" align="center">
            <Text color="gray.600">
              Showing {sortedTickets.length} of {displayTickets.length} tickets
            </Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                Search: "{searchTerm}"
              </Badge>
            )}
          </Flex>

          {/* Tickets Grid */}
          {sortedTickets.length === 0 ? (
            <Card maxW="2xl" mx="auto" shadow="xl">
              <CardBody py={16} textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="6xl">🎫</Text>
                  <Heading size="xl" color="gray.700">
                    No Tickets Found
                  </Heading>
                  <Text color="gray.600">
                    {searchTerm || statusFilter !== 'ALL'
                      ? 'Try adjusting your search or filters.'
                      : 'You haven\'t purchased any tickets yet. Browse competitions to get started!'
                    }
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {sortedTickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  shadow="lg" 
                  _hover={{ shadow: "xl" }} 
                  transition="all 0.3s"
                  overflow="hidden"
                  position="relative"
                >
                  {/* Winner Badge */}
                  {ticket.isWinner && (
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme="purple"
                      variant="solid"
                      borderRadius="md"
                      zIndex={1}
                      fontSize="sm"
                      px={3}
                      py={1}
                    >
                      🏆 WINNER!
                    </Badge>
                  )}

                  {/* Draw Soon Badge */}
                  {ticket.status === 'ACTIVE' && isDrawSoon(ticket.competition.drawDate) && (
                    <Badge
                      position="absolute"
                      top={3}
                      left={3}
                      colorScheme="orange"
                      variant="solid"
                      borderRadius="md"
                      zIndex={1}
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      🔥 Draw Soon!
                    </Badge>
                  )}

                  {/* Competition Image */}
                  <Box position="relative" h="150px" bg="gray.100">
                    {ticket.competition.imageUrl ? (
                      <Image
                        src={ticket.competition.imageUrl}
                        alt={ticket.competition.title}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    ) : (
                      <Flex
                        w="full"
                        h="full"
                        bgGradient="linear(to-br, blue.500, purple.600)"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="white" fontSize="4xl">
                          {getStatusIcon(ticket.status)}
                        </Text>
                      </Flex>
                    )}
                  </Box>

                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      {/* Ticket Status */}
                      <HStack justify="space-between">
                        <Badge 
                          colorScheme={getStatusColor(ticket.status)} 
                          variant="solid"
                          fontSize="xs"
                        >
                          {ticket.status}
                        </Badge>
                        <Text fontSize="sm" fontFamily="mono" color="gray.600">
                          {ticket.ticketNumber}
                        </Text>
                      </HStack>

                      {/* Competition Info */}
                      <VStack align="start" spacing={2}>
                        <Heading as="h3" size="sm" noOfLines={2} color="gray.800">
                          {ticket.competition.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {ticket.competition.description}
                        </Text>
                        <Text fontSize="sm" color="blue.600" fontWeight="medium">
                          {ticket.competition.charity.name}
                        </Text>
                      </VStack>

                      {/* Prize Info (for winners) */}
                      {ticket.status === 'WINNER' && (
                        <Alert status="success" borderRadius="md" p={3}>
                          <VStack align="start" spacing={1} w="full">
                            <Text fontWeight="bold" fontSize="sm">
                              🎉 Congratulations! You won!
                            </Text>
                            <Text fontSize="sm">
                              Check your email for prize details.
                            </Text>
                          </VStack>
                        </Alert>
                      )}

                      {/* Dates and Price */}
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between" fontSize="sm">
                          <Text color="gray.600">Purchased:</Text>
                          <Text>{formatDate(ticket.createdAt)}</Text>
                        </Flex>
                        <Flex justify="space-between" fontSize="sm">
                          <Text color="gray.600">Draw Date:</Text>
                          <Text fontWeight="medium">
                            {formatDate(ticket.competition.drawDate)}
                          </Text>
                        </Flex>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" color="gray.600">
                            Ticket Price:
                          </Text>
                          <Text fontWeight="bold" color="green.600">
                            {formatAmount(parseFloat(ticket.purchasePrice))}
                          </Text>
                        </Flex>
                      </VStack>

                      {/* Action Button */}
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        w="full"
                      >
                        View Competition
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}