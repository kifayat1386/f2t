import { PrismaClient, Shipment, ShipmentStatus, ShipmentType } from '@prisma/client';

export class LogisticsService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Mocks a call to Mapbox Directions API to get distance in kilometers.
   */
  private async calculateDistance(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<number> {
    // In production: await fetch('https://api.mapbox.com/directions/v5/...');
    // Simplified Haversine formula for mock
    const R = 6371; // km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  }

  /**
   * Calculates CO2e impact based on distance and shipment type.
   * Assumes ~150g CO2 per km for a standard delivery van.
   */
  private calculateCarbonImpact(distanceKm: number, type: ShipmentType): number {
    const baseEmissionPerKm = 150;
    let multiplier = 1.0;

    if (type === 'COLD_CHAIN') multiplier = 1.5; // Refrigeration adds footprint

    return Math.round(distanceKm * baseEmissionPerKm * multiplier);
  }

  /**
   * Creates a new shipment and automatically calculates route data and carbon impact.
   */
  async createShipment(
    orderId: string,
    type: ShipmentType,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<Shipment> {
    const distanceKm = await this.calculateDistance(origin, destination);
    const carbonImpactCo2e = this.calculateCarbonImpact(distanceKm, type);

    // Mock Route Data
    const routeData = {
      distanceKm,
      estimatedMinutes: Math.round(distanceKm * 2), // Rough estimate: 2 mins per km in traffic
      waypoints: [origin, destination]
    };

    return this.prisma.shipment.create({
      data: {
        orderId,
        type,
        status: 'CREATED',
        courier: 'PENDING_ASSIGNMENT',
        routeData,
        carbonImpactCo2e,
      }
    });
  }

  /**
   * Assigns a specific rider to the shipment.
   */
  async assignCourier(shipmentId: string, riderId: string, courierCompany: string = 'KHAMAR_LOGISTICS'): Promise<Shipment> {
    return this.prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        riderId,
        courier: courierCompany,
        status: 'PICKED_UP'
      }
    });
  }

  /**
   * Captures Proof of Delivery (POD) and marks shipment as DELIVERED.
   * Also updates the parent Order carbon impact for the user's portfolio.
   */
  async capturePOD(shipmentId: string, proofUrl: string): Promise<Shipment> {
    return this.prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          status: 'DELIVERED',
          routeData: { // Append POD to existing json
            proofUrl,
            deliveredAt: new Date().toISOString()
          }
        }
      });

      // Credit the carbon impact to the order
      if (shipment.carbonImpactCo2e) {
        await tx.order.update({
          where: { id: shipment.orderId },
          data: { carbonGrams: shipment.carbonImpactCo2e }
        });
      }

      return shipment;
    });
  }
}
