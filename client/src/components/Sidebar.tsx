'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  VStack,
  Button,
  Text,
  Icon,
  useColorModeValue,
  HStack,
  Avatar,
  Badge,
  Divider
} from '@chakra-ui/react';
import { FaHome, FaTrophy, FaHeart, FaQuestionCircle, FaUser, FaTicketAlt, FaWallet, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: FaHome },
  { label: 'Competitions', href: '/competitions', icon: FaTrophy },
  { label: 'Charities', href: '/charities', icon: FaHeart },
  { label: 'How It Works', href: '/how-it-works', icon: FaQuestionCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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

  return (
    <Box
      w="250px"
      h="100vh"
      bg={sidebarBg}
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      left={0}
      top={0}
      zIndex={100}
      pt={4}
      shadow="sm"
    >
      <VStack spacing={4} align="stretch" p={4}>
        {/* Logo */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="blue.500"
          textAlign="center"
          mb={4}
        >
          JJ+
        </Text>
        
        {/* User Profile or Auth Buttons */}
        {user ? (
          <>
            <Box bg="gray.50" p={3} borderRadius="md">
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name={getUserDisplayName()}
                  bg="blue.500"
                  color="white"
                >
                  {getUserInitials()}
                </Avatar>
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                    {getUserDisplayName()}
                  </Text>
                  <Badge colorScheme="blue" variant="solid" fontSize="xs">
                    {user.role}
                  </Badge>
                </VStack>
              </HStack>
            </Box>
            
            <Divider />
            
            {/* User Menu Items */}
            <VStack spacing={1} align="stretch">
              <Link href="/profile">
                <Button
                  variant={pathname === '/profile' ? 'solid' : 'ghost'}
                  colorScheme={pathname === '/profile' ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FaUser} />}
                  w="full"
                  size="sm"
                >
                  Profile
                </Button>
              </Link>
              <Link href="/my-tickets">
                <Button
                  variant={pathname === '/my-tickets' ? 'solid' : 'ghost'}
                  colorScheme={pathname === '/my-tickets' ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FaTicketAlt} />}
                  w="full"
                  size="sm"
                >
                  My Tickets
                </Button>
              </Link>
              <Link href="/wallet">
                <Button
                  variant={pathname === '/wallet' ? 'solid' : 'ghost'}
                  colorScheme={pathname === '/wallet' ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FaWallet} />}
                  w="full"
                  size="sm"
                >
                  Wallet
                </Button>
              </Link>
              <Link href="/transaction-history">
                <Button
                  variant={pathname === '/transaction-history' ? 'solid' : 'ghost'}
                  colorScheme={pathname === '/transaction-history' ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  leftIcon={<Icon as={FaHistory} />}
                  w="full"
                  size="sm"
                >
                  History
                </Button>
              </Link>
              <Button
                variant="ghost"
                colorScheme="red"
                justifyContent="flex-start"
                leftIcon={<Icon as={FaSignOutAlt} />}
                w="full"
                size="sm"
                onClick={logout}
              >
                Sign Out
              </Button>
            </VStack>
            
            <Divider />
          </>
        ) : null}
        
        {/* Main Navigation */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'solid' : 'ghost'}
                colorScheme={isActive ? 'blue' : 'gray'}
                justifyContent="flex-start"
                leftIcon={<Icon as={item.icon} />}
                w="full"
                h={12}
                fontWeight={isActive ? 'semibold' : 'medium'}
                _hover={{
                  bg: isActive ? 'blue.600' : 'gray.100',
                }}
                transition="all 0.2s"
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
        
        {/* Auth Links for Non-Authenticated Users */}
        {!user && (
          <>
            <Divider />
            <Link href="/login">
              <Button
                variant={pathname === '/login' ? 'solid' : 'ghost'}
                colorScheme={pathname === '/login' ? 'blue' : 'gray'}
                justifyContent="flex-start"
                w="full"
                h={12}
                fontWeight={pathname === '/login' ? 'semibold' : 'medium'}
                _hover={{
                  bg: pathname === '/login' ? 'blue.600' : 'gray.100',
                }}
                transition="all 0.2s"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant={pathname === '/signup' ? 'solid' : 'ghost'}
                colorScheme={pathname === '/signup' ? 'blue' : 'gray'}
                justifyContent="flex-start"
                w="full"
                h={12}
                fontWeight={pathname === '/signup' ? 'semibold' : 'medium'}
                _hover={{
                  bg: pathname === '/signup' ? 'blue.600' : 'gray.100',
                }}
                transition="all 0.2s"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </VStack>
    </Box>
  );
}