import Image from 'next/image';
import { 
  Box, 
  Card, 
  CardBody, 
  Heading, 
  Text, 
  Button, 
  Badge, 
  VStack, 
  HStack, 
  Avatar, 
  Flex,
  Link,
  Icon
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FaGlobe, FaEnvelope } from 'react-icons/fa';
import { Charity } from '@/types/api';

interface CharityCardProps {
  charity: Charity;
}

export default function CharityCard({ charity }: CharityCardProps) {
  return (
    <Card 
      maxW="sm" 
      shadow="xl" 
      _hover={{ shadow: "2xl" }} 
      transition="all 0.3s"
      overflow="hidden"
    >
      {/* Charity Logo */}
      <Box position="relative" h="150px" bg="gray.50">
        {charity.logoUrl ? (
          <Image
            src={charity.logoUrl}
            alt={charity.name}
            fill
            style={{ objectFit: 'contain', padding: '16px' }}
          />
        ) : (
          <Flex
            w="full"
            h="full"
            bgGradient="linear(to-br, blue.100, purple.100)"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              size="xl"
              name={charity.name}
              bg="blue.500"
              color="white"
            />
          </Flex>
        )}
        
        {/* Verified Badge */}
        {charity.isVerified && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            colorScheme="blue"
            variant="solid"
            borderRadius="md"
          >
            ✓ Verified
          </Badge>
        )}
      </Box>

      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          {/* Charity Name */}
          <Heading 
            as="h3" 
            size="md" 
            noOfLines={2}
            color="gray.800"
          >
            {charity.name}
          </Heading>

          {/* Description */}
          <Text 
            fontSize="sm" 
            color="gray.600" 
            noOfLines={4}
            minH="80px"
          >
            {charity.description}
          </Text>

          {/* Contact Info */}
          <VStack spacing={2} align="stretch">
            {charity.website && (
              <HStack spacing={2}>
                <Icon as={FaGlobe} color="blue.500" boxSize={4} />
                <Link 
                  href={charity.website}
                  isExternal
                  fontSize="sm"
                  color="blue.500"
                  _hover={{ textDecoration: 'underline' }}
                  noOfLines={1}
                >
                  Visit Website <ExternalLinkIcon mx="2px" />
                </Link>
              </HStack>
            )}
            
            {charity.email && (
              <HStack spacing={2}>
                <Icon as={FaEnvelope} color="gray.500" boxSize={4} />
                <Link 
                  href={`mailto:${charity.email}`}
                  fontSize="sm"
                  color="gray.600"
                  _hover={{ textDecoration: 'underline' }}
                  noOfLines={1}
                >
                  {charity.email}
                </Link>
              </HStack>
            )}
          </VStack>

          {/* Registration Number */}
          {charity.taxId && (
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Reg. No: {charity.taxId}
            </Text>
          )}

          {/* Action Buttons */}
          <VStack spacing={2}>
            <Button 
              colorScheme="blue"
              w="full"
              size="md"
            >
              View Competitions
            </Button>
            <Button 
              variant="outline"
              colorScheme="green"
              w="full"
              size="sm"
            >
              Donate Now
            </Button>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}