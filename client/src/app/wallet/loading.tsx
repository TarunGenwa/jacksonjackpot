import {
  Box,
  Container,
  VStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Flex,
  Divider,
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Skeleton height="64px" width="64px" borderRadius="full" mx="auto" />
            <Skeleton height="40px" width="200px" mx="auto" />
            <Skeleton height="24px" width="350px" mx="auto" />
          </VStack>

          {/* Wallet Balance Card */}
          <Card shadow="xl" bg="blue.50">
            <CardBody p={8}>
              <VStack spacing={6} textAlign="center">
                <Skeleton height="24px" width="150px" />
                <Skeleton height="60px" width="200px" />
                <HStack spacing={4}>
                  <Skeleton height="48px" width="120px" borderRadius="md" />
                  <Skeleton height="48px" width="120px" borderRadius="md" />
                </HStack>
                <Skeleton height="16px" width="300px" />
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[1, 2, 3].map((i) => (
              <Card key={i} shadow="md" _hover={{ shadow: "lg" }}>
                <CardBody p={6}>
                  <VStack spacing={4} textAlign="center">
                    <Skeleton height="48px" width="48px" borderRadius="full" />
                    <Skeleton height="24px" width="120px" />
                    <SkeletonText noOfLines={2} spacing={2} />
                    <Skeleton height="40px" width="100%" borderRadius="md" />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Left Column - Add Funds */}
            <VStack spacing={6}>
              <Card shadow="md" width="100%">
                <CardHeader>
                  <HStack spacing={2}>
                    <Skeleton height="24px" width="24px" />
                    <Skeleton height="24px" width="120px" />
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4}>
                    <VStack align="start" spacing={2} width="100%">
                      <Skeleton height="16px" width="60px" />
                      <Skeleton height="40px" width="100%" borderRadius="md" />
                    </VStack>

                    <VStack align="start" spacing={2} width="100%">
                      <Skeleton height="16px" width="120px" />
                      <SimpleGrid columns={2} spacing={3} width="100%">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} height="40px" borderRadius="md" />
                        ))}
                      </SimpleGrid>
                    </VStack>

                    <VStack align="start" spacing={2} width="100%">
                      <Skeleton height="16px" width="100px" />
                      <Skeleton height="40px" width="100%" borderRadius="md" />
                    </VStack>

                    <Divider />

                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>
                </CardBody>
              </Card>

              {/* Withdrawal Card */}
              <Card shadow="md" width="100%">
                <CardHeader>
                  <HStack spacing={2}>
                    <Skeleton height="24px" width="24px" />
                    <Skeleton height="24px" width="100px" />
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4}>
                    <VStack align="start" spacing={2} width="100%">
                      <Skeleton height="16px" width="60px" />
                      <Skeleton height="40px" width="100%" borderRadius="md" />
                    </VStack>

                    <VStack align="start" spacing={2} width="100%">
                      <Skeleton height="16px" width="120px" />
                      <Skeleton height="40px" width="100%" borderRadius="md" />
                    </VStack>

                    <Skeleton height="48px" width="100%" borderRadius="md" />
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Right Column - Transaction History */}
            <Card shadow="md">
              <CardHeader>
                <HStack justify="space-between">
                  <Skeleton height="24px" width="150px" />
                  <Skeleton height="32px" width="80px" borderRadius="md" />
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <HStack key={i} spacing={3} p={3} borderRadius="md" bg="gray.50">
                      <Skeleton height="40px" width="40px" borderRadius="full" />
                      <VStack align="start" spacing={1} flex={1}>
                        <Skeleton height="20px" width="150px" />
                        <Skeleton height="16px" width="100px" />
                        <Skeleton height="14px" width="80px" />
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Skeleton height="20px" width="60px" />
                        <Skeleton height="16px" width="50px" />
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Payment Methods */}
          <Card shadow="md">
            <CardHeader>
              <HStack justify="space-between">
                <Skeleton height="24px" width="180px" />
                <Skeleton height="32px" width="120px" borderRadius="md" />
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {[1, 2].map((i) => (
                  <Card key={i} variant="outline">
                    <CardBody>
                      <HStack spacing={4}>
                        <Skeleton height="40px" width="60px" borderRadius="md" />
                        <VStack align="start" spacing={1} flex={1}>
                          <Skeleton height="20px" width="120px" />
                          <Skeleton height="16px" width="100px" />
                        </VStack>
                        <VStack spacing={2}>
                          <Skeleton height="20px" width="20px" />
                          <Skeleton height="32px" width="60px" borderRadius="md" />
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Security Notice */}
          <Card shadow="md" bg="green.50" borderLeft="4px" borderColor="green.400">
            <CardBody>
              <HStack spacing={4}>
                <Skeleton height="24px" width="24px" />
                <VStack align="start" spacing={2} flex={1}>
                  <Skeleton height="20px" width="200px" />
                  <SkeletonText noOfLines={2} spacing={2} />
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}