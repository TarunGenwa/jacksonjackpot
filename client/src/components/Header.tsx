'use client';

import { useState } from 'react';
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
  useBreakpointValue
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaUser, FaTicketAlt, FaWallet, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
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

  const NavLinks = () => (
    <>
      <Link href="/">
        <Button variant="ghost">Home</Button>
      </Link>
      <Link href="/competitions">
        <Button variant="ghost">Competitions</Button>
      </Link>
      <Link href="/charities">
        <Button variant="ghost">Charities</Button>
      </Link>
      <Link href="/how-it-works">
        <Button variant="ghost">How It Works</Button>
      </Link>
    </>
  );

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

            {/* Desktop Navigation */}
            {!isMobile && (
              <HStack spacing={4}>
                <NavLinks />
              </HStack>
            )}

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
                      <Badge colorScheme="blue" variant="solid" fontSize="xs" mt={1}>
                        {user.role}
                      </Badge>
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
              ) : (
                /* Guest User Buttons */
                <HStack spacing={2}>
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Log In
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => setShowSignupModal(true)}
                  >
                    Sign Up
                  </Button>
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
              <Link href="/" onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  🏠 Home
                </Button>
              </Link>
              <Link href="/competitions" onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  🎲 Competitions
                </Button>
              </Link>
              <Link href="/charities" onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  💚 Charities
                </Button>
              </Link>
              <Link href="/how-it-works" onClick={onClose}>
                <Button variant="ghost" w="full" justifyContent="flex-start">
                  ❓ How It Works
                </Button>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}