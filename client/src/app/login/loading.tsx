import {
  Box,
  Container,
  VStack,
  Skeleton,
  SkeletonText,
  Card,
  CardBody,
  HStack,
  Flex,
  Divider,
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, purple.50)">
      <Container maxW="container.sm" py={12}>
        <Flex justify="center" align="center" minH="80vh">
          <Card shadow="2xl" maxW="md" w="full">
            <CardBody p={8}>
              <VStack spacing={6}>
                {/* Logo */}
                <Skeleton height="60px" width="60px" borderRadius="full" />

                {/* Title and Description */}
                <VStack spacing={2} textAlign="center">
                  <Skeleton height="32px" width="150px" />
                  <Skeleton height="20px" width="250px" />
                </VStack>

                {/* Login Form */}
                <VStack spacing={4} w="full">
                  {/* Email Field */}
                  <VStack align="start" spacing={2} w="full">
                    <Skeleton height="16px" width="80px" />
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>

                  {/* Password Field */}
                  <VStack align="start" spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Skeleton height="16px" width="80px" />
                      <Skeleton height="16px" width="120px" />
                    </HStack>
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>

                  {/* Remember Me */}
                  <HStack justify="flex-start" w="full">
                    <Skeleton height="20px" width="20px" borderRadius="md" />
                    <Skeleton height="16px" width="100px" />
                  </HStack>

                  {/* Login Button */}
                  <Skeleton height="48px" width="100%" borderRadius="md" />

                  {/* Divider with "OR" */}
                  <HStack w="full">
                    <Divider />
                    <Skeleton height="16px" width="20px" />
                    <Divider />
                  </HStack>

                  {/* Social Login Buttons */}
                  <VStack spacing={3} w="full">
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>
                </VStack>

                {/* Sign Up Link */}
                <HStack spacing={1} pt={4}>
                  <Skeleton height="16px" width="120px" />
                  <Skeleton height="16px" width="60px" />
                </HStack>

                {/* Terms and Privacy */}
                <VStack spacing={2} textAlign="center">
                  <SkeletonText noOfLines={2} spacing={1} fontSize="sm" />
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
}