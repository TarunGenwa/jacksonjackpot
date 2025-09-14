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
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header Skeleton */}
          <VStack spacing={4} textAlign="center">
            <Skeleton height="64px" width="64px" borderRadius="full" mx="auto" />
            <Skeleton height="40px" width="300px" mx="auto" />
            <Skeleton height="24px" width="400px" mx="auto" />
          </VStack>

          {/* Stats Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} shadow="md">
                <CardBody p={6}>
                  <VStack spacing={2}>
                    <Skeleton height="36px" width="80px" />
                    <Skeleton height="20px" width="100px" />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Filters Skeleton */}
          <Card shadow="md">
            <CardBody>
              <VStack spacing={4}>
                <Skeleton height="40px" width="100%" />
                <HStack spacing={4} width="100%">
                  <Skeleton height="40px" width="200px" />
                  <Skeleton height="40px" width="200px" />
                  <Skeleton height="40px" width="200px" />
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Competition Cards Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
                      <Skeleton height="20px" width="150px" />
                    </VStack>
                    <Skeleton height="8px" width="100%" />
                    <Flex justify="space-between">
                      <Skeleton height="20px" width="100px" />
                      <Skeleton height="20px" width="80px" />
                    </Flex>
                    <HStack spacing={3}>
                      <Skeleton height="40px" flex={1} />
                      <Skeleton height="40px" width="40px" />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}