import { PrismaClient, CommunityDrop } from '@prisma/client';

export class DropService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Race-safe join logic using SELECT FOR UPDATE.
   * Ensures atomic increment of currentQuantity and auto-activates if target is met.
   */
  async joinDrop(dropId: string, quantityToAdd: number, userId: string): Promise<CommunityDrop> {
    if (quantityToAdd <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Lock the drop row
      const dropArr = await tx.$queryRaw<CommunityDrop[]>`
        SELECT * FROM "CommunityDrop" WHERE id = ${dropId} FOR UPDATE
      `;

      if (!dropArr || dropArr.length === 0) {
        throw new Error('Community drop not found');
      }

      const drop = dropArr[0];

      if (drop.status !== 'PENDING') {
        throw new Error(`Cannot join drop. Current status is ${drop.status}`);
      }

      if (new Date() > drop.expiresAt) {
        // Automatically cancel it if expired during check
        await tx.communityDrop.update({
          where: { id: drop.id },
          data: { status: 'CANCELLED' }
        });
        throw new Error('Community drop has expired');
      }

      // 2. Increment quantity safely within lock
      const newQuantity = drop.currentQuantity + quantityToAdd;

      // 3. Check for threshold activation
      const nextStatus = newQuantity >= drop.targetQuantity ? 'ACTIVATED' : 'PENDING';

      const updatedDrop = await tx.communityDrop.update({
        where: { id: dropId },
        data: {
          currentQuantity: newQuantity,
          status: nextStatus,
        },
      });

      // 4. (Side Effect) Create user's Order tied to this drop
      // In a full implementation, we'd create the Order record here in PENDING_PAYMENT
      // await tx.order.create({ ... });

      return updatedDrop;
    });
  }
}
