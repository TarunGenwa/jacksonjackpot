import { PrismaClient, CompetitionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.winner.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.charity.deleteMany();
  console.log('✅ Existing data cleared');

  // Create charities
  console.log('Creating charities...');
  const charities = await Promise.all([
    prisma.charity.create({
      data: {
        name: 'Cancer Research UK',
        description: 'The world\'s leading cancer charity dedicated to saving lives through research.',
        logoUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center',
        website: 'https://www.cancerresearchuk.org',
        email: 'info@cancerresearchuk.org',
        phone: '+44 20 7242 0200',
        address: '2 Redman Place, London E20 1JQ, UK',
        isVerified: true,
        taxId: 'CHY001',
        bankDetails: {
          bankName: 'Barclays Bank',
          accountName: 'Cancer Research UK',
          accountNumber: '12345678',
          sortCode: '20-00-00'
        }
      }
    }),
    prisma.charity.create({
      data: {
        name: 'British Heart Foundation',
        description: 'Fighting for every heartbeat. We fund research to keep hearts beating and blood flowing.',
        logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop&crop=center',
        website: 'https://www.bhf.org.uk',
        email: 'info@bhf.org.uk',
        phone: '+44 20 7554 0000',
        address: 'Greater London House, 180 Hampstead Road, London NW1 7AW, UK',
        isVerified: true,
        taxId: 'CHY002',
        bankDetails: {
          bankName: 'HSBC',
          accountName: 'British Heart Foundation',
          accountNumber: '87654321',
          sortCode: '40-00-00'
        }
      }
    }),
    prisma.charity.create({
      data: {
        name: 'Mind - Mental Health Charity',
        description: 'We provide advice and support to empower anyone experiencing a mental health problem.',
        logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=center',
        website: 'https://www.mind.org.uk',
        email: 'info@mind.org.uk',
        phone: '+44 20 8519 2122',
        address: '15-19 Broadway, Stratford, London E15 4BQ, UK',
        isVerified: true,
        taxId: 'CHY003',
        bankDetails: {
          bankName: 'Lloyds Bank',
          accountName: 'Mind',
          accountNumber: '11223344',
          sortCode: '30-00-00'
        }
      }
    }),
    prisma.charity.create({
      data: {
        name: 'Oxfam GB',
        description: 'We are a global movement of people working together to end the injustice of poverty.',
        logoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=200&fit=crop&crop=center',
        website: 'https://www.oxfam.org.uk',
        email: 'enquiries@oxfam.org.uk',
        phone: '+44 1865 473727',
        address: 'Oxfam House, John Smith Drive, Cowley, Oxford OX4 2JY, UK',
        isVerified: true,
        taxId: 'CHY004',
        bankDetails: {
          bankName: 'NatWest',
          accountName: 'Oxfam GB',
          accountNumber: '55667788',
          sortCode: '60-00-00'
        }
      }
    }),
    prisma.charity.create({
      data: {
        name: 'RSPCA',
        description: 'We\'re the UK\'s largest animal welfare charity, dedicated to helping animals in need.',
        logoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop&crop=center',
        website: 'https://www.rspca.org.uk',
        email: 'info@rspca.org.uk',
        phone: '+44 300 1234 999',
        address: 'Wilberforce Way, Southwater, Horsham, West Sussex RH13 9RS, UK',
        isVerified: true,
        taxId: 'CHY005',
        bankDetails: {
          bankName: 'Santander',
          accountName: 'RSPCA',
          accountNumber: '99887766',
          sortCode: '09-00-00'
        }
      }
    })
  ]);

  console.log(`✅ Created ${charities.length} charities`);

  // Create competitions
  console.log('Creating competitions...');
  const now = new Date();
  const competitions: any[] = [];

  // Competition 1 - Cancer Research UK
  const competition1 = await prisma.competition.create({
    data: {
      title: 'Win a Dream Holiday to the Maldives',
      description: 'Enter our amazing competition to win a 7-night all-inclusive holiday for 2 to the beautiful Maldives. Includes flights, luxury resort accommodation, and all meals. Help us raise funds for vital cancer research while having the chance to win the holiday of a lifetime!',
      charityId: charities[0].id,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      drawDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      ticketPrice: new Decimal(5.00),
      maxTickets: 10000,
      ticketsSold: 3247,
      minTickets: 100,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center',
      termsAndConditions: 'Competition open to UK residents aged 18+. Draw will be conducted by independent adjudicator. Winner will be notified within 48 hours of draw.'
    }
  });

  // Competition 2 - British Heart Foundation
  const competition2 = await prisma.competition.create({
    data: {
      title: 'Tesla Model 3 Electric Car Giveaway',
      description: 'Win a brand new Tesla Model 3 electric vehicle worth £40,000! This eco-friendly car comes with all the latest technology and features. Your entry helps fund life-saving heart research. Every ticket counts towards saving lives!',
      charityId: charities[1].id,
      startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      drawDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      ticketPrice: new Decimal(10.00),
      maxTickets: 5000,
      ticketsSold: 1856,
      minTickets: 500,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center',
      termsAndConditions: 'UK residents only. Winner responsible for insurance and registration. Alternative cash prize of £35,000 available.'
    }
  });

  // Competition 3 - Mind
  const competition3 = await prisma.competition.create({
    data: {
      title: '£25,000 Cash Prize Draw',
      description: 'Win £25,000 in cash! Use it however you like - pay off debts, plan a holiday, buy a car, or invest in your future. Your participation helps Mind continue providing vital mental health support across the UK.',
      charityId: charities[2].id,
      startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      drawDate: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000), // 31 days from now
      ticketPrice: new Decimal(2.50),
      maxTickets: 15000,
      ticketsSold: 0,
      minTickets: 1000,
      status: CompetitionStatus.UPCOMING,
      imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=800&h=600&fit=crop&crop=center',
      termsAndConditions: 'Open to UK residents aged 18+. Cash will be transferred to winner\'s bank account within 14 days of verification.'
    }
  });

  // Competition 4 - Oxfam
  const competition4 = await prisma.competition.create({
    data: {
      title: 'Luxury Home Makeover Worth £50,000',
      description: 'Transform your home with a complete luxury makeover worth £50,000! Includes kitchen renovation, bathroom upgrade, flooring throughout, and professional interior design. Help us fight global poverty while potentially winning your dream home transformation.',
      charityId: charities[3].id,
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      drawDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      ticketPrice: new Decimal(15.00),
      maxTickets: 4000,
      ticketsSold: 3890,
      minTickets: 300,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center',
      termsAndConditions: 'Winner must own their property or have landlord permission. Work to be completed within 6 months of winning.'
    }
  });

  // Competition 5 - RSPCA
  const competition5 = await prisma.competition.create({
    data: {
      title: 'Weekend Getaway Package Collection',
      description: 'Win one of 10 amazing weekend getaway packages across the UK! From luxury spa retreats to adventure holidays, there\'s something for everyone. Multiple winners mean more chances to win while supporting animal welfare.',
      charityId: charities[4].id,
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      drawDate: new Date(now.getTime()), // today
      ticketPrice: new Decimal(3.00),
      maxTickets: 8000,
      ticketsSold: 8000,
      minTickets: 800,
      status: CompetitionStatus.DRAWING,
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center',
      termsAndConditions: 'Multiple prizes available. Winners will be drawn randomly. Getaway packages valid for 12 months from draw date.'
    }
  });

  competitions.push(competition1, competition2, competition3, competition4, competition5);
  console.log(`✅ Created ${competitions.length} competitions`);

  // Create prizes for competitions
  console.log('Creating prizes...');
  const prizes: any[] = [];

  // Prizes for Competition 1 (Maldives Holiday)
  const competition1Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: competition1.id,
        name: 'Maldives Holiday for 2',
        description: '7 nights all-inclusive luxury resort accommodation for 2 people including return flights',
        value: new Decimal(8000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center'
      }
    }),
    prisma.prize.create({
      data: {
        competitionId: competition1.id,
        name: '£500 Travel Voucher',
        description: 'Holiday voucher to use with any major travel company',
        value: new Decimal(500.00),
        position: 2,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=center'
      }
    })
  ]);

  // Prizes for Competition 2 (Tesla)
  const competition2Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: competition2.id,
        name: 'Tesla Model 3',
        description: 'Brand new Tesla Model 3 electric vehicle with full warranty',
        value: new Decimal(40000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&crop=center'
      }
    })
  ]);

  // Prizes for Competition 3 (Cash Prize)
  const competition3Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: competition3.id,
        name: '£25,000 Cash Prize',
        description: 'Cash prize paid directly to winner\'s bank account',
        value: new Decimal(25000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop&crop=center'
      }
    })
  ]);

  // Prizes for Competition 4 (Home Makeover)
  const competition4Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: competition4.id,
        name: 'Luxury Home Makeover',
        description: 'Complete home renovation including kitchen, bathroom, flooring and interior design',
        value: new Decimal(50000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center'
      }
    })
  ]);

  // Prizes for Competition 5 (Weekend Getaways) - Multiple prizes
  const competition5Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: competition5.id,
        name: 'Luxury Spa Weekend',
        description: '2-night luxury spa break for 2 people including treatments',
        value: new Decimal(800.00),
        position: 1,
        quantity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
      }
    }),
    prisma.prize.create({
      data: {
        competitionId: competition5.id,
        name: 'Adventure Weekend',
        description: '2-night adventure break including activities like zip-lining and rock climbing',
        value: new Decimal(600.00),
        position: 2,
        quantity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=center'
      }
    }),
    prisma.prize.create({
      data: {
        competitionId: competition5.id,
        name: 'City Break Weekend',
        description: '2-night city break in London, Edinburgh, or Bath with sightseeing tours',
        value: new Decimal(500.00),
        position: 3,
        quantity: 4,
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=center'
      }
    })
  ]);

  prizes.push(...competition1Prizes, ...competition2Prizes, ...competition3Prizes, ...competition4Prizes, ...competition5Prizes);
  console.log(`✅ Created ${prizes.length} prizes`);

  // Create some sample donations
  console.log('Creating sample donations...');
  const donations = await Promise.all([
    prisma.donation.create({
      data: {
        charityId: charities[0].id,
        amount: new Decimal(50.00),
        donorName: 'Anonymous Donor',
        donorEmail: 'donor1@example.com',
        isAnonymous: true,
        status: 'COMPLETED',
        message: 'Keep up the great work!'
      }
    }),
    prisma.donation.create({
      data: {
        charityId: charities[1].id,
        amount: new Decimal(25.00),
        donorName: 'John Smith',
        donorEmail: 'john@example.com',
        isAnonymous: false,
        status: 'COMPLETED',
        message: 'In memory of my father'
      }
    }),
    prisma.donation.create({
      data: {
        charityId: charities[2].id,
        amount: new Decimal(100.00),
        donorName: 'Sarah Johnson',
        donorEmail: 'sarah@example.com',
        isAnonymous: false,
        status: 'COMPLETED'
      }
    })
  ]);

  console.log(`✅ Created ${donations.length} donations`);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`
📊 Summary:
- ${charities.length} charities created
- ${competitions.length} competitions created
- ${prizes.length} prizes created
- ${donations.length} donations created

🏆 Competition statuses:
- ${competitions.filter(c => c.status === 'ACTIVE').length} ACTIVE competitions
- ${competitions.filter(c => c.status === 'UPCOMING').length} UPCOMING competitions
- ${competitions.filter(c => c.status === 'DRAWING').length} competitions in DRAWING status
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });