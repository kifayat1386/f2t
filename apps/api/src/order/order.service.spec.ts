import { describe, it, expect } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { OrderService } from './order.service';

describe('OrderService', () => {
  it('should transition PENDING_PAYMENT to PAID_ESCROWED on "pay" event', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new OrderService(prisma);

    // Mock the raw SQL lock query
    prisma.$queryRaw.mockResolvedValue([
      { id: 'order_1', status: 'PENDING_PAYMENT' }
    ] as any);

    // Mock the update return
    prisma.order.update.mockResolvedValue({
      id: 'order_1',
      status: 'PAID_ESCROWED'
    } as any);

    // Mock transaction to just execute the callback
    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    const result = await service.transitionOrder('order_1', 'pay', 'user_1');

    expect(result.status).toBe('PAID_ESCROWED');
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order_1' },
      data: { status: 'PAID_ESCROWED' }
    });
    // Ensure audit log is created
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it('should throw error on invalid transition', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new OrderService(prisma);

    prisma.$queryRaw.mockResolvedValue([
      { id: 'order_1', status: 'SHIPPED' } // SHIPPED -> pack is invalid
    ] as any);

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    await expect(service.transitionOrder('order_1', 'pack', 'user_1'))
      .rejects.toThrow('Invalid event pack for status SHIPPED');
  });
});
