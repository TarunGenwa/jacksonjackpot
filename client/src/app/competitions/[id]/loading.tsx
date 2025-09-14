import {
  Box,
  Container,
  VStack,
  HStack,
  Skeleton,
  SkeletonText,
  Card,
  CardBody,
  SimpleGrid,
  Flex,
  Divider,
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb Skeleton */}
          <HStack spacing={2}>
            <Skeleton height="20px" width="60px" />
            <Skeleton height="20px" width="20px" />
            <Skeleton height="20px" width="120px" />
          </HStack>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Left Column - Image */}
            <VStack spacing={4}>
              <Skeleton height="400px" width="100%" borderRadius="lg" />
              <HStack spacing={4} width="100%">
                <Skeleton height="80px" width="80px" borderRadius="md" />
                <Skeleton height="80px" width="80px" borderRadius="md" />
                <Skeleton height="80px" width="80px" borderRadius="md" />
                <Skeleton height="80px" width="80px" borderRadius="md" />
              </HStack>
            </VStack>

            {/* Right Column - Details */}
            <VStack spacing={6} align="stretch">
              {/* Status and Title */}
              <VStack align="start" spacing={3}>
                <HStack spacing={2}>
                  <Skeleton height="24px" width="80px" borderRadius="md" />
                  <Skeleton height="24px" width="100px" borderRadius="md" />
                </HStack>
                <Skeleton height="40px" width="100%" />
                <SkeletonText noOfLines={3} spacing={2} />
              </VStack>

              {/* Charity Info */}
              <HStack spacing={3}>
                <Skeleton height="40px" width="40px" borderRadius="full" />
                <VStack align="start" spacing={1} flex={1}>
                  <Skeleton height="16px" width="80px" />
                  <Skeleton height="20px" width="150px" />
                </VStack>
              </HStack>

              <Divider />

              {/* Progress Bar */}
              <VStack align="stretch" spacing={2}>
                <Flex justify="space-between">
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="20px" width="80px" />
                </Flex>
                <Skeleton height="12px" width="100%" borderRadius="full" />
                <Flex justify="space-between">
                  <Skeleton height="16px" width="120px" />
                  <Skeleton height="16px" width="100px" />
                </Flex>
              </VStack>

              {/* Key Details Grid */}
              <SimpleGrid columns={2} spacing={4}>
                {[1, 2, 3, 4].map((i) => (
                  <VStack key={i} align="start" spacing={1}>
                    <Skeleton height="16px" width="80px" />
                    <Skeleton height="24px" width="120px" />
                  </VStack>
                ))}
              </SimpleGrid>

              <Divider />

              {/* Purchase Section */}
              <Card bg="blue.50">
                <CardBody>
                  <VStack spacing={4}>
                    <Skeleton height="24px" width="200px" />
                    <HStack spacing={4} width="100%">
                      <Skeleton height="40px" flex={1} borderRadius="md" />
                      <Skeleton height="40px" width="120px" borderRadius="md" />
                    </HStack>
                    <Skeleton height="16px" width="250px" />
                  </VStack>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <HStack spacing={4}>
                <Skeleton height="48px" flex={1} borderRadius="md" />
                <Skeleton height="48px" width="48px" borderRadius="md" />
              </HStack>
            </VStack>
          </SimpleGrid>

          {/* Tabs Section */}
          <Card shadow="md">
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Tab Headers */}
                <HStack spacing={6} borderBottom="1px" borderColor="gray.200" pb={2}>
                  <Skeleton height="20px" width="80px" />
                  <Skeleton height="20px" width="60px" />
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="20px" width="120px" />
                </HStack>

                {/* Tab Content */}
                <VStack spacing={3} align="stretch" pt={4}>
                  <Skeleton height="28px" width="150px" />
                  <SkeletonText noOfLines={5} spacing={3} />

                  <Skeleton height="24px" width="120px" mt={4} />
                  <VStack spacing={2} align="stretch">
                    {[1, 2, 3].map((i) => (
                      <HStack key={i} spacing={3}>
                        <Skeleton height="40px" width="40px" borderRadius="full" />
                        <VStack align="start" spacing={1} flex={1}>
                          <Skeleton height="20px" width="150px" />
                          <Skeleton height="16px" width="200px" />
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}