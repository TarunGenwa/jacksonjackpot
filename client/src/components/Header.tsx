'use client';

import Link from 'next/link';
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
import { FaUser, FaTicketAlt, FaWallet, FaHistory, FaSignOutAlt, FaPoundSign, FaHeart, FaQuestionCircle, FaCog, FaUsers, FaTrophy, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { balance: walletBalance, isLoading: walletLoading } = useWallet();
  const { getThemeColor } = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.email || 'User';
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
        bg={getThemeColor("dark")}
        shadow="2xl"
        position="sticky"
        top={0}
        zIndex={1000}
        borderBottom="1px"
        borderColor={getThemeColor('primary')}
      >
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link href="/">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={getThemeColor("accent")}
                _hover={{
                  color: getThemeColor("accentDark")
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
                  color={getThemeColor('white')}
                  _hover={{ bg: getThemeColor('secondaryDark') }}
                  onClick={onOpen}
                />
              )}

              {user ? (
                /* Authenticated User Menu */
                <HStack spacing={3}>
                  {/* Wallet Balance - Only for non-admin users */}
                  {!isMobile && user.role !== 'ADMIN' && (
                    <Link href="/wallet">
                      <Badge
                        bg={getThemeColor('success')}
                        color={getThemeColor('white')}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        cursor="pointer"
                        _hover={{ bg: getThemeColor('success') }}
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
                        bg={getThemeColor('primary')}
                        color={getThemeColor('white')}
                        border="2px"
                        borderColor={getThemeColor('primary')}
                      />
                    </MenuButton>
                    <MenuList minW="250px" p={2} bg={getThemeColor('dark')} borderColor={getThemeColor('secondary')}>
                      <Box px={3} py={2} borderBottom="1px" borderColor={getThemeColor('secondary')} mb={2}>
                        <Text fontWeight="semibold" color={getThemeColor('white')}>{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color={getThemeColor('gray500')}>{user.email}</Text>
                        <HStack justify="space-between" mt={2}>
                          <Badge colorScheme="blue" variant="solid" fontSize="xs">
                            {user.role}
                          </Badge>
                          {user.role !== 'ADMIN' && (
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
                          )}
                        </HStack>
                      </Box>
                    
                    {user.role === 'ADMIN' ? (
                      /* Admin Menu Items */
                      <>
                        <Link href="/admin">
                          <MenuItem icon={<FaCog />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('warning')}>Dashboard</MenuItem>
                        </Link>
                        <Link href="/admin/users">
                          <MenuItem icon={<FaUsers />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Users</MenuItem>
                        </Link>
                        <Link href="/admin/competitions">
                          <MenuItem icon={<FaTrophy />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Competitions</MenuItem>
                        </Link>
                        <Link href="/admin/charities">
                          <MenuItem icon={<FaHeart />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Charities</MenuItem>
                        </Link>
                      </>
                    ) : (
                      /* Regular User Menu Items */
                      <>
                        <Link href="/profile">
                          <MenuItem icon={<FaUser />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Profile Settings</MenuItem>
                        </Link>
                        <Link href="/my-tickets">
                          <MenuItem icon={<FaTicketAlt />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>My Tickets</MenuItem>
                        </Link>
                        <Link href="/wallet">
                          <MenuItem icon={<FaWallet />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Wallet</MenuItem>
                        </Link>
                        <Link href="/transaction-history">
                          <MenuItem icon={<FaHistory />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Transaction History</MenuItem>
                        </Link>

                        <MenuDivider borderColor={getThemeColor('secondary')} />

                        <Link href="/charities">
                          <MenuItem icon={<FaHeart />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Charities</MenuItem>
                        </Link>
                        <Link href="/how-it-works">
                          <MenuItem icon={<FaQuestionCircle />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>How It Works</MenuItem>
                        </Link>
                        <Link href="/verify">
                          <MenuItem icon={<FaShieldAlt />} bg={getThemeColor('dark')} _hover={{ bg: getThemeColor('secondaryLight') }} color={getThemeColor('gray300')}>Verify Chain</MenuItem>
                        </Link>
                      </>
                    )}

                    <MenuDivider borderColor={getThemeColor('secondary')} />

                    <MenuItem
                      icon={<FaSignOutAlt />}
                      onClick={logout}
                      bg={getThemeColor('dark')}
                      color={getThemeColor('error')}
                      _hover={{ bg: getThemeColor('secondaryLight') }}
                    >
                      Sign Out
                    </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              ) : (
                /* Guest User Buttons */
                <HStack spacing={2}>
                  {!isMobile && (
                    <Link href="/verify">
                      <Button
                        variant="ghost"
                        color={getThemeColor('white')}
                        _hover={{ bg: getThemeColor('secondaryDark') }}
                        leftIcon={<FaShieldAlt />}
                      >
                        Verify
                      </Button>
                    </Link>
                  )}
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      color={getThemeColor('white')}
                      _hover={{ bg: getThemeColor('secondaryDark') }}
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      bg={getThemeColor('primary')}
                      color={getThemeColor('white')}
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
        <DrawerContent bg={getThemeColor('dark')} color={getThemeColor('white')}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={getThemeColor('secondary')}>
            <Text
              fontWeight="bold"
              fontSize="xl"
              color={getThemeColor("accent")}
            >
              JJ+
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              {/* Mobile User Menu */}
              {user && (
                <>
                  <Box borderTop="1px" borderColor={getThemeColor('secondary')} pt={4}>
                    <VStack spacing={2} align="stretch">
                      <Box px={3} py={2} bg="gray.700" borderRadius="md">
                        <Text fontWeight="semibold" color={getThemeColor('white')}>{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color={getThemeColor('gray500')}>{user.email}</Text>
                        <HStack justify="space-between" mt={2}>
                          <Badge colorScheme="blue" variant="solid" fontSize="xs">
                            {user.role}
                          </Badge>
                          {user.role !== 'ADMIN' && (
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
                          )}
                        </HStack>
                      </Box>

                      {user.role === 'ADMIN' ? (
                        /* Admin Mobile Menu Items */
                        <>
                          <Link href="/admin" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaCog />} w="full" justifyContent="flex-start" color={getThemeColor('warning')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/admin/users" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaUsers />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Users
                            </Button>
                          </Link>
                          <Link href="/admin/competitions" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaTrophy />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Competitions
                            </Button>
                          </Link>
                          <Link href="/admin/charities" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaHeart />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Charities
                            </Button>
                          </Link>
                        </>
                      ) : (
                        /* Regular User Mobile Menu Items */
                        <>
                          <Link href="/profile" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaUser />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Profile Settings
                            </Button>
                          </Link>
                          <Link href="/my-tickets" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaTicketAlt />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              My Tickets
                            </Button>
                          </Link>
                          <Link href="/wallet" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaWallet />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Wallet
                            </Button>
                          </Link>
                          <Link href="/transaction-history" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaHistory />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                              Transaction History
                            </Button>
                          </Link>

                          <Box borderTop="1px" borderColor={getThemeColor('gray300')} pt={2} mt={2}>
                            <Link href="/charities" onClick={onClose}>
                              <Button variant="ghost" leftIcon={<FaHeart />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                                Charities
                              </Button>
                            </Link>
                            <Link href="/how-it-works" onClick={onClose}>
                              <Button variant="ghost" leftIcon={<FaQuestionCircle />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                                How It Works
                              </Button>
                            </Link>
                            <Link href="/verify" onClick={onClose}>
                              <Button variant="ghost" leftIcon={<FaShieldAlt />} w="full" justifyContent="flex-start" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                                Verify Chain
                              </Button>
                            </Link>
                          </Box>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        leftIcon={<FaSignOutAlt />}
                        w="full"
                        justifyContent="flex-start"
                        color={getThemeColor('error')}
                        _hover={{ bg: getThemeColor('secondaryLight') }}
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
                  <Box borderTop="1px" borderColor={getThemeColor('gray300')} pt={4} mt={4}>
                    <VStack spacing={2}>
                      <Link href="/verify" onClick={onClose}>
                        <Button variant="ghost" leftIcon={<FaShieldAlt />} w="full" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                          Verify Chain
                        </Button>
                      </Link>
                      <Link href="/login" onClick={onClose}>
                        <Button variant="ghost" w="full" color={getThemeColor('gray300')} _hover={{ bg: getThemeColor('secondaryLight') }}>
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={onClose}>
                        <Button
                          w="full"
                          bg={getThemeColor("primary")}
                          color={getThemeColor('white')}
                          _hover={{
                            bg: getThemeColor("primaryDark")
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