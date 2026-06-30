import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

export class StreamingService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Initializes a new live stream session.
   * In production (P14), this will call Mux API. Here we mock it.
   */
  async createStream(farmId: string): Promise<{ streamId: string; streamKey: string; hlsUrl: string }> {
    const streamKey = crypto.randomBytes(16).toString('hex');
    const mockHlsUrl = `https://mock.stream.local/live/${farmId}/index.m3u8`;

    const stream = await this.prisma.liveStream.create({
      data: {
        farmId,
        hlsUrl: mockHlsUrl,
        status: 'ACTIVE'
      }
    });

    return {
      streamId: stream.id,
      streamKey,
      hlsUrl: mockHlsUrl,
    };
  }

  /**
   * Ends an active live stream.
   */
  async endStream(streamId: string): Promise<void> {
    await this.prisma.liveStream.update({
      where: { id: streamId },
      data: { status: 'ARCHIVED' }
    });
  }

  /**
   * Provides a fallback local looping .mp4 for development testing
   */
  getMockPlayerUrl(): string {
    return 'http://localhost:3000/mock-farm-loop.mp4';
  }
}
