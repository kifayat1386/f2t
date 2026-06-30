import { describe, it, expect, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { LogisticsService } from './logistics.service';

describe('LogisticsService', () => {
  it('should create a shipment with correctly calculated carbon impact', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new LogisticsService(prisma);

    // Dhaka to Tangail roughly 90km straight line
    const origin = { lat: 23.8103, lng: 90.4125 };
    const dest = { lat: 24.2498, lng: 89.9166 };

    prisma.shipment.create.mockResolvedValue({
      id: 'ship_1',
      orderId: 'order_1',
      type: 'COLD_CHAIN',
      status: 'CREATED',
      courier: 'PENDING_ASSIGNMENT',
      riderId: null,
      originBatchId: null,
      carbonImpactCo2e: 15638, // rough expectation
      routeData: {}
    });

    const result = await service.createShipment('order_1', 'COLD_CHAIN', origin, dest);

    // 1. Verify Prisma was called
    expect(prisma.shipment.create).toHaveBeenCalled();

    // 2. Verify math inside the passed object
    const createCallData: any = prisma.shipment.create.mock.calls[0][0].data;

    // Distance should be ~69km. COLD_CHAIN = 69 * 150 * 1.5 ~= 15525g CO2
    expect(createCallData.carbonImpactCo2e).toBeGreaterThan(15000);
    expect(createCallData.carbonImpactCo2e).toBeLessThan(16000);
  });

  it('should assign a courier', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new LogisticsService(prisma);

    await service.assignCourier('ship_1', 'rider_1');

    expect(prisma.shipment.update).toHaveBeenCalledWith({
      where: { id: 'ship_1' },
      data: {
        riderId: 'rider_1',
        courier: 'KHAMAR_LOGISTICS',
        status: 'PICKED_UP'
      }
    });
  });

  it('should capture POD and update order carbon footprint', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new LogisticsService(prisma);

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(prisma as any);
    });

    prisma.shipment.update.mockResolvedValue({
      id: 'ship_1',
      orderId: 'order_1',
      carbonImpactCo2e: 5000
    } as any);

    await service.capturePOD('ship_1', 'https://s3.local/proof.jpg');

    expect(prisma.shipment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'ship_1' },
        data: expect.objectContaining({ status: 'DELIVERED' })
      })
    );

    // Verify order was updated with carbon offset
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order_1' },
      data: { carbonGrams: 5000 }
    });
  });
});
