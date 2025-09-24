'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Badge,
  Progress,
  Divider,
  Grid,
  GridItem,
  Image,
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
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaTrophy, FaHeart, FaShieldAlt, FaInfoCircle, FaUsers, FaGift, FaChartLine, FaPoundSign, FaTicketAlt, FaQuestionCircle } from 'react-icons/fa';
import CompetitionCard from '@/components/CompetitionCard';
import { Competition } from '@/types/api';
import { competitionsService } from '@/services/competitions';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import TicketPurchaseModal from '@/components/TicketPurchaseModal';

export default function Home() {
  const { getThemeColor } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isDetailsDrawerOpen, onOpen: onDetailsDrawerOpen, onClose: onDetailsDrawerClose } = useDisclosure();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetitionIndex, setSelectedCompetitionIndex] = useState(0);
  const [showAllTickets, setShowAllTickets] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        // Fetch only active competitions that are available for ticket purchases
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

  const scrollCompetitions = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 300;
    const currentScroll = scrollContainerRef.current.scrollLeft;

    if (direction === 'left') {
      scrollContainerRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      scrollContainerRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    onOpen();
  };

  const handleCompetitionSelect = (index: number) => {
    setSelectedCompetitionIndex(index);
    onDrawerClose();
  };

  const toggleShowAllTickets = (prizeId: string) => {
    setShowAllTickets(prev => ({
      ...prev,
      [prizeId]: !prev[prizeId]
    }));
  };

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
    <Box minH="100vh" bg={getThemeColor('dark')} py={12} pb={{ base: 32, lg: 12 }}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Competition Details Section */}
          {competitions.length > 0 && (
            <Card w="full" shadow="xl" bg={getThemeColor('secondary')} border="1px" borderColor={getThemeColor('secondaryLight')}>
              <CardBody p={8}>
                <VStack spacing={6} align="stretch">
                  {/* Competition Selector */}
                  <Box>

                    {/* Mobile View - Button */}
                    {isMobile ? (
                      <Button
                        w="full"
                        size="lg"
                        bg={getThemeColor('dark')}
                        color={getThemeColor('white')}
                        border="2px"
                        borderColor={getThemeColor('primary')}
                        _hover={{ bg: getThemeColor('primaryDark') }}
                        onClick={onDrawerOpen}
                        leftIcon={<Icon as={FaTrophy} />}
                      >
                        {competitions[selectedCompetitionIndex]?.title || 'Select Competition'}
                      </Button>
                    ) : (
                      /* Desktop View - Horizontal Tiles */
                      <HStack spacing={2} position="relative">
                        <IconButton
                          aria-label="Scroll left"
                          icon={<ChevronLeftIcon boxSize={6} />}
                          size="sm"
                          borderRadius="full"
                          bg={getThemeColor('primary')}
                          color="white"
                          _hover={{ bg: getThemeColor('primaryDark') }}
                          onClick={() => scrollCompetitions('left')}
                        />

                        <Box
                          ref={scrollContainerRef}
                          overflowX="auto"
                          flex={1}
                          css={{
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                          }}
                        >
                          <HStack spacing={3} pb={2}>
                            {competitions.map((comp, index) => (
                              <VStack
                          key={comp.id}
                          spacing={2}
                          p={2}
                          borderRadius="lg"
                          border="2px"
                          borderColor={selectedCompetitionIndex === index ? getThemeColor('primary') : getThemeColor('gray700')}
                          bg={selectedCompetitionIndex === index ? getThemeColor('dark') : getThemeColor('secondary')}
                          minW="140px"
                          cursor="pointer"
                          onClick={() => setSelectedCompetitionIndex(index)}
                          transition="all 0.2s"
                          position="relative"
                          zIndex={selectedCompetitionIndex === index ? 2 : 1}
                          _hover={{
                            transform: 'scale(1.05)',
                            borderColor: selectedCompetitionIndex === index ? getThemeColor('primary') : getThemeColor('primaryLight'),
                            zIndex: 3
                          }}
                        >
                            <Box
                              w="120px"
                              h="80px"
                              borderRadius="md"
                              overflow="hidden"
                              bg={getThemeColor('dark')}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              {comp.imageUrl ? (
                                <Image
                                  src={comp.imageUrl}
                                  alt={comp.title}
                                  width="100%"
                                  height="100%"
                                  objectFit="cover"
                                />
                              ) : (
                                <Icon as={FaTrophy} boxSize={8} color={getThemeColor('accent')} />
                              )}
                            </Box>
                            <VStack spacing={0} align="center">
                              <Text
                                fontSize="xs"
                                fontWeight="semibold"
                                color={selectedCompetitionIndex === index ? getThemeColor('white') : getThemeColor('gray300')}
                                textAlign="center"
                                noOfLines={1}
                              >
                                {comp.title}
                              </Text>
                              <Text
                                fontSize="xs"
                                color={selectedCompetitionIndex === index ? getThemeColor('primary') : getThemeColor('gray500')}
                                noOfLines={1}
                              >
                                {comp.charity.name}
                              </Text>
                            </VStack>
                          </VStack>
                            ))}
                          </HStack>
                        </Box>

                        <IconButton
                          aria-label="Scroll right"
                          icon={<ChevronRightIcon boxSize={6} />}
                          size="sm"
                          borderRadius="full"
                          bg={getThemeColor('primary')}
                          color="white"
                          _hover={{ bg: getThemeColor('primaryDark') }}
                          onClick={() => scrollCompetitions('right')}
                        />
                      </HStack>
                    )}
                  </Box>

                  <Divider borderColor={getThemeColor('primaryDark')} />

                  {/* Selected Competition Details */}
                  {competitions[selectedCompetitionIndex] && (
                    <>
                      {/* Mobile Layout */}
                      <Box display={{ base: 'block', lg: 'none' }}>
                        <VStack spacing={4} align="stretch">
                          {/* Image with Badge */}
                          <Box position="relative">
                            {competitions[selectedCompetitionIndex].imageUrl ? (
                              <Box borderRadius="lg" overflow="hidden" border="2px" borderColor={getThemeColor('primary')} bg={getThemeColor('dark')}>
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
                                <Icon as={FaTrophy} boxSize={16} color={getThemeColor('accent')} />
                              </Box>
                            )}

                            {/* ACTIVE Badge on top left */}
                            <Badge
                              position="absolute"
                              top={4}
                              left={4}
                              bg={getThemeColor('accent')}
                              color={getThemeColor('dark')}
                              px={3}
                              py={1}
                              fontSize="sm"
                              fontWeight="bold"
                              borderRadius="md"
                            >
                              ACTIVE
                            </Badge>
                          </Box>

                          {/* Title and Description below image */}
                          <Box>
                            <Heading size="lg" color={getThemeColor('white')} mb={2}>
                              {competitions[selectedCompetitionIndex].title}
                            </Heading>
                            <HStack spacing={2} mb={3}>
                              <Text color={getThemeColor('gray300')} fontSize="sm">Supporting</Text>
                              <Text color={getThemeColor('primary')} fontWeight="semibold" fontSize="sm">
                                {competitions[selectedCompetitionIndex].charity.name}
                              </Text>
                              {competitions[selectedCompetitionIndex].charity.isVerified && (
                                <Badge colorScheme="green" variant="solid" fontSize="xs">✓ Verified</Badge>
                              )}
                            </HStack>
                            <Text color={getThemeColor('gray300')} fontSize="sm" mb={4}>
                              {competitions[selectedCompetitionIndex].description}
                            </Text>

                            {/* View Details Button */}
                            <Button
                              w="full"
                              variant="outline"
                              borderColor={getThemeColor('primary')}
                              color={getThemeColor('primary')}
                              _hover={{ bg: getThemeColor('primaryDark'), color: 'white' }}
                              onClick={onDetailsDrawerOpen}
                              mb={4}
                            >
                              View Competition Details
                            </Button>
                          </Box>
                        </VStack>
                      </Box>

                      {/* Desktop Layout */}
                      <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8} display={{ base: 'none', lg: 'grid' }}>
                        {/* Competition Image and Title */}
                        <GridItem>
                          <VStack spacing={4} align="stretch">
                          {/* Image with Badge */}
                          <Box position="relative">
                            {competitions[selectedCompetitionIndex].imageUrl ? (
                              <Box borderRadius="lg" overflow="hidden" border="2px" borderColor={getThemeColor('primary')} bg={getThemeColor('dark')}>
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
                                h="350px"
                                bg={getThemeColor('dark')}
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px"
                                borderColor={getThemeColor('primary')}
                              >
                                <Icon as={FaTrophy} boxSize={24} color={getThemeColor('accent')} />
                              </Box>
                            )}

                            {/* ACTIVE Badge on top left */}
                            <Badge
                              position="absolute"
                              top={4}
                              left={4}
                              bg={getThemeColor('accent')}
                              color={getThemeColor('dark')}
                              px={3}
                              py={1}
                              fontSize="sm"
                              fontWeight="bold"
                              borderRadius="md"
                            >
                              ACTIVE
                            </Badge>
                          </Box>

                          {/* Title and Description below image */}
                          <Box>
                            <Heading size="lg" color={getThemeColor('white')} mb={2}>
                              {competitions[selectedCompetitionIndex].title}
                            </Heading>
                            <HStack spacing={2} mb={3}>
                              <Text color={getThemeColor('gray300')} fontSize="sm">Supporting</Text>
                              <Text color={getThemeColor('primary')} fontWeight="semibold" fontSize="sm">
                                {competitions[selectedCompetitionIndex].charity.name}
                              </Text>
                              {competitions[selectedCompetitionIndex].charity.isVerified && (
                                <Badge colorScheme="green" variant="solid" fontSize="xs">✓ Verified</Badge>
                              )}
                            </HStack>
                            <Text color={getThemeColor('gray300')} fontSize="sm">
                              {competitions[selectedCompetitionIndex].description}
                            </Text>
                          </Box>
                        </VStack>
                      </GridItem>

                      {/* Competition Info */}
                      <GridItem>
                        <VStack spacing={6} align="stretch">
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

                          {/* Ticket Quantity Selector */}
                          <Box bg={getThemeColor('dark')} p={4} borderRadius="lg">
                            <HStack justify="space-between" align="center">
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color={getThemeColor('gray300')}>Number of Tickets</Text>
                                <HStack>
                                  <NumberInput
                                    value={ticketQuantity}
                                    onChange={(_, value) => setTicketQuantity(value)}
                                    min={1}
                                    max={100}
                                    size="md"
                                    w="120px"
                                  >
                                    <NumberInputField
                                      bg={getThemeColor('secondary')}
                                      color={getThemeColor('white')}
                                      borderColor={getThemeColor('primary')}
                                      _hover={{ borderColor: getThemeColor('primaryLight') }}
                                      _focus={{ borderColor: getThemeColor('primary'), boxShadow: 'none' }}
                                    />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper color={getThemeColor('primary')} />
                                      <NumberDecrementStepper color={getThemeColor('primary')} />
                                    </NumberInputStepper>
                                  </NumberInput>
                                  <Text color={getThemeColor('gray300')}>tickets</Text>
                                </HStack>
                              </VStack>
                              <VStack align="end" spacing={1}>
                                <Text fontSize="sm" color={getThemeColor('gray300')}>Total Price</Text>
                                <Text fontSize="2xl" fontWeight="bold" color={getThemeColor('accent')}>
                                  £{(ticketQuantity * parseFloat(competitions[selectedCompetitionIndex].ticketPrice)).toFixed(2)}
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>

                          {/* Action Button */}
                          <Button
                            size="lg"
                            bg={getThemeColor('accent')}
                            color={getThemeColor('dark')}
                            _hover={{ bg: getThemeColor('accentDark') }}
                            leftIcon={<Icon as={FaTicketAlt} />}
                            fontWeight="bold"
                            onClick={handlePurchaseClick}
                            w="full"
                          >
                            Checkout - £{(ticketQuantity * parseFloat(competitions[selectedCompetitionIndex].ticketPrice)).toFixed(2)}
                          </Button>
                          </VStack>
                        </GridItem>
                      </Grid>
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Mobile Fixed Checkout Button */}
          {competitions.length > 0 && competitions[selectedCompetitionIndex] && (
            <Box
              display={{ base: 'block', lg: 'none' }}
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              bg={getThemeColor('secondary')}
              p={4}
              borderTop="2px"
              borderColor={getThemeColor('primary')}
              zIndex={1000}
            >
              {/* Ticket Quantity Selector - Mobile */}
              <HStack justify="space-between" align="center" mb={3}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color={getThemeColor('gray300')}>Tickets</Text>
                  <HStack>
                    <NumberInput
                      value={ticketQuantity}
                      onChange={(_, value) => setTicketQuantity(value)}
                      min={1}
                      max={100}
                      size="sm"
                      w="80px"
                    >
                      <NumberInputField
                        bg={getThemeColor('dark')}
                        color={getThemeColor('white')}
                        borderColor={getThemeColor('primary')}
                        _hover={{ borderColor: getThemeColor('primaryLight') }}
                        _focus={{ borderColor: getThemeColor('primary'), boxShadow: 'none' }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper color={getThemeColor('primary')} />
                        <NumberDecrementStepper color={getThemeColor('primary')} />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </VStack>
                <VStack align="end" spacing={0}>
                  <Text fontSize="xs" color={getThemeColor('gray300')}>Total</Text>
                  <Text fontSize="lg" fontWeight="bold" color={getThemeColor('accent')}>
                    £{(ticketQuantity * parseFloat(competitions[selectedCompetitionIndex].ticketPrice)).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>

              {/* Checkout Button */}
              <Button
                size="lg"
                bg={getThemeColor('accent')}
                color={getThemeColor('dark')}
                _hover={{ bg: getThemeColor('accentDark') }}
                leftIcon={<Icon as={FaTicketAlt} />}
                fontWeight="bold"
                onClick={handlePurchaseClick}
                w="full"
              >
                Checkout - £{(ticketQuantity * parseFloat(competitions[selectedCompetitionIndex].ticketPrice)).toFixed(2)}
              </Button>
            </Box>
          )}

          {/* Tabbed Content Section - Prizes, Tickets, Details */}
          {competitions.length > 0 && competitions[selectedCompetitionIndex] && (
            <Card w="full" shadow="xl" bg={getThemeColor('secondary')} border="1px" borderColor={getThemeColor('secondaryLight')}>
              <CardBody p={8}>
                <Tabs variant="soft-rounded" colorScheme="purple" defaultIndex={0}>
                  <TabList mb={4} overflowX="auto" flexWrap="wrap">
                    <Tab
                      _selected={{
                        bg: getThemeColor('primary'),
                        color: "white",
                      }}
                      color={getThemeColor('gray300')}
                      mr={2}
                      mb={2}
                    >
                      <Icon as={FaGift} mr={2} />
                      Prizes
                    </Tab>
                    <Tab
                      _selected={{
                        bg: getThemeColor('primary'),
                        color: "white",
                      }}
                      color={getThemeColor('gray300')}
                      mr={2}
                      mb={2}
                    >
                      <Icon as={FaTicketAlt} mr={2} />
                      Tickets
                    </Tab>
                    <Tab
                      _selected={{
                        bg: getThemeColor('primary'),
                        color: "white",
                      }}
                      color={getThemeColor('gray300')}
                      mr={2}
                      mb={2}
                    >
                      <Icon as={FaInfoCircle} mr={2} />
                      Details
                    </Tab>
                    <Tab
                      _selected={{
                        bg: getThemeColor('primary'),
                        color: "white",
                      }}
                      color={getThemeColor('gray300')}
                      mr={2}
                      mb={2}
                    >
                      <Icon as={FaQuestionCircle} mr={2} />
                      FAQ
                    </Tab>
                  </TabList>

                  <TabPanels>
                    {/* Prizes Tab */}
                    <TabPanel px={0}>
                      <VStack spacing={6} align="stretch">
                        {competitions[selectedCompetitionIndex].prizes && competitions[selectedCompetitionIndex].prizes.length > 0 ? (
                          <>
                            <HStack justify="space-between" w="full" bg={getThemeColor('dark')} p={4} borderRadius="lg" border="1px" borderColor={getThemeColor("primary")}>
                              <VStack align="start" spacing={1}>
                                <Text color={getThemeColor("primary")} fontSize="sm" fontWeight="semibold">Total Prizes</Text>
                                <Text color={getThemeColor('white')} fontWeight="bold" fontSize="xl">
                                  {competitions[selectedCompetitionIndex].prizes.length} prizes
                                </Text>
                              </VStack>
                              <VStack align="end" spacing={1}>
                                <Text color={getThemeColor("accent")} fontSize="sm" fontWeight="semibold">Combined Value</Text>
                                <Text color={getThemeColor("accent")} fontWeight="bold" fontSize="xl">
                                  £{(competitions[selectedCompetitionIndex].prizes.reduce((sum, p) => sum + ((p.value / 100) * p.quantity), 0)).toFixed(2)}
                                </Text>
                              </VStack>
                            </HStack>

                            <Text color={getThemeColor('gray300')} mb={2}>
                              This competition features {competitions[selectedCompetitionIndex].prizes.filter(p => p.type === 'DRAW').length > 0 ? 'a main draw prize' : 'no draw prize'} and {competitions[selectedCompetitionIndex].prizes.filter(p => p.type === 'INSTANT_WIN').length} instant win prizes!
                            </Text>

                            {/* Draw Prizes Section */}
                            {competitions[selectedCompetitionIndex].prizes.filter(p => p.type === 'DRAW').length > 0 && (
                              <VStack spacing={3} align="stretch">
                                <Text color={getThemeColor("primary")} fontWeight="bold" fontSize="lg">
                                  🏆 Main Draw Prize
                                </Text>
                                {competitions[selectedCompetitionIndex].prizes.filter(p => p.type === 'DRAW').map((prize) => (
                                  <Box
                                    key={prize.id}
                                    bg={getThemeColor('dark')}
                                    p={6}
                                    borderRadius="lg"
                                    border="2px"
                                    borderColor={getThemeColor("primary")}
                                    position="relative"
                                  >
                                    <Badge
                                      position="absolute"
                                      top={3}
                                      right={3}
                                      colorScheme="purple"
                                      variant="solid"
                                    >
                                      DRAW PRIZE
                                    </Badge>
                                    <HStack align="start" spacing={4}>
                                      <Box
                                        bg={getThemeColor("primary")}
                                        color={getThemeColor('white')}
                                        borderRadius="md"
                                        w="50px"
                                        h="50px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        fontSize="xl"
                                      >
                                        <Icon as={FaTrophy} />
                                      </Box>
                                      <VStack align="start" flex={1} spacing={2}>
                                        <Text color={getThemeColor('white')} fontWeight="bold" fontSize="xl">
                                          {prize.name}
                                        </Text>
                                        {prize.description && (
                                          <Text color={getThemeColor('gray300')} fontSize="md">
                                            {prize.description}
                                          </Text>
                                        )}
                                        <Text color={getThemeColor("accent")} fontWeight="bold" fontSize="2xl">
                                          £{(prize.value / 100).toFixed(2)}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  </Box>
                                ))}
                              </VStack>
                            )}

                            {/* Instant Win Prizes Section */}
                            {competitions[selectedCompetitionIndex].prizes.filter(p => p.type === 'INSTANT_WIN').length > 0 && (
                              <VStack spacing={3} align="stretch">
                                <Text color={getThemeColor("accent")} fontWeight="bold" fontSize="lg">
                                  ⚡ Instant Win Prizes
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                                  {competitions[selectedCompetitionIndex].prizes.filter(p => p.type === 'INSTANT_WIN').map((prize) => (
                                    <Box
                                      key={prize.id}
                                      bg={getThemeColor('dark')}
                                      p={4}
                                      borderRadius="lg"
                                      border="1px"
                                      borderColor={getThemeColor("accent")}
                                    >
                                      <Badge
                                        position="absolute"
                                        colorScheme="pink"
                                        variant="solid"
                                      >
                                        INSTANT WIN
                                      </Badge>
                                      <VStack align="start" spacing={2} mt={6}>
                                        <Text color={getThemeColor('white')} fontWeight="semibold">
                                          {prize.name}
                                        </Text>
                                        <Text color={getThemeColor("accent")} fontWeight="bold" fontSize="lg">
                                          £{(prize.value / 100).toFixed(2)}
                                        </Text>
                                        {prize.quantity > 1 && (
                                          <Badge colorScheme="purple" variant="subtle">
                                            {prize.quantity} available
                                          </Badge>
                                        )}
                                      </VStack>
                                    </Box>
                                  ))}
                                </SimpleGrid>
                              </VStack>
                            )}
                          </>
                        ) : (
                          <Box
                            bg={getThemeColor('dark')}
                            p={8}
                            borderRadius="lg"
                            textAlign="center"
                          >
                            <Icon as={FaTrophy} color={getThemeColor('gray500')} boxSize={12} mb={3} />
                            <Text color={getThemeColor('gray500')}>Prize details will be announced soon!</Text>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>

                    {/* Tickets Tab */}
                    <TabPanel px={0}>
                      <VStack spacing={6} align="stretch">
                        <Box bg={getThemeColor('dark')} p={4} borderRadius="lg" border="1px" borderColor={getThemeColor("primary")}>
                          <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={1}>
                              <Text color={getThemeColor("primary")} fontSize="sm" fontWeight="semibold">Total Tickets</Text>
                              <Text color={getThemeColor('white')} fontWeight="bold" fontSize="xl">
                                {competitions[selectedCompetitionIndex].maxTickets} tickets
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text color={getThemeColor("accent")} fontSize="sm" fontWeight="semibold">Tickets Sold</Text>
                              <Text color={getThemeColor("accent")} fontWeight="bold" fontSize="xl">
                                {competitions[selectedCompetitionIndex].ticketsSold}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>

                        <Text color={getThemeColor('gray300')} mb={2}>
                          Ticket numbers are assigned sequentially as they are purchased. Winners are selected randomly after all tickets are sold.
                        </Text>

                        <Box bg={getThemeColor('dark')} p={4} borderRadius="lg" border="1px" borderColor={getThemeColor("primary")}>
                          <VStack spacing={2}>
                            <Text color={getThemeColor("primary")} fontWeight="semibold" fontSize="sm" textAlign="center">
                              🔒 Fairness & Transparency
                            </Text>
                            <Text color={getThemeColor('gray300')} fontSize="sm" textAlign="center">
                              All winning ticket numbers are determined using cryptographically secure random number generation.
                            </Text>
                          </VStack>
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* Details Tab */}
                    <TabPanel px={0}>
                      <VStack spacing={4} align="stretch">
                        <Box bg={getThemeColor('dark')} p={5} borderRadius="lg">
                          <Heading size="md" color={getThemeColor('white')} mb={4}>Competition Details</Heading>
                          <List spacing={3}>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color={getThemeColor("accent")} />
                                <Text>Entry Price: <Text as="span" fontWeight="bold" color={getThemeColor("accent")}>{formatPrice(competitions[selectedCompetitionIndex].ticketPrice)}</Text> per ticket</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color={getThemeColor("accent")} />
                                <Text>Maximum Tickets: <Text as="span" fontWeight="bold" color={getThemeColor('white')}>{competitions[selectedCompetitionIndex].maxTickets}</Text></Text>
                              </HStack>
                            </ListItem>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color={getThemeColor("accent")} />
                                <Text>Draw Date: <Text as="span" fontWeight="bold" color={getThemeColor("accent")}>{formatDate(competitions[selectedCompetitionIndex].drawDate)}</Text></Text>
                              </HStack>
                            </ListItem>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack>
                                <ListIcon as={CheckCircleIcon} color={getThemeColor("accent")} />
                                <Text>Competition Type: <Badge colorScheme="purple" ml={2}>{competitions[selectedCompetitionIndex].type}</Badge></Text>
                              </HStack>
                            </ListItem>
                          </List>
                        </Box>

                        <Box bg={getThemeColor('dark')} p={5} borderRadius="lg">
                          <Heading size="md" color={getThemeColor('white')} mb={4}>How It Works</Heading>
                          <List spacing={3}>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack align="start">
                                <Text color={getThemeColor("primary")} fontWeight="bold">1.</Text>
                                <Text>Purchase your tickets for just {formatPrice(competitions[selectedCompetitionIndex].ticketPrice)} each</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack align="start">
                                <Text color={getThemeColor("primary")} fontWeight="bold">2.</Text>
                                <Text>Each ticket gives you a chance to win amazing prizes</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack align="start">
                                <Text color={getThemeColor("primary")} fontWeight="bold">3.</Text>
                                <Text>Winners are drawn randomly on {new Date(competitions[selectedCompetitionIndex].drawDate).toLocaleDateString('en-GB')}</Text>
                              </HStack>
                            </ListItem>
                            <ListItem color={getThemeColor('gray300')}>
                              <HStack align="start">
                                <Text color={getThemeColor("primary")} fontWeight="bold">4.</Text>
                                <Text>20% of proceeds support {competitions[selectedCompetitionIndex].charity.name}</Text>
                              </HStack>
                            </ListItem>
                          </List>
                        </Box>

                        <Box bg={getThemeColor('dark')} p={5} borderRadius="lg">
                          <Heading size="md" color={getThemeColor('white')} mb={4}>About {competitions[selectedCompetitionIndex].charity.name}</Heading>
                          <Text color={getThemeColor('gray300')} mb={3}>
                            {competitions[selectedCompetitionIndex].charity.description || 'This verified charity is making a real difference in our community. Your participation directly supports their important work.'}
                          </Text>
                          {competitions[selectedCompetitionIndex].charity.website && (
                            <Button
                              as="a"
                              href={competitions[selectedCompetitionIndex].charity.website}
                              target="_blank"
                              size="sm"
                              variant="outline"
                              colorScheme="pink"
                              leftIcon={<Icon as={FaHeart} />}
                            >
                              Learn More About This Charity
                            </Button>
                          )}
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* FAQ Tab */}
                    <TabPanel px={0}>
                      <Accordion allowToggle>
                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              How do I purchase tickets?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            Simply click the "Buy Tickets Now" button above, select how many tickets you'd like, and complete your purchase securely. You'll receive an email confirmation with your ticket numbers.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              When will the draw take place?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            The draw will take place on {formatDate(competitions[selectedCompetitionIndex].drawDate)}. Winners will be selected randomly and notified via email immediately after the draw.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              How are winners selected?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            Winners are selected using a certified random number generator to ensure complete fairness. Each ticket has an equal chance of winning, regardless of when it was purchased.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              Where does the money go?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            20% of the proceeds from ticket sales go directly to {competitions[selectedCompetitionIndex].charity.name}, with the remainder covering operational costs and platform fees.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              Is there a limit on tickets I can buy?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            You can purchase as many tickets as you like, up to the maximum available. More tickets mean more chances to win! However, please gamble responsibly.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none" mb={3}>
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              How will I know if I've won?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            Winners are notified via email and SMS (if provided) immediately after the draw. You can also check your account dashboard to see if any of your tickets have won.
                          </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem border="none">
                          <AccordionButton
                            bg={getThemeColor('dark')}
                            borderRadius="lg"
                            _hover={{ bg: getThemeColor('secondaryDark') }}
                            _expanded={{ bg: getThemeColor('secondaryDark'), borderBottomRadius: 0 }}
                            border="1px"
                            borderColor={getThemeColor('primary')}
                          >
                            <Box flex="1" textAlign="left" color={getThemeColor('white')} fontWeight="semibold">
                              Can I get a refund?
                            </Box>
                            <AccordionIcon color={getThemeColor("primary")} />
                          </AccordionButton>
                          <AccordionPanel pb={4} bg={getThemeColor('dark')} borderBottomRadius="lg" color={getThemeColor('gray300')} border="1px" borderColor={getThemeColor('primary')} borderTop="none">
                            As per our terms and conditions, all ticket sales are final and non-refundable. This ensures fairness for all participants and maximizes the charity's fundraising.
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          )}

        </VStack>
      </Container>

      {/* Mobile Details Drawer */}
      {competitions.length > 0 && competitions[selectedCompetitionIndex] && (
        <Drawer
          isOpen={isDetailsDrawerOpen}
          placement="bottom"
          onClose={onDetailsDrawerClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent bg={getThemeColor('secondary')} maxH="90vh">
            <DrawerCloseButton color={getThemeColor('white')} />
            <DrawerHeader borderBottomWidth="1px" borderColor={getThemeColor('primaryDark')} color={getThemeColor('white')}>
              Competition Details
            </DrawerHeader>

            <DrawerBody p={4} overflowY="auto">
              <VStack spacing={6} align="stretch">
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

                {/* Prize Summary */}
                {competitions[selectedCompetitionIndex].prizes && competitions[selectedCompetitionIndex].prizes.length > 0 && (
                  <Box bg={getThemeColor('dark')} p={4} borderRadius="lg">
                    <Text fontSize="lg" fontWeight="bold" color={getThemeColor('white')} mb={3}>
                      Prizes Available
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {competitions[selectedCompetitionIndex].prizes.slice(0, 3).map((prize, idx) => (
                        <HStack key={idx} justify="space-between">
                          <Text fontSize="sm" color={getThemeColor('gray300')}>
                            {prize.name}
                          </Text>
                          <Badge colorScheme="yellow" variant="solid">
                            £{(prize.value / 100).toFixed(0)}
                          </Badge>
                        </HStack>
                      ))}
                      {competitions[selectedCompetitionIndex].prizes.length > 3 && (
                        <Text fontSize="xs" color={getThemeColor('gray500')} textAlign="center">
                          +{competitions[selectedCompetitionIndex].prizes.length - 3} more prizes
                        </Text>
                      )}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* Purchase Modal */}
      {competitions.length > 0 && competitions[selectedCompetitionIndex] && (
        <TicketPurchaseModal
          isOpen={isOpen}
          onClose={onClose}
          competition={competitions[selectedCompetitionIndex]}
          ticketQuantity={ticketQuantity}
          onPurchaseSuccess={async () => {
            console.log('Purchase successful');
            // Refresh competition data to show updated ticket count
            try {
              const activeCompetitions = await competitionsService.getActive();
              setCompetitions(activeCompetitions);
            } catch (err) {
              console.error('Failed to refresh competitions:', err);
            }
            // Reset ticket quantity
            setTicketQuantity(1);
            onClose();
          }}
        />
      )}

      {/* Mobile Competition Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="bottom"
        onClose={onDrawerClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent bg={getThemeColor('secondary')} maxH="100vh">
          <DrawerCloseButton color={getThemeColor('white')} />
          <DrawerHeader borderBottomWidth="1px" borderColor={getThemeColor('primaryDark')} color={getThemeColor('white')}>
            Select Competition
          </DrawerHeader>

          <DrawerBody p={4} overflowY="auto">
            <VStack spacing={3} align="stretch">
              {competitions.map((comp, index) => (
                <Box
                  key={comp.id}
                  cursor="pointer"
                  onClick={() => handleCompetitionSelect(index)}
                  p={4}
                  borderRadius="lg"
                  border="2px"
                  borderColor={selectedCompetitionIndex === index ? getThemeColor('primary') : getThemeColor('dark')}
                  bg={selectedCompetitionIndex === index ? getThemeColor('dark') : getThemeColor('secondaryLight')}
                  transition="all 0.2s"
                  _hover={{
                    borderColor: getThemeColor('primary'),
                    bg: getThemeColor('dark')
                  }}
                >
                  <HStack spacing={4} align="center">
                    <Box
                      w="80px"
                      h="80px"
                      borderRadius="md"
                      overflow="hidden"
                      bg={getThemeColor('dark')}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      {comp.imageUrl ? (
                        <Image
                          src={comp.imageUrl}
                          alt={comp.title}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      ) : (
                        <Icon as={FaTrophy} boxSize={8} color={getThemeColor('accent')} />
                      )}
                    </Box>

                    <VStack align="start" flex={1} spacing={1}>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        color={getThemeColor('white')}
                      >
                        {comp.title}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={getThemeColor('primary')}
                      >
                        {comp.charity.name}
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="cyan" variant="solid">
                          £{comp.ticketPrice}
                        </Badge>
                        <Badge colorScheme="purple" variant="subtle">
                          {comp.ticketsSold}/{comp.maxTickets} sold
                        </Badge>
                      </HStack>
                    </VStack>

                    {selectedCompetitionIndex === index && (
                      <Circle size="8" bg={getThemeColor('primary')} color="white">
                        <CheckCircleIcon boxSize={4} />
                      </Circle>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
