'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  Progress,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Center,
  Flex,
  Spacer,
  Avatar,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { FaTrophy, FaUsers, FaClock, FaTicketAlt, FaHeart, FaCheckCircle, FaQuestionCircle, FaInfoCircle, FaGift } from 'react-icons/fa';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';
import { useAuth } from '@/contexts/AuthContext';
import TicketPurchaseModal from '@/components/TicketPurchaseModal';

export default function CompetitionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        setLoading(true);
        const data = await competitionsService.getById(params.id);
        setCompetition(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch competition:', err);
        setError('Failed to load competition. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompetition();
    }
  }, [params.id]);

  const formatPrice = (price: string) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRemainingTime = () => {
    if (!competition) return '';

    const now = new Date();
    const drawDate = new Date(competition.drawDate);
    const diffMs = drawDate.getTime() - now.getTime();

    if (diffMs <= 0) return 'Draw closed';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!competition || competition.maxTickets === 0) return 0;
    return Math.round((competition.ticketsSold / competition.maxTickets) * 100);
  };


  const handlePurchaseClick = () => {
    if (!user) {
      alert('Please log in to purchase tickets');
      return;
    }
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'UPCOMING': return 'blue';
      case 'SOLD_OUT': return 'red';
      case 'COMPLETED': return 'gray';
      default: return 'gray';
    }
  };

  const getButtonProps = () => {
    if (!competition) return { colorScheme: 'gray', isDisabled: true };

    if (competition.status === 'SOLD_OUT')
      return { colorScheme: 'red', isDisabled: true };
    if (competition.status === 'COMPLETED')
      return { colorScheme: 'gray', isDisabled: true };
    if (competition.status === 'UPCOMING')
      return { colorScheme: 'blue', isDisabled: true };
    return { colorScheme: 'blue', isDisabled: false };
  };

  const getButtonText = () => {
    if (!competition) return 'Loading...';

    switch (competition.status) {
      case 'SOLD_OUT': return 'Sold Out';
      case 'COMPLETED': return 'Completed';
      case 'UPCOMING': return 'Coming Soon';
      default: return 'Buy Tickets';
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.900">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.400" />
              <Text color="gray.300">Loading competition...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  if (error || !competition) {
    return (
      <Box minH="100vh" bg="gray.900">
        <Container maxW="container.xl" py={8}>
          <Center minH="50vh">
            <VStack spacing={4}>
              <Alert status="error" maxW="md" borderRadius="md" bg="gray.800" color="white">
                <AlertIcon />
                {error || 'Competition not found'}
              </Alert>
              <Button
                variant="outline"
                borderColor="gray.600"
                color="gray.300"
                _hover={{ bg: "gray.800", borderColor: "gray.500" }}
                onClick={() => router.push('/competitions')}
                leftIcon={<ArrowBackIcon />}
              >
                Back to Competitions
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900">
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Back to Competitions Button */}
          <Button
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => router.push('/competitions')}
            variant="ghost"
            color="gray.300"
            borderColor="purple.700"
            border="1px"
            _hover={{
              bg: "purple.900",
              borderColor: "purple.600",
              color: "white"
            }}
            size="lg"
            w="full"
            justifyContent="center"
            px={4}
            h="50px"
            fontSize="md"
            fontWeight="semibold"
          >
            Back to All Competitions
          </Button>

          {/* Main Content - Three Sections */}
          <VStack spacing={6} align="stretch">
            {/* Top Row: Image and Details Side by Side */}
            <Flex gap={6} direction={{ base: "column", lg: "row" }}>
              {/* Section 1: Image with Charity Info */}
              <Card
                flex={{ base: "1", lg: "1" }}
                shadow="2xl"
                overflow="hidden"
                bgGradient="linear(to-br, purple.900, blue.900)"
                borderRadius="lg"
                border="1px"
                borderColor="purple.800"
              >
                <CardBody p={0}>
                  <Box position="relative" h={{ base: "400px", lg: "100%" }} minH="500px">
                  {competition.imageUrl ? (
                    <Image
                      src={competition.imageUrl}
                      alt={competition.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box
                      w="full"
                      h="full"
                      bgGradient="linear(to-br, purple.700, blue.700)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FaTrophy} color="white" boxSize={20} />
                    </Box>
                  )}

                  {/* Overlay with gradient for better text visibility */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="150px"
                    bgGradient="linear(to-t, blackAlpha.900, transparent)"
                  />

                  {/* Status Badge */}
                  <Badge
                    position="absolute"
                    top={4}
                    left={4}
                    colorScheme={getStatusColor(competition.status)}
                    variant="solid"
                    borderRadius="md"
                    fontSize="sm"
                    px={3}
                    py={2}
                  >
                    {competition.status.replace('_', ' ')}
                  </Badge>

                  {/* Charity Info Overlay */}
                  <Box
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={4}
                  >
                    <HStack
                      bg="blackAlpha.700"
                      backdropFilter="blur(10px)"
                      p={4}
                      borderRadius="lg"
                      border="1px"
                      borderColor="whiteAlpha.200"
                    >
                      <Avatar
                        src={competition.charity.logoUrl}
                        name={competition.charity.name}
                        size="md"
                        border="2px"
                        borderColor="purple.400"
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" color="gray.300">Supporting</Text>
                        <Text fontSize="md" fontWeight="bold" color="white">
                          {competition.charity.name}
                        </Text>
                        {competition.charity.isVerified && (
                          <Badge colorScheme="green" variant="solid" size="sm">
                            ✓ Verified Charity
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                </Box>
              </CardBody>
            </Card>

            {/* Section 2: Main Details, Stats, and Buy Button */}
            <Card
              flex={{ base: "1", lg: "1" }}
              shadow="2xl"
              overflow="hidden"
              bgGradient="linear(to-br, purple.900, blue.900)"
              borderRadius="lg"
              border="1px"
              borderColor="purple.800"
            >
              <CardBody p={6}>
                <VStack spacing={5} align="stretch">
                  {/* Title and Description */}
                  <VStack spacing={3} align="stretch">
                    <Heading as="h1" size="xl" color="white">
                      {competition.title}
                    </Heading>
                    <Text color="gray.300" fontSize="md">
                      {competition.description}
                    </Text>
                  </VStack>

                  {/* Stats Grid */}
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    <Box textAlign="center" bg="blackAlpha.400" p={4} borderRadius="lg" border="1px" borderColor="green.700">
                      <Icon as={FaTicketAlt} boxSize={6} color="green.400" mb={2} />
                      <Text fontSize="xs" color="gray.400" mb={1}>Ticket Price</Text>
                      <Text fontWeight="bold" color="green.400" fontSize="lg">
                        {formatPrice(competition.ticketPrice)}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="blackAlpha.400" p={4} borderRadius="lg" border="1px" borderColor="purple.700">
                      <Icon as={FaTrophy} boxSize={6} color="purple.400" mb={2} />
                      <Text fontSize="xs" color="gray.400" mb={1}>Top Prize</Text>
                      <Text fontWeight="bold" color="purple.400" fontSize="lg">
                        £{competition.prizes[0]?.value || '0'}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="blackAlpha.400" p={4} borderRadius="lg" border="1px" borderColor="blue.700">
                      <Icon as={FaUsers} boxSize={6} color="blue.400" mb={2} />
                      <Text fontSize="xs" color="gray.400" mb={1}>Tickets Sold</Text>
                      <Text fontWeight="bold" color="blue.400" fontSize="lg">
                        {competition.ticketsSold}/{competition.maxTickets}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="blackAlpha.400" p={4} borderRadius="lg" border="1px" borderColor="orange.700">
                      <Icon as={FaClock} boxSize={6} color="orange.400" mb={2} />
                      <Text fontSize="xs" color="gray.400" mb={1}>Time Left</Text>
                      <Text fontWeight="bold" color="orange.400" fontSize="lg">
                        {getRemainingTime()}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Progress Bar */}
                  <Box>
                    <Flex justify="space-between" mb={2}>
                      <Text fontWeight="semibold" color="white">Sales Progress</Text>
                      <Text color="purple.300" fontWeight="bold">{getProgressPercentage()}%</Text>
                    </Flex>
                    <Progress
                      value={getProgressPercentage()}
                      colorScheme="purple"
                      size="lg"
                      borderRadius="full"
                      bg="blackAlpha.400"
                    />
                    <Flex justify="space-between" mt={2}>
                      <Text fontSize="sm" color="gray.400">
                        {competition.ticketsSold} tickets sold
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {competition.maxTickets - competition.ticketsSold} remaining
                      </Text>
                    </Flex>
                  </Box>

                  {/* Purchase Section with Cool Button */}
                  <Box
                    bg="blackAlpha.400"
                    p={6}
                    borderRadius="lg"
                    border="2px"
                    borderColor="green.400"
                    position="relative"
                    overflow="hidden"
                  >
                    {/* Animated background effect */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bgGradient="linear(45deg, transparent, green.900, transparent)"
                      opacity={0.3}
                    />

                    <VStack spacing={4} position="relative">
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                          <Text color="green.400" fontWeight="bold" fontSize="sm">ENTER NOW</Text>
                          <Text color="white" fontSize="2xl" fontWeight="bold">
                            {formatPrice(competition.ticketPrice)} per ticket
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text color="gray.400" fontSize="sm">Draw Date</Text>
                          <Text color="orange.400" fontWeight="semibold">
                            {new Date(competition.drawDate).toLocaleDateString('en-GB')}
                          </Text>
                        </VStack>
                      </HStack>

                      <Button
                        size="lg"
                        w="full"
                        h="60px"
                        onClick={handlePurchaseClick}
                        bg="green.400"
                        color="gray.900"
                        fontSize="lg"
                        fontWeight="bold"
                        _hover={{
                          bg: "green.300",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 20px rgba(72, 187, 120, 0.3)"
                        }}
                        _active={{
                          transform: "translateY(0)",
                        }}
                        transition="all 0.2s"
                        isDisabled={getButtonProps().isDisabled}
                      >
                        {getButtonText()} 🎫
                      </Button>

                      <Text fontSize="xs" color="gray.400" textAlign="center">
                        100% of proceeds go to {competition.charity.name}
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
            </Flex>

            {/* Section 3: Tabbed Content - Details, Prizes, FAQ */}
            <Card
              shadow="2xl"
              overflow="hidden"
              bgGradient="linear(to-br, purple.900, blue.900)"
              borderRadius="lg"
              border="1px"
              borderColor="purple.800"
            >
              <CardBody p={6}>
                <Tabs variant="soft-rounded" colorScheme="purple">
                  <TabList mb={4}>
                    <Tab
                      _selected={{
                        bg: "purple.600",
                        color: "white",
                      }}
                      color="gray.300"
                      mr={2}
                    >
                      <Icon as={FaInfoCircle} mr={2} />
                      Details
                    </Tab>
                    <Tab
                      _selected={{
                        bg: "purple.600",
                        color: "white",
                      }}
                      color="gray.300"
                      mr={2}
                    >
                      <Icon as={FaGift} mr={2} />
                      Prizes
                    </Tab>
                    <Tab
                      _selected={{
                        bg: "purple.600",
                        color: "white",
                      }}
                      color="gray.300"
                    >
                      <Icon as={FaQuestionCircle} mr={2} />
                      FAQ
                    </Tab>
                  </TabList>

                  <TabPanels>
                    {/* Details Tab */}
                    <TabPanel px={0}>
                      <VStack spacing={4} align="stretch">
                        <Box bg="blackAlpha.400" p={5} borderRadius="lg">
                          <Heading size="md" color="white" mb={4}>Competition Details</Heading>
                          <List spacing={3}>
                            <ListItem color="gray.300">
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.400" />
                                <Text>Entry Price: <Text as="span" fontWeight="bold" color="green.400">{formatPrice(competition.ticketPrice)}</Text> per ticket</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color="gray.300">
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.400" />
                                <Text>Maximum Tickets: <Text as="span" fontWeight="bold" color="white">{competition.maxTickets}</Text></Text>
                              </HStack>
                            </ListItem>
                            <ListItem color="gray.300">
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.400" />
                                <Text>Draw Date: <Text as="span" fontWeight="bold" color="orange.400">{formatDate(competition.drawDate)}</Text></Text>
                              </HStack>
                            </ListItem>
                            <ListItem color="gray.300">
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color="green.400" />
                                <Text>Competition Type: <Badge colorScheme="purple" ml={2}>{competition.type}</Badge></Text>
                              </HStack>
                            </ListItem>
                          </List>
                        </Box>

                        <Box bg="blackAlpha.400" p={5} borderRadius="lg">
                          <Heading size="md" color="white" mb={4}>How It Works</Heading>
                          <List spacing={3}>
                            <ListItem color="gray.300">
                              <HStack align="start">
                                <Text color="purple.400" fontWeight="bold">1.</Text>
                                <Text>Purchase your tickets for just {formatPrice(competition.ticketPrice)} each</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color="gray.300">
                              <HStack align="start">
                                <Text color="purple.400" fontWeight="bold">2.</Text>
                                <Text>Each ticket gives you a chance to win amazing prizes</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color="gray.300">
                              <HStack align="start">
                                <Text color="purple.400" fontWeight="bold">3.</Text>
                                <Text>Winners are drawn randomly on {new Date(competition.drawDate).toLocaleDateString('en-GB')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color="gray.300">
                              <HStack align="start">
                                <Text color="purple.400" fontWeight="bold">4.</Text>
                                <Text>100% of proceeds support {competition.charity.name}</Text>
                              </HStack>
                            </ListItem>
                          </List>
                        </Box>

                        <Box bg="blackAlpha.400" p={5} borderRadius="lg">
                          <Heading size="md" color="white" mb={4}>About {competition.charity.name}</Heading>
                          <Text color="gray.300" mb={3}>
                            {competition.charity.description || 'This verified charity is making a real difference in our community. Your participation directly supports their important work.'}
                          </Text>
                          {competition.charity.website && (
                            <Button
                              as="a"
                              href={competition.charity.website}
                              target="_blank"
                              size="sm"
                              variant="outline"
                              colorScheme="purple"
                              leftIcon={<Icon as={FaHeart} />}
                            >
                              Learn More About This Charity
                            </Button>
                          )}
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* Prizes Tab */}
                    <TabPanel px={0}>
                      <VStack spacing={4} align="stretch">
                        {competition.prizes && competition.prizes.length > 0 ? (
                          <>
                            <Text color="gray.300" mb={2}>
                              Win one of {competition.prizes.length} amazing prizes in this competition!
                            </Text>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                              {competition.prizes.map((prize, index) => (
                                <Box
                                  key={prize.id}
                                  bg="blackAlpha.400"
                                  p={4}
                                  borderRadius="lg"
                                  border="1px"
                                  borderColor={index === 0 ? "yellow.600" : "gray.700"}
                                  position="relative"
                                  transition="all 0.2s"
                                  _hover={{
                                    transform: "translateY(-2px)",
                                    borderColor: index === 0 ? "yellow.500" : "purple.600",
                                  }}
                                >
                                  {index === 0 && (
                                    <Badge
                                      position="absolute"
                                      top={2}
                                      right={2}
                                      colorScheme="yellow"
                                      variant="solid"
                                    >
                                      GRAND PRIZE
                                    </Badge>
                                  )}
                                  <HStack align="start" spacing={3}>
                                    <Box
                                      bg={index === 0 ? "yellow.600" : "purple.700"}
                                      color="white"
                                      borderRadius="md"
                                      w="40px"
                                      h="40px"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      fontWeight="bold"
                                      fontSize="lg"
                                    >
                                      {prize.position || index + 1}
                                    </Box>
                                    <VStack align="start" flex={1} spacing={1}>
                                      <Text color="white" fontWeight="semibold">
                                        {prize.name}
                                      </Text>
                                      {prize.description && (
                                        <Text color="gray.400" fontSize="sm">
                                          {prize.description}
                                        </Text>
                                      )}
                                      <Text color={index === 0 ? "yellow.400" : "green.400"} fontWeight="bold" fontSize="lg">
                                        £{prize.value}
                                      </Text>
                                      {prize.quantity > 1 && (
                                        <Badge colorScheme="blue" variant="subtle">
                                          {prize.quantity} winners
                                        </Badge>
                                      )}
                                    </VStack>
                                  </HStack>
                                </Box>
                              ))}
                            </SimpleGrid>
                            <Box bg="blackAlpha.400" p={4} borderRadius="lg" mt={2}>
                              <Text color="purple.400" fontWeight="semibold" fontSize="sm">
                                Total Prize Value: £{competition.prizes.reduce((sum, p) => sum + parseFloat(p.value), 0).toFixed(2)}
                              </Text>
                            </Box>
                          </>
                        ) : (
                          <Box
                            bg="blackAlpha.400"
                            p={8}
                            borderRadius="lg"
                            textAlign="center"
                          >
                            <Icon as={FaTrophy} color="gray.500" boxSize={12} mb={3} />
                            <Text color="gray.400">Prize details will be announced soon!</Text>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* FAQ Tab */}
                    <TabPanel px={0}>
                      <Accordion allowToggle>
                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              How do I purchase tickets?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            Simply click the "Buy Tickets" button above, select how many tickets you'd like, and complete your purchase securely. You'll receive an email confirmation with your ticket numbers.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              When will the draw take place?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            The draw will take place on {formatDate(competition.drawDate)}. Winners will be selected randomly and notified via email immediately after the draw.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              How are winners selected?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            Winners are selected using a certified random number generator to ensure complete fairness. Each ticket has an equal chance of winning, regardless of when it was purchased.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              Where does the money go?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            100% of the proceeds from ticket sales go directly to {competition.charity.name}. We cover all operational costs separately to ensure maximum impact for the charity.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              Is there a limit on tickets I can buy?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            You can purchase as many tickets as you like, up to the maximum available. More tickets mean more chances to win! However, please gamble responsibly.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              How will I know if I've won?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            Winners are notified via email and SMS (if provided) immediately after the draw. You can also check your account dashboard to see if any of your tickets have won.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none">
                          <AccordionButton
                            bg="blackAlpha.400"
                            borderRadius="lg"
                            _hover={{ bg: "blackAlpha.500" }}
                            _expanded={{ bg: "purple.900", borderBottomRadius: 0 }}
                          >
                            <Box flex="1" textAlign="left" color="white" fontWeight="semibold">
                              Can I get a refund?
                            </Box>
                            <AccordionIcon color="purple.400" />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg="blackAlpha.400" borderBottomRadius="lg" color="gray.300">
                            As per our terms and conditions, all ticket sales are final and non-refundable. This ensures fairness for all participants and maximizes the charity's fundraising.
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </VStack>
        </VStack>
      </Container>

      {/* Purchase Modal */}
      {competition && (
        <TicketPurchaseModal
          isOpen={isOpen}
          onClose={onClose}
          competition={competition}
          onPurchaseSuccess={async () => {
            console.log('Purchase successful');
            // Refresh competition data to show updated ticket count
            if (params.id && typeof params.id === 'string') {
              try {
                const data = await competitionsService.getById(params.id);
                setCompetition(data);
              } catch (err) {
                console.error('Failed to refresh competition:', err);
              }
            }
            onClose();
          }}
        />
      )}
    </Box>
  );
}