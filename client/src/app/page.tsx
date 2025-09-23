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
  Circle,
  Select,
  Badge,
  Progress,
  Divider,
  Grid,
  GridItem,
  Image
} from '@chakra-ui/react';
import { FaTrophy, FaHeart, FaShieldAlt, FaInfoCircle, FaUsers, FaGift, FaChartLine, FaPoundSign, FaTicketAlt } from 'react-icons/fa';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { getThemeColor } = useTheme();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetitionIndex, setSelectedCompetitionIndex] = useState(0);

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
      <Box minH="100vh" bg={getThemeColor('dark')}>
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color={getThemeColor('primary')} />
              <Text color={getThemeColor('gray300')}>Loading competitions...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={getThemeColor('dark')}>
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Alert status="error" maxW="md" borderRadius="md" bg={getThemeColor('secondary')} color="white">
                <AlertIcon />
                {error}
              </Alert>
              <Button
                bg={getThemeColor('primary')}
                color="white"
                _hover={{ bg: getThemeColor('primaryDark') }}
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
    <Box minH="100vh" bg={getThemeColor('dark')} py={12}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Competition Details Section */}
          {competitions.length > 0 && (
            <Card w="full" shadow="xl" bg={getThemeColor('secondary')} border="1px" borderColor={getThemeColor('secondaryLight')}>
              <CardBody p={8}>
                <VStack spacing={6} align="stretch">
                  {/* Competition Selector */}
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={getThemeColor('gray300')} mb={2}>
                      SELECT A COMPETITION
                    </Text>
                    <Select
                      value={selectedCompetitionIndex}
                      onChange={(e) => setSelectedCompetitionIndex(Number(e.target.value))}
                      bg={getThemeColor('dark')}
                      color={getThemeColor('white')}
                      borderColor={getThemeColor('primary')}
                      _hover={{ borderColor: getThemeColor('primaryLight') }}
                      _focus={{ borderColor: getThemeColor('primary'), boxShadow: `0 0 0 1px ${getThemeColor('primary')}` }}
                      size="lg"
                    >
                      {competitions.map((comp, index) => (
                        <option key={comp.id} value={index} style={{ background: '#1f3044' }}>
                          {comp.title} - {comp.charity.name}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Divider borderColor={getThemeColor('primaryDark')} />

                  {/* Selected Competition Details */}
                  {competitions[selectedCompetitionIndex] && (
                    <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
                      {/* Competition Image */}
                      <GridItem>
                        <VStack spacing={4} align="stretch">
                          {competitions[selectedCompetitionIndex].imageUrl ? (
                            <Box borderRadius="lg" overflow="hidden" border="2px" borderColor={getThemeColor('primary')}>
                              <Image
                                src={competitions[selectedCompetitionIndex].imageUrl}
                                alt={competitions[selectedCompetitionIndex].title}
                                width="100%"
                                height="auto"
                                objectFit="cover"
                              />
                            </Box>
                          ) : (
                            <Box
                              h="250px"
                              bg={getThemeColor('dark')}
                              borderRadius="lg"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              border="2px"
                              borderColor={getThemeColor('primary')}
                            >
                              <Icon as={FaTrophy} boxSize={20} color={getThemeColor('accent')} />
                            </Box>
                          )}

                          {/* Prize Preview */}
                          <Box bg={getThemeColor('dark')} p={4} borderRadius="lg">
                            <Text fontSize="sm" fontWeight="bold" color={getThemeColor('accent')} mb={2}>
                              PRIZES
                            </Text>
                            <VStack align="stretch" spacing={2}>
                              {competitions[selectedCompetitionIndex].prizes?.slice(0, 3).map((prize, idx) => (
                                <HStack key={idx} justify="space-between">
                                  <Text fontSize="sm" color={getThemeColor('gray300')}>
                                    {prize.name}
                                  </Text>
                                  <Badge colorScheme="yellow" variant="solid">
                                    £{(prize.value / 100).toFixed(0)}
                                  </Badge>
                                </HStack>
                              ))}
                              {competitions[selectedCompetitionIndex].prizes?.length > 3 && (
                                <Text fontSize="xs" color={getThemeColor('gray500')} textAlign="center">
                                  +{competitions[selectedCompetitionIndex].prizes.length - 3} more prizes
                                </Text>
                              )}
                            </VStack>
                          </Box>
                        </VStack>
                      </GridItem>

                      {/* Competition Info */}
                      <GridItem>
                        <VStack spacing={6} align="stretch">
                          <Box>
                            <Badge bg={getThemeColor('accent')} color={getThemeColor('dark')} mb={2}>
                              ACTIVE
                            </Badge>
                            <Heading size="xl" color={getThemeColor('white')} mb={2}>
                              {competitions[selectedCompetitionIndex].title}
                            </Heading>
                            <HStack spacing={2} mb={4}>
                              <Text color={getThemeColor('gray300')}>Supporting</Text>
                              <Text color={getThemeColor('primary')} fontWeight="semibold">
                                {competitions[selectedCompetitionIndex].charity.name}
                              </Text>
                              {competitions[selectedCompetitionIndex].charity.isVerified && (
                                <Badge colorScheme="green" variant="solid">✓ Verified</Badge>
                              )}
                            </HStack>
                            <Text color={getThemeColor('gray300')} fontSize="lg">
                              {competitions[selectedCompetitionIndex].description}
                            </Text>
                          </Box>

                          {/* Ticket Info */}
                          <Box bg={getThemeColor('dark')} p={6} borderRadius="lg">
                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                              <GridItem>
                                <VStack align="start">
                                  <Text fontSize="sm" color={getThemeColor('gray500')}>Ticket Price</Text>
                                  <Text fontSize="2xl" fontWeight="bold" color={getThemeColor('accent')}>
                                    £{competitions[selectedCompetitionIndex].ticketPrice}
                                  </Text>
                                </VStack>
                              </GridItem>
                              <GridItem>
                                <VStack align="start">
                                  <Text fontSize="sm" color={getThemeColor('gray500')}>Draw Date</Text>
                                  <Text fontSize="lg" fontWeight="semibold" color={getThemeColor('white')}>
                                    {new Date(competitions[selectedCompetitionIndex].drawDate).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </Text>
                                </VStack>
                              </GridItem>
                            </Grid>
                          </Box>

                          {/* Progress */}
                          <Box>
                            <HStack justify="space-between" mb={2}>
                              <Text color={getThemeColor('white')} fontWeight="semibold">
                                Tickets Sold
                              </Text>
                              <Text color={getThemeColor('gray300')}>
                                {competitions[selectedCompetitionIndex].ticketsSold} / {competitions[selectedCompetitionIndex].maxTickets}
                              </Text>
                            </HStack>
                            <Progress
                              value={(competitions[selectedCompetitionIndex].ticketsSold / competitions[selectedCompetitionIndex].maxTickets) * 100}
                              size="lg"
                              colorScheme="cyan"
                              bg={getThemeColor('dark')}
                              borderRadius="full"
                            />
                            <Text fontSize="sm" color={getThemeColor('gray500')} mt={1}>
                              {Math.round((competitions[selectedCompetitionIndex].ticketsSold / competitions[selectedCompetitionIndex].maxTickets) * 100)}% sold
                            </Text>
                          </Box>

                          {/* Action Buttons */}
                          <HStack spacing={4}>
                            <Link href={`/competitions/${competitions[selectedCompetitionIndex].id}`}>
                              <Button
                                size="lg"
                                bg={getThemeColor('accent')}
                                color={getThemeColor('dark')}
                                _hover={{ bg: getThemeColor('accentDark') }}
                                leftIcon={<Icon as={FaTicketAlt} />}
                                fontWeight="bold"
                                w="full"
                              >
                                Buy Tickets
                              </Button>
                            </Link>
                            <Link href={`/competitions/${competitions[selectedCompetitionIndex].id}`}>
                              <Button
                                size="lg"
                                variant="outline"
                                borderColor={getThemeColor('primary')}
                                color={getThemeColor('primary')}
                                _hover={{ bg: getThemeColor('primaryDark'), color: getThemeColor('white') }}
                                w="full"
                              >
                                View Details
                              </Button>
                            </Link>
                          </HStack>
                        </VStack>
                      </GridItem>
                    </Grid>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Features Section */}
          <Card w="full" shadow="xl" bg={getThemeColor('secondary')} border="1px" borderColor={getThemeColor('secondaryLight')}>
            <CardBody p={8}>
              <VStack spacing={8}>
                <Heading size="xl" textAlign="center" color={getThemeColor('white')}>
                  Why Choose Jackson Jackpot?
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                  <VStack spacing={4} textAlign="center">
                    <Circle size="16" bg={getThemeColor('primary')} color={getThemeColor('white')}>
                      <Icon as={FaTrophy} boxSize={8} />
                    </Circle>
                    <Heading size="md" color={getThemeColor('white')}>Amazing Prizes</Heading>
                    <Text color={getThemeColor('gray300')}>
                      Win holidays, cash, cars, and more incredible prizes
                    </Text>
                  </VStack>
                  <VStack spacing={4} textAlign="center">
                    <Circle size="16" bg={getThemeColor('accent')} color={getThemeColor('dark')}>
                      <Icon as={FaHeart} boxSize={8} />
                    </Circle>
                    <Heading size="md" color={getThemeColor('white')}>Support Charities</Heading>
                    <Text color={getThemeColor('gray300')}>
                      Every ticket supports verified charitable causes
                    </Text>
                  </VStack>
                  <VStack spacing={4} textAlign="center">
                    <Circle size="16" bg={getThemeColor('primaryLight')} color={getThemeColor('dark')}>
                      <Icon as={FaShieldAlt} boxSize={8} />
                    </Circle>
                    <Heading size="md" color={getThemeColor('white')}>100% Transparent</Heading>
                    <Text color={getThemeColor('gray300')}>
                      Fair draws, verified charities, secure payments
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
