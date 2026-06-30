import { describe, it, expect } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DropService } from './drop.service';

describe('DropService', () => {
  it('should auto-activate drop when target quantity is met', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new DropService(prisma);

    // Drop needs 100, currently has 80
    prisma.$queryRaw.mockResolvedValue([
      {
        id: 'drop_1',
        status: 'PENDING',
        currentQuantity: 80,
        targetQuantity: 100,
        expiresAt: new Date(Date.now() + 100000) // future
      }
    ] as any);

    prisma.communityDrop.update.mockResolvedValue({
      id: 'drop_1',
      status: 'ACTIVATED',
      currentQuantity: 105
    } as any);

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    // Add 25, brings total to 105 (>= 100)
    const result = await service.joinDrop('drop_1', 25, 'user_1');

    expect(prisma.communityDrop.update).toHaveBeenCalledWith({
      where: { id: 'drop_1' },
      data: {
        currentQuantity: 105,
        status: 'ACTIVATED' // Expecting auto-activation
      }
    });

    expect(result.status).toBe('ACTIVATED');
  });

  it('should throw error if drop is already expired', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new DropService(prisma);

    prisma.$queryRaw.mockResolvedValue([
      {
        id: 'drop_1',
        status: 'PENDING',
        currentQuantity: 80,
        targetQuantity: 100,
        expiresAt: new Date(Date.now() - 100000) // Past date
      }
    ] as any);

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    await expect(service.joinDrop('drop_1', 10, 'user_1'))
      .rejects.toThrow('Community drop has expired');
  });
});
