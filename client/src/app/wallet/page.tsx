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
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  Divider,
  Icon,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Select
} from '@chakra-ui/react';
import { FaWallet, FaCreditCard, FaPlus, FaMinus, FaPoundSign } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { walletService, Wallet, Transaction } from '@/services/wallet';

export default function WalletPage() {
  const { user } = useAuth();
  const { refreshBalance } = useWallet();
  const { isOpen: isDepositOpen, onOpen: onDepositOpen, onClose: onDepositClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();
  const toast = useToast();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      setIsLoadingWallet(true);
      const wallet = await walletService.getWallet();
      setWalletData(wallet);
      // Also refresh the global wallet balance
      await refreshBalance();
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactions = await walletService.getTransactions();
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleQuickDeposit = async (amount: number) => {
    setIsLoading(true);
    try {
      const response = await walletService.addFunds({
        amount: amount,
        currency: 'GBP',
        description: 'Quick deposit'
      });
      
      if (response.success) {
        toast({
          title: 'Deposit successful',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        setWalletData(response.wallet);
        await fetchTransactions();
      }
    } catch (error) {
      toast({
        title: 'Deposit failed',
        description: 'Failed to process deposit. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid deposit amount.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await walletService.addFunds({
        amount: parseFloat(depositAmount),
        currency: 'GBP',
        description: `${paymentMethod === 'card' ? 'Card' : paymentMethod === 'bank' ? 'Bank transfer' : 'PayPal'} deposit`
      });
      
      if (response.success) {
        toast({
          title: 'Deposit successful',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        setWalletData(response.wallet);
        await fetchTransactions();
        setDepositAmount('');
        onDepositClose();
      }
    } catch (error) {
      toast({
        title: 'Deposit failed',
        description: 'Failed to process deposit. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid withdrawal amount.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!walletData || parseFloat(withdrawAmount) > parseFloat(walletData.balance)) {
      toast({
        title: 'Insufficient funds',
        description: 'You cannot withdraw more than your current balance.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual withdrawal API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Withdrawal successful',
        description: `£${withdrawAmount} has been withdrawn from your wallet.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setWithdrawAmount('');
      onWithdrawClose();
    } catch (error) {
      toast({
        title: 'Withdrawal failed',
        description: 'Failed to process withdrawal. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
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

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'green';
      case 'TICKET_PURCHASE': return 'blue';
      case 'WITHDRAWAL': return 'orange';
      case 'PRIZE_PAYOUT': return 'purple';
      case 'REFUND': return 'cyan';
      case 'BONUS': return 'pink';
      case 'FEE': return 'red';
      default: return 'gray';
    }
  };

  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.md" py={12}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Please log in to view your wallet.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (isLoadingWallet) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.lg" py={12}>
          <VStack spacing={8}>
            <Text>Loading wallet...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.lg" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Icon as={FaWallet} boxSize={16} color="blue.500" />
            <Heading as="h1" size="2xl" color="gray.800">
              My Wallet
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Manage your account balance and transactions
            </Text>
          </VStack>

          {/* Wallet Balance */}
          <Card shadow="xl" bg="gradient-to-r" bgGradient="linear(to-r, blue.500, purple.600)">
            <CardBody p={8}>
              <VStack spacing={6} textAlign="center" color="white">
                <Text fontSize="lg" opacity={0.9}>
                  Current Balance
                </Text>
                <Text fontSize="5xl" fontWeight="bold">
                  {walletData ? formatAmount(parseFloat(walletData.balance)) : '£0.00'}
                </Text>
                <Badge 
                  colorScheme={walletData?.isLocked ? 'red' : 'green'} 
                  variant="solid" 
                  px={4} 
                  py={2}
                  borderRadius="md"
                >
                  {walletData?.isLocked ? 'Account Locked' : 'Active'}
                </Badge>
                
                <HStack spacing={4} pt={4}>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="green"
                    size="lg"
                    onClick={onDepositOpen}
                    disabled={walletData?.isLocked}
                  >
                    Add Funds
                  </Button>
                  <Button
                    leftIcon={<FaMinus />}
                    variant="outline"
                    color="white"
                    borderColor="white"
                    size="lg"
                    onClick={onWithdrawOpen}
                    disabled={walletData?.isLocked || !walletData || parseFloat(walletData.balance) <= 0}
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Withdraw
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.3s">
              <CardBody textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Icon as={FaCreditCard} boxSize={8} color="blue.500" />
                  <Text fontWeight="medium">Quick Deposit</Text>
                  <Text fontSize="sm" color="gray.600">
                    Add £10, £25, or £50 instantly
                  </Text>
                  <HStack spacing={2}>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="outline"
                      onClick={() => handleQuickDeposit(10)}
                      isLoading={isLoading}
                    >
                      £10
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="outline"
                      onClick={() => handleQuickDeposit(25)}
                      isLoading={isLoading}
                    >
                      £25
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="outline"
                      onClick={() => handleQuickDeposit(50)}
                      isLoading={isLoading}
                    >
                      £50
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            <Card shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.3s">
              <CardBody textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Icon as={FaPoundSign} boxSize={8} color="green.500" />
                  <Text fontWeight="medium">Auto Top-up</Text>
                  <Text fontSize="sm" color="gray.600">
                    Automatically add funds when balance is low
                  </Text>
                  <Button size="sm" colorScheme="green" variant="outline">
                    Set Up
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.3s">
              <CardBody textAlign="center" p={6}>
                <VStack spacing={3}>
                  <Icon as={FaWallet} boxSize={8} color="purple.500" />
                  <Text fontWeight="medium">Payment Methods</Text>
                  <Text fontSize="sm" color="gray.600">
                    Manage your cards and bank accounts
                  </Text>
                  <Button size="sm" colorScheme="purple" variant="outline">
                    Manage
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Recent Transactions */}
          <Card shadow="lg">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="md" color="gray.800">
                  Recent Transactions
                </Heading>
                <Button size="sm" variant="outline" colorScheme="blue">
                  View All
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentTransactions.length > 0 ? recentTransactions.map((transaction, index) => (
                  <Box key={transaction.id}>
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{transaction.description}</Text>
                        <HStack spacing={2}>
                          <Badge 
                            colorScheme={getTransactionColor(transaction.type)} 
                            variant="subtle"
                            fontSize="xs"
                          >
                            {transaction.type.replace('_', ' ')}
                          </Badge>
                          <Text fontSize="sm" color="gray.600">
                            {formatDate(transaction.createdAt)}
                          </Text>
                        </HStack>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text 
                          fontWeight="bold" 
                          color={transaction.amount > 0 ? 'green.600' : 'red.600'}
                          fontSize="lg"
                        >
                          {transaction.amount > 0 ? '+' : ''}{formatAmount(Math.abs(transaction.amount))}
                        </Text>
                        <Badge 
                          colorScheme={transaction.status === 'COMPLETED' ? 'green' : 'yellow'} 
                          variant="solid"
                          fontSize="xs"
                        >
                          {transaction.status}
                        </Badge>
                      </VStack>
                    </Flex>
                    {index < recentTransactions.length - 1 && <Divider mt={4} />}
                  </Box>
                )) : (
                  <Text color="gray.500" textAlign="center">No transactions yet</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Deposit Modal */}
        <Modal isOpen={isDepositOpen} onClose={onDepositClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Funds to Wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Text color="gray.500">£</Text>
                    </InputLeftElement>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="1"
                      step="0.01"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Payment Method</FormLabel>
                  <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDepositClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="green" 
                onClick={handleDeposit}
                isLoading={isLoading}
                loadingText="Processing..."
              >
                Add Funds
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Withdraw Modal */}
        <Modal isOpen={isWithdrawOpen} onClose={onWithdrawClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Withdraw Funds</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  Available balance: {walletData ? formatAmount(parseFloat(walletData.balance)) : '£0.00'}
                </Alert>
                
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Text color="gray.500">£</Text>
                    </InputLeftElement>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="1"
                      max={walletData ? parseFloat(walletData.balance) : 0}
                      step="0.01"
                    />
                  </InputGroup>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onWithdrawClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="orange" 
                onClick={handleWithdraw}
                isLoading={isLoading}
                loadingText="Processing..."
              >
                Withdraw
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}