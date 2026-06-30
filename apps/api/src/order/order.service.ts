import { PrismaClient, OrderStatus, Order } from '@prisma/client';

export type OrderEvent =
  | 'pay'
  | 'sellerConfirm'
  | 'buyerCancel'
  | 'pack'
  | 'ship'
  | 'deliver'
  | 'autoComplete'
  | 'openDispute';

export class OrderService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Enforces the strict server-side state machine for Orders.
   * Throws an error if the transition is invalid.
   */
  async transitionOrder(orderId: string, event: OrderEvent, actorId: string): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      // Lock the order row to prevent race conditions during transition
      const orderArr = await tx.$queryRaw<Order[]>`
        SELECT * FROM "Order" WHERE id = ${orderId} FOR UPDATE
      `;

      if (!orderArr || orderArr.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderArr[0];
      let nextStatus: OrderStatus;

      switch (order.status) {
        case 'PENDING_PAYMENT':
          if (event === 'pay') nextStatus = 'PAID_ESCROWED';
          else if (event === 'buyerCancel') nextStatus = 'CANCELLED';
          else throw new Error(`Invalid event ${event} for status ${order.status}`);
          break;

        case 'PAID_ESCROWED':
          if (event === 'sellerConfirm') nextStatus = 'CONFIRMED';
          else if (event === 'buyerCancel') nextStatus = 'CANCELLED';
          else throw new Error(`Invalid event ${event} for status ${order.status}`);
          break;

        case 'CONFIRMED':
          if (event === 'pack') nextStatus = 'PACKED';
          else if (event === 'buyerCancel') nextStatus = 'CANCELLED';
          else throw new Error(`Invalid event ${event} for status ${order.status}`);
          break;

        case 'PACKED':
          if (event === 'ship') nextStatus = 'SHIPPED';
          else throw new Error(`Invalid event ${event} for status ${order.status}`);
          break;

        case 'SHIPPED':
          if (event === 'deliver') nextStatus = 'DELIVERED';
          else throw new Error(`Invalid event ${event} for status ${order.status}`);
          break;

        case 'DELIVERED':
          if (event === 'autoComplete') nextStatus = 'COMPLETED';
          else if (event === 'openDispute') nextStatus = 'DISPUTED';
          else throw new Error(`Invalid event ${event} for status ${order.status}`);
          break;

        default:
          throw new Error(`Order cannot be transitioned from terminal state: ${order.status}`);
      }

      // Update the order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });

      // Write append-only AuditLog
      await tx.auditLog.create({
        data: {
          action: 'ORDER_STATE_CHANGE',
          payload: { orderId, from: order.status, to: nextStatus, event, actorId },
          prevHash: 'TODO_IMPLEMENT_CHAIN', // Phase 7
          currentHash: 'TODO_IMPLEMENT_CHAIN',
        }
      });

      return updatedOrder;
    });
  }
}
