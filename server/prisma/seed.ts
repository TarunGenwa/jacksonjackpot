import { PrismaClient, CompetitionStatus, CompetitionType } from '@prisma/client';
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

  // Create competitions with different types
  console.log('Creating competitions...');
  const now = new Date();
  const competitions: any[] = [];

  // MYSTERY BOXES competitions
  const mysteryBox1 = await prisma.competition.create({
    data: {
      title: 'Land Rover Surprise Box',
      description: 'Contains premium electronics worth up to £2000 including smartphones, tablets, headphones, and smart home gadgets. Every box guaranteed to contain items worth more than the entry fee!',
      type: CompetitionType.MYSTERYBOXES,
      charityId: charities[0].id,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(10.00),
      maxTickets: 500,
      ticketsSold: 320,
      minTickets: 50,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/mystery-land-rover-box_5_4.png?updatedAt=1758172879453',
      termsAndConditions: 'Mystery box contents vary. Minimum value guaranteed. UK delivery only.'
    }
  });

  const mysteryBox2 = await prisma.competition.create({
    data: {
      title: 'Top Gun Box',
      description: 'Designer clothing and accessories worth up to £1500 from top brands. Includes a mix of clothing, shoes, bags, and jewelry from premium fashion houses.',
      type: CompetitionType.MYSTERYBOXES,
      charityId: charities[1].id,
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 19 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(8.00),
      maxTickets: 300,
      ticketsSold: 180,
      minTickets: 30,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/top-gun-box-5_4.webp?updatedAt=1758172879581',
      termsAndConditions: 'Size selection required after winning. Exchange policy applies.'
    }
  });

  // INSTANT WINS competitions
  const instantWin1 = await prisma.competition.create({
    data: {
      title: 'Mercedes Benz Box',
      description: 'Win £500 instantly! No waiting for draws - find out immediately if you\'ve won. Multiple prizes available throughout the competition period.',
      type: CompetitionType.INSTANT_WINS,
      charityId: charities[2].id,
      startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(2.00),
      maxTickets: 1000,
      ticketsSold: 750,
      minTickets: 100,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/mercedes-benz-box-5_4.webp?updatedAt=1758172879885',
      termsAndConditions: 'Instant win results shown immediately. Winners notified by email.'
    }
  });

  const instantWin2 = await prisma.competition.create({
    data: {
      title: 'Cash Box',
      description: 'Win the latest smartphone instantly! Premium devices available including iPhone 15 Pro, Samsung Galaxy S24, and Google Pixel 8 Pro.',
      type: CompetitionType.INSTANT_WINS,
      charityId: charities[3].id,
      startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(5.00),
      maxTickets: 200,
      ticketsSold: 120,
      minTickets: 20,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/cash-box-2-5_4.webp?updatedAt=1758171903862',
      termsAndConditions: 'Instant results. Device model may vary based on availability.'
    }
  });

  // DAILY FREE competitions
  const dailyFree1 = await prisma.competition.create({
    data: {
      title: 'The Money Machine',
      description: 'Free entry! Win a £20 coffee shop voucher daily. New winner selected every day at midnight. Multiple chances to win throughout the month.',
      type: CompetitionType.DAILY_FREE,
      charityId: charities[4].id,
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(0.00),
      maxTickets: 10000,
      ticketsSold: 8500,
      minTickets: 1000,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/the-money-machine-5_4.webp?updatedAt=1758172879760',
      termsAndConditions: 'Free entry. One entry per person per day. Daily draws at midnight.'
    }
  });

  const dailyFree2 = await prisma.competition.create({
    data: {
      title: 'Rush Hour Riches',
      description: 'Free entry! Win lunch for two at top restaurants daily. Choose from over 50 participating restaurants in your area.',
      type: CompetitionType.DAILY_FREE,
      charityId: charities[0].id,
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(0.00),
      maxTickets: 5000,
      ticketsSold: 4200,
      minTickets: 500,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/rush-hour-riches-5_4.webp?updatedAt=1758172879884',
      termsAndConditions: 'Free entry. Restaurant subject to availability. Valid weekdays only.'
    }
  });

  // INSTANT SPINS competitions
  const instantSpin1 = await prisma.competition.create({
    data: {
      title: 'Cash Fanned Gaming Setup',
      description: 'Spin the wheel for a chance to win a complete gaming setup worth £3000! Includes gaming PC, monitor, keyboard, mouse, and gaming chair.',
      type: CompetitionType.INSTANT_SPINS,
      charityId: charities[1].id,
      startDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(3.00),
      maxTickets: 800,
      ticketsSold: 560,
      minTickets: 80,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/cash-fanned1-5_4.jpg?updatedAt=1758172879681',
      termsAndConditions: 'Spin wheel shows instant results. Setup customization available.'
    }
  });

  const instantSpin2 = await prisma.competition.create({
    data: {
      title: 'Mystery Rolex Box',
      description: 'Spin for your chance to win a luxury weekend getaway worth £2000! Destinations include Paris, Amsterdam, Rome, and Barcelona.',
      type: CompetitionType.INSTANT_SPINS,
      charityId: charities[2].id,
      startDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      drawDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
      ticketPrice: new Decimal(4.00),
      maxTickets: 600,
      ticketsSold: 420,
      minTickets: 60,
      status: CompetitionStatus.ACTIVE,
      imageUrl: 'https://ik.imagekit.io/sportfeeds/mystery-boxes/mystery-rolex-box-5_4.webp?updatedAt=1758172883716',
      termsAndConditions: 'Spin results instant. Travel dates subject to availability.'
    }
  });

  competitions.push(
    mysteryBox1, mysteryBox2,
    instantWin1, instantWin2,
    dailyFree1, dailyFree2,
    instantSpin1, instantSpin2
  );
  console.log(`✅ Created ${competitions.length} competitions`);

  // Create prizes for competitions
  console.log('Creating prizes...');
  const prizes: any[] = [];

  // Mystery Box Prizes
  const mysteryBox1Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: mysteryBox1.id,
        name: 'Electronics Mystery Box',
        description: 'Premium electronics package including smartphone, tablet, and accessories',
        value: new Decimal(2000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
      }
    })
  ]);

  const mysteryBox2Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: mysteryBox2.id,
        name: 'Fashion Mystery Box',
        description: 'Designer clothing and accessories from luxury brands',
        value: new Decimal(1500.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
      }
    })
  ]);

  // Instant Win Prizes
  const instantWin1Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: instantWin1.id,
        name: '£500 Cash Prize',
        description: 'Instant cash prize transferred to your account',
        value: new Decimal(500.00),
        position: 1,
        quantity: 5,
        imageUrl: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=400&h=300&fit=crop'
      }
    })
  ]);

  const instantWin2Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: instantWin2.id,
        name: 'Latest Smartphone',
        description: 'Brand new premium smartphone with full warranty',
        value: new Decimal(1200.00),
        position: 1,
        quantity: 3,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
      }
    })
  ]);

  // Daily Free Prizes
  const dailyFree1Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: dailyFree1.id,
        name: 'Coffee Shop Voucher',
        description: '£20 voucher for major coffee shop chains',
        value: new Decimal(20.00),
        position: 1,
        quantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
      }
    })
  ]);

  const dailyFree2Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: dailyFree2.id,
        name: 'Restaurant Lunch Voucher',
        description: 'Lunch for two at participating restaurants',
        value: new Decimal(60.00),
        position: 1,
        quantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
      }
    })
  ]);

  // Instant Spin Prizes
  const instantSpin1Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: instantSpin1.id,
        name: 'Complete Gaming Setup',
        description: 'Gaming PC, monitor, peripherals and gaming chair',
        value: new Decimal(3000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
      }
    })
  ]);

  const instantSpin2Prizes = await Promise.all([
    prisma.prize.create({
      data: {
        competitionId: instantSpin2.id,
        name: 'European Weekend Getaway',
        description: 'Luxury weekend trip to European destination for 2',
        value: new Decimal(2000.00),
        position: 1,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
      }
    })
  ]);

  prizes.push(
    ...mysteryBox1Prizes, ...mysteryBox2Prizes,
    ...instantWin1Prizes, ...instantWin2Prizes,
    ...dailyFree1Prizes, ...dailyFree2Prizes,
    ...instantSpin1Prizes, ...instantSpin2Prizes
  );
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