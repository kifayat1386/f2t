import { PrismaClient, LedgerAccount, LedgerEntry } from '@prisma/client';

export interface TransactionEntry {
  account: LedgerAccount;
  debitP?: number;
  creditP?: number;
}

export class LedgerService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Records a double-entry transaction.
   * Throws an error if debits do not equal credits.
   */
  async recordTransaction(orderId: string, entries: TransactionEntry[]): Promise<LedgerEntry[]> {
    // 1. Validate Double-Entry Math
    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of entries) {
      if (entry.debitP && entry.debitP < 0) throw new Error('Debits must be positive');
      if (entry.creditP && entry.creditP < 0) throw new Error('Credits must be positive');

      totalDebit += entry.debitP || 0;
      totalCredit += entry.creditP || 0;
    }

    if (totalDebit !== totalCredit) {
      throw new Error(`Unbalanced transaction: Debits (${totalDebit}P) != Credits (${totalCredit}P)`);
    }

    if (totalDebit === 0) {
      throw new Error('Transaction must have non-zero value');
    }

    return this.prisma.$transaction(async (tx) => {
      const createdEntries: LedgerEntry[] = [];

      for (const entry of entries) {
        // Calculate new balance. For liabilities/revenue/equity: Credit increases, Debit decreases.
        // For assets/expenses: Debit increases, Credit decreases.
        // To simplify, we track absolute running balances per account.
        const lastEntry = await tx.ledgerEntry.findFirst({
          where: { account: entry.account },
          orderBy: { id: 'desc' }, // In a real app, use a proper sequence or timestamp
        });

        const prevBalance = lastEntry ? lastEntry.balanceP : 0;
        let newBalance = prevBalance;

        // General simplified rule for this schema:
        // Asset/Expense accounts increase with Debit
        if (entry.account === 'PLATFORM_CASH' || entry.account === 'SHIPPING_EXPENSE') {
          newBalance = prevBalance + (entry.debitP || 0) - (entry.creditP || 0);
        } else {
          // Liability/Revenue increase with Credit
          newBalance = prevBalance + (entry.creditP || 0) - (entry.debitP || 0);
        }

        const created = await tx.ledgerEntry.create({
          data: {
            orderId,
            account: entry.account,
            debitP: entry.debitP || 0,
            creditP: entry.creditP || 0,
            balanceP: newBalance,
          }
        });
        createdEntries.push(created);
      }

      return createdEntries;
    });
  }

  /**
   * Nightly reconciliation cron logic
   */
  async reconcile(): Promise<boolean> {
    const sums = await this.prisma.ledgerEntry.aggregate({
      _sum: {
        debitP: true,
        creditP: true
      }
    });

    return sums._sum.debitP === sums._sum.creditP;
  }
}
