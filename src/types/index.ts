export interface SensorData {
  timestamp: number;
  pumpId: string;
  vibration: number;
  temperature: number;
  pressure: number;
  flowRate: number;
  current: number;
  voltage: number;
}

export interface Pump {
  id: string;
  name: string;
  location: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  efficiency: number;
  operatingHours: number;
  lastMaintenance: string;
}

export interface Anomaly {
  id: string;
  pumpId: string;
  timestamp: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  recommendation: string;
  parameters: string[];
}

export interface AgentState {
  step: 'collecting' | 'physics' | 'ml' | 'reporting' | 'complete';
  progress: number;
  currentAgent: string;
  message: string;
}

export interface PhysicsThresholds {
  vibration: { min: number; max: number };
  temperature: { min: number; max: number };
  pressure: { min: number; max: number };
  flowRate: { min: number; max: number };
  current: { min: number; max: number };
  voltage: { min: number; max: number };
}