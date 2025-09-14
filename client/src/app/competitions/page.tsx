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
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaGift, FaBolt, FaCalendarDay, FaCircle } from 'react-icons/fa';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';

type CompetitionType = 'mysteryboxes' | 'instant-wins' | 'daily-free' | 'instant-spins';

export default function CompetitionsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      description: 'Surprise prizes in exciting mystery boxes',
      color: 'purple'
    },
    {
      id: 'INSTANT_WINS',
      label: 'Instant Wins',
      icon: FaBolt,
      description: 'Win instantly with every play',
      color: 'orange'
    },
    {
      id: 'DAILY_FREE',
      label: 'Daily Free',
      icon: FaCalendarDay,
      description: 'Free daily competitions for everyone',
      color: 'green'
    },
    {
      id: 'INSTANT_SPINS',
      label: 'Instant Spins',
      icon: FaCircle,
      description: 'Spin the wheel for amazing prizes',
      color: 'blue'
    }
  ];

  const getCurrentCompetitions = () => {
    const currentTabId = competitionTabs[activeTab]?.id;
    return competitionsByType[currentTabId] || [];
  };

  const getFilteredCompetitions = () => {
    const competitions = getCurrentCompetitions();
    if (!searchTerm) return competitions;

    return competitions.filter(competition =>
      competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  const filteredCompetitions = getFilteredCompetitions();
  const currentTab = competitionTabs[activeTab];

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
                    {/* Tab Description */}
                    <Card shadow="md" bg={`${tab.color}.50`} borderColor={`${tab.color}.200`}>
                      <CardBody>
                        <HStack spacing={4}>
                          <Icon as={tab.icon} boxSize={8} color={`${tab.color}.600`} />
                          <VStack align="start" spacing={1}>
                            <Heading size="md" color={`${tab.color}.800`}>
                              {tab.label}
                            </Heading>
                            <Text color={`${tab.color}.700`}>
                              {tab.description}
                            </Text>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>

                    {/* Search Bar */}
                    <Card shadow="md">
                      <CardBody>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder={`Search ${tab.label.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg="white"
                          />
                        </InputGroup>
                      </CardBody>
                    </Card>

                    {/* Results Summary */}
                    <Flex justify="space-between" align="center">
                      <Text color="gray.600">
                        Showing {filteredCompetitions.length} {tab.label.toLowerCase()}
                      </Text>
                      {searchTerm && (
                        <Badge colorScheme={tab.color} variant="subtle" px={3} py={1}>
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                    </Flex>

                    {/* Competition Grid */}
                    {filteredCompetitions.length === 0 ? (
                      <Card maxW="2xl" mx="auto" shadow="xl">
                        <CardBody py={16} textAlign="center">
                          <VStack spacing={4}>
                            <Icon as={tab.icon} boxSize={16} color={`${tab.color}.300`} />
                            <Heading size="xl" color="gray.700">
                              No {tab.label} Available
                            </Heading>
                            <Text color="gray.600">
                              {searchTerm
                                ? `No ${tab.label.toLowerCase()} match your search. Try different keywords.`
                                : `We're working on bringing you amazing ${tab.label.toLowerCase()}. Check back soon!`
                              }
                            </Text>
                            {searchTerm && (
                              <Button
                                colorScheme={tab.color}
                                onClick={() => setSearchTerm('')}
                              >
                                Clear Search
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
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}