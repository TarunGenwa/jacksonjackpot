'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  Badge,
  Container,
  IconButton,
  useDisclosure,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Spinner
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaUser, FaTicketAlt, FaWallet, FaHistory, FaSignOutAlt, FaPoundSign } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { walletService } from '@/services/wallet';

export default function Header() {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!user) return;
      
      try {
        setWalletLoading(true);
        const balanceData = await walletService.getBalance();
        setWalletBalance(balanceData.balance);
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
        setWalletBalance('0.00');
      } finally {
        setWalletLoading(false);
      }
    };

    fetchWalletBalance();
  }, [user]);

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.email || 'User';
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  };

  const formatBalance = (balance: string) => {
    const amount = parseFloat(balance);
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };


  return (
    <>
      <Box bg="white" shadow="lg" position="sticky" top={0} zIndex={1000}>
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link href="/">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="blue.500"
                _hover={{ color: "blue.600" }}
                transition="color 0.2s"
              >
                Jackson Jackpot
              </Text>
            </Link>


            {/* Right Side */}
            <HStack spacing={4}>
              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  aria-label="Open Menu"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                  onClick={onOpen}
                />
              )}

              {user ? (
                /* Authenticated User Menu */
                <HStack spacing={3}>
                  {/* Wallet Balance */}
                  {!isMobile && (
                    <Link href="/wallet">
                      <Badge
                        colorScheme="green"
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        cursor="pointer"
                        _hover={{ bg: 'green.600' }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={1}>
                          <FaPoundSign size={10} />
                          <Text>
                            {walletLoading ? (
                              <Spinner size="xs" />
                            ) : (
                              walletBalance ? formatBalance(walletBalance) : '£0.00'
                            )}
                          </Text>
                        </HStack>
                      </Badge>
                    </Link>
                  )}
                  
                  <Menu>
                    <MenuButton>
                      <Avatar
                        size="sm"
                        name={getUserDisplayName()}
                        bg="blue.500"
                        color="white"
                      >
                        {getUserInitials()}
                      </Avatar>
                    </MenuButton>
                    <MenuList minW="250px" p={2}>
                      <Box px={3} py={2} borderBottom="1px" borderColor="gray.200" mb={2}>
                        <Text fontWeight="semibold">{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color="gray.600">{user.email}</Text>
                        <HStack justify="space-between" mt={2}>
                          <Badge colorScheme="blue" variant="solid" fontSize="xs">
                            {user.role}
                          </Badge>
                          <Badge colorScheme="green" variant="solid" fontSize="xs">
                            <HStack spacing={1}>
                              <FaPoundSign size={8} />
                              <Text>
                                {walletLoading ? (
                                  <Spinner size="xs" />
                                ) : (
                                  walletBalance ? formatBalance(walletBalance) : '£0.00'
                                )}
                              </Text>
                            </HStack>
                          </Badge>
                        </HStack>
                      </Box>
                    
                    <Link href="/profile">
                      <MenuItem icon={<FaUser />}>Profile Settings</MenuItem>
                    </Link>
                    <Link href="/my-tickets">
                      <MenuItem icon={<FaTicketAlt />}>My Tickets</MenuItem>
                    </Link>
                    <Link href="/wallet">
                      <MenuItem icon={<FaWallet />}>Wallet</MenuItem>
                    </Link>
                    <Link href="/transaction-history">
                      <MenuItem icon={<FaHistory />}>Transaction History</MenuItem>
                    </Link>
                    
                    <MenuDivider />
                    
                    <MenuItem 
                      icon={<FaSignOutAlt />} 
                      onClick={logout}
                      color="red.500"
                    >
                      Sign Out
                    </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              ) : (
                /* Guest User Buttons */
                <HStack spacing={2}>
                  <Link href="/login">
                    <Button variant="ghost">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button colorScheme="blue">
                      Sign Up
                    </Button>
                  </Link>
                </HStack>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text color="blue.500" fontWeight="bold">
              Jackson Jackpot
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              {/* Mobile Auth Links */}
              {!user && (
                <>
                  <Box borderTop="1px" borderColor="gray.200" pt={4} mt={4}>
                    <VStack spacing={2}>
                      <Link href="/login" onClick={onClose}>
                        <Button variant="ghost" w="full">
                          🔑 Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={onClose}>
                        <Button colorScheme="blue" w="full">
                          ✨ Sign Up
                        </Button>
                      </Link>
                    </VStack>
                  </Box>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}