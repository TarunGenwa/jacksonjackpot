import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChainEntryType, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

export interface ChainEntryData {
  type: ChainEntryType;
  data: any;
  metadata?: any;
}

export interface VerificationResult {
  isValid: boolean;
  errors?: string[];
  brokenAtSequence?: number;
}

@Injectable()
export class HashChainService {
  private readonly logger = new Logger(HashChainService.name);
  private readonly CHECKPOINT_INTERVAL = 100;

  constructor(private readonly prisma: PrismaService) {}

  async addEntry(entryData: ChainEntryData): Promise<any> {
    return await this.prisma.$transaction(async (prisma) => {
      const latestEntry = await this.getLatestEntry(prisma);

      const sequence = latestEntry ? latestEntry.sequence + 1 : 1;
      const previousHash = latestEntry ? latestEntry.hash : null;

      const entryToHash = {
        sequence,
        type: entryData.type,
        timestamp: new Date().toISOString(),
        data: entryData.data,
        metadata: entryData.metadata,
        previousHash
      };

      const hash = this.calculateHash(entryToHash);

      const newEntry = await prisma.hashChain.create({
        data: {
          sequence,
          type: entryData.type,
          data: entryData.data,
          metadata: entryData.metadata,
          previousHash,
          hash
        }
      });

      if (sequence % this.CHECKPOINT_INTERVAL === 0) {
        await this.createCheckpoint(sequence, prisma);
      }

      this.logger.log(`Added chain entry: sequence=${sequence}, type=${entryData.type}, hash=${hash}`);

      return newEntry;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });
  }

  calculateHash(entry: any): string {
    const dataToHash = JSON.stringify({
      sequence: entry.sequence,
      type: entry.type,
      timestamp: entry.timestamp,
      data: entry.data,
      metadata: entry.metadata,
      previousHash: entry.previousHash
    });

    return crypto
      .createHash('sha256')
      .update(dataToHash)
      .digest('hex');
  }

  async verifyChain(startSequence?: number, endSequence?: number): Promise<VerificationResult> {
    const errors: string[] = [];

    const whereClause: Prisma.HashChainWhereInput = {};
    if (startSequence !== undefined) {
      whereClause.sequence = { gte: startSequence };
    }
    if (endSequence !== undefined) {
      if (whereClause.sequence && typeof whereClause.sequence === 'object') {
        whereClause.sequence = { ...whereClause.sequence, lte: endSequence };
      } else {
        whereClause.sequence = { lte: endSequence };
      }
    }

    const entries = await this.prisma.hashChain.findMany({
      where: whereClause,
      orderBy: { sequence: 'asc' }
    });

    if (entries.length === 0) {
      return { isValid: true, errors: ['No entries found in specified range'] };
    }

    let previousEntry: any = null;

    for (const entry of entries) {
      if (previousEntry) {
        if (entry.previousHash !== previousEntry.hash) {
          errors.push(`Chain broken at sequence ${entry.sequence}: previous hash mismatch`);
          return { isValid: false, errors, brokenAtSequence: entry.sequence };
        }

        if (entry.sequence !== previousEntry.sequence + 1) {
          errors.push(`Sequence gap detected between ${previousEntry.sequence} and ${entry.sequence}`);
          return { isValid: false, errors, brokenAtSequence: entry.sequence };
        }
      }

      const calculatedHash = this.calculateHash({
        sequence: entry.sequence,
        type: entry.type,
        timestamp: entry.timestamp.toISOString(),
        data: entry.data,
        metadata: entry.metadata,
        previousHash: entry.previousHash
      });

      if (calculatedHash !== entry.hash) {
        errors.push(`Hash mismatch at sequence ${entry.sequence}`);
        return { isValid: false, errors, brokenAtSequence: entry.sequence };
      }

      previousEntry = entry;
    }

    this.logger.log(`Chain verification successful for sequences ${startSequence || 'start'} to ${endSequence || 'end'}`);
    return { isValid: true };
  }

  async getLatestEntry(prisma?: any) {
    const db = prisma || this.prisma;
    return await db.hashChain.findFirst({
      orderBy: { sequence: 'desc' }
    });
  }

  async createCheckpoint(sequence: number, prisma?: any) {
    const db = prisma || this.prisma;

    const startSequence = Math.max(1, sequence - this.CHECKPOINT_INTERVAL + 1);
    const endSequence = sequence;

    const entries = await db.hashChain.findMany({
      where: {
        sequence: {
          gte: startSequence,
          lte: endSequence
        }
      },
      orderBy: { sequence: 'asc' }
    });

    if (entries.length === 0) {
      this.logger.warn(`No entries found for checkpoint at sequence ${sequence}`);
      return;
    }

    const merkleRoot = this.calculateMerkleRoot(entries.map(e => e.hash));
    const lastEntry = entries[entries.length - 1];

    const checkpoint = await db.chainCheckpoint.create({
      data: {
        sequence,
        hash: lastEntry.hash,
        merkleRoot,
        entriesCount: entries.length,
        startSequence,
        endSequence
      }
    });

    this.logger.log(`Created checkpoint at sequence ${sequence}: merkleRoot=${merkleRoot}`);

    return checkpoint;
  }

  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '';
    if (hashes.length === 1) return hashes[0];

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

  async getCheckpoints(limit: number = 10) {
    return await this.prisma.chainCheckpoint.findMany({
      orderBy: { sequence: 'desc' },
      take: limit
    });
  }

  async getLatestCheckpoint() {
    return await this.prisma.chainCheckpoint.findFirst({
      orderBy: { sequence: 'desc' }
    });
  }

  async publishCheckpoint(checkpointId: string, publishedHash: string) {
    return await this.prisma.chainCheckpoint.update({
      where: { id: checkpointId },
      data: {
        publishedHash,
        publishedTimestamp: new Date()
      }
    });
  }

  async getEntryByHash(hash: string) {
    return await this.prisma.hashChain.findUnique({
      where: { hash }
    });
  }

  async getEntriesByType(type: ChainEntryType, limit?: number) {
    return await this.prisma.hashChain.findMany({
      where: { type },
      orderBy: { sequence: 'desc' },
      take: limit
    });
  }
}