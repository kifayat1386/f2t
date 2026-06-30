import { describe, it, expect } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { AuditService } from './audit.service';
import * as crypto from 'crypto';

describe('AuditService', () => {
  it('should correctly hash and link a new record', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new AuditService(prisma);

    // Mock findFirst to simulate genesis block
    prisma.auditLog.findFirst.mockResolvedValue(null);

    // Mock transaction
    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    const expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const payload = { amount: 500 };
    const payloadStr = JSON.stringify(payload);
    const hashInput = `TEST_ACTION|${payloadStr}|${expectedPrevHash}`;
    const expectedHash = crypto.createHash('sha256').update(hashInput).digest('hex');

    await service.record('TEST_ACTION', payload);

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          action: 'TEST_ACTION',
          payload,
          prevHash: expectedPrevHash,
          currentHash: expectedHash,
        }
      })
    );
  });

  it('should throw an error on verifyChain if tampered', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new AuditService(prisma);

    // Supply tampered logs
    prisma.auditLog.findMany.mockResolvedValue([
      {
        id: '1',
        seq: 1,
        action: 'TEST',
        payload: { a: 1 },
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: 'tampered_hash_here', // INVALID
        createdAt: new Date()
      }
    ]);

    await expect(service.verifyChain()).rejects.toThrow('Chain broken at seq 1: invalid currentHash. Tampering detected.');
  });
});
