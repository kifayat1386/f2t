import { describe, it, expect, vi } from 'vitest';
import { EscrowService } from './escrow.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';

describe('EscrowService', () => {
  it('should correctly release and split funds', async () => {
    const prisma = mockDeep<PrismaClient>();
    const ledgerMock = { recordTransaction: vi.fn() } as unknown as LedgerService;
    const auditMock = { record: vi.fn() } as unknown as AuditService;

    const service = new EscrowService(prisma, ledgerMock, auditMock);

    await service.releaseFunds('order_1', 1000, 800, 100, 100);

    // Should debit Escrow and credit the parties
    expect(ledgerMock.recordTransaction).toHaveBeenCalledWith('order_1', [
      { account: 'ESCROW_LIABILITY', debitP: 1000 },
      { account: 'FARMER_PAYABLE', creditP: 800 },
      { account: 'COURIER_PAYABLE', creditP: 100 },
      { account: 'COMMISSION_REVENUE', creditP: 100 }
    ]);

    expect(auditMock.record).toHaveBeenCalledWith('ESCROW_RELEASED', {
      orderId: 'order_1',
      farmerAmountP: 800,
      courierAmountP: 100,
      platformCommissionP: 100
    });
  });

  it('should throw if payout split does not match total amount', async () => {
    const prisma = mockDeep<PrismaClient>();
    const ledgerMock = { recordTransaction: vi.fn() } as unknown as LedgerService;
    const auditMock = { record: vi.fn() } as unknown as AuditService;

    const service = new EscrowService(prisma, ledgerMock, auditMock);

    await expect(
      service.releaseFunds('order_1', 1000, 800, 100, 50) // Total is 950!
    ).rejects.toThrow('Payout split does not match total amount');
  });
});
