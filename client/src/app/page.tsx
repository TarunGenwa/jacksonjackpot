'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Text, 
  Heading, 
  Button, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Spinner, 
  Alert, 
  AlertIcon, 
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Circle
} from '@chakra-ui/react';
import { FaTrophy, FaHeart, FaShieldAlt, FaInfoCircle, FaUsers, FaGift, FaChartLine, FaPoundSign, FaTicketAlt } from 'react-icons/fa';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';

export default function Home() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const activeCompetitions = await competitionsService.getActive();
        setCompetitions(activeCompetitions);
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
      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, blue.600, purple.700, pink.600)"
        color="white"
        py={20}
        textAlign="center"
        position="relative"
      >
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" minH="60vh">
            <VStack spacing={6} maxW="4xl" mx="auto" flex={1} textAlign={{ base: 'center', lg: 'left' }}>
              <Heading
                as="h1"
                size={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
              >
                Jackson Jackpot
              </Heading>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                opacity={0.9}
              >
                Win amazing prizes while supporting great causes
              </Text>
              <Text
                fontSize="lg"
                opacity={0.8}
                maxW="2xl"
              >
                Enter charity competitions and lotteries to win incredible prizes while making a difference.
                100% transparent, verified charities, and life-changing rewards await.
              </Text>
              <HStack spacing={4} pt={4}>
                <Link href="/competitions">
                  <Button
                    size="lg"
                    bg="green.400"
                    color="gray.900"
                    _hover={{ bg: "green.300" }}
                    fontWeight="bold"
                  >
                    Browse Competitions
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg" color="white" borderColor="white">
                    How It Works
                  </Button>
                </Link>
              </HStack>
            </VStack>

            <Box
              flex={1}
              maxW="500px"
              display={{ base: 'none', lg: 'block' }}
              position="relative"
              ml={8}
            >
              <VStack spacing={6} align="stretch">
                <Box
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  borderRadius="xl"
                  p={6}
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  transform="translateY(0)"
                  animation="float 3s ease-in-out infinite"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' }
                    }
                  }}
                >
                  <HStack spacing={4}>
                    <Circle size="60px" bg="green.500" color="white">
                      <Icon as={FaPoundSign} boxSize={6} />
                    </Circle>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="white">
                        £500K+
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.800">
                        Raised for Charities
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Box
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  borderRadius="xl"
                  p={6}
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  transform="translateY(0)"
                  animation="float 3s ease-in-out infinite 1s"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' }
                    }
                  }}
                >
                  <HStack spacing={4}>
                    <Circle size="60px" bg="purple.500" color="white">
                      <Icon as={FaTrophy} boxSize={6} />
                    </Circle>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="white">
                        1,200+
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.800">
                        Prizes Won
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <Box
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  borderRadius="xl"
                  p={6}
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  transform="translateY(0)"
                  animation="float 3s ease-in-out infinite 2s"
                  sx={{
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' }
                    }
                  }}
                >
                  <HStack spacing={4}>
                    <Circle size="60px" bg="blue.500" color="white">
                      <Icon as={FaUsers} boxSize={6} />
                    </Circle>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="white">
                        25K+
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.800">
                        Happy Players
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>

              <Icon
                as={FaTicketAlt}
                position="absolute"
                top="10%"
                right="10%"
                boxSize={8}
                color="yellow.300"
                opacity={0.7}
                animation="pulse 2s infinite"
                sx={{
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.1)' }
                  }
                }}
              />

              <Icon
                as={FaGift}
                position="absolute"
                bottom="20%"
                left="5%"
                boxSize={6}
                color="pink.300"
                opacity={0.8}
                animation="bounce 3s infinite"
                sx={{
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' }
                  }
                }}
              />

              <Icon
                as={FaHeart}
                position="absolute"
                top="50%"
                right="5%"
                boxSize={5}
                color="red.300"
                opacity={0.6}
                animation="heartbeat 2s infinite"
                sx={{
                  '@keyframes heartbeat': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '25%': { transform: 'scale(1.1)' },
                    '50%': { transform: 'scale(1)' },
                    '75%': { transform: 'scale(1.05)' }
                  }
                }}
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={12}>
        {/* Active Competitions Section - HIDDEN */}
        {/*
        <VStack spacing={12}>
          <VStack spacing={8} w="full">
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color="gray.800">
                Active Competitions
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Enter now for your chance to win amazing prizes and support worthy causes
              </Text>
            </VStack>

            {competitions.length === 0 ? (
              <Card maxW="2xl" w="full" shadow="xl">
                <CardBody py={16} textAlign="center">
                  <VStack spacing={4}>
                    <Text fontSize="6xl">🎲</Text>
                    <Heading size="xl" color="gray.700">
                      No Active Competitions
                    </Heading>
                    <Text color="gray.600">
                      Check back soon for new competitions and amazing prizes!
                    </Text>
                    <Button colorScheme="blue" mt={4}>
                      Notify Me
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                {competitions.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        */}

        <VStack spacing={12}>

          {/* Features Section */}
          <Card w="full" shadow="xl" bg="gray.800" border="1px" borderColor="gray.700">
            <CardBody p={8}>
              <VStack spacing={8}>
                <Heading size="xl" textAlign="center" color="white">
                  Why Choose Jackson Jackpot?
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                  <VStack spacing={4} textAlign="center">
                    <Circle size="16" bg="blue.900" color="blue.400">
                      <Icon as={FaTrophy} boxSize={8} />
                    </Circle>
                    <Heading size="md" color="white">Amazing Prizes</Heading>
                    <Text color="gray.400">
                      Win holidays, cash, cars, and more incredible prizes
                    </Text>
                  </VStack>
                  <VStack spacing={4} textAlign="center">
                    <Circle size="16" bg="green.900" color="green.400">
                      <Icon as={FaHeart} boxSize={8} />
                    </Circle>
                    <Heading size="md" color="white">Support Charities</Heading>
                    <Text color="gray.400">
                      Every ticket supports verified charitable causes
                    </Text>
                  </VStack>
                  <VStack spacing={4} textAlign="center">
                    <Circle size="16" bg="purple.900" color="purple.400">
                      <Icon as={FaShieldAlt} boxSize={8} />
                    </Circle>
                    <Heading size="md" color="white">100% Transparent</Heading>
                    <Text color="gray.400">
                      Fair draws, verified charities, secure payments
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Stats Section */}
          <Card w="full" shadow="xl" bg="gray.800" border="1px" borderColor="gray.700">
            <CardBody p={8}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                <Stat textAlign="center">
                  <Flex justify="center" mb={2}>
                    <Icon as={FaInfoCircle} boxSize={8} color="blue.400" />
                  </Flex>
                  <StatLabel fontSize="lg" color="gray.300">Total Raised</StatLabel>
                  <StatNumber fontSize="3xl" color="blue.400">£1.2M</StatNumber>
                  <StatHelpText color="gray.400">For charities this year</StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <Flex justify="center" mb={2}>
                    <Icon as={FaUsers} boxSize={8} color="green.400" />
                  </Flex>
                  <StatLabel fontSize="lg" color="gray.300">Happy Winners</StatLabel>
                  <StatNumber fontSize="3xl" color="green.400">2,450</StatNumber>
                  <StatHelpText color="gray.400">Life-changing prizes</StatHelpText>
                </Stat>

                <Stat textAlign="center">
                  <Flex justify="center" mb={2}>
                    <Icon as={FaGift} boxSize={8} color="purple.400" />
                  </Flex>
                  <StatLabel fontSize="lg" color="gray.300">Active Competitions</StatLabel>
                  <StatNumber fontSize="3xl" color="purple.400">{competitions.length}</StatNumber>
                  <StatHelpText color="gray.400">Ready to enter</StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
