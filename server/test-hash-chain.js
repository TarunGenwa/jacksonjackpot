const { PrismaClient } = require('@prisma/client');

async function testHashChain() {
  const prisma = new PrismaClient();

  try {
    console.log('Checking existing hash chain entries...');

    // Get all hash chain entries ordered by sequence
    const entries = await prisma.hashChain.findMany({
      orderBy: { sequence: 'asc' },
      take: 10
    });

    console.log(`Found ${entries.length} entries in hash chain:`);

    entries.forEach((entry, index) => {
      console.log(`\nEntry ${index + 1}:`);
      console.log(`  Sequence: ${entry.sequence}`);
      console.log(`  Type: ${entry.type}`);
      console.log(`  Hash: ${entry.hash.substring(0, 16)}...`);
      console.log(`  Previous Hash: ${entry.previousHash ? entry.previousHash.substring(0, 16) + '...' : 'null'}`);
      console.log(`  Timestamp: ${entry.timestamp}`);
    });

    // Check if the chain is properly linked
    console.log('\nChecking chain linkage:');
    for (let i = 1; i < entries.length; i++) {
      const current = entries[i];
      const previous = entries[i - 1];

      if (current.previousHash !== previous.hash) {
        console.log(`❌ Chain break at sequence ${current.sequence}!`);
        console.log(`  Expected previous hash: ${previous.hash}`);
        console.log(`  Actual previous hash: ${current.previousHash}`);
      } else {
        console.log(`✅ Chain link valid between ${previous.sequence} and ${current.sequence}`);
      }
    }

    // Get latest entry
    const latest = await prisma.hashChain.findFirst({
      orderBy: { sequence: 'desc' }
    });

    console.log(`\nLatest entry: ${latest ? `Sequence ${latest.sequence}, Hash: ${latest.hash.substring(0, 16)}...` : 'None'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHashChain();