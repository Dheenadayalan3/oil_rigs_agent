import { Anomaly, SensorData, Pump } from '../types';

export class Reporter {
  generateReport(anomalies: Anomaly[], sensorData: SensorData, pump: Pump): string {
    if (anomalies.length === 0) {
      return this.generateNormalReport(sensorData, pump);
    }

    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
    const highAnomalies = anomalies.filter(a => a.severity === 'high');
    const mediumAnomalies = anomalies.filter(a => a.severity === 'medium');
    const lowAnomalies = anomalies.filter(a => a.severity === 'low');

    let report = `🚨 ANOMALY REPORT - ${pump.name}\n`;
    report += `Location: ${pump.location}\n`;
    report += `Timestamp: ${new Date(sensorData.timestamp).toLocaleString()}\n\n`;

    if (criticalAnomalies.length > 0) {
      report += `⚠️ CRITICAL ALERTS (${criticalAnomalies.length}):\n`;
      criticalAnomalies.forEach(anomaly => {
        report += `• ${anomaly.description}\n`;
        report += `  Action: ${anomaly.recommendation}\n\n`;
      });
    }

    if (highAnomalies.length > 0) {
      report += `🔴 HIGH PRIORITY (${highAnomalies.length}):\n`;
      highAnomalies.forEach(anomaly => {
        report += `• ${anomaly.description}\n`;
        report += `  Recommendation: ${anomaly.recommendation}\n\n`;
      });
    }

    if (mediumAnomalies.length > 0) {
      report += `🟡 MEDIUM PRIORITY (${mediumAnomalies.length}):\n`;
      mediumAnomalies.forEach(anomaly => {
        report += `• ${anomaly.description}\n`;
      });
      report += '\n';
    }

    if (lowAnomalies.length > 0) {
      report += `🟢 LOW PRIORITY (${lowAnomalies.length}):\n`;
      lowAnomalies.forEach(anomaly => {
        report += `• ${anomaly.description}\n`;
      });
      report += '\n';
    }

    // Add current sensor readings
    report += `📊 CURRENT READINGS:\n`;
    report += `• Vibration: ${sensorData.vibration.toFixed(2)} mm/s\n`;
    report += `• Temperature: ${sensorData.temperature.toFixed(1)}°C\n`;
    report += `• Pressure: ${sensorData.pressure.toFixed(2)} bar\n`;
    report += `• Flow Rate: ${sensorData.flowRate.toFixed(1)} L/min\n`;
    report += `• Current: ${sensorData.current.toFixed(1)} A\n`;
    report += `• Voltage: ${sensorData.voltage.toFixed(1)} V\n\n`;

    // Add maintenance insights
    report += this.generateMaintenanceInsights(anomalies, pump);

    return report;
  }

  private generateNormalReport(sensorData: SensorData, pump: Pump): string {
    let report = `✅ NORMAL OPERATION - ${pump.name}\n`;
    report += `Location: ${pump.location}\n`;
    report += `Timestamp: ${new Date(sensorData.timestamp).toLocaleString()}\n\n`;

    report += `All parameters within normal operating ranges.\n`;
    report += `Pump efficiency: ${pump.efficiency}%\n`;
    report += `Operating hours: ${pump.operatingHours.toLocaleString()}\n\n`;

    report += `📊 CURRENT READINGS:\n`;
    report += `• Vibration: ${sensorData.vibration.toFixed(2)} mm/s ✓\n`;
    report += `• Temperature: ${sensorData.temperature.toFixed(1)}°C ✓\n`;
    report += `• Pressure: ${sensorData.pressure.toFixed(2)} bar ✓\n`;
    report += `• Flow Rate: ${sensorData.flowRate.toFixed(1)} L/min ✓\n`;
    report += `• Current: ${sensorData.current.toFixed(1)} A ✓\n`;
    report += `• Voltage: ${sensorData.voltage.toFixed(1)} V ✓\n\n`;

    const daysSinceLastMaintenance = Math.floor(
      (Date.now() - new Date(pump.lastMaintenance).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastMaintenance > 90) {
      report += `💡 MAINTENANCE REMINDER:\n`;
      report += `Last maintenance was ${daysSinceLastMaintenance} days ago. Consider scheduling routine maintenance.\n`;
    }

    return report;
  }

  private generateMaintenanceInsights(anomalies: Anomaly[], pump: Pump): string {
    let insights = `🔧 MAINTENANCE INSIGHTS:\n`;

    const parameterCounts = anomalies.reduce((acc, anomaly) => {
      anomaly.parameters.forEach(param => {
        acc[param] = (acc[param] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const mostAffectedParam = Object.entries(parameterCounts)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostAffectedParam) {
      insights += `• Primary concern: ${mostAffectedParam[0]} (${mostAffectedParam[1]} anomalies)\n`;
    }

    const hasPatternAnomalies = anomalies.some(a => a.type.includes('pattern') || a.type.includes('bearing') || a.type.includes('impeller'));
    if (hasPatternAnomalies) {
      insights += `• Complex failure patterns detected - multi-parameter analysis recommended\n`;
    }

    const avgConfidence = anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length;
    insights += `• Average detection confidence: ${(avgConfidence * 100).toFixed(1)}%\n`;

    const daysSinceLastMaintenance = Math.floor(
      (Date.now() - new Date(pump.lastMaintenance).getTime()) / (1000 * 60 * 60 * 24)
    );
    insights += `• Days since last maintenance: ${daysSinceLastMaintenance}\n`;

    if (pump.efficiency < 85) {
      insights += `• Low efficiency (${pump.efficiency}%) may indicate wear or fouling\n`;
    }

    return insights;
  }

  generateSummary(allAnomalies: Anomaly[]): string {
    if (allAnomalies.length === 0) {
      return "All pumps operating normally. No anomalies detected.";
    }

    const criticalCount = allAnomalies.filter(a => a.severity === 'critical').length;
    const highCount = allAnomalies.filter(a => a.severity === 'high').length;
    const mediumCount = allAnomalies.filter(a => a.severity === 'medium').length;
    const lowCount = allAnomalies.filter(a => a.severity === 'low').length;

    let summary = `System Status: ${criticalCount > 0 ? 'CRITICAL' : highCount > 0 ? 'HIGH ALERT' : mediumCount > 0 ? 'CAUTION' : 'MONITORING'}\n`;
    
    if (criticalCount > 0) summary += `${criticalCount} critical alerts require immediate attention. `;
    if (highCount > 0) summary += `${highCount} high priority issues detected. `;
    if (mediumCount > 0) summary += `${mediumCount} medium priority items for review. `;
    if (lowCount > 0) summary += `${lowCount} low priority observations noted.`;

    return summary;
  }
}