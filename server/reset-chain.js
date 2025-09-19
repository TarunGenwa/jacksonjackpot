const { PrismaClient } = require('@prisma/client');

async function resetChain() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Resetting hash chain...');

    // Delete all chain entries and checkpoints
    await prisma.chainCheckpoint.deleteMany({});
    console.log('✅ Deleted all checkpoints');

    await prisma.hashChain.deleteMany({});
    console.log('✅ Deleted all hash chain entries');

    // Update all tickets to remove chain references
    await prisma.ticket.updateMany({
      data: {
        chainEntryId: null
      }
    });
    console.log('✅ Removed chain references from tickets');

    console.log('🎉 Hash chain reset complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. New ticket purchases will create properly hashed chain entries');
    console.log('2. The chain integrity verification should now pass');
    console.log('3. You can test by purchasing new tickets');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetChain();