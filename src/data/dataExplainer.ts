// Data Generation and Sources Explanation
export class DataExplainer {
  static getDataSourceInfo() {
    return {
      source: "Realistic Simulation",
      updateFrequency: "Every 3 seconds",
      parameters: [
        {
          name: "Vibration",
          unit: "mm/s",
          purpose: "Detect bearing wear, misalignment, cavitation",
          normalRange: "0-4.5",
          criticalThreshold: ">4.5"
        },
        {
          name: "Temperature", 
          unit: "°C",
          purpose: "Monitor overheating, cooling system performance",
          normalRange: "20-75",
          criticalThreshold: ">75"
        },
        {
          name: "Pressure",
          unit: "bar", 
          purpose: "Detect blockages, impeller wear, system issues",
          normalRange: "2.2-3.5",
          criticalThreshold: "Outside range"
        },
        {
          name: "Flow Rate",
          unit: "L/min",
          purpose: "Monitor pump performance, detect cavitation",
          normalRange: "145-250", 
          criticalThreshold: "Outside range"
        },
        {
          name: "Current",
          unit: "A",
          purpose: "Electrical system monitoring, motor health",
          normalRange: "6-15",
          criticalThreshold: "Outside range"
        },
        {
          name: "Voltage",
          unit: "V", 
          purpose: "Power supply stability, electrical faults",
          normalRange: "440-480",
          criticalThreshold: "Outside range"
        }
      ],
      pumpTypes: [
        {
          id: "PUMP-001",
          type: "Primary Seawater Pump",
          application: "Main seawater intake for platform operations",
          criticalityLevel: "High",
          baselineHealth: "Excellent"
        },
        {
          id: "PUMP-002", 
          type: "Cooling Water Pump",
          application: "Engine and equipment cooling system",
          criticalityLevel: "High",
          baselineHealth: "Good"
        },
        {
          id: "PUMP-003",
          type: "Fire Water Pump", 
          application: "Emergency fire suppression system",
          criticalityLevel: "Critical",
          baselineHealth: "Fair - needs attention"
        },
        {
          id: "PUMP-004",
          type: "Ballast Water Pump",
          application: "Platform stability and ballast management", 
          criticalityLevel: "Medium",
          baselineHealth: "Poor - immediate maintenance required"
        }
      ],
      dataGeneration: {
        method: "Baseline + Noise + Trends",
        noiseLevel: "±20% realistic variation",
        updateInterval: "3 seconds",
        historicalDepth: "Last 100 readings per pump",
        anomalyInjection: "Realistic failure patterns"
      },
      realWorldEquivalents: [
        "Vibration sensors (accelerometers)",
        "RTD temperature sensors", 
        "Pressure transmitters",
        "Flow meters (magnetic/ultrasonic)",
        "Current transformers",
        "Voltage monitors"
      ]
    };
  }

  static explainDataFlow() {
    return `
🔄 DATA FLOW EXPLANATION:

1. **Data Generation** (Every 3 seconds)
   └── Realistic sensor simulation with noise and trends
   
2. **Agent Pipeline** (LangGraph Flow)
   ├── 📊 Data Collector: Gathers all sensor readings
   ├── ⚖️  Physics Checker: Applies threshold rules  
   ├── 🧠 ML Model: Statistical anomaly detection
   └── 📝 Reporter: Generates intelligent insights

3. **Anomaly Detection** (Hybrid Approach)
   ├── Physics: Immediate threshold violations
   └── ML: Pattern recognition and statistical analysis

4. **Output Generation**
   ├── Real-time charts and visualizations
   ├── Severity-classified alerts
   └── Maintenance recommendations

🎯 SIMULATION REALISM:
- Based on actual offshore pump specifications
- Includes realistic sensor noise and drift
- Simulates common failure modes
- Provides maintenance-actionable insights
    `;
  }
}