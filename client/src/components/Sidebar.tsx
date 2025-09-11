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
} from '@chakra-ui/react';
import { FaHome, FaTrophy, FaHeart, FaQuestionCircle } from 'react-icons/fa';

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
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
      pt={16} // Account for header height
      shadow="sm"
    >
      <VStack spacing={2} align="stretch" p={4}>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wide"
          mb={2}
        >
          Navigation
        </Text>
        
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
      </VStack>
    </Box>
  );
}