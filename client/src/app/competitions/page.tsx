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
  const [allCompetitions, setAllCompetitions] = useState<{
    mysteryBoxes: Competition[];
    instantWins: Competition[];
    dailyFree: Competition[];
    instantSpins: Competition[];
  }>({
    mysteryBoxes: [],
    instantWins: [],
    dailyFree: [],
    instantSpins: []
  });

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

        setAllCompetitions({
          mysteryBoxes,
          instantWins,
          dailyFree,
          instantSpins
        });
      } catch (err) {
        console.error('Failed to fetch competitions:', err);
        setError('Failed to load competitions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const competitionSections = [
    {
      title: 'Mystery Boxes',
      icon: FaGift,
      color: 'purple',
      competitions: allCompetitions.mysteryBoxes
    },
    {
      title: 'Instant Wins',
      icon: FaBolt,
      color: 'orange',
      competitions: allCompetitions.instantWins
    },
    {
      title: 'Daily Free',
      icon: FaCalendarDay,
      color: 'green',
      competitions: allCompetitions.dailyFree
    },
    {
      title: 'Instant Spins',
      icon: FaCircle,
      color: 'blue',
      competitions: allCompetitions.instantSpins
    }
  ];


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

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="gray.800">
              All Competitions
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Browse all available competitions and win amazing prizes while supporting great causes
            </Text>
          </VStack>

          {/* All Competition Sections */}
          <VStack spacing={12} align="stretch">
            {competitionSections.map((section) => {
              const hasCompetitions = section.competitions.length > 0;

              return (
                <VStack key={section.title} spacing={6} align="stretch">
                  {/* Section Header */}
                  <Box>
                    <Heading
                      as="h2"
                      size="lg"
                      color={`${section.color}.600`}
                      mb={2}
                    >
                      {section.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {hasCompetitions
                        ? `${section.competitions.length} competition${section.competitions.length > 1 ? 's' : ''} available`
                        : 'Coming soon'
                      }
                    </Text>
                  </Box>

                  {/* Competition Cards */}
                  {hasCompetitions ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {section.competitions.map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box
                      p={12}
                      bg="white"
                      borderRadius="lg"
                      border="1px"
                      borderColor="gray.200"
                      textAlign="center"
                    >
                      <Text color="gray.500">
                        No {section.title.toLowerCase()} available at the moment. Check back soon!
                      </Text>
                    </Box>
                  )}

                  {/* Divider between sections */}
                  <Divider borderColor="gray.300" />
                </VStack>
              );
            })}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}