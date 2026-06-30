import { PrismaClient, AuditLog } from '@prisma/client';
import * as crypto from 'crypto';

export class AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Cryptographically chains a new event to the ledger.
   * Append-only implementation.
   */
  async record(action: string, payload: any): Promise<AuditLog> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the last hash (using serial seq to guarantee order)
      const lastEntry = await tx.auditLog.findFirst({
        orderBy: { seq: 'desc' },
      });

      const prevHash = lastEntry ? lastEntry.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';

      // 2. Canonicalize payload string consistently
      const payloadString = payload ? JSON.stringify(payload, Object.keys(payload).sort()) : '';

      // 3. Compute new SHA-256 hash
      const hashInput = `${action}|${payloadString}|${prevHash}`;
      const currentHash = crypto.createHash('sha256').update(hashInput).digest('hex');

      // 4. Insert new block
      return tx.auditLog.create({
        data: {
          action,
          payload: payload || null,
          prevHash,
          currentHash,
        }
      });
    });
  }

  /**
   * Verifies the entire cryptographic chain to ensure no row was tampered with.
   * Returns true if valid, or throws an error with the sequence number where it broke.
   */
  async verifyChain(): Promise<boolean> {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { seq: 'asc' }
    });

    if (logs.length === 0) return true;

    let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (const log of logs) {
      if (log.prevHash !== expectedPrevHash) {
        throw new Error(`Chain broken at seq ${log.seq}: invalid prevHash`);
      }

      const payloadString = log.payload ? JSON.stringify(log.payload, Object.keys(log.payload as object).sort()) : '';
      const hashInput = `${log.action}|${payloadString}|${expectedPrevHash}`;
      const computedHash = crypto.createHash('sha256').update(hashInput).digest('hex');

      if (log.currentHash !== computedHash) {
        throw new Error(`Chain broken at seq ${log.seq}: invalid currentHash. Tampering detected.`);
      }

      expectedPrevHash = computedHash;
    }

    return true;
  }
}
