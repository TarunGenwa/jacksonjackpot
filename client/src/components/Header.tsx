'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  Spinner,
  Icon
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaUser, FaTicketAlt, FaWallet, FaHistory, FaSignOutAlt, FaPoundSign, FaHeart, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { balance: walletBalance, isLoading: walletLoading } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

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
      <Box
        bgGradient="linear(to-r, purple.900, blue.900, purple.900)"
        shadow="2xl"
        position="sticky"
        top={0}
        zIndex={1000}
        borderBottom="1px"
        borderColor="purple.700"
      >
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link href="/">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="linear(to-r, cyan.400, blue.400, purple.400)"
                bgClip="text"
                _hover={{
                  bgGradient: "linear(to-r, cyan.300, blue.300, purple.300)",
                  bgClip: "text"
                }}
                transition="all 0.3s"
              >
                JJ+
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
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
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
                        bg="green.400"
                        color="gray.900"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        cursor="pointer"
                        _hover={{ bg: 'green.300' }}
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
                        bg="purple.500"
                        color="white"
                        border="2px"
                        borderColor="purple.400"
                      />
                    </MenuButton>
                    <MenuList minW="250px" p={2} bg="gray.800" borderColor="gray.700">
                      <Box px={3} py={2} borderBottom="1px" borderColor="gray.600" mb={2}>
                        <Text fontWeight="semibold" color="white">{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color="gray.400">{user.email}</Text>
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
                      <MenuItem icon={<FaUser />} bg="gray.800" _hover={{ bg: "gray.700" }} color="gray.200">Profile Settings</MenuItem>
                    </Link>
                    <Link href="/my-tickets">
                      <MenuItem icon={<FaTicketAlt />} bg="gray.800" _hover={{ bg: "gray.700" }} color="gray.200">My Tickets</MenuItem>
                    </Link>
                    <Link href="/wallet">
                      <MenuItem icon={<FaWallet />} bg="gray.800" _hover={{ bg: "gray.700" }} color="gray.200">Wallet</MenuItem>
                    </Link>
                    <Link href="/transaction-history">
                      <MenuItem icon={<FaHistory />} bg="gray.800" _hover={{ bg: "gray.700" }} color="gray.200">Transaction History</MenuItem>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <>
                        <MenuDivider borderColor="gray.600" />
                        <Link href="/admin">
                          <MenuItem icon={<FaCog />} bg="gray.800" _hover={{ bg: "gray.700" }} color="orange.300">Admin Panel</MenuItem>
                        </Link>
                      </>
                    )}

                    <MenuDivider borderColor="gray.600" />

                    <Link href="/charities">
                      <MenuItem icon={<FaHeart />} bg="gray.800" _hover={{ bg: "gray.700" }} color="gray.200">Charities</MenuItem>
                    </Link>
                    <Link href="/how-it-works">
                      <MenuItem icon={<FaQuestionCircle />} bg="gray.800" _hover={{ bg: "gray.700" }} color="gray.200">How It Works</MenuItem>
                    </Link>

                    <MenuDivider borderColor="gray.600" />

                    <MenuItem
                      icon={<FaSignOutAlt />}
                      onClick={logout}
                      bg="gray.800"
                      color="red.400"
                      _hover={{ bg: "gray.700" }}
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
                    <Button
                      variant="ghost"
                      color="white"
                      _hover={{ bg: "whiteAlpha.200" }}
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      bg="purple.500"
                      color="white"
                      _hover={{ bg: "purple.400" }}
                    >
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
        <DrawerContent bg="gray.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700">
            <Text
              fontWeight="bold"
              fontSize="xl"
              bgGradient="linear(to-r, cyan.400, blue.400, purple.400)"
              bgClip="text"
            >
              JJ+
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              {/* Mobile User Menu */}
              {user && (
                <>
                  <Box borderTop="1px" borderColor="gray.700" pt={4}>
                    <VStack spacing={2} align="stretch">
                      <Box px={3} py={2} bg="gray.700" borderRadius="md">
                        <Text fontWeight="semibold" color="white">{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color="gray.400">{user.email}</Text>
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

                      <Link href="/profile" onClick={onClose}>
                        <Button variant="ghost" leftIcon={<FaUser />} w="full" justifyContent="flex-start" color="gray.200" _hover={{ bg: "gray.700" }}>
                          Profile Settings
                        </Button>
                      </Link>
                      <Link href="/my-tickets" onClick={onClose}>
                        <Button variant="ghost" leftIcon={<FaTicketAlt />} w="full" justifyContent="flex-start" color="gray.200" _hover={{ bg: "gray.700" }}>
                          My Tickets
                        </Button>
                      </Link>
                      <Link href="/wallet" onClick={onClose}>
                        <Button variant="ghost" leftIcon={<FaWallet />} w="full" justifyContent="flex-start" color="gray.200" _hover={{ bg: "gray.700" }}>
                          Wallet
                        </Button>
                      </Link>
                      <Link href="/transaction-history" onClick={onClose}>
                        <Button variant="ghost" leftIcon={<FaHistory />} w="full" justifyContent="flex-start" color="gray.200" _hover={{ bg: "gray.700" }}>
                          Transaction History
                        </Button>
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link href="/admin" onClick={onClose}>
                          <Button variant="ghost" leftIcon={<FaCog />} w="full" justifyContent="flex-start" color="orange.300" _hover={{ bg: "gray.700" }}>
                            Admin Panel
                          </Button>
                        </Link>
                      )}

                      <Box borderTop="1px" borderColor="gray.200" pt={2} mt={2}>
                        <Link href="/charities" onClick={onClose}>
                          <Button variant="ghost" leftIcon={<FaHeart />} w="full" justifyContent="flex-start" color="gray.200" _hover={{ bg: "gray.700" }}>
                            Charities
                          </Button>
                        </Link>
                        <Link href="/how-it-works" onClick={onClose}>
                          <Button variant="ghost" leftIcon={<FaQuestionCircle />} w="full" justifyContent="flex-start" color="gray.200" _hover={{ bg: "gray.700" }}>
                            How It Works
                          </Button>
                        </Link>
                      </Box>

                      <Button
                        variant="ghost"
                        leftIcon={<FaSignOutAlt />}
                        w="full"
                        justifyContent="flex-start"
                        color="red.400"
                        _hover={{ bg: "gray.700" }}
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                      >
                        Sign Out
                      </Button>
                    </VStack>
                  </Box>
                </>
              )}

              {/* Mobile Auth Links */}
              {!user && (
                <>
                  <Box borderTop="1px" borderColor="gray.200" pt={4} mt={4}>
                    <VStack spacing={2}>
                      <Link href="/login" onClick={onClose}>
                        <Button variant="ghost" w="full" color="gray.200" _hover={{ bg: "gray.700" }}>
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={onClose}>
                        <Button
                          w="full"
                          bgGradient="linear(to-r, purple.500, blue.500)"
                          color="white"
                          _hover={{
                            bgGradient: "linear(to-r, purple.400, blue.400)"
                          }}
                        >
                          Sign Up
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