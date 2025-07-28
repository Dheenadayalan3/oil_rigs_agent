import { SensorData, PhysicsThresholds, Anomaly } from '../types';
import { physicsThresholds } from '../data/sampleData';

export class PhysicsChecker {
  checkThresholds(data: SensorData): Anomaly[] {
    const thresholds = physicsThresholds[data.pumpId];
    const anomalies: Anomaly[] = [];

    // Check each parameter against thresholds
    const checks = [
      { param: 'vibration', value: data.vibration, unit: 'mm/s' },
      { param: 'temperature', value: data.temperature, unit: '°C' },
      { param: 'pressure', value: data.pressure, unit: 'bar' },
      { param: 'flowRate', value: data.flowRate, unit: 'L/min' },
      { param: 'current', value: data.current, unit: 'A' },
      { param: 'voltage', value: data.voltage, unit: 'V' }
    ];

    checks.forEach(check => {
      const threshold = thresholds[check.param as keyof PhysicsThresholds];
      if (check.value < threshold.min || check.value > threshold.max) {
        const severity = this.calculateSeverity(check.value, threshold);
        const anomaly: Anomaly = {
          id: `${data.pumpId}-${check.param}-${Date.now()}`,
          pumpId: data.pumpId,
          timestamp: data.timestamp,
          type: `${check.param}_threshold`,
          severity,
          confidence: 0.95,
          description: `${check.param} reading of ${check.value.toFixed(2)} ${check.unit} is ${check.value > threshold.max ? 'above' : 'below'} safe operating range (${threshold.min}-${threshold.max} ${check.unit})`,
          recommendation: this.getRecommendation(check.param, severity),
          parameters: [check.param]
        };
        anomalies.push(anomaly);
      }
    });

    return anomalies;
  }

  private calculateSeverity(value: number, threshold: { min: number; max: number }): 'low' | 'medium' | 'high' | 'critical' {
    const range = threshold.max - threshold.min;
    const deviation = Math.max(
      Math.abs(value - threshold.max) / range,
      Math.abs(value - threshold.min) / range
    );

    if (deviation > 0.5) return 'critical';
    if (deviation > 0.3) return 'high';
    if (deviation > 0.1) return 'medium';
    return 'low';
  }

  private getRecommendation(parameter: string, severity: string): string {
    const recommendations = {
      vibration: {
        low: 'Monitor vibration levels closely',
        medium: 'Check bearing alignment and lubrication',
        high: 'Inspect bearings and coupling immediately',
        critical: 'Stop pump and perform emergency maintenance'
      },
      temperature: {
        low: 'Verify cooling system operation',
        medium: 'Check coolant flow and heat exchanger',
        high: 'Reduce load and inspect cooling system',
        critical: 'Emergency shutdown - overheating detected'
      },
      pressure: {
        low: 'Check for leaks and blockages',
        medium: 'Inspect impeller and suction line',
        high: 'Verify system pressure requirements',
        critical: 'Immediate inspection required - pressure critical'
      },
      flowRate: {
        low: 'Check for blockages or cavitation',
        medium: 'Inspect impeller wear and clearances',
        high: 'Verify pump sizing and system requirements',
        critical: 'Flow rate critical - check for major blockage'
      },
      current: {
        low: 'Monitor electrical connections',
        medium: 'Check motor load and efficiency',
        high: 'Inspect motor and electrical system',
        critical: 'Electrical fault detected - immediate attention required'
      },
      voltage: {
        low: 'Check power supply stability',
        medium: 'Verify electrical connections',
        high: 'Inspect power distribution system',
        critical: 'Power supply fault - emergency electrical check'
      }
    };

    return recommendations[parameter as keyof typeof recommendations]?.[severity as keyof typeof recommendations.vibration] || 'Investigate anomaly';
  }
}