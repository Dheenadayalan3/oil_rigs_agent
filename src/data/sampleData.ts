import { Pump, SensorData, PhysicsThresholds } from '../types';

export const pumps: Pump[] = [
  {
    id: 'PUMP-001',
    name: 'Primary Seawater Pump',
    location: 'Platform A - Deck 2',
    status: 'normal',
    efficiency: 94.2,
    operatingHours: 8760,
    lastMaintenance: '2024-01-15'
  },
  {
    id: 'PUMP-002',
    name: 'Cooling Water Pump',
    location: 'Platform A - Engine Room',
    status: 'normal',
    efficiency: 91.8,
    operatingHours: 7320,
    lastMaintenance: '2024-02-01'
  },
  {
    id: 'PUMP-003',
    name: 'Fire Water Pump',
    location: 'Platform B - Safety Deck',
    status: 'warning',
    efficiency: 87.5,
    operatingHours: 12450,
    lastMaintenance: '2023-11-20'
  },
  {
    id: 'PUMP-004',
    name: 'Ballast Water Pump',
    location: 'Platform B - Lower Deck',
    status: 'critical',
    efficiency: 78.3,
    operatingHours: 15680,
    lastMaintenance: '2023-09-10'
  }
];

export const physicsThresholds: Record<string, PhysicsThresholds> = {
  'PUMP-001': {
    vibration: { min: 0, max: 4.5 },
    temperature: { min: 20, max: 75 },
    pressure: { min: 2.8, max: 3.2 },
    flowRate: { min: 180, max: 220 },
    current: { min: 8, max: 12 },
    voltage: { min: 440, max: 480 }
  },
  'PUMP-002': {
    vibration: { min: 0, max: 4.0 },
    temperature: { min: 20, max: 70 },
    pressure: { min: 2.5, max: 2.9 },
    flowRate: { min: 150, max: 190 },
    current: { min: 6, max: 10 },
    voltage: { min: 440, max: 480 }
  },
  'PUMP-003': {
    vibration: { min: 0, max: 5.0 },
    temperature: { min: 20, max: 80 },
    pressure: { min: 3.0, max: 3.5 },
    flowRate: { min: 200, max: 250 },
    current: { min: 10, max: 15 },
    voltage: { min: 440, max: 480 }
  },
  'PUMP-004': {
    vibration: { min: 0, max: 4.2 },
    temperature: { min: 20, max: 72 },
    pressure: { min: 2.2, max: 2.8 },
    flowRate: { min: 160, max: 200 },
    current: { min: 7, max: 11 },
    voltage: { min: 440, max: 480 }
  }
};

export const generateSensorData = (pumpId: string): SensorData => {
  const baseValues = {
    'PUMP-001': { vibration: 2.1, temperature: 45, pressure: 3.0, flowRate: 200, current: 10, voltage: 460 },
    'PUMP-002': { vibration: 1.8, temperature: 42, pressure: 2.7, flowRate: 170, current: 8, voltage: 465 },
    'PUMP-003': { vibration: 3.2, temperature: 58, pressure: 3.2, flowRate: 225, current: 12, voltage: 455 },
    'PUMP-004': { vibration: 5.8, temperature: 82, pressure: 2.1, flowRate: 145, current: 13.5, voltage: 435 }
  };

  const base = baseValues[pumpId as keyof typeof baseValues];
  const noise = () => (Math.random() - 0.5) * 0.2;

  return {
    timestamp: Date.now(),
    pumpId,
    vibration: Math.max(0, base.vibration + noise()),
    temperature: Math.max(0, base.temperature + noise() * 5),
    pressure: Math.max(0, base.pressure + noise() * 0.1),
    flowRate: Math.max(0, base.flowRate + noise() * 10),
    current: Math.max(0, base.current + noise() * 0.5),
    voltage: Math.max(0, base.voltage + noise() * 5)
  };
};