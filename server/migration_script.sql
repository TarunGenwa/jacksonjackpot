-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "public"."CompetitionType" AS ENUM ('MYSTERYBOXES', 'INSTANT_WINS', 'DAILY_FREE', 'INSTANT_SPINS');

-- CreateEnum
CREATE TYPE "public"."CompetitionStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ACTIVE', 'SOLD_OUT', 'DRAWING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TICKET_PURCHASE', 'PRIZE_PAYOUT', 'REFUND', 'BONUS', 'FEE');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."TicketStatus" AS ENUM ('ACTIVE', 'WINNER', 'EXPIRED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."WinnerStatus" AS ENUM ('PENDING', 'NOTIFIED', 'CLAIMED', 'PAID', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."ChainEntryType" AS ENUM ('TICKET_PURCHASE', 'PRIZE_ALLOCATION', 'DRAW_RESULT', 'PRIZE_CLAIM', 'COMPETITION_STATE_CHANGE', 'INSTANT_WIN_REVEAL', 'SEED_COMMIT', 'SEED_REVEAL', 'CHECKPOINT');

-- CreateEnum
CREATE TYPE "public"."DrawSeedStatus" AS ENUM ('COMMITTED', 'REVEALED', 'USED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."charities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "taxId" TEXT,
    "bankDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."competitions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."CompetitionType" NOT NULL DEFAULT 'MYSTERYBOXES',
    "charityId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL,
    "ticketPrice" DECIMAL(10,2) NOT NULL,
    "maxTickets" INTEGER NOT NULL,
    "ticketsSold" INTEGER NOT NULL DEFAULT 0,
    "minTickets" INTEGER NOT NULL DEFAULT 1,
    "status" "public"."CompetitionStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "termsAndConditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prizes" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "position" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "description" TEXT,
    "referenceId" TEXT,
    "paymentMethod" TEXT,
    "paymentProvider" TEXT,
    "metadata" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purchasePrice" DECIMAL(10,2) NOT NULL,
    "status" "public"."TicketStatus" NOT NULL DEFAULT 'ACTIVE',
    "chainEntryId" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."winners" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "status" "public"."WinnerStatus" NOT NULL DEFAULT 'PENDING',
    "claimedAt" TIMESTAMP(3),
    "paidOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "winners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."donations" (
    "id" TEXT NOT NULL,
    "charityId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "donorName" TEXT,
    "donorEmail" TEXT,
    "status" "public"."DonationStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hash_chain" (
    "id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "type" "public"."ChainEntryType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "metadata" JSONB,
    "previousHash" TEXT,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hash_chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chain_checkpoints" (
    "id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "entriesCount" INTEGER NOT NULL,
    "startSequence" INTEGER NOT NULL,
    "endSequence" INTEGER NOT NULL,
    "publishedHash" TEXT,
    "publishedTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chain_checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."instant_wins" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "encryptedData" TEXT NOT NULL,
    "isRevealed" BOOLEAN NOT NULL DEFAULT false,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedByTicketId" TEXT,
    "chainEntryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instant_wins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."draw_seeds" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "seedCommit" TEXT NOT NULL,
    "seedReveal" TEXT,
    "commitTimestamp" TIMESTAMP(3) NOT NULL,
    "revealTimestamp" TIMESTAMP(3),
    "status" "public"."DrawSeedStatus" NOT NULL DEFAULT 'COMMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draw_seeds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "charities_taxId_key" ON "public"."charities"("taxId");

-- CreateIndex
CREATE INDEX "competitions_status_isActive_idx" ON "public"."competitions"("status", "isActive");

-- CreateIndex
CREATE INDEX "competitions_charityId_idx" ON "public"."competitions"("charityId");

-- CreateIndex
CREATE INDEX "competitions_type_idx" ON "public"."competitions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "prizes_competitionId_position_key" ON "public"."prizes"("competitionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "public"."wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_referenceId_key" ON "public"."transactions"("referenceId");

-- CreateIndex
CREATE INDEX "transactions_userId_status_idx" ON "public"."transactions"("userId", "status");

-- CreateIndex
CREATE INDEX "transactions_walletId_idx" ON "public"."transactions"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticketNumber_key" ON "public"."tickets"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_chainEntryId_key" ON "public"."tickets"("chainEntryId");

-- CreateIndex
CREATE INDEX "tickets_competitionId_status_idx" ON "public"."tickets"("competitionId", "status");

-- CreateIndex
CREATE INDEX "tickets_userId_idx" ON "public"."tickets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "winners_ticketId_key" ON "public"."winners"("ticketId");

-- CreateIndex
CREATE INDEX "winners_competitionId_idx" ON "public"."winners"("competitionId");

-- CreateIndex
CREATE INDEX "winners_userId_idx" ON "public"."winners"("userId");

-- CreateIndex
CREATE INDEX "donations_charityId_status_idx" ON "public"."donations"("charityId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "hash_chain_sequence_key" ON "public"."hash_chain"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "hash_chain_hash_key" ON "public"."hash_chain"("hash");

-- CreateIndex
CREATE INDEX "hash_chain_sequence_idx" ON "public"."hash_chain"("sequence");

-- CreateIndex
CREATE INDEX "hash_chain_type_idx" ON "public"."hash_chain"("type");

-- CreateIndex
CREATE INDEX "hash_chain_timestamp_idx" ON "public"."hash_chain"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "chain_checkpoints_sequence_key" ON "public"."chain_checkpoints"("sequence");

-- CreateIndex
CREATE INDEX "chain_checkpoints_sequence_idx" ON "public"."chain_checkpoints"("sequence");

-- CreateIndex
CREATE UNIQUE INDEX "instant_wins_claimedByTicketId_key" ON "public"."instant_wins"("claimedByTicketId");

-- CreateIndex
CREATE UNIQUE INDEX "instant_wins_chainEntryId_key" ON "public"."instant_wins"("chainEntryId");

-- CreateIndex
CREATE INDEX "instant_wins_competitionId_isClaimed_idx" ON "public"."instant_wins"("competitionId", "isClaimed");

-- CreateIndex
CREATE UNIQUE INDEX "instant_wins_competitionId_position_key" ON "public"."instant_wins"("competitionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "draw_seeds_competitionId_key" ON "public"."draw_seeds"("competitionId");

-- AddForeignKey
ALTER TABLE "public"."competitions" ADD CONSTRAINT "competitions_charityId_fkey" FOREIGN KEY ("charityId") REFERENCES "public"."charities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prizes" ADD CONSTRAINT "prizes_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_chainEntryId_fkey" FOREIGN KEY ("chainEntryId") REFERENCES "public"."hash_chain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."winners" ADD CONSTRAINT "winners_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."winners" ADD CONSTRAINT "winners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."winners" ADD CONSTRAINT "winners_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."winners" ADD CONSTRAINT "winners_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."donations" ADD CONSTRAINT "donations_charityId_fkey" FOREIGN KEY ("charityId") REFERENCES "public"."charities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."instant_wins" ADD CONSTRAINT "instant_wins_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."instant_wins" ADD CONSTRAINT "instant_wins_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."instant_wins" ADD CONSTRAINT "instant_wins_chainEntryId_fkey" FOREIGN KEY ("chainEntryId") REFERENCES "public"."hash_chain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."draw_seeds" ADD CONSTRAINT "draw_seeds_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

