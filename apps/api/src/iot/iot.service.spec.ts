import { describe, it, expect, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { IotService, TelemetryData } from './iot.service';

describe('IotService', () => {
  it('should store incoming telemetry and notify subscribers', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new IotService(prisma);

    const mockCallback = vi.fn();
    service.subscribeToTelemetry('farm_1', mockCallback);

    const data: TelemetryData = {
      sensorType: 'Temp',
      value: 5.5,
      timestamp: new Date()
    };

    await service.handleIncomingTelemetry('farm_1', data);

    // Assert DB persistence
    expect(prisma.ioTSensorLog.create).toHaveBeenCalledWith({
      data: {
        farmId: 'farm_1',
        sensorType: 'Temp',
        value: 5.5,
        timestamp: data.timestamp
      }
    });

    // Assert WebSocket push logic
    expect(mockCallback).toHaveBeenCalledWith(data);
  });

  it('should evaluate thresholds (mock print for now)', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new IotService(prisma);

    const consoleSpy = vi.spyOn(console, 'warn');

    const data: TelemetryData = {
      sensorType: 'Temp',
      value: 10.5, // > 8.0, should breach
      timestamp: new Date()
    };

    await service.handleIncomingTelemetry('farm_1', data);

    expect(consoleSpy).toHaveBeenCalledWith('[ALERT] Cold chain threshold breached for farm farm_1: 10.5°C');
  });
});
