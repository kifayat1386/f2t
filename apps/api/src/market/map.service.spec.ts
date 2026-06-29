import { describe, it, expect, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { MapService } from './map.service';

describe('MapService', () => {
  it('should format database records into a valid GeoJSON FeatureCollection', async () => {
    // Create a deeply mocked Prisma client
    const prismaMock = mockDeep<PrismaClient>();
    const service = new MapService(prismaMock);

    // Mock the raw SQL response representing a PostGIS ST_AsGeoJSON output
    const mockFarmData = [
      {
        id: 'farm_1',
        name: 'Bogra Premium Rice',
        ownerName: 'Rahim Ali',
        geojson: '{"type":"Point","coordinates":[89.3789,24.8481]}',
      },
    ];

    prismaMock.$queryRaw.mockResolvedValue(mockFarmData as any);

    const geoJSON = await service.getInteractiveMapGeoJSON();

    expect(geoJSON.type).toBe('FeatureCollection');
    expect(geoJSON.features.length).toBe(1);
    expect(geoJSON.features[0].type).toBe('Feature');

    // Check Geometry
    expect(geoJSON.features[0].geometry.type).toBe('Point');
    expect(geoJSON.features[0].geometry.coordinates).toEqual([89.3789, 24.8481]);

    // Check Properties
    expect(geoJSON.features[0].properties.id).toBe('farm_1');
    expect(geoJSON.features[0].properties.name).toBe('Bogra Premium Rice');
  });

  it('should handle empty farm lists gracefully', async () => {
    const prismaMock = mockDeep<PrismaClient>();
    const service = new MapService(prismaMock);

    prismaMock.$queryRaw.mockResolvedValue([]);

    const geoJSON = await service.getInteractiveMapGeoJSON();

    expect(geoJSON.type).toBe('FeatureCollection');
    expect(geoJSON.features.length).toBe(0);
  });
});
