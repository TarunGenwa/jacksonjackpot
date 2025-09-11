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
import CharityCard from '@/components/CharityCard';
import { Charity } from '@/types/api';
import { charitiesService } from '@/services/charities';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [filteredCharities, setFilteredCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        const allCharities = await charitiesService.getAll();
        console.log('Fetched charities:', allCharities);
        setCharities(allCharities);
        setFilteredCharities(allCharities);
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
    
    let filtered = [...charities];
    console.log('Filtering charities:', { charities: charities.length, searchTerm, showVerifiedOnly });

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(charity =>
        charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by verification status
    if (showVerifiedOnly) {
      filtered = filtered.filter(charity => charity.isVerified);
    }

    console.log('Filtered charities:', filtered.length);
    setFilteredCharities(filtered);
  }, [charities, searchTerm, showVerifiedOnly]);

  const getVerificationCounts = () => {
    const totalCount = charities?.length || 0;
    const verifiedCount = charities?.filter(c => c.isVerified).length || 0;
    return { totalCount, verifiedCount };
  };

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

  const { totalCount, verifiedCount } = getVerificationCounts();

  console.log('Render state:', { 
    loading, 
    error, 
    charitiesLength: charities?.length, 
    filteredCharitiesLength: filteredCharities?.length 
  });

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="gray.800">
              Registered Charities
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Support amazing causes by participating in their lottery competitions and making direct donations
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
                    placeholder="Search charities by name or cause..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                  />
                </InputGroup>

                {/* Verification Filter */}
                <Flex 
                  direction={{ base: 'column', md: 'row' }} 
                  gap={4} 
                  w="full" 
                  align={{ base: 'stretch', md: 'center' }}
                  justify="space-between"
                >
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Filter by Verification
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      <Button
                        size="sm"
                        variant={!showVerifiedOnly ? 'solid' : 'outline'}
                        colorScheme={!showVerifiedOnly ? 'blue' : 'gray'}
                        onClick={() => setShowVerifiedOnly(false)}
                      >
                        All Charities ({totalCount})
                      </Button>
                      <Button
                        size="sm"
                        variant={showVerifiedOnly ? 'solid' : 'outline'}
                        colorScheme={showVerifiedOnly ? 'blue' : 'gray'}
                        onClick={() => setShowVerifiedOnly(true)}
                      >
                        ✓ Verified Only ({verifiedCount})
                      </Button>
                    </HStack>
                  </VStack>

                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Verification Info
                    </Text>
                    <Badge colorScheme="blue" variant="outline" px={3} py={1}>
                      <Text fontSize="xs">
                        Verified charities have been thoroughly vetted by our team
                      </Text>
                    </Badge>
                  </VStack>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Results Summary */}
          <Flex justify="space-between" align="center">
            <Text color="gray.600">
              Showing {filteredCharities?.length || 0} of {charities?.length || 0} charities
            </Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                Search: "{searchTerm}"
              </Badge>
            )}
          </Flex>

          {/* Charity Grid */}
          {!filteredCharities || filteredCharities.length === 0 ? (
            <Card maxW="2xl" mx="auto" shadow="xl">
              <CardBody py={16} textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="6xl">💚</Text>
                  <Heading size="xl" color="gray.700">
                    No Charities Found
                  </Heading>
                  <Text color="gray.600">
                    {searchTerm || showVerifiedOnly
                      ? 'Try adjusting your search or filters to find more charities.'
                      : 'Check back soon for new registered charities!'
                    }
                  </Text>
                  {(searchTerm || showVerifiedOnly) && (
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        setSearchTerm('');
                        setShowVerifiedOnly(false);
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
              {filteredCharities.map((charity) => (
                <CharityCard 
                  key={charity.id} 
                  charity={charity} 
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}