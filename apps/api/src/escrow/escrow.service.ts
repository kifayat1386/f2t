import { PrismaClient } from '@prisma/client';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';

export class EscrowService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly ledger: LedgerService,
    private readonly audit: AuditService
  ) {}

  /**
   * Holds funds in Escrow upon successful payment.
   */
  async holdFunds(orderId: string, amountP: number) {
    // Dr: PLATFORM_CASH, Cr: ESCROW_LIABILITY
    await this.ledger.recordTransaction(orderId, [
      { account: 'PLATFORM_CASH', debitP: amountP },
      { account: 'ESCROW_LIABILITY', creditP: amountP }
    ]);

    await this.audit.record('ESCROW_HELD', { orderId, amountP });
  }

  /**
   * Splits and releases funds to appropriate parties upon delivery completion.
   */
  async releaseFunds(orderId: string, totalAmountP: number, farmerAmountP: number, courierAmountP: number, platformCommissionP: number) {
    const totalSplit = farmerAmountP + courierAmountP + platformCommissionP;

    if (totalSplit !== totalAmountP) {
      throw new Error('Payout split does not match total amount');
    }

    await this.ledger.recordTransaction(orderId, [
      { account: 'ESCROW_LIABILITY', debitP: totalAmountP },
      { account: 'FARMER_PAYABLE', creditP: farmerAmountP },
      { account: 'COURIER_PAYABLE', creditP: courierAmountP },
      { account: 'COMMISSION_REVENUE', creditP: platformCommissionP }
    ]);

    await this.audit.record('ESCROW_RELEASED', { orderId, farmerAmountP, courierAmountP, platformCommissionP });
  }
}
