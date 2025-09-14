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
            <Skeleton height="24px" width="300px" mx="auto" />
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {/* Left Column - Profile Info */}
            <VStack spacing={6}>
              {/* Profile Card */}
              <Card shadow="md" width="100%">
                <CardBody p={6}>
                  <VStack spacing={4} align="center">
                    <Skeleton height="80px" width="80px" borderRadius="full" />
                    <VStack spacing={2} align="center">
                      <Skeleton height="24px" width="150px" />
                      <Skeleton height="16px" width="200px" />
                      <Skeleton height="20px" width="80px" borderRadius="md" />
                    </VStack>
                    <Skeleton height="40px" width="100%" borderRadius="md" />
                  </VStack>
                </CardBody>
              </Card>

              {/* Account Stats */}
              <Card shadow="md" width="100%">
                <CardHeader>
                  <Skeleton height="24px" width="150px" />
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4}>
                    {[1, 2, 3, 4].map((i) => (
                      <HStack key={i} justify="space-between" width="100%">
                        <Skeleton height="20px" width="120px" />
                        <Skeleton height="24px" width="60px" />
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Right Column - Main Content */}
            <Box gridColumn={{ base: "1", lg: "2 / 4" }}>
              <VStack spacing={6}>
                {/* Personal Information */}
                <Card shadow="md" width="100%">
                  <CardHeader>
                    <HStack justify="space-between">
                      <Skeleton height="24px" width="180px" />
                      <Skeleton height="32px" width="60px" borderRadius="md" />
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <VStack key={i} align="start" spacing={2}>
                          <Skeleton height="16px" width="80px" />
                          <Skeleton height="40px" width="100%" borderRadius="md" />
                        </VStack>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Security Settings */}
                <Card shadow="md" width="100%">
                  <CardHeader>
                    <Skeleton height="24px" width="150px" />
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={4}>
                      {[1, 2, 3].map((i) => (
                        <HStack key={i} justify="space-between" width="100%">
                          <VStack align="start" spacing={1}>
                            <Skeleton height="20px" width="150px" />
                            <Skeleton height="16px" width="200px" />
                          </VStack>
                          <Skeleton height="32px" width="80px" borderRadius="md" />
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Preferences */}
                <Card shadow="md" width="100%">
                  <CardHeader>
                    <Skeleton height="24px" width="120px" />
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={4}>
                      {[1, 2, 3, 4].map((i) => (
                        <HStack key={i} justify="space-between" width="100%">
                          <VStack align="start" spacing={1}>
                            <Skeleton height="20px" width="180px" />
                            <Skeleton height="16px" width="250px" />
                          </VStack>
                          <Skeleton height="24px" width="44px" borderRadius="full" />
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Activity Timeline */}
                <Card shadow="md" width="100%">
                  <CardHeader>
                    <HStack justify="space-between">
                      <Skeleton height="24px" width="150px" />
                      <Skeleton height="32px" width="100px" borderRadius="md" />
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <HStack key={i} spacing={4}>
                          <Skeleton height="40px" width="40px" borderRadius="full" />
                          <VStack align="start" spacing={1} flex={1}>
                            <Skeleton height="20px" width="200px" />
                            <Skeleton height="16px" width="150px" />
                            <Skeleton height="14px" width="100px" />
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Danger Zone */}
                <Card shadow="md" width="100%" borderColor="red.200">
                  <CardHeader>
                    <Skeleton height="24px" width="100px" />
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                      <SkeletonText noOfLines={2} spacing={2} />
                      <Divider />
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Skeleton height="20px" width="150px" />
                          <Skeleton height="16px" width="250px" />
                        </VStack>
                        <Skeleton height="40px" width="120px" borderRadius="md" />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}