import {
  Box,
  Container,
  VStack,
  SimpleGrid,
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
      <Container maxW="container.md" py={8}>
        <Flex justify="center" align="center" minH="90vh">
          <Card shadow="2xl" maxW="lg" w="full">
            <CardBody p={8}>
              <VStack spacing={6}>
                {/* Logo */}
                <Skeleton height="60px" width="60px" borderRadius="full" />

                {/* Title and Description */}
                <VStack spacing={2} textAlign="center">
                  <Skeleton height="32px" width="200px" />
                  <Skeleton height="20px" width="300px" />
                </VStack>

                {/* Signup Form */}
                <VStack spacing={4} w="full">
                  {/* Name Fields */}
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <VStack align="start" spacing={2}>
                      <Skeleton height="16px" width="80px" />
                      <Skeleton height="48px" width="100%" borderRadius="md" />
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Skeleton height="16px" width="80px" />
                      <Skeleton height="48px" width="100%" borderRadius="md" />
                    </VStack>
                  </SimpleGrid>

                  {/* Username Field */}
                  <VStack align="start" spacing={2} w="full">
                    <Skeleton height="16px" width="80px" />
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>

                  {/* Email Field */}
                  <VStack align="start" spacing={2} w="full">
                    <Skeleton height="16px" width="80px" />
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>

                  {/* Password Fields */}
                  <SimpleGrid columns={1} spacing={4} w="full">
                    <VStack align="start" spacing={2}>
                      <Skeleton height="16px" width="80px" />
                      <Skeleton height="48px" width="100%" borderRadius="md" />
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Skeleton height="16px" width="120px" />
                      <Skeleton height="48px" width="100%" borderRadius="md" />
                    </VStack>
                  </SimpleGrid>

                  {/* Password Requirements */}
                  <VStack align="start" spacing={2} w="full">
                    <Skeleton height="16px" width="150px" />
                    <VStack align="start" spacing={1} w="full">
                      {[1, 2, 3, 4].map((i) => (
                        <HStack key={i} spacing={2}>
                          <Skeleton height="16px" width="16px" />
                          <Skeleton height="14px" width="180px" />
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>

                  {/* Terms and Privacy Checkboxes */}
                  <VStack align="start" spacing={3} w="full">
                    <HStack align="start" spacing={3}>
                      <Skeleton height="20px" width="20px" borderRadius="md" mt={1} />
                      <SkeletonText noOfLines={2} spacing={1} fontSize="sm" />
                    </HStack>
                    <HStack align="start" spacing={3}>
                      <Skeleton height="20px" width="20px" borderRadius="md" mt={1} />
                      <Skeleton height="14px" width="200px" />
                    </HStack>
                  </VStack>

                  {/* Sign Up Button */}
                  <Skeleton height="48px" width="100%" borderRadius="md" />

                  {/* Divider with "OR" */}
                  <HStack w="full">
                    <Divider />
                    <Skeleton height="16px" width="20px" />
                    <Divider />
                  </HStack>

                  {/* Social Signup Buttons */}
                  <VStack spacing={3} w="full">
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>
                </VStack>

                {/* Login Link */}
                <HStack spacing={1} pt={4}>
                  <Skeleton height="16px" width="150px" />
                  <Skeleton height="16px" width="50px" />
                </HStack>

                {/* Security Notice */}
                <Card variant="outline" bg="blue.50" w="full">
                  <CardBody p={4}>
                    <HStack spacing={3}>
                      <Skeleton height="24px" width="24px" />
                      <VStack align="start" spacing={2} flex={1}>
                        <Skeleton height="16px" width="120px" />
                        <SkeletonText noOfLines={2} spacing={1} fontSize="sm" />
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </CardBody>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
}