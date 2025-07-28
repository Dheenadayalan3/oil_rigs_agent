import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export class OpenAIService {
  static async generateMaintenanceReport(
    anomalies: any[],
    sensorData: any,
    pumpInfo: any,
    historicalContext: string = ''
  ): Promise<string> {
    try {
      const prompt = this.buildMaintenancePrompt(anomalies, sensorData, pumpInfo, historicalContext);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert predictive maintenance engineer specializing in centrifugal pumps for offshore operations. 
            Generate detailed, actionable maintenance reports based on sensor data and anomaly detection results.
            Focus on safety, operational efficiency, and cost-effective maintenance strategies.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      return completion.choices[0]?.message?.content || 'Unable to generate report';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return `Error generating AI report: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  static async analyzeAnomalyPattern(anomalies: any[]): Promise<{
    rootCause: string;
    severity: string;
    recommendation: string;
    timeToFailure: string;
  }> {
    try {
      const prompt = `Analyze these pump anomalies and provide root cause analysis:
      
${JSON.stringify(anomalies, null, 2)}

Provide analysis in this JSON format:
{
  "rootCause": "Primary cause of the anomalies",
  "severity": "low|medium|high|critical",
  "recommendation": "Specific maintenance action required",
  "timeToFailure": "Estimated time before failure"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a predictive maintenance AI expert. Analyze pump anomalies and provide structured insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      return {
        rootCause: 'Analysis unavailable',
        severity: 'unknown',
        recommendation: 'Manual inspection required',
        timeToFailure: 'Unknown'
      };
    }
  }

  static async generateMaintenanceSchedule(
    pumpData: any[],
    anomalyHistory: any[]
  ): Promise<string> {
    try {
      const prompt = `Based on the following pump data and anomaly history, generate an optimized maintenance schedule:

Pump Data: ${JSON.stringify(pumpData, null, 2)}
Anomaly History: ${JSON.stringify(anomalyHistory.slice(-20), null, 2)}

Generate a maintenance schedule with:
1. Immediate actions (next 24-48 hours)
2. Short-term maintenance (next 1-2 weeks)
3. Long-term planning (next 1-3 months)
4. Cost optimization recommendations`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a maintenance planning expert. Create detailed, cost-effective maintenance schedules."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1200
      });

      return completion.choices[0]?.message?.content || 'Unable to generate schedule';
    } catch (error) {
      console.error('OpenAI Schedule Error:', error);
      return `Error generating maintenance schedule: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private static buildMaintenancePrompt(
    anomalies: any[],
    sensorData: any,
    pumpInfo: any,
    historicalContext: string
  ): string {
    return `Generate a comprehensive maintenance report for the following pump:

PUMP INFORMATION:
- ID: ${pumpInfo.id}
- Name: ${pumpInfo.name}
- Location: ${pumpInfo.location}
- Current Status: ${pumpInfo.status}
- Efficiency: ${pumpInfo.efficiency}%
- Operating Hours: ${pumpInfo.operatingHours}
- Last Maintenance: ${pumpInfo.lastMaintenance}

CURRENT SENSOR READINGS:
- Vibration: ${sensorData.vibration?.toFixed(2)} mm/s
- Temperature: ${sensorData.temperature?.toFixed(1)}°C
- Pressure: ${sensorData.pressure?.toFixed(2)} bar
- Flow Rate: ${sensorData.flowRate?.toFixed(1)} L/min
- Current: ${sensorData.current?.toFixed(1)} A
- Voltage: ${sensorData.voltage?.toFixed(1)} V

DETECTED ANOMALIES:
${anomalies.map(a => `- ${a.severity.toUpperCase()}: ${a.description} (Confidence: ${(a.confidence * 100).toFixed(1)}%)`).join('\n')}

HISTORICAL CONTEXT:
${historicalContext}

Please provide:
1. Executive Summary
2. Critical Issues Analysis
3. Immediate Actions Required
4. Maintenance Recommendations
5. Cost Impact Assessment
6. Timeline for Actions`;
  }
}