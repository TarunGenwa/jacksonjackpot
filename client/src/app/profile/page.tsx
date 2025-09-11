'use client';

import { useState } from 'react';
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
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  Divider,
  Avatar,
  Flex,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || '',
    });
    setIsEditing(false);
  };

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

  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.md" py={12}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Please log in to view your profile.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.md" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Avatar
              size="2xl"
              name={getUserDisplayName()}
              bg="blue.500"
              color="white"
            >
              {getUserInitials()}
            </Avatar>
            <VStack spacing={2}>
              <Heading as="h1" size="xl" color="gray.800">
                {getUserDisplayName()}
              </Heading>
              <Badge colorScheme="blue" variant="solid" fontSize="sm" px={3} py={1}>
                {user.role}
              </Badge>
            </VStack>
          </VStack>

          {/* Profile Information */}
          <Card shadow="lg">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading as="h2" size="md" color="gray.800">
                  Profile Information
                </Heading>
                {!isEditing ? (
                  <IconButton
                    aria-label="Edit profile"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  />
                ) : (
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Save changes"
                      icon={<CheckIcon />}
                      size="sm"
                      colorScheme="green"
                      variant="ghost"
                      onClick={handleSave}
                      isLoading={isLoading}
                    />
                    <IconButton
                      aria-label="Cancel changes"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={handleCancel}
                    />
                  </HStack>
                )}
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    {isEditing ? (
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                      />
                    ) : (
                      <Text
                        p={2}
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        bg="gray.50"
                      >
                        {user.firstName || 'Not provided'}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    {isEditing ? (
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                      />
                    ) : (
                      <Text
                        p={2}
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        bg="gray.50"
                      >
                        {user.lastName || 'Not provided'}
                      </Text>
                    )}
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                    />
                  ) : (
                    <Text
                      p={2}
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      bg="gray.50"
                    >
                      {user.email}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Username</FormLabel>
                  {isEditing ? (
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                    />
                  ) : (
                    <Text
                      p={2}
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      bg="gray.50"
                    >
                      {user.username}
                    </Text>
                  )}
                </FormControl>

                {isEditing && (
                  <>
                    <Divider />
                    <HStack spacing={4} w="full" justify="center">
                      <Button
                        colorScheme="green"
                        onClick={handleSave}
                        isLoading={isLoading}
                        loadingText="Saving..."
                      >
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </HStack>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Account Statistics */}
          <Card shadow="lg">
            <CardHeader>
              <Heading as="h2" size="md" color="gray.800">
                Account Statistics
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    12
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Tickets Purchased
                  </Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    3
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Competitions Entered
                  </Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    £45.50
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Total Spent
                  </Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    £22.75
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Donated to Charity
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Account Security */}
          <Card shadow="lg">
            <CardHeader>
              <Heading as="h2" size="md" color="gray.800">
                Account Security
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">Password</Text>
                    <Text fontSize="sm" color="gray.600">
                      Last changed 30 days ago
                    </Text>
                  </VStack>
                  <Button size="sm" variant="outline" colorScheme="blue">
                    Change Password
                  </Button>
                </Flex>
                
                <Divider />
                
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">Two-Factor Authentication</Text>
                    <Text fontSize="sm" color="gray.600">
                      Add an extra layer of security
                    </Text>
                  </VStack>
                  <Button size="sm" variant="outline" colorScheme="green">
                    Enable 2FA
                  </Button>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}