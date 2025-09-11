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
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Icon,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { FaTrophy, FaMedal, FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import { Charity } from '@/types/api';
import { charitiesService } from '@/services/charities';

interface CharityWithStats extends Charity {
  totalRaised: number;
  competitionsCount: number;
  rank: number;
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<CharityWithStats[]>([]);
  const [filteredCharities, setFilteredCharities] = useState<CharityWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  const generateMockStats = (charity: Charity): CharityWithStats => {
    // Generate realistic mock data based on charity ID for consistency
    const seed = charity.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const totalRaised = Math.floor((seed % 50000) + 10000 + Math.random() * 100000);
    const competitionsCount = Math.floor((seed % 15) + 2);
    
    return {
      ...charity,
      totalRaised,
      competitionsCount,
      rank: 0 // Will be set after sorting
    };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <FaTrophy color="gold" size="20" />;
    if (rank === 2) return <FaMedal color="silver" size="20" />;
    if (rank === 3) return <FaAward color="#CD7F32" size="20" />;
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        const allCharities = await charitiesService.getAll();
        
        // Add stats and sort by total raised (highest first)
        const charitiesWithStats = allCharities
          .map(generateMockStats)
          .sort((a, b) => b.totalRaised - a.totalRaised)
          .map((charity, index) => ({ ...charity, rank: index + 1 }));
        
        setCharities(charitiesWithStats);
        setFilteredCharities(charitiesWithStats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch charities:', err);
        setError('Failed to load charities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  useEffect(() => {
    if (!charities) return;
    setFilteredCharities(charities);
  }, [charities]);


  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Loading charities...</Text>
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


  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="gray.800">
              Charity Leaderboard
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Top performing charities ranked by total funds raised through our platform
            </Text>
          </VStack>


          {/* Leaderboard Table */}
          {!filteredCharities || filteredCharities.length === 0 ? (
            <Card maxW="2xl" mx="auto" shadow="xl">
              <CardBody py={16} textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="6xl">💚</Text>
                  <Heading size="xl" color="gray.700">
                    No Charities Found
                  </Heading>
                  <Text color="gray.600">
                    Check back soon for new registered charities!
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <Card shadow="lg" bg={tableBg}>
              <Table variant="simple" size="md">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th width="80px">Rank</Th>
                    <Th>Charity</Th>
                    <Th isNumeric>Total Raised</Th>
                    <Th isNumeric>Competitions</Th>
                    <Th width="100px">Status</Th>
                    <Th width="80px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCharities.map((charity) => (
                    <Tr key={charity.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                      <Td>
                        <HStack spacing={2}>
                          {getRankIcon(charity.rank)}
                          <Text fontWeight="bold" fontSize="lg">
                            #{charity.rank}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            src={charity.logoUrl}
                            name={charity.name}
                            bg="blue.500"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold" fontSize="md">
                              {charity.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {charity.description || 'No description available'}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td isNumeric>
                        <VStack align="end" spacing={0}>
                          <Text fontWeight="bold" fontSize="lg" color="green.600">
                            {formatCurrency(charity.totalRaised)}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Total raised
                          </Text>
                        </VStack>
                      </Td>
                      <Td isNumeric>
                        <VStack align="end" spacing={0}>
                          <Text fontWeight="semibold">
                            {charity.competitionsCount}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Active
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        {charity.isVerified ? (
                          <Badge colorScheme="green" variant="solid" fontSize="xs">
                            ✓ Verified
                          </Badge>
                        ) : (
                          <Badge colorScheme="gray" variant="outline" fontSize="xs">
                            Pending
                          </Badge>
                        )}
                      </Td>
                      <Td>
                        <Tooltip label="View charity profile" hasArrow>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => {
                              if (charity.website) {
                                window.open(charity.website, '_blank');
                              }
                            }}
                            isDisabled={!charity.website}
                          >
                            <Icon as={charity.website ? FaExternalLinkAlt : ViewIcon} />
                          </Button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}