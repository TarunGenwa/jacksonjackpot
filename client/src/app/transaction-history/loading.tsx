import {
  Box,
  Container,
  VStack,
  HStack,
  Skeleton,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
            <Skeleton height="40px" width="350px" mx="auto" />
            <Skeleton height="24px" width="400px" mx="auto" />
          </VStack>

          {/* Filters Card Skeleton */}
          <Card shadow="md">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <HStack spacing={2}>
                  <Skeleton height="24px" width="24px" />
                  <Skeleton height="28px" width="180px" />
                </HStack>
                <Skeleton height="32px" width="80px" borderRadius="md" />
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                {/* Search Bar Skeleton */}
                <Skeleton height="40px" width="100%" borderRadius="md" />

                {/* Filter Controls Skeleton */}
                <Flex direction={{ base: 'column', md: 'row' }} gap={4} w="full">
                  <Skeleton height="40px" flex={1} borderRadius="md" />
                  <Skeleton height="40px" flex={1} borderRadius="md" />
                  <Skeleton height="40px" flex={1} borderRadius="md" />
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Summary Skeleton */}
          <Flex justify="space-between" align="center">
            <Skeleton height="20px" width="250px" />
            <Skeleton height="24px" width="120px" borderRadius="md" />
          </Flex>

          {/* Transactions Table Skeleton */}
          <Card shadow="lg">
            <CardBody p={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Description</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Date</Th>
                      <Th>Reference</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Tr key={i}>
                        <Td>
                          <HStack spacing={2}>
                            <Skeleton height="20px" width="20px" />
                            <Skeleton height="24px" width="100px" borderRadius="md" />
                          </HStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Skeleton height="20px" width="200px" />
                            <Skeleton height="16px" width="150px" />
                            <Skeleton height="16px" width="100px" />
                          </VStack>
                        </Td>
                        <Td>
                          <Skeleton height="20px" width="80px" />
                        </Td>
                        <Td>
                          <Skeleton height="24px" width="80px" borderRadius="md" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" width="140px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" width="100px" />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}