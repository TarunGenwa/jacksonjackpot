'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
  Icon,
  Badge,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaShieldAlt,
  FaHeart,
  FaGavel,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function Footer() {
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const textColor = useColorModeValue('gray.300', 'gray.300');
  const headingColor = useColorModeValue('white', 'white');

  return (
    <Box bg={bgColor} color={textColor} mt="auto">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={10}>
          {/* Main Footer Content */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {/* Company Info */}
            <VStack align={{ base: "center", md: "start" }} spacing={4} textAlign={{ base: "center", md: "left" }}>
              <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                Jackson Jackpot
              </Text>
              <Text fontSize="sm" lineHeight={1.8}>
                Win amazing prizes while supporting incredible charities across the UK. 
                Every ticket purchased makes a real difference to important causes.
              </Text>
              <HStack spacing={3}>
                <Badge colorScheme="green" variant="solid" px={2} py={1}>
                  Licensed & Regulated
                </Badge>
                <Badge colorScheme="blue" variant="solid" px={2} py={1}>
                  Charity Verified
                </Badge>
              </HStack>
            </VStack>

            {/* Quick Links */}
            <VStack align={{ base: "center", md: "start" }} spacing={4} textAlign={{ base: "center", md: "left" }}>
              <Heading as="h3" size="sm" color={headingColor}>
                Quick Links
              </Heading>
              <VStack align={{ base: "center", md: "start" }} spacing={2}>
                <Link href="/competitions">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Browse Competitions
                  </Text>
                </Link>
                <Link href="/charities">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Our Charities
                  </Text>
                </Link>
                <Link href="/how-it-works">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    How It Works
                  </Text>
                </Link>
                <Link href="/winners">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Recent Winners
                  </Text>
                </Link>
                <Link href="/about">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    About Us
                  </Text>
                </Link>
              </VStack>
            </VStack>

            {/* Support & Legal */}
            <VStack align={{ base: "center", md: "start" }} spacing={4} textAlign={{ base: "center", md: "left" }}>
              <Heading as="h3" size="sm" color={headingColor}>
                Support & Legal
              </Heading>
              <VStack align={{ base: "center", md: "start" }} spacing={2}>
                <Link href="/help">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Help & FAQ
                  </Text>
                </Link>
                <Link href="/contact">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Contact Support
                  </Text>
                </Link>
                <Link href="/terms">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Terms & Conditions
                  </Text>
                </Link>
                <Link href="/privacy">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Text>
                </Link>
                <Link href="/responsible-gambling">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Responsible Gambling
                  </Text>
                </Link>
                <Link href="/cookie-policy">
                  <Text fontSize="sm" _hover={{ color: 'blue.400', textDecoration: 'underline' }}>
                    Cookie Policy
                  </Text>
                </Link>
              </VStack>
            </VStack>

            {/* Newsletter & Contact */}
            <VStack align={{ base: "center", md: "start" }} spacing={4} textAlign={{ base: "center", md: "left" }}>
              <Heading as="h3" size="sm" color={headingColor}>
                Stay Updated
              </Heading>
              <Text fontSize="sm">
                Get notified about new competitions and charity updates
              </Text>
              <InputGroup size="sm">
                <Input
                  placeholder="Enter your email"
                  bg="gray.800"
                  border="1px"
                  borderColor="gray.600"
                  _hover={{ borderColor: 'gray.500' }}
                  _focus={{ borderColor: 'blue.400' }}
                />
                <InputRightElement width="4.5rem">
                  <Button size="xs" colorScheme="blue">
                    Subscribe
                  </Button>
                </InputRightElement>
              </InputGroup>
              
              <VStack align={{ base: "center", md: "start" }} spacing={2} pt={2}>
                <HStack spacing={2}>
                  <Icon as={FaEnvelope} boxSize={3} />
                  <Text fontSize="sm">hello@jacksonjackpot.co.uk</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaPhone} boxSize={3} />
                  <Text fontSize="sm">0800 123 4567</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} boxSize={3} />
                  <Text fontSize="sm">London, United Kingdom</Text>
                </HStack>
              </VStack>
            </VStack>
          </SimpleGrid>

          <Divider borderColor="gray.700" />

          {/* Trust & Compliance Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full" textAlign="center">
            <VStack spacing={2}>
              <Icon as={FaShieldAlt} boxSize={8} color="green.400" />
              <Text fontSize="sm" fontWeight="semibold" color={headingColor}>
                Licensed & Secure
              </Text>
              <Text fontSize="xs">
                Licensed by the UK Gambling Commission. 
                All transactions are protected with bank-level security.
              </Text>
            </VStack>
            
            <VStack spacing={2}>
              <Icon as={FaHeart} boxSize={8} color="red.400" />
              <Text fontSize="sm" fontWeight="semibold" color={headingColor}>
                Supporting Charities
              </Text>
              <Text fontSize="xs">
                50%+ of ticket sales go directly to registered UK charities. 
                Over £500,000 raised so far.
              </Text>
            </VStack>
            
            <VStack spacing={2}>
              <Icon as={FaGavel} boxSize={8} color="blue.400" />
              <Text fontSize="sm" fontWeight="semibold" color={headingColor}>
                Fair & Transparent
              </Text>
              <Text fontSize="xs">
                Independently audited draws using certified random number generation. 
                Complete transparency guaranteed.
              </Text>
            </VStack>
          </SimpleGrid>

          <Divider borderColor="gray.700" />

          {/* Social Media & Bottom Info */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align="center" 
            w="full"
            gap={4}
          >
            <VStack spacing={2} align={{ base: 'center', md: 'start' }}>
              <Text fontSize="xs" color="gray.500">
                © 2025 Jackson Jackpot Ltd. All rights reserved.
              </Text>
              <Text fontSize="xs" color="gray.500">
                Company Registration: 12345678 | Gambling Commission License: 123-456-789
              </Text>
            </VStack>

            <VStack spacing={3} align="center">
              <HStack spacing={4}>
                <Link href="https://facebook.com/jacksonjackpot" target="_blank">
                  <Icon 
                    as={FaFacebook} 
                    boxSize={5} 
                    _hover={{ color: 'blue.400' }} 
                    transition="color 0.2s"
                  />
                </Link>
                <Link href="https://twitter.com/jacksonjackpot" target="_blank">
                  <Icon 
                    as={FaTwitter} 
                    boxSize={5} 
                    _hover={{ color: 'blue.400' }} 
                    transition="color 0.2s"
                  />
                </Link>
                <Link href="https://instagram.com/jacksonjackpot" target="_blank">
                  <Icon 
                    as={FaInstagram} 
                    boxSize={5} 
                    _hover={{ color: 'pink.400' }} 
                    transition="color 0.2s"
                  />
                </Link>
                <Link href="https://youtube.com/jacksonjackpot" target="_blank">
                  <Icon 
                    as={FaYoutube} 
                    boxSize={5} 
                    _hover={{ color: 'red.400' }} 
                    transition="color 0.2s"
                  />
                </Link>
              </HStack>
              
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Follow us for the latest updates and winner announcements
              </Text>
            </VStack>
          </Flex>

          {/* Age Verification & Responsible Gambling */}
          <Box 
            bg="gray.800" 
            p={4} 
            borderRadius="md" 
            border="1px" 
            borderColor="gray.700"
            w="full"
          >
            <VStack spacing={3} textAlign="center">
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Badge colorScheme="red" variant="solid" px={3} py={1}>
                  18+ ONLY
                </Badge>
                <Badge colorScheme="yellow" variant="solid" px={3} py={1}>
                  GAMBLE RESPONSIBLY
                </Badge>
                <Badge colorScheme="blue" variant="solid" px={3} py={1}>
                  BEGAMBLEAWARE.ORG
                </Badge>
              </HStack>
              
              <Text fontSize="xs" color="gray.400" maxW="4xl">
                Please gamble responsibly. You must be 18 or over to participate. 
                If you feel you may have a gambling problem, visit{' '}
                <Link href="https://www.begambleaware.org" target="_blank">
                  <Text as="span" color="blue.400" textDecoration="underline">
                    BeGambleAware.org
                  </Text>
                </Link>{' '}
                or call the National Gambling Helpline on 0808 8020 133.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}