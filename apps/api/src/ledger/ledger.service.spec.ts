import { describe, it, expect } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { LedgerService } from './ledger.service';

describe('LedgerService', () => {
  it('should process a balanced transaction', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new LedgerService(prisma);

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    prisma.ledgerEntry.findFirst.mockResolvedValue(null);

    await service.recordTransaction('order_1', [
      { account: 'PLATFORM_CASH', debitP: 1000 },
      { account: 'ESCROW_LIABILITY', creditP: 1000 }
    ]);

    expect(prisma.ledgerEntry.create).toHaveBeenCalledTimes(2);
  });

  it('should throw error on unbalanced transaction', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new LedgerService(prisma);

    await expect(
      service.recordTransaction('order_1', [
        { account: 'PLATFORM_CASH', debitP: 1000 },
        { account: 'ESCROW_LIABILITY', creditP: 900 } // Unbalanced!
      ])
    ).rejects.toThrow('Unbalanced transaction: Debits (1000P) != Credits (900P)');
  });
});
