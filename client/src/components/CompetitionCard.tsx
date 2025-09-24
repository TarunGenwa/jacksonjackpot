import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Badge,
  Progress,
  VStack,
  HStack,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaTrophy, FaGift, FaBolt, FaCalendarDay, FaCircle } from 'react-icons/fa';
import { Competition } from '@/types/api';
import { useTheme } from '@/contexts/ThemeContext';

interface CompetitionWithCategory extends Competition {
  category?: string;
}

interface CompetitionCardProps {
  competition: CompetitionWithCategory;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const { getThemeColor } = useTheme();
  const [localCompetition, setLocalCompetition] = useState(competition);

  // Update local state when prop changes
  useEffect(() => {
    setLocalCompetition(competition);
  }, [competition]);
  const formatPrice = (price: string) => {
    return `£${parseFloat(price).toFixed(2)}`;
  };


  const getProgressPercentage = () => {
    if (localCompetition.maxTickets === 0) return 0;
    return Math.round((localCompetition.ticketsSold / localCompetition.maxTickets) * 100);
  };




  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': getThemeColor('success'),
      'UPCOMING': getThemeColor('info'),
      'SOLD_OUT': getThemeColor('error'),
      'COMPLETED': getThemeColor('gray500'),
    };
    return statusMap[status] || getThemeColor('gray500');
  };

  const getCategoryInfo = (category?: string) => {
    const categoryMap: Record<string, { icon: React.ComponentType; color: string }> = {
      'Mystery Box': { icon: FaGift, color: getThemeColor('primary') },
      'Instant Win': { icon: FaBolt, color: getThemeColor('warning') },
      'Daily Free': { icon: FaCalendarDay, color: getThemeColor('success') },
      'Instant Spin': { icon: FaCircle, color: getThemeColor('info') },
    };
    return categoryMap[category || ''] || { icon: FaTrophy, color: getThemeColor('gray500') };
  };

  const categoryInfo = getCategoryInfo(localCompetition.category);


  return (
    <Card
      w="full"
      shadow="xl"
      transition="all 0.3s"
      overflow="hidden"
      bg={getThemeColor('dark')}
      borderRadius="lg"
      border="1px"
      borderColor={getThemeColor('secondary')}
    >
      <CardBody p={0}>
        <VStack spacing={0} align="stretch">
          {/* Top - Image Section */}
          <Box position="relative" w="full" aspectRatio={16/9}>
            {localCompetition.imageUrl ? (
              <Image
                src={localCompetition.imageUrl}
                alt={localCompetition.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Box
                w="full"
                h="full"
                bg={getThemeColor('secondaryDark')}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaTrophy} color={getThemeColor('white')} boxSize={10} />
              </Box>
            )}

            {/* Status and Category Badges */}
            <HStack
              position="absolute"
              top={4}
              left={4}
              spacing={2}
            >
              {localCompetition.category && (
                <Badge
                  bg={categoryInfo.color}
                  color={getThemeColor('white')}
                  fontSize="sm"
                  borderRadius="md"
                  px={3}
                  py={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={categoryInfo.icon} boxSize={3} />
                  {localCompetition.category}
                </Badge>
              )}
              <Badge
                bg={getStatusColor(localCompetition.status)}
                color={getThemeColor('white')}
                fontSize="sm"
                borderRadius="md"
                px={3}
                py={1}
              >
                {localCompetition.status}
              </Badge>
            </HStack>

            {/* Price Badge */}
            <Badge
              position="absolute"
              top={4}
              right={4}
              bg={getThemeColor('success')}
              color={getThemeColor('gray900')}
              fontSize="md"
              px={3}
              py={1}
              borderRadius="md"
              fontWeight="bold"
            >
              {formatPrice(localCompetition.ticketPrice)}
            </Badge>
          </Box>

          {/* Bottom - Content */}
          <VStack p={3} spacing={2} align="stretch">
            {/* Title */}
            <Heading
              as="h3"
              size="sm"
              color={getThemeColor('white')}
              lineHeight="1.2"
              noOfLines={2}
            >
              {localCompetition.title}
            </Heading>

            {/* Progress Bar */}
            <Box>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="xs" fontWeight="semibold" color={getThemeColor('gray300')}>
                  Progress
                </Text>
                <Text fontSize="xs" fontWeight="bold" color={getThemeColor('primary')}>
                  {getProgressPercentage()}%
                </Text>
              </Flex>
              <Progress
                value={getProgressPercentage()}
                size="sm"
                borderRadius="full"
                bg={`rgba(0, 0, 0, 0.4)`}
                sx={{
                  '& > div': {
                    bg: getThemeColor('primary'),
                  },
                }}
              />
            </Box>

            {/* Prizes */}
            <HStack justify="space-between" py={1}>
              <HStack spacing={1}>
                <Icon as={FaTrophy} boxSize={3} color={getThemeColor('warning')} />
                <Text fontSize="xs" color={getThemeColor('gray500')}>Total Prizes Value</Text>
              </HStack>
              <Text fontWeight="bold" color={getThemeColor('success')} fontSize="sm">
                £{(localCompetition.prizes.reduce((sum, prize) => sum + (prize.value * prize.quantity), 0) / 100).toFixed(2)}
              </Text>
            </HStack>

            {/* Action Button */}
            <Button
              size="sm"
              bg={getThemeColor('success')}
              color={getThemeColor('gray900')}
              _hover={{
                bg: getThemeColor('success'),
                transform: "translateY(-1px)"
              }}
              variant="solid"
              w="full"
              fontSize="xs"
              h="32px"
              fontWeight="semibold"
            >
              Enter
            </Button>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}