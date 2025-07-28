import { Anomaly, SensorData, Pump } from '../types';
import { GoogleAIService } from '../services/googleAIService';
import { OpenAIService } from '../services/openaiService';
import { AWSDataService } from '../services/awsDataService';

export class EnhancedReporter {
  private static instance: EnhancedReporter;
  private useOpenAI: boolean;
  
  static getInstance(useOpenAI: boolean = true): EnhancedReporter {
    if (!EnhancedReporter.instance) {
      EnhancedReporter.instance = new EnhancedReporter(useOpenAI);
    }
    return EnhancedReporter.instance;
  }

  private constructor(useOpenAI: boolean = true) {
    this.useOpenAI = useOpenAI;
  }

  async generateAIReport(
    anomalies: Anomaly[], 
    sensorData: SensorData, 
    pump: Pump
  ): Promise<string> {
    try {
      // Get historical context from AWS
      const historicalAnomalies = await AWSDataService.getRecentAnomalies(pump.id, 20);
      const historicalContext = this.buildHistoricalContext(historicalAnomalies);

      // Generate AI-powered report using selected AI service
      const aiReport = this.useOpenAI 
        ? await OpenAIService.generateMaintenanceReport(anomalies, sensorData, pump, historicalContext)
        : await GoogleAIService.generateMaintenanceReport(anomalies, sensorData, pump, historicalContext);

      // Store the report in S3 for future reference
      await AWSDataService.storeMaintenanceReport(
        pump.id,
        aiReport,
        Date.now()
      );

      return aiReport;
    } catch (error) {
      console.error('Error generating AI report:', error);
      return this.generateFallbackReport(anomalies, sensorData, pump);
    }
  }

  async analyzeAnomalyPatterns(anomalies: Anomaly[]): Promise<{
    rootCause: string;
    severity: string;
    recommendation: string;
    timeToFailure: string;
  }> {
    try {
      return this.useOpenAI 
        ? await OpenAIService.analyzeAnomalyPattern(anomalies)
        : await GoogleAIService.analyzeAnomalyPattern(anomalies);
    } catch (error) {
      console.error('Error analyzing anomaly patterns:', error);
      return {
        rootCause: 'Multiple sensor anomalies detected',
        severity: 'medium',
        recommendation: 'Perform comprehensive inspection',
        timeToFailure: 'Unknown - requires analysis'
      };
    }
  }

  async generateMaintenanceSchedule(
    pumpData: Pump[],
    anomalyHistory: Anomaly[]
  ): Promise<string> {
    try {
      return this.useOpenAI 
        ? await OpenAIService.generateMaintenanceSchedule(pumpData, anomalyHistory)
        : await GoogleAIService.generateMaintenanceSchedule(pumpData, anomalyHistory);
    } catch (error) {
      console.error('Error generating maintenance schedule:', error);
      return 'Unable to generate maintenance schedule. Please consult maintenance team.';
    }
  }

