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
            <Skeleton height="24px" width="450px" mx="auto" />
          </VStack>

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[1, 2, 3].map((i) => (
              <Card key={i} shadow="md">
                <CardBody p={6}>
                  <VStack spacing={2}>
                    <Skeleton height="36px" width="80px" />
                    <Skeleton height="20px" width="120px" />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Search and Filter */}
          <Card shadow="md">
            <CardBody>
              <VStack spacing={4}>
                <Skeleton height="40px" width="100%" borderRadius="md" />
                <HStack spacing={4} width="100%">
                  <Skeleton height="40px" width="150px" borderRadius="md" />
                  <Skeleton height="40px" width="150px" borderRadius="md" />
                  <Skeleton height="40px" width="150px" borderRadius="md" />
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Charities Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} shadow="lg" overflow="hidden" _hover={{ shadow: "xl" }}>
                {/* Charity Logo/Image */}
                <Skeleton height="200px" />

                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    {/* Verification Badge and Category */}
                    <HStack justify="space-between">
                      <Skeleton height="24px" width="80px" borderRadius="md" />
                      <Skeleton height="20px" width="100px" />
                    </HStack>

                    {/* Charity Name and Description */}
                    <VStack align="start" spacing={2}>
                      <Skeleton height="28px" width="100%" />
                      <SkeletonText noOfLines={3} spacing={2} />
                    </VStack>

                    {/* Impact Stats */}
                    <HStack spacing={4}>
                      <VStack flex={1}>
                        <Skeleton height="24px" width="60px" />
                        <Skeleton height="16px" width="100px" />
                      </VStack>
                      <VStack flex={1}>
                        <Skeleton height="24px" width="60px" />
                        <Skeleton height="16px" width="100px" />
                      </VStack>
                    </HStack>

                    {/* Action Buttons */}
                    <HStack spacing={3}>
                      <Skeleton height="40px" flex={1} borderRadius="md" />
                      <Skeleton height="40px" flex={1} borderRadius="md" />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Pagination */}
          <Flex justify="center" pt={4}>
            <HStack spacing={2}>
              <Skeleton height="32px" width="32px" borderRadius="md" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height="32px" width="32px" borderRadius="md" />
              ))}
              <Skeleton height="32px" width="32px" borderRadius="md" />
            </HStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}