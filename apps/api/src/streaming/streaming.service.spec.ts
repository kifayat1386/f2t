import { describe, it, expect } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { StreamingService } from './streaming.service';

describe('StreamingService', () => {
  it('should initialize a mock stream session', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new StreamingService(prisma);

    prisma.liveStream.create.mockResolvedValue({
      id: 'stream_1',
      farmId: 'farm_1',
      hlsUrl: 'https://mock.stream.local/live/farm_1/index.m3u8',
      status: 'ACTIVE'
    });

    const result = await service.createStream('farm_1');

    expect(result.streamId).toBe('stream_1');
    expect(result.hlsUrl).toContain('farm_1/index.m3u8');
    expect(result.streamKey).toBeDefined();

    expect(prisma.liveStream.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          farmId: 'farm_1',
          hlsUrl: result.hlsUrl,
          status: 'ACTIVE'
        }
      })
    );
  });

  it('should transition stream to archived when ended', async () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new StreamingService(prisma);

    await service.endStream('stream_1');

    expect(prisma.liveStream.update).toHaveBeenCalledWith({
      where: { id: 'stream_1' },
      data: { status: 'ARCHIVED' }
    });
  });

  it('should provide local fallback mock player', () => {
    const prisma = mockDeep<PrismaClient>();
    const service = new StreamingService(prisma);

    expect(service.getMockPlayerUrl()).toBe('http://localhost:3000/mock-farm-loop.mp4');
  });
});
