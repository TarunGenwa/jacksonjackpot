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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header Skeleton */}
          <VStack spacing={4} textAlign="center">
            <Skeleton height="64px" width="64px" borderRadius="full" mx="auto" />
            <Skeleton height="40px" width="250px" mx="auto" />
            <Skeleton height="24px" width="350px" mx="auto" />
          </VStack>

          {/* Statistics Cards Skeleton */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} shadow="md">
                <CardBody p={6}>
                  <VStack spacing={2}>
                    <Skeleton height="36px" width="60px" />
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
                <Skeleton height="48px" width="100%" borderRadius="md" />
                <HStack spacing={4} width="100%" flexWrap="wrap">
                  <VStack align="start" spacing={2} flex={1}>
                    <Skeleton height="20px" width="120px" />
                    <HStack spacing={2}>
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height="32px" width="80px" borderRadius="md" />
                      ))}
                    </HStack>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Skeleton height="20px" width="60px" />
                    <Skeleton height="32px" width="150px" borderRadius="md" />
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Results Summary Skeleton */}
          <HStack justify="space-between">
            <Skeleton height="20px" width="200px" />
            <Skeleton height="24px" width="100px" borderRadius="md" />
          </HStack>

          {/* Table Skeleton */}
          <Card shadow="md">
            <CardBody p={0}>
              <TableContainer>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Ticket Number</Th>
                      <Th>Competition</Th>
                      <Th>Charity</Th>
                      <Th>Status</Th>
                      <Th>Purchase Date</Th>
                      <Th>Draw Date</Th>
                      <Th isNumeric>Price</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Tr key={i}>
                        <Td>
                          <Skeleton height="20px" width="100px" />
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Skeleton height="20px" width="150px" />
                            <Skeleton height="16px" width="200px" />
                          </VStack>
                        </Td>
                        <Td>
                          <Skeleton height="20px" width="120px" />
                        </Td>
                        <Td>
                          <Skeleton height="24px" width="70px" borderRadius="md" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" width="90px" />
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Skeleton height="20px" width="90px" />
                            <Skeleton height="16px" width="50px" />
                          </VStack>
                        </Td>
                        <Td isNumeric>
                          <Skeleton height="20px" width="60px" />
                        </Td>
                        <Td>
                          <Skeleton height="32px" width="60px" borderRadius="md" />
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