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
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, purple.50)">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Hero Section Skeleton */}
          <VStack spacing={6} textAlign="center" py={12}>
            <Skeleton height="60px" width="400px" mx="auto" />
            <Skeleton height="32px" width="500px" mx="auto" />
            <HStack spacing={4} justify="center">
              <Skeleton height="48px" width="150px" borderRadius="md" />
              <Skeleton height="48px" width="150px" borderRadius="md" />
            </HStack>
          </VStack>

          {/* Stats Section Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[1, 2, 3].map((i) => (
              <Card key={i} shadow="md">
                <CardBody p={6}>
                  <VStack spacing={2}>
                    <Skeleton height="40px" width="100px" />
                    <Skeleton height="24px" width="150px" />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Featured Competitions Section */}
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Skeleton height="32px" width="250px" />
              <Skeleton height="40px" width="100px" borderRadius="md" />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Card key={i} shadow="lg" overflow="hidden">
                  <Skeleton height="200px" />
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Skeleton height="24px" width="80px" />
                        <Skeleton height="24px" width="60px" />
                      </HStack>
                      <VStack align="start" spacing={2}>
                        <Skeleton height="28px" width="100%" />
                        <SkeletonText noOfLines={2} spacing={2} />
                      </VStack>
                      <Skeleton height="8px" width="100%" />
                      <Flex justify="space-between">
                        <Skeleton height="20px" width="100px" />
                        <Skeleton height="20px" width="80px" />
                      </Flex>
                      <Skeleton height="40px" width="100%" borderRadius="md" />
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* How It Works Section */}
          <Card shadow="md">
            <CardBody p={8}>
              <VStack spacing={6}>
                <Skeleton height="32px" width="200px" />
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                  {[1, 2, 3, 4].map((i) => (
                    <VStack key={i} spacing={3}>
                      <Skeleton height="64px" width="64px" borderRadius="full" />
                      <Skeleton height="24px" width="100px" />
                      <SkeletonText noOfLines={2} spacing={2} textAlign="center" />
                    </VStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Winners Section */}
          <VStack spacing={4} align="stretch">
            <Skeleton height="32px" width="200px" />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {[1, 2].map((i) => (
                <Card key={i} shadow="md">
                  <CardBody>
                    <HStack spacing={4}>
                      <Skeleton height="60px" width="60px" borderRadius="full" />
                      <VStack align="start" spacing={2} flex={1}>
                        <Skeleton height="20px" width="120px" />
                        <Skeleton height="16px" width="150px" />
                        <Skeleton height="24px" width="80px" />
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}