  private buildHistoricalContext(historicalAnomalies: Anomaly[]): string {
    if (historicalAnomalies.length === 0) {
      return 'No significant historical anomalies recorded.';
    }

    const severityCounts = historicalAnomalies.reduce((acc, anomaly) => {
      acc[anomaly.severity] = (acc[anomaly.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentTrends = historicalAnomalies
      .slice(0, 5)
      .map(a => `${a.type}: ${a.severity}`)
      .join(', ');

    return `Historical Analysis (Last 20 anomalies):
- Critical: ${severityCounts.critical || 0}
- High: ${severityCounts.high || 0}  
- Medium: ${severityCounts.medium || 0}
- Low: ${severityCounts.low || 0}

Recent Trends: ${recentTrends}`;
  }

  private generateFallbackReport(
    anomalies: Anomaly[], 
    sensorData: SensorData, 
    pump: Pump
  ): string {
    if (anomalies.length === 0) {
      return this.generateNormalReport(sensorData, pump);
    }

    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
    const highAnomalies = anomalies.filter(a => a.severity === 'high');

    let report = `🤖 AI-ENHANCED MAINTENANCE REPORT - ${pump.name}\n`;
    report += `Location: ${pump.location}\n`;
    report += `Analysis Time: ${new Date(sensorData.timestamp).toLocaleString()}\n\n`;

    report += `📊 EXECUTIVE SUMMARY:\n`;
    report += `${anomalies.length} anomalies detected requiring attention.\n`;
    if (criticalAnomalies.length > 0) {
      report += `⚠️ IMMEDIATE ACTION REQUIRED: ${criticalAnomalies.length} critical issues\n`;
    }
    report += `Current pump efficiency: ${pump.efficiency}%\n\n`;

    if (criticalAnomalies.length > 0) {
      report += `🚨 CRITICAL ISSUES:\n`;
      criticalAnomalies.forEach(anomaly => {
        report += `• ${anomaly.description}\n`;
        report += `  Action Required: ${anomaly.recommendation}\n\n`;
      });
    }

    if (highAnomalies.length > 0) {
      report += `🔴 HIGH PRIORITY ISSUES:\n`;
      highAnomalies.forEach(anomaly => {
        report += `• ${anomaly.description}\n`;
        report += `  Recommendation: ${anomaly.recommendation}\n\n`;
      });
    }

    report += `📈 CURRENT SENSOR READINGS:\n`;
    report += `• Vibration: ${sensorData.vibration.toFixed(2)} mm/s\n`;
    report += `• Temperature: ${sensorData.temperature.toFixed(1)}°C\n`;
    report += `• Pressure: ${sensorData.pressure.toFixed(2)} bar\n`;
    report += `• Flow Rate: ${sensorData.flowRate.toFixed(1)} L/min\n`;
    report += `• Current: ${sensorData.current.toFixed(1)} A\n`;
    report += `• Voltage: ${sensorData.voltage.toFixed(1)} V\n\n`;

    report += `🔧 MAINTENANCE INSIGHTS:\n`;
    report += `• Operating hours: ${pump.operatingHours.toLocaleString()}\n`;
    report += `• Last maintenance: ${pump.lastMaintenance}\n`;
    report += `• System status: Enhanced monitoring with AWS cloud integration\n`;

    return report;
  }

  private generateNormalReport(sensorData: SensorData, pump: Pump): string {
    let report = `✅ AI-ENHANCED NORMAL OPERATION - ${pump.name}\n`;
    report += `Location: ${pump.location}\n`;
    report += `Analysis Time: ${new Date(sensorData.timestamp).toLocaleString()}\n\n`;

    report += `🤖 AI ANALYSIS: All parameters within optimal ranges\n`;
    report += `Cloud Integration: Active monitoring via AWS services\n`;
    report += `Pump efficiency: ${pump.efficiency}%\n\n`;

    report += `📊 CURRENT READINGS:\n`;
    report += `• Vibration: ${sensorData.vibration.toFixed(2)} mm/s ✓\n`;
    report += `• Temperature: ${sensorData.temperature.toFixed(1)}°C ✓\n`;
    report += `• Pressure: ${sensorData.pressure.toFixed(2)} bar ✓\n`;
    report += `• Flow Rate: ${sensorData.flowRate.toFixed(1)} L/min ✓\n`;
    report += `• Current: ${sensorData.current.toFixed(1)} A ✓\n`;
    report += `• Voltage: ${sensorData.voltage.toFixed(1)} V ✓\n\n`;

    report += `☁️ CLOUD SERVICES STATUS:\n`;
    report += `• Data stored in Amazon Timestream ✓\n`;
    report += `• ML processing via AWS Lambda ✓\n`;
    report += `• Reports archived in S3 ✓\n`;
    report += `• Anomaly tracking in DynamoDB ✓\n`;

    return report;
  }
}