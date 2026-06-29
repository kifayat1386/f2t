import { PrismaClient, Product } from '@prisma/client';

export class CatalogService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Search active products using PostgreSQL full-text search.
   * Searches across nameEn and nameBn.
   */
  async searchProducts(query: string) {
    if (!query) {
      return this.prisma.product.findMany({
        where: { status: 'ACTIVE' },
        include: { variants: true, farm: true },
        take: 50,
      });
    }

    // Convert spaces to & for PostgreSQL tsquery
    const formattedQuery = query.trim().split(/\s+/).join(' & ');

    // We use a raw query here to leverage the to_tsvector logic for both languages.
    // In a production environment with millions of rows, we would add a GIN index on these columns.
    const products = await this.prisma.$queryRaw<Product[]>`
      SELECT p.*
      FROM "Product" p
      WHERE p."status" = 'ACTIVE'
        AND (
          to_tsvector('english', p."nameEn") @@ to_tsquery('english', ${formattedQuery})
          OR
          to_tsvector('simple', p."nameBn") @@ to_tsquery('simple', ${formattedQuery})
        )
      LIMIT 50
    `;

    // Because $queryRaw doesn't auto-fetch relations, we fetch variants in a secondary query
    // if this is just a quick catalog view.
    const productIds = products.map(p => p.id);

    if (productIds.length === 0) return [];

    const fullyLoaded = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true, farm: true }
    });

    return fullyLoaded;
  }
}
