# Agentic AI Predictive Maintenance System

## 🤖 Production-Ready AI System for Centrifugal Pump Monitoring

This system uses **ChatGPT (OpenAI)** for production AI analysis and **Google Gemini** as a backup service.

### 🔧 Production Setup

1. **Create `.env` file** with your API keys:
```env
# OpenAI Configuration (PRIMARY - for production)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Google AI Configuration (BACKUP - for development)
VITE_GOOGLE_API_KEY=AIzaSyBjIRVSZqL6Ix2lSSfA-OGPYiaSvjKtxEY

# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
VITE_AWS_DYNAMODB_TABLE=pump-sensor-data
VITE_AWS_TIMESTREAM_DATABASE=PumpMonitoring
VITE_AWS_TIMESTREAM_TABLE=SensorReadings
VITE_AWS_S3_BUCKET=pump-maintenance-reports
VITE_AWS_LAMBDA_FUNCTION=pump-anomaly-processor
```

2. **AI Service Configuration**:
   - **Production**: Uses ChatGPT (OpenAI) for intelligent analysis
   - **Development**: Falls back to Google Gemini if needed
   - **Hybrid Approach**: Physics + ML + LLM analysis

### 🚀 Features

- **Real-time Monitoring**: 4 offshore pumps with 6 sensor parameters
- **LangGraph Simulation**: Multi-agent workflow visualization
- **ChatGPT Integration**: Professional maintenance reports and insights
- **AWS Cloud Storage**: Timestream, DynamoDB, S3, Lambda integration
- **Hybrid Detection**: Physics thresholds + ML anomaly detection

### 🎯 Production Architecture

```
Sensor Data → Physics Agent → ML Agent → ChatGPT Analysis → AWS Storage
     ↓              ↓           ↓            ↓              ↓
  Real-time     Threshold   Pattern      AI Reports    Cloud Archive
  Updates       Checking    Detection    Generation    & Analytics
```

### 📊 Monitoring Dashboard

- **Pump Status Cards**: Real-time health indicators
- **Agent Flow**: Visual LangGraph workflow
- **AI Reports**: ChatGPT-powered maintenance insights
- **Cloud Status**: AWS service monitoring
- **Anomaly Timeline**: Severity-based alerts

Start monitoring to see the production AI system in action!