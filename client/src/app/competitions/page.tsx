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
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Center,
  Icon,
  Stack
} from '@chakra-ui/react';
import { FaGift, FaBolt, FaCalendarDay, FaCircle } from 'react-icons/fa';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';

export default function CompetitionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [competitionsByType, setCompetitionsByType] = useState<{
    [key: string]: Competition[];
  }>({
    'MYSTERYBOXES': [],
    'INSTANT_WINS': [],
    'DAILY_FREE': [],
    'INSTANT_SPINS': []
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

        setCompetitionsByType({
          'MYSTERYBOXES': mysteryBoxes,
          'INSTANT_WINS': instantWins,
          'DAILY_FREE': dailyFree,
          'INSTANT_SPINS': instantSpins
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

  const competitionTabs = [
    {
      id: 'MYSTERYBOXES',
      label: 'Mystery Boxes',
      icon: FaGift,
      color: 'purple'
    },
    {
      id: 'INSTANT_WINS',
      label: 'Instant Wins',
      icon: FaBolt,
      color: 'orange'
    },
    {
      id: 'DAILY_FREE',
      label: 'Daily Free',
      icon: FaCalendarDay,
      color: 'green'
    },
    {
      id: 'INSTANT_SPINS',
      label: 'Instant Spins',
      icon: FaCircle,
      color: 'blue'
    }
  ];

  const getCurrentCompetitions = () => {
    const currentTabId = competitionTabs[activeTab]?.id;
    return competitionsByType[currentTabId] || [];
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

  const currentCompetitions = getCurrentCompetitions();

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="gray.800">
              Competitions
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Choose your competition type and win amazing prizes while supporting great causes
            </Text>
          </VStack>

          {/* Sidebar + Content Layout */}
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={6}
            align="flex-start"
          >
            {/* Left Sidebar - Vertical Tabs */}
            <Stack
              direction={{ base: "row", md: "column" }}
              spacing={2}
              w={{ base: "full", md: "250px" }}
              flexShrink={0}
              align="stretch"
              overflowX={{ base: "auto", md: "visible" }}
            >
              {competitionTabs.map((tab, index) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  variant={activeTab === index ? "solid" : "ghost"}
                  colorScheme={activeTab === index ? tab.color : "gray"}
                  justifyContent="flex-start"
                  h="auto"
                  py={4}
                  px={4}
                  borderRadius="lg"
                  _hover={{
                    bg: activeTab === index ? `${tab.color}.600` : `${tab.color}.50`,
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s"
                  boxShadow={activeTab === index ? "md" : "sm"}
                  minW={{ base: "auto", md: "full" }}
                  flexShrink={{ base: 0, md: 1 }}
                >
                  <HStack spacing={3} w="full">
                    <Icon
                      as={tab.icon}
                      boxSize={5}
                      color={activeTab === index ? "white" : `${tab.color}.600`}
                    />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        color={activeTab === index ? "white" : `${tab.color}.700`}
                      >
                        {tab.label}
                      </Text>
                      <Text
                        fontSize="xs"
                        opacity={0.8}
                        color={activeTab === index ? "white" : "gray.600"}
                      >
                        {currentCompetitions.length === 0 && activeTab === index
                          ? "Coming soon"
                          : activeTab === index
                            ? `${currentCompetitions.length} available`
                            : `${competitionsByType[tab.id]?.length || 0} available`
                        }
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              ))}
            </Stack>

            {/* Right Content Area */}
            <Box flex={1} minH="500px">
              {currentCompetitions.length === 0 ? (
                <Card maxW="2xl" mx="auto" shadow="xl">
                  <CardBody py={16} textAlign="center">
                    <VStack spacing={4}>
                      <Icon
                        as={competitionTabs[activeTab].icon}
                        boxSize={16}
                        color={`${competitionTabs[activeTab].color}.300`}
                      />
                      <Heading size="xl" color="gray.700">
                        No {competitionTabs[activeTab].label} Available
                      </Heading>
                      <Text color="gray.600">
                        We're working on bringing you amazing {competitionTabs[activeTab].label.toLowerCase()}. Check back soon!
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {currentCompetitions.map((competition) => (
                    <CompetitionCard
                      key={competition.id}
                      competition={competition}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
}