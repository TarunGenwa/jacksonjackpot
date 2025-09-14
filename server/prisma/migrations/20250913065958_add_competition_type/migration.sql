-- CreateEnum
CREATE TYPE "public"."CompetitionType" AS ENUM ('MYSTERYBOXES', 'INSTANT_WINS', 'DAILY_FREE', 'INSTANT_SPINS');

-- AlterTable
ALTER TABLE "public"."competitions" ADD COLUMN     "type" "public"."CompetitionType" NOT NULL DEFAULT 'MYSTERYBOXES';

-- CreateIndex
CREATE INDEX "competitions_type_idx" ON "public"."competitions"("type");
