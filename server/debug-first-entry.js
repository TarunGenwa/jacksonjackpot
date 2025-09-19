const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function debugFirstEntry() {
  const prisma = new PrismaClient();

  try {
    // Get the first entry
    const firstEntry = await prisma.hashChain.findFirst({
      where: { sequence: 1 },
    });

    if (!firstEntry) {
      console.log('No first entry found');
      return;
    }

    console.log('First entry details:');
    console.log('Sequence:', firstEntry.sequence);
    console.log('Type:', firstEntry.type);
    console.log('Timestamp:', firstEntry.timestamp.toISOString());
    console.log('Data:', JSON.stringify(firstEntry.data, null, 2));
    console.log('Metadata:', JSON.stringify(firstEntry.metadata, null, 2));
    console.log('Previous Hash:', firstEntry.previousHash);
    console.log('Stored Hash:', firstEntry.hash);

    // Calculate what the hash should be
    const entryToHash = {
      sequence: firstEntry.sequence,
      type: firstEntry.type,
      timestamp: firstEntry.timestamp.toISOString(),
      data: firstEntry.data,
      metadata: firstEntry.metadata,
      previousHash: firstEntry.previousHash
    };

    console.log('\nData being hashed:');
    console.log(JSON.stringify(entryToHash, null, 2));

    const dataToHash = JSON.stringify(entryToHash);
    const calculatedHash = crypto
      .createHash('sha256')
      .update(dataToHash)
      .digest('hex');

    console.log('\nCalculated Hash:', calculatedHash);
    console.log('Matches stored?', calculatedHash === firstEntry.hash);

    if (calculatedHash !== firstEntry.hash) {
      console.log('\n❌ HASH MISMATCH DETECTED');
      console.log('This explains why chain verification is failing');
    } else {
      console.log('\n✅ Hash matches - issue might be elsewhere');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugFirstEntry();