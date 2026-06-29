import { PrismaClient } from '@prisma/client';

export class MapService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Retrieves verified farms as a GeoJSON FeatureCollection.
   * Leverages PostGIS ST_AsGeoJSON to parse the point geometry.
   */
  async getInteractiveMapGeoJSON() {
    const farms = await this.prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        ownerName: string;
        geojson: string;
      }>
    >`
      SELECT
        id,
        name,
        "ownerName",
        ST_AsGeoJSON(location) as geojson
      FROM "Farm"
      WHERE "isVerified" = true AND location IS NOT NULL
    `;

    return {
      type: 'FeatureCollection',
      features: farms.map((farm) => ({
        type: 'Feature',
        geometry: JSON.parse(farm.geojson),
        properties: {
          id: farm.id,
          name: farm.name,
          ownerName: farm.ownerName,
        },
      })),
    };
  }
}
