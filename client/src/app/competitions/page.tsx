'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon
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

          {/* Competition Type Tabs */}
          <Tabs
            index={activeTab}
            onChange={setActiveTab}
            variant="enclosed"
            colorScheme="blue"
            isFitted
          >
            <TabList>
              {competitionTabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  _selected={{
                    color: `${tab.color}.600`,
                    borderColor: `${tab.color}.600`,
                    bg: `${tab.color}.50`
                  }}
                  fontWeight="semibold"
                  py={4}
                >
                  <VStack spacing={2}>
                    <Icon as={tab.icon} boxSize={5} />
                    <Text fontSize="sm">{tab.label}</Text>
                  </VStack>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {competitionTabs.map((tab, index) => (
                <TabPanel key={tab.id} px={0}>
                  <VStack spacing={6} align="stretch">

                    {/* Competition Grid */}
                    {currentCompetitions.length === 0 ? (
                      <Card maxW="2xl" mx="auto" shadow="xl">
                        <CardBody py={16} textAlign="center">
                          <VStack spacing={4}>
                            <Icon as={tab.icon} boxSize={16} color={`${tab.color}.300`} />
                            <Heading size="xl" color="gray.700">
                              No {tab.label} Available
                            </Heading>
                            <Text color="gray.600">
                              We're working on bringing you amazing {tab.label.toLowerCase()}. Check back soon!
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
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}