-- CreateEnum
CREATE TYPE "public"."ChainEntryType" AS ENUM ('TICKET_PURCHASE', 'PRIZE_ALLOCATION', 'DRAW_RESULT', 'PRIZE_CLAIM', 'COMPETITION_STATE_CHANGE', 'INSTANT_WIN_REVEAL', 'SEED_COMMIT', 'SEED_REVEAL', 'CHECKPOINT');

-- CreateEnum
CREATE TYPE "public"."DrawSeedStatus" AS ENUM ('COMMITTED', 'REVEALED', 'USED');

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

-- AlterTable
ALTER TABLE "public"."tickets" ADD COLUMN "chainEntryId" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "tickets_chainEntryId_key" ON "public"."tickets"("chainEntryId");

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_chainEntryId_fkey" FOREIGN KEY ("chainEntryId") REFERENCES "public"."hash_chain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."instant_wins" ADD CONSTRAINT "instant_wins_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."instant_wins" ADD CONSTRAINT "instant_wins_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "public"."prizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."instant_wins" ADD CONSTRAINT "instant_wins_chainEntryId_fkey" FOREIGN KEY ("chainEntryId") REFERENCES "public"."hash_chain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."draw_seeds" ADD CONSTRAINT "draw_seeds_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;