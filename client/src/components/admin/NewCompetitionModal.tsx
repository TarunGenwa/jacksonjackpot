'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Save,
  Check,
  Trophy
} from 'lucide-react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  Button,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Grid,
  GridItem,
  Box,
  Text,
  Icon
} from '@chakra-ui/react';
import { adminApi } from '@/services/adminApi';
import { CompetitionCreateData } from '@/types/admin';

interface Charity {
  id: string;
  name: string;
  isVerified: boolean;
  isActive: boolean;
  logoUrl?: string;
}

interface NewCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewCompetitionModal({
  isOpen,
  onClose,
  onSuccess,
}: NewCompetitionModalProps) {
  const [formData, setFormData] = useState<CompetitionCreateData>({
    title: '',
    description: '',
    imageUrl: '',
    ticketPrice: 500, // £5.00 in pence
    maxTickets: 1000,
    startDate: '',
    endDate: '',
    drawDate: '',
    charityId: '',
    status: 'DRAFT',
  });

  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(false);
  const [charityLoading, setCharityLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdCompetitionId, setCreatedCompetitionId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch charities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCharities();
      // Reset form when modal opens
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        ticketPrice: 500,
        maxTickets: 1000,
        startDate: '',
        endDate: '',
        drawDate: '',
        charityId: '',
        status: 'DRAFT',
      });
      setErrors({});
      setCreatedCompetitionId(null);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const fetchCharities = async () => {
    try {
      setCharityLoading(true);
      const response = await adminApi.getCharities({
        limit: 100,
        isVerified: 'true',
        isActive: 'true',
      }) as { charities: Charity[] };
      setCharities(response.charities);
    } catch (err) {
      console.error('Failed to fetch charities:', err);
    } finally {
      setCharityLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.charityId) {
      newErrors.charityId = 'Please select a charity';
    }

    if (formData.ticketPrice <= 0) {
      newErrors.ticketPrice = 'Ticket price must be greater than 0';
    }

    if (formData.maxTickets <= 0) {
      newErrors.maxTickets = 'Max tickets must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.drawDate) {
      newErrors.drawDate = 'Draw date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Convert date strings to ISO format
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate + 'T00:00:00Z').toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59Z').toISOString(),
        drawDate: new Date(formData.drawDate + 'T12:00:00Z').toISOString(),
      };

      const result = await adminApi.createCompetition(formattedData);
      setCreatedCompetitionId(result.id);
      setShowSuccess(true);
      onSuccess();
    } catch (err) {
      console.error('Failed to create competition:', err);
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create competition' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {showSuccess ? 'Competition Created!' : 'Create New Competition'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>

          {/* Success Content */}
          {showSuccess && createdCompetitionId ? (
            <VStack spacing={6} textAlign="center" py={8}>
              <Box
                w={16}
                h={16}
                bg="green.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={Check} w={8} h={8} color="green.600" />
              </Box>
              <Text fontSize="xl" fontWeight="semibold" color="gray.900">
                Competition Created Successfully!
              </Text>
              <Text color="gray.600">
                Your competition &quot;{formData.title}&quot; has been created and is ready for configuration.
              </Text>
              <HStack spacing={3} w="full">
                <Button
                  variant="outline"
                  onClick={onClose}
                  flex={1}
                >
                  Close
                </Button>
                <Button
                  as="a"
                  href={`/admin/competitions/${createdCompetitionId}`}
                  onClick={onClose}
                  colorScheme="blue"
                  leftIcon={<Icon as={Trophy} />}
                  flex={1}
                >
                  Add Prizes
                </Button>
              </HStack>
            </VStack>
          ) : (
            /* Form Content */
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.title}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                {errors.description && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.description}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <Box mt={2}>
                    <Image
                      src={formData.imageUrl}
                      alt="Competition preview"
                      width={400}
                      height={128}
                      style={{ width: '100%', height: '8rem', objectFit: 'cover', borderRadius: '0.5rem' }}
                    />
                  </Box>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.charityId}>
                <FormLabel>Charity</FormLabel>
                {charityLoading ? (
                  <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                    <Box
                      className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"
                    />
                  </Box>
                ) : (
                  <Select
                    value={formData.charityId}
                    onChange={(e) => setFormData({ ...formData, charityId: e.target.value })}
                    placeholder="Select a charity..."
                  >
                    {charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.name} {charity.isVerified ? '✓' : ''}
                      </option>
                    ))}
                  </Select>
                )}
                {errors.charityId && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.charityId}</Text>
                )}
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ACTIVE">Active</option>
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isInvalid={!!errors.ticketPrice}>
                    <FormLabel>Ticket Price (£)</FormLabel>
                    <NumberInput
                      value={formData.ticketPrice / 100}
                      onChange={(valueString) => setFormData({ ...formData, ticketPrice: parseFloat(valueString) * 100 })}
                      step={0.01}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                    {errors.ticketPrice && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.ticketPrice}</Text>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>

              <FormControl isInvalid={!!errors.maxTickets}>
                <FormLabel>Max Tickets</FormLabel>
                <NumberInput
                  value={formData.maxTickets}
                  onChange={(valueString) => setFormData({ ...formData, maxTickets: parseInt(valueString) })}
                >
                  <NumberInputField />
                </NumberInput>
                {errors.maxTickets && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.maxTickets}</Text>
                )}
              </FormControl>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem>
                  <FormControl isInvalid={!!errors.startDate}>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    {errors.startDate && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.startDate}</Text>
                    )}
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isInvalid={!!errors.endDate}>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    {errors.endDate && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.endDate}</Text>
                    )}
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isInvalid={!!errors.drawDate}>
                    <FormLabel>Draw Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.drawDate}
                      onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                    />
                    {errors.drawDate && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.drawDate}</Text>
                    )}
                  </FormControl>
                </GridItem>
              </Grid>

              {/* Error Message */}
              {errors.submit && (
                <Alert status="error">
                  <AlertIcon />
                  {errors.submit}
                </Alert>
              )}

              {/* Actions */}
              <Box borderTop="1px" borderColor="gray.200" pt={6} mt={6}>
                <HStack spacing={3}>
                  <Button
                    onClick={handleSubmit}
                    isLoading={loading}
                    loadingText="Creating..."
                    colorScheme="blue"
                    leftIcon={<Icon as={Save} />}
                    flex={1}
                  >
                    Create Competition
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    flex={1}
                  >
                    Cancel
                  </Button>
                </HStack>
              </Box>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}