'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  Button,
  Divider,
  SimpleGrid
} from '@chakra-ui/react';
import { FaGift, FaBolt, FaCalendarDay, FaCircle } from 'react-icons/fa';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';

export default function CompetitionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCompetitions, setAllCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch competitions for each type
        const [mysteryBoxes, instantWins, dailyFree, instantSpins] = await Promise.all([
          competitionsService.getByType('MYSTERYBOXES'),
          competitionsService.getByType('INSTANT_WINS'),
          competitionsService.getByType('DAILY_FREE'),
          competitionsService.getByType('INSTANT_SPINS')
        ]);

        // Combine all competitions into a single array
        const combined = [
          ...mysteryBoxes.map(c => ({ ...c, category: 'Mystery Box' })),
          ...instantWins.map(c => ({ ...c, category: 'Instant Win' })),
          ...dailyFree.map(c => ({ ...c, category: 'Daily Free' })),
          ...instantSpins.map(c => ({ ...c, category: 'Instant Spin' }))
        ];

        setAllCompetitions(combined);
      } catch (err) {
        console.error('Failed to fetch competitions:', err);
        setError('Failed to load competitions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);



  if (loading) {
    return (
      <Box minH="100vh" bg="gray.900">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.400" />
              <Text color="gray.300">Loading competitions...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.900">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Alert status="error" maxW="md" borderRadius="md" bg="gray.800" color="white">
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
    <Box minH="100vh" bg="gray.900">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="white">
              All Competitions
            </Heading>
            <Text fontSize="lg" color="gray.300" maxW="2xl">
              Browse all available competitions and win amazing prizes while supporting great causes
            </Text>
            {allCompetitions.length > 0 && (
              <Text fontSize="md" color="gray.400">
                {allCompetitions.length} competition{allCompetitions.length > 1 ? 's' : ''} available
              </Text>
            )}
          </VStack>

          {/* All Competition Cards */}
          {allCompetitions.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {allCompetitions.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box
              p={16}
              bg="gray.900"
              borderRadius="lg"
              border="1px"
              borderColor="gray.700"
              textAlign="center"
              maxW="2xl"
              mx="auto"
            >
              <VStack spacing={4}>
                <Text fontSize="lg" fontWeight="semibold" color="white">
                  No Competitions Available
                </Text>
                <Text color="gray.400">
                  Check back soon for exciting new competitions!
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}