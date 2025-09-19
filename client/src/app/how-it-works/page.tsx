'use client';

import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  Badge,
  Divider,
  Flex,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { CheckCircleIcon, StarIcon } from '@chakra-ui/icons';
import { 
  FaTicketAlt, 
  FaGift, 
  FaHeart, 
  FaUsers, 
  FaTrophy,
  FaShieldAlt,
  FaChartLine,
  FaCreditCard
} from 'react-icons/fa';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: FaTicketAlt,
      title: "Purchase Tickets",
      description: "Browse competitions and buy tickets for your favourite causes. Each ticket gives you a chance to win amazing prizes.",
      color: "blue"
    },
    {
      icon: FaGift,
      title: "Win Incredible Prizes",
      description: "From luxury holidays to the latest tech, cars, and cash prizes - there's something for everyone.",
      color: "purple"
    },
    {
      icon: FaHeart,
      title: "Support Charities",
      description: "A portion of every ticket sale goes directly to registered charities, making a real difference.",
      color: "red"
    },
    {
      icon: FaTrophy,
      title: "Get Notified",
      description: "Winners are automatically notified and prizes are delivered directly to your door.",
      color: "green"
    }
  ];

  const features = [
    {
      icon: FaShieldAlt,
      title: "100% Secure",
      description: "All transactions are protected with bank-level security and SSL encryption."
    },
    {
      icon: FaUsers,
      title: "Verified Charities",
      description: "We work only with registered charities that have been thoroughly vetted."
    },
    {
      icon: FaChartLine,
      title: "Transparent Impact",
      description: "See exactly how much money is raised for each charity and cause."
    },
    {
      icon: FaCreditCard,
      title: "Easy Payments",
      description: "Multiple payment options including cards, digital wallets, and bank transfers."
    }
  ];

  const faqs = [
    {
      question: "How are winners selected?",
      answer: "Winners are selected using a certified random number generator, ensuring complete fairness. The draw process is independently audited."
    },
    {
      question: "When do I receive my prize?",
      answer: "Winners are notified within 24 hours of the draw. Physical prizes are typically delivered within 7-14 business days, while cash prizes are transferred within 3-5 business days."
    },
    {
      question: "How much goes to charity?",
      answer: "A minimum of 50% of ticket sales goes directly to the charity. The exact percentage is displayed on each competition page."
    },
    {
      question: "What if I don't win?",
      answer: "Even if you don't win, you've still made a valuable contribution to important charitable causes. Plus, there are new competitions launching regularly!"
    }
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="gray.800">
              How Jackson Jackpot Works
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="3xl">
              Win amazing prizes while supporting incredible charities. It&apos;s simple, secure, and makes a real difference.
            </Text>
          </VStack>

          {/* How It Works Steps */}
          <VStack spacing={8}>
            <Heading as="h2" size="xl" color="gray.800" textAlign="center">
              Four Simple Steps
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {steps.map((step, index) => (
                <Card key={index} shadow="lg" _hover={{ shadow: "xl" }} transition="all 0.3s">
                  <CardBody p={6} textAlign="center">
                    <VStack spacing={4}>
                      <Flex
                        w={16}
                        h={16}
                        bg={`${step.color}.500`}
                        borderRadius="full"
                        align="center"
                        justify="center"
                        color="white"
                      >
                        <Icon as={step.icon} boxSize={8} />
                      </Flex>
                      
                      <Badge colorScheme={step.color} variant="solid" px={3} py={1}>
                        Step {index + 1}
                      </Badge>
                      
                      <Heading as="h3" size="md" color="gray.800">
                        {step.title}
                      </Heading>
                      
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {step.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Key Features */}
          <VStack spacing={8}>
            <Heading as="h2" size="xl" color="gray.800" textAlign="center">
              Why Choose Jackson Jackpot?
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {features.map((feature, index) => (
                <Card key={index} shadow="md">
                  <CardBody p={6}>
                    <HStack spacing={4} align="start">
                      <Flex
                        w={12}
                        h={12}
                        bg="blue.100"
                        borderRadius="lg"
                        align="center"
                        justify="center"
                        color="blue.500"
                        flexShrink={0}
                      >
                        <Icon as={feature.icon} boxSize={6} />
                      </Flex>
                      
                      <VStack align="start" spacing={2}>
                        <Heading as="h3" size="md" color="gray.800">
                          {feature.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          {feature.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Impact Section */}
          <Card bg="blue.50" shadow="lg">
            <CardBody p={8}>
              <VStack spacing={6} textAlign="center">
                <Icon as={FaHeart} boxSize={12} color="red.500" />
                <Heading as="h2" size="xl" color="gray.800">
                  Your Impact Matters
                </Heading>
                <Text fontSize="lg" color="gray.700" maxW="2xl">
                  Every ticket you purchase directly supports registered charities across the UK. 
                  Together, we&apos;re making a real difference in communities nationwide.
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="2xl">
                  <VStack>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      £500K+
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Raised for charities
                    </Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="3xl" fontWeight="bold" color="green.600">
                      50+
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Charities supported
                    </Text>
                  </VStack>
                  <VStack>
                    <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                      10K+
                    </Text>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Happy participants
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* FAQ Section */}
          <VStack spacing={8}>
            <Heading as="h2" size="xl" color="gray.800" textAlign="center">
              Frequently Asked Questions
            </Heading>
            
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
              {faqs.map((faq, index) => (
                <Card key={index} shadow="md">
                  <CardBody p={6}>
                    <VStack align="start" spacing={3}>
                      <Heading as="h3" size="sm" color="gray.800">
                        {faq.question}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {faq.answer}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Trust Indicators */}
          <Card bg="green.50" shadow="lg">
            <CardBody p={6}>
              <VStack spacing={4}>
                <Icon as={FaShieldAlt} boxSize={8} color="green.500" />
                <Heading as="h3" size="lg" color="gray.800" textAlign="center">
                  Licensed & Regulated
                </Heading>
                <Text fontSize="sm" color="gray.600" textAlign="center" maxW="2xl">
                  Jackson Jackpot operates under strict UK gambling regulations and is licensed by the Gambling Commission. 
                  All funds are held in segregated accounts for maximum security.
                </Text>
                
                <List spacing={2} textAlign="left">
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Licensed by the UK Gambling Commission
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Audited by independent third parties
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    PCI DSS compliant payment processing
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    Responsible gambling measures in place
                  </ListItem>
                </List>
              </VStack>
            </CardBody>
          </Card>

          {/* Call to Action */}
          <Card bg="blue.600" color="white" shadow="xl">
            <CardBody p={8} textAlign="center">
              <VStack spacing={6}>
                <Icon as={StarIcon} boxSize={12} color="yellow.300" />
                <Heading as="h2" size="xl">
                  Ready to Start Winning?
                </Heading>
                <Text fontSize="lg" maxW="2xl">
                  Join thousands of players who are winning amazing prizes while supporting incredible causes.
                </Text>
                
                <HStack spacing={4}>
                  <Link href="/competitions">
                    <Button 
                      size="lg" 
                      bg="white" 
                      color="blue.600" 
                      _hover={{ bg: "gray.100" }}
                    >
                      Browse Competitions
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      borderColor="white" 
                      color="white"
                      _hover={{ bg: "whiteAlpha.200" }}
                    >
                      Create Account
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}