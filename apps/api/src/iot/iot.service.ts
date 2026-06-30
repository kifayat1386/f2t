import { PrismaClient } from '@prisma/client';
import mqtt from 'mqtt';

export interface TelemetryData {
  sensorType: 'pH' | 'Temp' | 'Moisture';
  value: number;
  timestamp: Date;
}

export class IotService {
  private client: mqtt.MqttClient | null = null;
  private subscribers = new Map<string, Array<(data: TelemetryData) => void>>();

  constructor(private readonly prisma: PrismaClient) {
    if (process.env.IOT !== 'mock' && process.env.MQTT_URL) {
      this.client = mqtt.connect(process.env.MQTT_URL);

      this.client.on('message', (topic, message) => {
        const parts = topic.split('/');
        if (parts.length === 3 && parts[0] === 'farm') {
          const farmId = parts[1];
          try {
            const data: TelemetryData = JSON.parse(message.toString());
            this.handleIncomingTelemetry(farmId, data);
          } catch (e) {
            console.error('Invalid telemetry payload', e);
          }
        }
      });
    }
  }

  /**
   * Process incoming telemetry, check for alerts, and store it.
   */
  async handleIncomingTelemetry(farmId: string, data: TelemetryData) {
    // 1. Store in DB
    await this.prisma.ioTSensorLog.create({
      data: {
        farmId,
        sensorType: data.sensorType,
        value: data.value,
        timestamp: data.timestamp
      }
    });

    // 2. Alert threshold checking
    this.checkThresholds(farmId, data);

    // 3. Notify subscribers (WebSockets)
    const callbacks = this.subscribers.get(farmId) || [];
    callbacks.forEach(cb => cb(data));
  }

  private checkThresholds(farmId: string, data: TelemetryData) {
    // Basic threshold rules, could be dynamically fetched from the DB Hub model
    if (data.sensorType === 'Temp' && data.value > 8.0) {
      console.warn(`[ALERT] Cold chain threshold breached for farm ${farmId}: ${data.value}°C`);
      // Pushes to admin queue via BullMQ in real app
    }
  }

  /**
   * Used by WebSocket gateway to forward data to connected clients watching the live stream.
   */
  subscribeToTelemetry(farmId: string, callback: (data: TelemetryData) => void) {
    if (this.client) {
      this.client.subscribe(`farm/${farmId}/telemetry`);
    }

    const callbacks = this.subscribers.get(farmId) || [];
    callbacks.push(callback);
    this.subscribers.set(farmId, callbacks);
  }

  /**
   * Used in 'mock' mode to simulate hardware IoT sensor data arriving every 3 seconds.
   */
  mockTelemetryData(farmId: string) {
    setInterval(() => {
      const mockData: TelemetryData = {
        sensorType: 'Temp',
        value: 4.0 + (Math.random() * 2), // 4 - 6 C
        timestamp: new Date()
      };

      this.handleIncomingTelemetry(farmId, mockData);
    }, 3000);
  }
}
