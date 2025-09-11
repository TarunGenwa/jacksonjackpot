'use client';

import { useState } from 'react';
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
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  InputGroup,
  InputLeftElement,
  useBreakpointValue
} from '@chakra-ui/react';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons';
import { FaHistory, FaFilter } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  reference: string;
  createdAt: string;
  competitionTitle?: string;
  paymentMethod?: string;
}

export default function TransactionHistoryPage() {
  const { user } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');

  // Mock transaction data - replace with actual API call
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'DEPOSIT',
      amount: 50.00,
      currency: 'GBP',
      status: 'COMPLETED',
      description: 'Wallet deposit via credit card',
      reference: 'DEP-001234',
      createdAt: '2025-01-10T14:30:00Z',
      paymentMethod: 'Visa ****1234'
    },
    {
      id: '2',
      type: 'TICKET_PURCHASE',
      amount: -5.00,
      currency: 'GBP',
      status: 'COMPLETED',
      description: 'Competition ticket purchase',
      reference: 'TKT-005678',
      createdAt: '2025-01-10T12:15:00Z',
      competitionTitle: 'Summer Prize Draw 2025'
    },
    {
      id: '3',
      type: 'DEPOSIT',
      amount: 25.00,
      currency: 'GBP',
      status: 'COMPLETED',
      description: 'Bank transfer deposit',
      reference: 'DEP-001235',
      createdAt: '2025-01-09T16:45:00Z',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '4',
      type: 'TICKET_PURCHASE',
      amount: -10.00,
      currency: 'GBP',
      status: 'COMPLETED',
      description: 'Competition ticket purchase',
      reference: 'TKT-005679',
      createdAt: '2025-01-09T14:20:00Z',
      competitionTitle: 'Winter Wonderland Competition'
    },
    {
      id: '5',
      type: 'WITHDRAWAL',
      amount: -20.00,
      currency: 'GBP',
      status: 'PENDING',
      description: 'Withdrawal to bank account',
      reference: 'WDL-001236',
      createdAt: '2025-01-08T10:30:00Z',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '6',
      type: 'PRIZE_PAYOUT',
      amount: 100.00,
      currency: 'GBP',
      status: 'COMPLETED',
      description: 'Prize winnings',
      reference: 'PRZ-001237',
      createdAt: '2025-01-07T09:15:00Z',
      competitionTitle: 'Christmas Mega Draw'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.competitionTitle && transaction.competitionTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'ALL' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'green';
      case 'TICKET_PURCHASE': return 'blue';
      case 'WITHDRAWAL': return 'orange';
      case 'PRIZE_PAYOUT': return 'purple';
      case 'REFUND': return 'cyan';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'yellow';
      case 'PROCESSING': return 'blue';
      case 'FAILED': return 'red';
      case 'CANCELLED': return 'gray';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return '↗️';
      case 'TICKET_PURCHASE': return '🎫';
      case 'WITHDRAWAL': return '↙️';
      case 'PRIZE_PAYOUT': return '🏆';
      case 'REFUND': return '↩️';
      default: return '💰';
    }
  };

  const exportTransactions = () => {
    // TODO: Implement actual export functionality
    console.log('Exporting transactions...');
  };

  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Please log in to view your transaction history.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Icon as={FaHistory} boxSize={16} color="blue.500" />
            <Heading as="h1" size="2xl" color="gray.800">
              Transaction History
            </Heading>
            <Text fontSize="lg" color="gray.600">
              View and manage all your account transactions
            </Text>
          </VStack>

          {/* Filters */}
          <Card shadow="md">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Icon as={FaFilter} color="gray.600" />
                  <Heading as="h2" size="md" color="gray.800">
                    Filter Transactions
                  </Heading>
                </HStack>
                <Button
                  leftIcon={<DownloadIcon />}
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  onClick={exportTransactions}
                >
                  Export
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                {/* Search */}
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by description, reference, or competition..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                  />
                </InputGroup>

                {/* Filter Controls */}
                <Flex 
                  direction={{ base: 'column', md: 'row' }} 
                  gap={4} 
                  w="full"
                >
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    bg="white"
                  >
                    <option value="ALL">All Types</option>
                    <option value="DEPOSIT">Deposits</option>
                    <option value="TICKET_PURCHASE">Ticket Purchases</option>
                    <option value="WITHDRAWAL">Withdrawals</option>
                    <option value="PRIZE_PAYOUT">Prize Payouts</option>
                    <option value="REFUND">Refunds</option>
                  </Select>

                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    bg="white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="FAILED">Failed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>

                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    bg="white"
                  >
                    <option value="ALL">All Time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 3 months</option>
                    <option value="365">Last year</option>
                  </Select>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Summary */}
          <Flex justify="space-between" align="center">
            <Text color="gray.600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </Text>
            {searchTerm && (
              <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                Search: "{searchTerm}"
              </Badge>
            )}
          </Flex>

          {/* Transactions Table/Cards */}
          {filteredTransactions.length === 0 ? (
            <Card maxW="2xl" mx="auto" shadow="xl">
              <CardBody py={16} textAlign="center">
                <VStack spacing={4}>
                  <Text fontSize="6xl">📋</Text>
                  <Heading size="xl" color="gray.700">
                    No Transactions Found
                  </Heading>
                  <Text color="gray.600">
                    {searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                      ? 'Try adjusting your filters to find more transactions.'
                      : 'Your transaction history will appear here once you make your first transaction.'
                    }
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : isMobile ? (
            // Mobile Card View
            <VStack spacing={4}>
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} w="full" shadow="md">
                  <CardBody p={4}>
                    <VStack spacing={3} align="stretch">
                      <Flex justify="space-between" align="center">
                        <HStack spacing={2}>
                          <Text fontSize="lg">{getTypeIcon(transaction.type)}</Text>
                          <Badge 
                            colorScheme={getTypeColor(transaction.type)} 
                            variant="subtle"
                          >
                            {transaction.type.replace('_', ' ')}
                          </Badge>
                        </HStack>
                        <Text 
                          fontWeight="bold" 
                          fontSize="lg"
                          color={transaction.amount > 0 ? 'green.600' : 'red.600'}
                        >
                          {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                        </Text>
                      </Flex>
                      
                      <Text fontWeight="medium" noOfLines={2}>
                        {transaction.description}
                      </Text>
                      
                      {transaction.competitionTitle && (
                        <Text fontSize="sm" color="blue.600" noOfLines={1}>
                          {transaction.competitionTitle}
                        </Text>
                      )}
                      
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(transaction.createdAt)}
                        </Text>
                        <Badge 
                          colorScheme={getStatusColor(transaction.status)} 
                          variant="solid"
                          fontSize="xs"
                        >
                          {transaction.status}
                        </Badge>
                      </Flex>
                      
                      <Text fontSize="xs" color="gray.500">
                        Ref: {transaction.reference}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            // Desktop Table View
            <Card shadow="lg">
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Type</Th>
                        <Th>Description</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                        <Th>Reference</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredTransactions.map((transaction) => (
                        <Tr key={transaction.id} _hover={{ bg: 'gray.50' }}>
                          <Td>
                            <HStack spacing={2}>
                              <Text>{getTypeIcon(transaction.type)}</Text>
                              <Badge 
                                colorScheme={getTypeColor(transaction.type)} 
                                variant="subtle"
                                fontSize="xs"
                              >
                                {transaction.type.replace('_', ' ')}
                              </Badge>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" noOfLines={1}>
                                {transaction.description}
                              </Text>
                              {transaction.competitionTitle && (
                                <Text fontSize="sm" color="blue.600" noOfLines={1}>
                                  {transaction.competitionTitle}
                                </Text>
                              )}
                              {transaction.paymentMethod && (
                                <Text fontSize="sm" color="gray.600">
                                  {transaction.paymentMethod}
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <Text 
                              fontWeight="bold" 
                              color={transaction.amount > 0 ? 'green.600' : 'red.600'}
                            >
                              {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                            </Text>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={getStatusColor(transaction.status)} 
                              variant="solid"
                              fontSize="xs"
                            >
                              {transaction.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(transaction.createdAt)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600" fontFamily="mono">
                              {transaction.reference}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}