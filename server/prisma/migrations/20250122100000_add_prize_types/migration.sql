-- CreateEnum
CREATE TYPE "PrizeType" AS ENUM ('DRAW', 'INSTANT_WIN');

-- AlterTable
ALTER TABLE "prizes" ADD COLUMN "type" "PrizeType" NOT NULL DEFAULT 'DRAW';
ALTER TABLE "prizes" ADD COLUMN "allocatedTickets" INTEGER DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN "prizes"."type" IS 'DRAW: Main lottery prize, INSTANT_WIN: Instant win prize with allocated tickets';
COMMENT ON COLUMN "prizes"."allocatedTickets" IS 'For INSTANT_WIN prizes: number of tickets that can win this prize';