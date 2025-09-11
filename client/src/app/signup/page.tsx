'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  Divider,
  Card,
  CardBody,
  SimpleGrid,
  FormHelperText,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
      };

      await signup(signupData);
      router.push('/'); // Redirect to home page after successful signup
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="lg">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Heading size="xl" color="gray.800">
              Create Your Account
            </Heading>
            <Text color="gray.600">
              Join Jackson Jackpot and start winning amazing prizes
            </Text>
          </VStack>

          {/* Signup Form */}
          <Card w="full" shadow="xl">
            <CardBody p={8}>
              <VStack spacing={6}>
                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First name"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last name"
                          size="lg"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Username</FormLabel>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        size="lg"
                      />
                      <FormHelperText>
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                      </FormHelperText>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        size="lg"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={isLoading}
                      loadingText="Creating Account..."
                    >
                      Create Account
                    </Button>
                  </VStack>
                </form>

                <Divider />
                
                <VStack spacing={4} w="full">
                  <Text fontSize="sm" color="gray.600">
                    Already have an account?
                  </Text>
                  <Link href="/login" style={{ width: '100%' }}>
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                    >
                      Sign In Instead
                    </Button>
                  </Link>
                </VStack>

                <Divider />

                <Flex justify="center">
                  <Link href="/">
                    <Button variant="ghost" color="gray.600">
                      ← Back to Home
                    </Button>
                  </Link>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}