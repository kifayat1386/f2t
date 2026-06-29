import { describe, it, expect, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  it('should return all active products when no search query is provided', async () => {
    const prismaMock = mockDeep<PrismaClient>();
    const service = new CatalogService(prismaMock);

    // Mock standard findMany
    const mockProducts = [{ id: 'prod_1', nameEn: 'Rice' }];
    prismaMock.product.findMany.mockResolvedValue(mockProducts as any);

    const result = await service.searchProducts('');

    expect(prismaMock.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'ACTIVE' },
        include: { variants: true, farm: true }
      })
    );
    expect(result).toEqual(mockProducts);
  });

  it('should use raw tsvector query when search text is provided', async () => {
    const prismaMock = mockDeep<PrismaClient>();
    const service = new CatalogService(prismaMock);

    // 1. Mock the $queryRaw response
    const rawResult = [{ id: 'prod_1' }];
    prismaMock.$queryRaw.mockResolvedValue(rawResult as any);

    // 2. Mock the secondary findMany response
    const fullyLoadedResult = [{ id: 'prod_1', variants: [] }];
    prismaMock.product.findMany.mockResolvedValue(fullyLoadedResult as any);

    const result = await service.searchProducts('rice');

    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    expect(prismaMock.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: ['prod_1'] } }
      })
    );
    expect(result).toEqual(fullyLoadedResult);
  });

  it('should return empty array if raw tsvector query finds nothing', async () => {
    const prismaMock = mockDeep<PrismaClient>();
    const service = new CatalogService(prismaMock);

    // Return empty array from raw query
    prismaMock.$queryRaw.mockResolvedValue([] as any);

    const result = await service.searchProducts('non_existent_item');

    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    // findMany should NOT be called if raw query returns empty
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
