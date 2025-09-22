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
        bg={getThemeColor("components.header.bg")}
        shadow="2xl"
        position="sticky"
        top={0}
        zIndex={1000}
        borderBottom="1px"
        borderColor={getThemeColor('ui.border.accent')}
      >
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link href="/">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={getThemeColor("components.header.logo")}
                _hover={{
                  color: getThemeColor("razzmatazz.600")
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
                  color={getThemeColor('text.primary')}
                  _hover={{ bg: getThemeColor('ui.hover.base') }}
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
                        bg={getThemeColor('semantic.success.DEFAULT')}
                        color={getThemeColor('text.primary')}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                        cursor="pointer"
                        _hover={{ bg: getThemeColor('semantic.success.light') }}
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
                        bg={getThemeColor('brand.electricViolet')}
                        color={getThemeColor('text.primary')}
                        border="2px"
                        borderColor={getThemeColor('ui.border.accent')}
                      />
                    </MenuButton>
                    <MenuList minW="250px" p={2} bg={getThemeColor('ui.card.bg')} borderColor={getThemeColor('ui.border.base')}>
                      <Box px={3} py={2} borderBottom="1px" borderColor={getThemeColor('ui.border.base')} mb={2}>
                        <Text fontWeight="semibold" color={getThemeColor('text.primary')}>{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color={getThemeColor('text.muted')}>{user.email}</Text>
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
                          <MenuItem icon={<FaCog />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('semantic.warning.light')}>Dashboard</MenuItem>
                        </Link>
                        <Link href="/admin/users">
                          <MenuItem icon={<FaUsers />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Users</MenuItem>
                        </Link>
                        <Link href="/admin/competitions">
                          <MenuItem icon={<FaTrophy />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Competitions</MenuItem>
                        </Link>
                        <Link href="/admin/charities">
                          <MenuItem icon={<FaHeart />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Charities</MenuItem>
                        </Link>
                      </>
                    ) : (
                      /* Regular User Menu Items */
                      <>
                        <Link href="/profile">
                          <MenuItem icon={<FaUser />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Profile Settings</MenuItem>
                        </Link>
                        <Link href="/my-tickets">
                          <MenuItem icon={<FaTicketAlt />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>My Tickets</MenuItem>
                        </Link>
                        <Link href="/wallet">
                          <MenuItem icon={<FaWallet />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Wallet</MenuItem>
                        </Link>
                        <Link href="/transaction-history">
                          <MenuItem icon={<FaHistory />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Transaction History</MenuItem>
                        </Link>

                        <MenuDivider borderColor={getThemeColor('ui.border.base')} />

                        <Link href="/charities">
                          <MenuItem icon={<FaHeart />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Charities</MenuItem>
                        </Link>
                        <Link href="/how-it-works">
                          <MenuItem icon={<FaQuestionCircle />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>How It Works</MenuItem>
                        </Link>
                        <Link href="/verify">
                          <MenuItem icon={<FaShieldAlt />} bg={getThemeColor('ui.card.bg')} _hover={{ bg: getThemeColor('ui.hover.elevated') }} color={getThemeColor('text.secondary')}>Verify Chain</MenuItem>
                        </Link>
                      </>
                    )}

                    <MenuDivider borderColor={getThemeColor('ui.border.base')} />

                    <MenuItem
                      icon={<FaSignOutAlt />}
                      onClick={logout}
                      bg={getThemeColor('ui.card.bg')}
                      color={getThemeColor('semantic.error.DEFAULT')}
                      _hover={{ bg: getThemeColor('ui.hover.elevated') }}
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
                        color={getThemeColor('text.primary')}
                        _hover={{ bg: getThemeColor('ui.hover.base') }}
                        leftIcon={<FaShieldAlt />}
                      >
                        Verify
                      </Button>
                    </Link>
                  )}
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      color={getThemeColor('text.primary')}
                      _hover={{ bg: getThemeColor('ui.hover.base') }}
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      bg={getThemeColor('brand.electricViolet')}
                      color={getThemeColor('text.primary')}
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
        <DrawerContent bg={getThemeColor('ui.card.bg')} color={getThemeColor('text.primary')}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={getThemeColor('ui.border.base')}>
            <Text
              fontWeight="bold"
              fontSize="xl"
              color={getThemeColor("components.header.logo")}
            >
              JJ+
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" pt={4}>
              {/* Mobile User Menu */}
              {user && (
                <>
                  <Box borderTop="1px" borderColor={getThemeColor('ui.border.base')} pt={4}>
                    <VStack spacing={2} align="stretch">
                      <Box px={3} py={2} bg="gray.700" borderRadius="md">
                        <Text fontWeight="semibold" color={getThemeColor('text.primary')}>{getUserDisplayName()}</Text>
                        <Text fontSize="sm" color={getThemeColor('text.muted')}>{user.email}</Text>
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
                            <Button variant="ghost" leftIcon={<FaCog />} w="full" justifyContent="flex-start" color={getThemeColor('semantic.warning.light')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/admin/users" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaUsers />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Users
                            </Button>
                          </Link>
                          <Link href="/admin/competitions" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaTrophy />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Competitions
                            </Button>
                          </Link>
                          <Link href="/admin/charities" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaHeart />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Charities
                            </Button>
                          </Link>
                        </>
                      ) : (
                        /* Regular User Mobile Menu Items */
                        <>
                          <Link href="/profile" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaUser />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Profile Settings
                            </Button>
                          </Link>
                          <Link href="/my-tickets" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaTicketAlt />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              My Tickets
                            </Button>
                          </Link>
                          <Link href="/wallet" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaWallet />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Wallet
                            </Button>
                          </Link>
                          <Link href="/transaction-history" onClick={onClose}>
                            <Button variant="ghost" leftIcon={<FaHistory />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                              Transaction History
                            </Button>
                          </Link>

                          <Box borderTop="1px" borderColor={getThemeColor('ui.border.light')} pt={2} mt={2}>
                            <Link href="/charities" onClick={onClose}>
                              <Button variant="ghost" leftIcon={<FaHeart />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                                Charities
                              </Button>
                            </Link>
                            <Link href="/how-it-works" onClick={onClose}>
                              <Button variant="ghost" leftIcon={<FaQuestionCircle />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                                How It Works
                              </Button>
                            </Link>
                            <Link href="/verify" onClick={onClose}>
                              <Button variant="ghost" leftIcon={<FaShieldAlt />} w="full" justifyContent="flex-start" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
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
                        color={getThemeColor('semantic.error.DEFAULT')}
                        _hover={{ bg: getThemeColor('ui.hover.elevated') }}
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
                  <Box borderTop="1px" borderColor={getThemeColor('ui.border.light')} pt={4} mt={4}>
                    <VStack spacing={2}>
                      <Link href="/verify" onClick={onClose}>
                        <Button variant="ghost" leftIcon={<FaShieldAlt />} w="full" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                          Verify Chain
                        </Button>
                      </Link>
                      <Link href="/login" onClick={onClose}>
                        <Button variant="ghost" w="full" color={getThemeColor('text.secondary')} _hover={{ bg: getThemeColor('ui.hover.elevated') }}>
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={onClose}>
                        <Button
                          w="full"
                          bg={getThemeColor("ui.button.primary.bg")}
                          color={getThemeColor('text.primary')}
                          _hover={{
                            bg: getThemeColor("ui.button.primary.hover")
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