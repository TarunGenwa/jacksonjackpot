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
  Flex
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/'); // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Heading size="xl" color="gray.800">
              Welcome Back
            </Heading>
            <Text color="gray.600">
              Sign in to your Jackson Jackpot account
            </Text>
          </VStack>

          {/* Login Form */}
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
                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={isLoading}
                      loadingText="Signing In..."
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>

                <Divider />
                
                <VStack spacing={4} w="full">
                  <Text fontSize="sm" color="gray.600">
                    Don't have an account?
                  </Text>
                  <Link href="/signup" style={{ width: '100%' }}>
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                    >
                      Create New Account
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