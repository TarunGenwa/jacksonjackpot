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
  SimpleGrid,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Flex,
  InputGroup,
  InputLeftElement,
  Center
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('endDate');

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const allCompetitions = await competitionsService.getAll();
        setCompetitions(allCompetitions);
        setFilteredCompetitions(allCompetitions);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch competitions:', err);
        setError('Failed to load competitions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  useEffect(() => {
    let filtered = [...competitions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(competition =>
        competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competition.charity.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(competition => competition.status === statusFilter);
    }

    // Sort competitions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'ticketPrice':
          return parseFloat(a.ticketPrice) - parseFloat(b.ticketPrice);
        case 'ticketsSold':
          return b.ticketsSold - a.ticketsSold;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredCompetitions(filtered);
  }, [competitions, searchTerm, statusFilter, sortBy]);

  const getStatusCounts = () => {
    const counts = {
      ALL: competitions.length,
      ACTIVE: competitions.filter(c => c.status === 'ACTIVE').length,
      UPCOMING: competitions.filter(c => c.status === 'UPCOMING').length,
      COMPLETED: competitions.filter(c => c.status === 'COMPLETED').length,
      SOLD_OUT: competitions.filter(c => c.status === 'SOLD_OUT').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Loading competitions...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
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
          </Center>
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
            <Heading as="h1" size="2xl" color="gray.800">
              All Competitions
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Browse all available competitions and find your next chance to win amazing prizes
            </Text>
          </VStack>

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
                    placeholder="Search competitions, charities, or prizes..."
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
                          {status === 'ALL' ? 'All' : status.replace('_', ' ')} ({count})
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
                    >
                      <option value="endDate">End Date</option>
                      <option value="ticketPrice">Ticket Price</option>
                      <option value="ticketsSold">Popularity</option>
                      <option value="title">Title</option>
                    </Select>
                  </VStack>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Results Summary */}
          <Flex justify="space-between" align="center">
            <Text color="gray.600">
              Showing {filteredCompetitions.length} of {competitions.length} competitions
            </Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                Search: "{searchTerm}"
              </Badge>
            )}
          </Flex>

          {/* Competition Grid */}
          {filteredCompetitions.length === 0 ? (
            <Card maxW="2xl" mx="auto" shadow="xl">
              <CardBody py={16} textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="6xl">🔍</Text>
                  <Heading size="xl" color="gray.700">
                    No Competitions Found
                  </Heading>
                  <Text color="gray.600">
                    {searchTerm || statusFilter !== 'ALL' 
                      ? 'Try adjusting your search or filters to find more competitions.'
                      : 'Check back soon for new competitions and amazing prizes!'
                    }
                  </Text>
                  {(searchTerm || statusFilter !== 'ALL') && (
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredCompetitions.map((competition) => (
                <CompetitionCard 
                  key={competition.id} 
                  competition={competition} 
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}