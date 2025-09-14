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
  useBreakpointValue,
  Spinner
} from '@chakra-ui/react';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons';
import { FaHistory, FaFilter } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { transactionsService, Transaction } from '@/services/transactions';


export default function TransactionHistoryPage() {
  const { user } = useAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Calculate date filters based on dateRange
        let dateFrom: string | undefined;
        const now = new Date();

        if (dateRange !== 'ALL') {
          const daysAgo = parseInt(dateRange);
          const fromDate = new Date();
          fromDate.setDate(now.getDate() - daysAgo);
          dateFrom = fromDate.toISOString();
        }

        const filters = {
          type: typeFilter,
          status: statusFilter,
          dateFrom,
        };

        const data = await transactionsService.getTransactions(filters);
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, typeFilter, statusFilter, dateRange]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.referenceNumber && transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (transaction.metadata?.competitionTitle && transaction.metadata.competitionTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return transactionsService.formatAmount(numAmount);
  };

  const formatDate = (dateString: string) => {
    return transactionsService.formatDate(dateString);
  };

  const getTypeColor = (type: string) => {
    return transactionsService.getTypeColor(type);
  };

  const getStatusColor = (status: string) => {
    return transactionsService.getStatusColor(status);
  };

  const getTypeIcon = (type: string) => {
    return transactionsService.getTypeIcon(type);
  };

  const exportTransactions = async () => {
    try {
      const filters = {
        type: typeFilter,
        status: statusFilter,
      };

      const blob = await transactionsService.exportTransactions('csv', filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export transactions:', error);
    }
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

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <VStack spacing={4} justify="center" minH="50vh">
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600">Loading your transactions...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <VStack spacing={4} justify="center" minH="50vh">
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
                            {transactionsService.getTypeLabel(transaction.type)}
                          </Badge>
                        </HStack>
                        <Text 
                          fontWeight="bold" 
                          fontSize="lg"
                          color={parseFloat(transaction.amount.toString()) > 0 ? 'green.600' : 'red.600'}
                        >
                          {parseFloat(transaction.amount.toString()) > 0 ? '+' : '-'}{formatAmount(transaction.amount)}
                        </Text>
                      </Flex>
                      
                      <Text fontWeight="medium" noOfLines={2}>
                        {transaction.description}
                      </Text>
                      
                      {transaction.metadata?.competitionTitle && (
                        <Text fontSize="sm" color="blue.600" noOfLines={1}>
                          {transaction.metadata.competitionTitle}
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
                      
                      {transaction.referenceNumber && (
                        <Text fontSize="xs" color="gray.500">
                          Ref: {transaction.referenceNumber}
                        </Text>
                      )}
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
                              {transaction.paymentProvider && (
                                <Text fontSize="sm" color="gray.600">
                                  {transaction.paymentProvider}
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
                              {transaction.referenceNumber || transaction.id.slice(0, 8)}
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