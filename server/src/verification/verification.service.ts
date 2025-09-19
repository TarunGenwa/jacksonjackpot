import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashChainService } from '../hash-chain/hash-chain.service';

export interface TicketVerificationResult {
  ticketId: string;
  ticketNumber: string;
  isValid: boolean;
  chainEntry?: any;
  verification: {
    hashValid: boolean;
    chainIntact: boolean;
    purchaseProven: boolean;
  };
  details?: {
    competitionId: string;
    userId: string;
    purchasePrice: string;
    purchasedAt: Date;
    chainHash: string;
    sequence: number;
  };
}

export interface ChainIntegrityResult {
  isValid: boolean;
  totalEntries: number;
  verifiedEntries: number;
  brokenAtSequence?: number;
  errors?: string[];
  verificationRange: {
    start: number;
    end: number;
  };
  checkpoints: {
    total: number;
    verified: number;
    latest?: any;
  };
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashChainService: HashChainService,
  ) {}

  async verifyTicket(ticketId: string): Promise<TicketVerificationResult> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        chainEntry: true,
        competition: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!ticket.chainEntry) {
      return {
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        isValid: false,
        verification: {
          hashValid: false,
          chainIntact: false,
          purchaseProven: false,
        },
      };
    }

    const calculatedHash = this.hashChainService.calculateHash({
      sequence: ticket.chainEntry.sequence,
      type: ticket.chainEntry.type,
      timestamp: ticket.chainEntry.timestamp.toISOString(),
      data: ticket.chainEntry.data,
      metadata: ticket.chainEntry.metadata,
      previousHash: ticket.chainEntry.previousHash,
    });

    const hashValid = calculatedHash === ticket.chainEntry.hash;

    const chainVerification = await this.hashChainService.verifyChain(
      Math.max(1, ticket.chainEntry.sequence - 5),
      ticket.chainEntry.sequence + 5,
    );

    const purchaseData = ticket.chainEntry.data as any;
    const purchaseProven =
      purchaseData.ticketId === ticket.id &&
      purchaseData.ticketNumber === ticket.ticketNumber &&
      purchaseData.competitionId === ticket.competitionId;

    return {
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      isValid: hashValid && chainVerification.isValid && purchaseProven,
      chainEntry: ticket.chainEntry,
      verification: {
        hashValid,
        chainIntact: chainVerification.isValid,
        purchaseProven,
      },
      details: {
        competitionId: ticket.competitionId,
        userId: ticket.userId,
        purchasePrice: ticket.purchasePrice.toString(),
        purchasedAt: ticket.purchasedAt,
        chainHash: ticket.chainEntry.hash,
        sequence: ticket.chainEntry.sequence,
      },
    };
  }

  async verifyChainIntegrity(
    startSequence?: number,
    endSequence?: number,
  ): Promise<ChainIntegrityResult> {
    const latestEntry = await this.hashChainService.getLatestEntry();

    if (!latestEntry) {
      return {
        isValid: true,
        totalEntries: 0,
        verifiedEntries: 0,
        verificationRange: { start: 0, end: 0 },
        checkpoints: { total: 0, verified: 0 },
      };
    }

    const actualStart = startSequence || 1;
    const actualEnd = endSequence || latestEntry.sequence;

    const verificationResult = await this.hashChainService.verifyChain(
      actualStart,
      actualEnd,
    );

    const totalEntries = await this.prisma.hashChain.count();
    const verifiedRange = actualEnd - actualStart + 1;

    const checkpoints = await this.hashChainService.getCheckpoints();
    const latestCheckpoint = await this.hashChainService.getLatestCheckpoint();

    let verifiedCheckpoints = 0;
    for (const checkpoint of checkpoints) {
      const checkpointVerification = await this.verifyCheckpoint(checkpoint.id);
      if (checkpointVerification.isValid) {
        verifiedCheckpoints++;
      }
    }

    return {
      isValid: verificationResult.isValid,
      totalEntries,
      verifiedEntries: verificationResult.isValid ? verifiedRange : 0,
      brokenAtSequence: verificationResult.brokenAtSequence,
      errors: verificationResult.errors,
      verificationRange: {
        start: actualStart,
        end: actualEnd,
      },
      checkpoints: {
        total: checkpoints.length,
        verified: verifiedCheckpoints,
        latest: latestCheckpoint,
      },
    };
  }

  async getLatestCheckpoint() {
    const checkpoint = await this.hashChainService.getLatestCheckpoint();

    if (!checkpoint) {
      return {
        exists: false,
        message: 'No checkpoints found',
      };
    }

    const verification = await this.verifyCheckpoint(checkpoint.id);

    return {
      exists: true,
      checkpoint: {
        id: checkpoint.id,
        sequence: checkpoint.sequence,
        hash: checkpoint.hash,
        merkleRoot: checkpoint.merkleRoot,
        entriesCount: checkpoint.entriesCount,
        range: {
          start: checkpoint.startSequence,
          end: checkpoint.endSequence,
        },
        publishedHash: checkpoint.publishedHash,
        publishedTimestamp: checkpoint.publishedTimestamp,
        createdAt: checkpoint.createdAt,
      },
      verification,
    };
  }

  async verifyCheckpoint(checkpointId: string) {
    const checkpoint = await this.prisma.chainCheckpoint.findUnique({
      where: { id: checkpointId },
    });

    if (!checkpoint) {
      throw new NotFoundException('Checkpoint not found');
    }

    const entries = await this.prisma.hashChain.findMany({
      where: {
        sequence: {
          gte: checkpoint.startSequence,
          lte: checkpoint.endSequence,
        },
      },
      orderBy: { sequence: 'asc' },
    });

    if (entries.length !== checkpoint.entriesCount) {
      return {
        isValid: false,
        error: `Entry count mismatch: expected ${checkpoint.entriesCount}, found ${entries.length}`,
      };
    }

    const calculatedMerkleRoot = this.calculateMerkleRoot(
      entries.map((e) => e.hash),
    );
    const merkleRootValid = calculatedMerkleRoot === checkpoint.merkleRoot;

    const lastEntry = entries[entries.length - 1];
    const hashValid = lastEntry && lastEntry.hash === checkpoint.hash;

    return {
      isValid: merkleRootValid && hashValid,
      merkleRootValid,
      hashValid,
      entriesCount: entries.length,
      expectedEntriesCount: checkpoint.entriesCount,
      calculatedMerkleRoot,
      storedMerkleRoot: checkpoint.merkleRoot,
    };
  }

  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '';
    if (hashes.length === 1) return hashes[0];

    const crypto = require('crypto');
    const nextLevel: string[] = [];

    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = hashes[i + 1] || left;

      const combined = crypto
        .createHash('sha256')
        .update(left + right)
        .digest('hex');

      nextLevel.push(combined);
    }

    return this.calculateMerkleRoot(nextLevel);
  }

  async getDrawResults(competitionId: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        drawSeed: true,
        winners: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            ticket: true,
            prize: true,
          },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    const drawResultEntry = await this.prisma.hashChain.findFirst({
      where: {
        type: 'DRAW_RESULT',
        data: {
          path: ['competitionId'],
          equals: competitionId,
        },
      },
    });

    const verification = drawResultEntry
      ? await this.hashChainService.verifyChain(
          drawResultEntry.sequence,
          drawResultEntry.sequence,
        )
      : { isValid: false, errors: ['No draw result found in chain'] };

    return {
      competitionId: competition.id,
      competitionTitle: competition.title,
      drawDate: competition.drawDate,
      status: competition.status,
      seedCommitted: !!competition.drawSeed?.seedCommit,
      seedRevealed: !!competition.drawSeed?.seedReveal,
      drawExecuted: !!drawResultEntry,
      verification: {
        isValid: verification.isValid,
        errors: verification.errors,
      },
      results: {
        winnersCount: competition.winners.length,
        winners: competition.winners.map((w) => ({
          winnerId: w.id,
          ticketNumber: w.ticket.ticketNumber,
          username: w.user.username,
          firstName: w.user.firstName,
          lastName: w.user.lastName,
          prizeName: w.prize.name,
          prizeValue: w.prize.value,
          claimStatus: w.status,
          claimedAt: w.claimedAt,
        })),
      },
      chainProof: drawResultEntry
        ? {
            hash: drawResultEntry.hash,
            sequence: drawResultEntry.sequence,
            timestamp: drawResultEntry.timestamp,
          }
        : null,
    };
  }

  async getVerificationReport(competitionId?: string) {
    const filter = competitionId
      ? {
          data: {
            path: ['competitionId'],
            equals: competitionId,
          },
        }
      : {};

    const entries = await this.prisma.hashChain.findMany({
      where: filter,
      orderBy: { sequence: 'desc' },
      take: 100,
    });

    const integrityCheck = await this.verifyChainIntegrity();
    const latestCheckpoint = await this.getLatestCheckpoint();

    const entryTypes = await this.prisma.hashChain.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
      where: filter,
    });

    return {
      summary: {
        totalEntries: entries.length,
        chainIntegrity: integrityCheck.isValid,
        latestSequence: entries[0]?.sequence || 0,
        oldestSequence: entries[entries.length - 1]?.sequence || 0,
      },
      entryTypes: entryTypes.map((et) => ({
        type: et.type,
        count: et._count.type,
      })),
      latestCheckpoint: latestCheckpoint.exists
        ? latestCheckpoint.checkpoint
        : null,
      integrityReport: integrityCheck,
      recentEntries: entries.slice(0, 10).map((e) => ({
        sequence: e.sequence,
        type: e.type,
        hash: e.hash,
        previousHash: e.previousHash,
        timestamp: e.timestamp,
      })),
    };
  }
}
