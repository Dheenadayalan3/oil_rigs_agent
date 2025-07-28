import { SensorData, Anomaly } from '../types';

export class MLModel {
  private historicalData: Map<string, SensorData[]> = new Map();

  addData(data: SensorData) {
    if (!this.historicalData.has(data.pumpId)) {
      this.historicalData.set(data.pumpId, []);
    }
    
    const history = this.historicalData.get(data.pumpId)!;
    history.push(data);
    
    // Keep only last 100 readings for performance
    if (history.length > 100) {
      history.shift();
    }
  }

  detectAnomalies(data: SensorData): Anomaly[] {
    const history = this.historicalData.get(data.pumpId) || [];
    if (history.length < 10) return []; // Need minimum history

    const anomalies: Anomaly[] = [];

    // Statistical anomaly detection using z-score
    const parameters = ['vibration', 'temperature', 'pressure', 'flowRate', 'current', 'voltage'] as const;
    
    parameters.forEach(param => {
      const values = history.map(d => d[param]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      
      const zScore = Math.abs((data[param] - mean) / std);
      
      if (zScore > 2.5) { // Anomaly threshold
        const confidence = Math.min(0.99, zScore / 4); // Convert z-score to confidence
        const severity = this.calculateMLSeverity(zScore);
        
        anomalies.push({
          id: `ml-${data.pumpId}-${param}-${Date.now()}`,
          pumpId: data.pumpId,
          timestamp: data.timestamp,
          type: `ml_anomaly_${param}`,
          severity,
          confidence,
          description: `ML model detected anomalous ${param} pattern (z-score: ${zScore.toFixed(2)})`,
          recommendation: this.getMLRecommendation(param, severity, zScore),
          parameters: [param]
        });
      }
    });

    // Pattern-based anomaly detection
    const patternAnomalies = this.detectPatterns(data, history);
    anomalies.push(...patternAnomalies);

    return anomalies;
  }

  private detectPatterns(current: SensorData, history: SensorData[]): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Bearing degradation pattern (high vibration + high temperature)
    if (current.vibration > 4.0 && current.temperature > 70) {
      anomalies.push({
        id: `pattern-bearing-${current.pumpId}-${Date.now()}`,
        pumpId: current.pumpId,
        timestamp: current.timestamp,
        type: 'bearing_degradation',
        severity: 'high',
        confidence: 0.87,
        description: 'ML pattern analysis indicates potential bearing degradation',
        recommendation: 'Schedule bearing inspection and replacement within 48 hours',
        parameters: ['vibration', 'temperature']
      });
    }

    // Impeller wear pattern (low pressure + low flow rate)
    if (current.pressure < 2.5 && current.flowRate < 160) {
      anomalies.push({
        id: `pattern-impeller-${current.pumpId}-${Date.now()}`,
        pumpId: current.pumpId,
        timestamp: current.timestamp,
        type: 'impeller_wear',
        severity: 'medium',
        confidence: 0.82,
        description: 'ML pattern suggests impeller wear or blockage',
        recommendation: 'Inspect impeller condition and clear any blockages',
        parameters: ['pressure', 'flowRate']
      });
    }

    // Electrical issues pattern (high current + low voltage)
    if (current.current > 12 && current.voltage < 450) {
      anomalies.push({
        id: `pattern-electrical-${current.pumpId}-${Date.now()}`,
        pumpId: current.pumpId,
        timestamp: current.timestamp,
        type: 'electrical_fault',
        severity: 'critical',
        confidence: 0.91,
        description: 'ML analysis detects electrical system anomaly',
        recommendation: 'Immediate electrical system inspection required',
        parameters: ['current', 'voltage']
      });
    }

    return anomalies;
  }

  private calculateMLSeverity(zScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (zScore > 4) return 'critical';
    if (zScore > 3.5) return 'high';
    if (zScore > 3) return 'medium';
    return 'low';
  }

  private getMLRecommendation(parameter: string, severity: string, zScore: number): string {
    const timeToFailure = Math.max(1, Math.round(30 / zScore)); // Rough estimate in days
    
    return `ML prediction: ${parameter} anomaly detected. Estimated time to potential failure: ${timeToFailure} days. ${severity === 'critical' ? 'Immediate action required.' : 'Schedule maintenance accordingly.'}`;
  }

  predictFailure(pumpId: string): { probability: number; timeToFailure: number } {
    const history = this.historicalData.get(pumpId) || [];
    if (history.length < 20) return { probability: 0, timeToFailure: 365 };

    // Simple failure prediction based on trend analysis
    const recent = history.slice(-10);
    const older = history.slice(-20, -10);

    const recentAvg = {
      vibration: recent.reduce((a, b) => a + b.vibration, 0) / recent.length,
      temperature: recent.reduce((a, b) => a + b.temperature, 0) / recent.length
    };

    const olderAvg = {
      vibration: older.reduce((a, b) => a + b.vibration, 0) / older.length,
      temperature: older.reduce((a, b) => a + b.temperature, 0) / older.length
    };

    const vibrationTrend = (recentAvg.vibration - olderAvg.vibration) / olderAvg.vibration;
    const temperatureTrend = (recentAvg.temperature - olderAvg.temperature) / olderAvg.temperature;

    const failureProbability = Math.min(0.95, Math.max(0, (vibrationTrend + temperatureTrend) * 10));
    const timeToFailure = Math.max(1, Math.round(365 * (1 - failureProbability)));

    return { probability: failureProbability, timeToFailure };
  }
}