# Data Sources for Agentic AI Predictive Maintenance

## 📊 Data Generation Overview

The system uses **realistic simulation** of centrifugal pump sensor data based on actual offshore pump operating parameters. Here's how the data flows through the system:

## 🔄 Data Flow Architecture

```
Real-time Data Generation → Physics Thresholds → ML Analysis → Anomaly Detection → Reports
```

## 📈 Sensor Parameters Generated

### 1. **Vibration (mm/s)**
- Normal range: 0-5 mm/s
- Critical threshold: >4.5 mm/s
- Simulates bearing wear, misalignment

### 2. **Temperature (°C)**
- Normal range: 20-80°C
- Critical threshold: >75°C
- Simulates overheating, cooling issues

### 3. **Pressure (bar)**
- Normal range: 2.2-3.5 bar
- Varies by pump type and application
- Simulates blockages, impeller wear

### 4. **Flow Rate (L/min)**
- Normal range: 145-250 L/min
- Depends on pump capacity
- Simulates cavitation, blockages

### 5. **Current (A)**
- Normal range: 6-15 A
- Motor electrical consumption
- Simulates electrical faults

### 6. **Voltage (V)**
- Normal range: 440-480 V
- Power supply stability
- Simulates electrical issues

## 🏭 Pump Configurations

### PUMP-001: Primary Seawater Pump
- **Location**: Platform A - Deck 2
- **Base Values**: Vibration: 2.1, Temp: 45°C, Pressure: 3.0 bar
- **Status**: Normal operation
- **Application**: Main seawater intake

### PUMP-002: Cooling Water Pump
- **Location**: Platform A - Engine Room
- **Base Values**: Vibration: 1.8, Temp: 42°C, Pressure: 2.7 bar
- **Status**: Normal operation
- **Application**: Engine cooling system

### PUMP-003: Fire Water Pump
- **Location**: Platform B - Safety Deck
- **Base Values**: Vibration: 3.2, Temp: 58°C, Pressure: 3.2 bar
- **Status**: Warning (elevated parameters)
- **Application**: Fire suppression system

### PUMP-004: Ballast Water Pump
- **Location**: Platform B - Lower Deck
- **Base Values**: Vibration: 5.8, Temp: 82°C, Pressure: 2.1 bar
- **Status**: Critical (multiple threshold violations)
- **Application**: Ballast water management

## 🎯 Data Generation Logic

The system uses the `generateSensorData()` function that:

1. **Base Values**: Each pump has realistic baseline values
2. **Noise Addition**: Adds random variation (±20%) to simulate real sensors
3. **Trend Simulation**: Some pumps show degradation patterns
4. **Real-time Updates**: New data every 3 seconds during monitoring

## 🔍 Physics-Based Thresholds

Each pump has specific operating thresholds based on:
- **Manufacturer specifications**
- **Offshore operating conditions**
- **Safety margins**
- **Historical performance data**

## 🤖 ML Model Training Data

The ML model builds historical data by:
- **Storing last 100 readings** per pump
- **Statistical analysis** (mean, standard deviation)
- **Z-score calculation** for anomaly detection
- **Pattern recognition** across multiple parameters

## 🚨 Anomaly Detection Sources

### Physics-Based Detection
- Immediate threshold violations
- Safety-critical parameter monitoring
- Rule-based severity classification

### ML-Based Detection
- Statistical anomalies (Z-score > 2.5)
- Multi-parameter pattern recognition
- Trend analysis and prediction

## 📝 Data Quality Features

- **Realistic Noise**: Simulates actual sensor variations
- **Correlated Parameters**: Temperature and vibration correlation
- **Degradation Patterns**: Gradual parameter drift over time
- **Fault Injection**: Specific failure mode simulation

## 🔄 Real-World Integration Points

In a production system, this would connect to:
- **SCADA Systems**: Industrial control systems
- **IoT Sensors**: Wireless sensor networks
- **Historian Databases**: Time-series data storage
- **Maintenance Systems**: CMMS integration
- **Alert Systems**: SMS, email, dashboard notifications

The current simulation provides a realistic foundation that can be easily replaced with actual sensor data feeds.