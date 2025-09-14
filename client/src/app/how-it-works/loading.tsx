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
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Header Section */}
          <VStack spacing={6} textAlign="center" py={8}>
            <Skeleton height="64px" width="64px" borderRadius="full" mx="auto" />
            <Skeleton height="48px" width="400px" mx="auto" />
            <Skeleton height="24px" width="500px" mx="auto" />
          </VStack>

          {/* How It Works Steps */}
          <Card shadow="lg">
            <CardBody p={8}>
              <VStack spacing={8}>
                <Skeleton height="32px" width="250px" />

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
                  {[1, 2, 3, 4].map((i) => (
                    <VStack key={i} spacing={4} align="center" textAlign="center">
                      <Skeleton height="80px" width="80px" borderRadius="full" />
                      <Skeleton height="24px" width="120px" />
                      <SkeletonText noOfLines={3} spacing={2} />
                    </VStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Features Section */}
          <VStack spacing={8}>
            <Skeleton height="32px" width="200px" />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} shadow="md">
                  <CardBody p={6}>
                    <VStack spacing={3} align="center" textAlign="center">
                      <Skeleton height="48px" width="48px" borderRadius="full" />
                      <Skeleton height="24px" width="150px" />
                      <SkeletonText noOfLines={2} spacing={2} />
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* FAQ Section */}
          <Card shadow="lg">
            <CardBody p={8}>
              <VStack spacing={6}>
                <Skeleton height="32px" width="300px" />

                <VStack spacing={4} width="100%">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} variant="outline" width="100%">
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <Skeleton height="20px" width="300px" />
                            <Skeleton height="20px" width="20px" />
                          </HStack>
                          <SkeletonText noOfLines={2} spacing={2} />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Safety & Security Section */}
          <Card shadow="lg" bg="blue.50">
            <CardBody p={8}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <VStack spacing={4} align="start">
                  <Skeleton height="32px" width="250px" />
                  <SkeletonText noOfLines={4} spacing={3} />

                  <VStack spacing={3} align="start" width="100%">
                    {[1, 2, 3].map((i) => (
                      <HStack key={i} spacing={3}>
                        <Skeleton height="24px" width="24px" borderRadius="full" />
                        <Skeleton height="20px" width="200px" />
                      </HStack>
                    ))}
                  </VStack>
                </VStack>

                <VStack spacing={4}>
                  <Skeleton height="200px" width="100%" borderRadius="lg" />
                  <HStack spacing={4}>
                    <Skeleton height="60px" width="60px" borderRadius="lg" />
                    <Skeleton height="60px" width="60px" borderRadius="lg" />
                    <Skeleton height="60px" width="60px" borderRadius="lg" />
                  </HStack>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Call to Action */}
          <Card shadow="lg" bg="purple.50">
            <CardBody p={8}>
              <VStack spacing={6} textAlign="center">
                <Skeleton height="32px" width="350px" />
                <Skeleton height="20px" width="400px" />
                <HStack spacing={4}>
                  <Skeleton height="48px" width="150px" borderRadius="md" />
                  <Skeleton height="48px" width="150px" borderRadius="md" />
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}