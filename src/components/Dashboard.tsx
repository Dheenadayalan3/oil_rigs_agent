import React, { useState, useEffect } from 'react';
import { Play, Pause, Activity, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { SensorData, Pump, Anomaly, AgentState } from '../types';
import { pumps, generateSensorData } from '../data/sampleData';
import { PhysicsChecker } from '../agents/PhysicsChecker';
import { MLModel } from '../agents/MLModel';
import { EnhancedReporter } from '../agents/EnhancedReporter';
import PumpCard from './PumpCard';
import SensorChart from './SensorChart';
import AnomalyList from './AnomalyList';
import AgentFlow from './AgentFlow';
import DataSourcePanel from './DataSourcePanel';
import CloudStatusPanel from './CloudStatusPanel';
import { ConnectionChecker } from '../services/connectionChecker';

const Dashboard: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedPump, setSelectedPump] = useState<string>('PUMP-001');
  const [sensorData, setSensorData] = useState<Record<string, SensorData[]>>({});
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [agentState, setAgentState] = useState<AgentState>({
    step: 'collecting',
    progress: 0,
    currentAgent: 'Data Collector',
    message: 'Waiting to start monitoring...'
  });
  const [report, setReport] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const physicsChecker = new PhysicsChecker();
  const mlModel = new MLModel();
  
  // Determine which AI service to use based on availability
  const [useOpenAI, setUseOpenAI] = useState(false);
  const enhancedReporter = EnhancedReporter.getInstance(useOpenAI);

  useEffect(() => {
    // Check which AI services are available on component mount - prioritize Google AI
    const checkAIServices = async () => {
      const envStatus = ConnectionChecker.getEnvironmentStatus();
      
      // First check Google AI (our primary service)
      if (envStatus.googleaiConfigured) {
        const googleCheck = await ConnectionChecker.checkGoogleAI(import.meta.env.VITE_GOOGLE_API_KEY);
        if (googleCheck.connected) {
          setUseOpenAI(false); // Use Google AI
          return;
        }
      }
      
      // Fallback to OpenAI if Google AI is not available
      if (envStatus.openaiConfigured) {
        const openaiCheck = await ConnectionChecker.checkOpenAI(import.meta.env.VITE_OPENAI_API_KEY);
        if (openaiCheck.connected) {
          setUseOpenAI(true);
          return;
        }
      }
      
      // Default to Google AI even if not connected (will show appropriate errors)
      setUseOpenAI(false);
    };

    checkAIServices();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isMonitoring) {
      interval = setInterval(() => {
        processData();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const processData = async () => {
    // Simulate LangGraph agent flow
    setAgentState({
      step: 'collecting',
      progress: 20,
      currentAgent: 'Data Collector',
      message: 'Collecting sensor data from all pumps...'
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate new sensor data for all pumps
    const newData: Record<string, SensorData[]> = { ...sensorData };
    const newAnomalies: Anomaly[] = [];

    for (const pump of pumps) {
      const data = generateSensorData(pump.id);
      
      if (!newData[pump.id]) {
        newData[pump.id] = [];
      }
      newData[pump.id].push(data);
      
      // Keep only last 50 readings
      if (newData[pump.id].length > 50) {
        newData[pump.id] = newData[pump.id].slice(-50);
      }

      // Physics-based analysis
      setAgentState({
        step: 'physics',
        progress: 40,
        currentAgent: 'Physics Checker',
        message: `Analyzing ${pump.name} against physics thresholds...`
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      const physicsAnomalies = physicsChecker.checkThresholds(data);
      newAnomalies.push(...physicsAnomalies);

      // ML-based analysis
      setAgentState({
        step: 'ml',
        progress: 60,
        currentAgent: 'ML Model',
        message: `Running ML anomaly detection for ${pump.name}...`
      });

      await new Promise(resolve => setTimeout(resolve, 400));

      mlModel.addData(data);
      const mlAnomalies = mlModel.detectAnomalies(data);
      newAnomalies.push(...mlAnomalies);
    }

    // Generate AI-enhanced report
    setAgentState({
      step: 'reporting',
      progress: 80,
      currentAgent: 'Reporter',
      message: 'Generating AI-powered maintenance report...'
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    const selectedPumpData = newData[selectedPump]?.[newData[selectedPump].length - 1];
    const selectedPumpInfo = pumps.find(p => p.id === selectedPump)!;
    const selectedPumpAnomalies = newAnomalies.filter(a => a.pumpId === selectedPump);

    if (selectedPumpData) {
      // Generate AI-enhanced report
      try {
        const newReport = await enhancedReporter.generateAIReport(
          selectedPumpAnomalies, 
          selectedPumpData, 
          selectedPumpInfo
        );
        setReport(newReport);

        // Get AI analysis of anomaly patterns
        if (selectedPumpAnomalies.length > 0) {
          const analysis = await enhancedReporter.analyzeAnomalyPatterns(selectedPumpAnomalies);
          setAiAnalysis(analysis);
        }
      } catch (error) {
        console.error('AI report generation failed:', error);
        setReport('AI report generation temporarily unavailable. Using fallback analysis.');
      }
    }

    setAgentState({
      step: 'complete',
      progress: 100,
      currentAgent: 'System',
      message: `Analysis complete. ${newAnomalies.length} anomalies detected across all pumps.`
    });

    setSensorData(newData);
    setAnomalies(prev => [...prev, ...newAnomalies].slice(-100)); // Keep last 100 anomalies

    // Reset to collecting after a brief pause
    setTimeout(() => {
      if (isMonitoring) {
        setAgentState({
          step: 'collecting',
          progress: 0,
          currentAgent: 'Data Collector',
          message: 'Preparing next data collection cycle...'
        });
      }
    }, 1000);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setAgentState({
        step: 'collecting',
        progress: 0,
        currentAgent: 'Data Collector',
        message: 'Starting monitoring system...'
      });
    } else {
      setAgentState({
        step: 'collecting',
        progress: 0,
        currentAgent: 'System',
        message: 'Monitoring stopped.'
      });
    }
  };

  const getSystemStatus = () => {
    const recentAnomalies = anomalies.filter(a => Date.now() - a.timestamp < 60000);
    const criticalCount = recentAnomalies.filter(a => a.severity === 'critical').length;
    const highCount = recentAnomalies.filter(a => a.severity === 'high').length;

    if (criticalCount > 0) return { status: 'critical', icon: AlertTriangle, color: 'text-red-500' };
    if (highCount > 0) return { status: 'warning', icon: AlertTriangle, color: 'text-yellow-500' };
    return { status: 'normal', icon: CheckCircle, color: 'text-green-500' };
  };

  const systemStatus = getSystemStatus();
  const StatusIcon = systemStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agentic AI Predictive Maintenance</h1>
                <p className="text-sm text-gray-500">Centrifugal Pump Monitoring System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`w-5 h-5 ${systemStatus.color}`} />
                <span className="text-sm font-medium capitalize">{systemStatus.status}</span>
              </div>
              
              <button
                onClick={toggleMonitoring}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isMonitoring
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Agent Flow */}
        <div className="mb-6">
          <AgentFlow agentState={agentState} />
        </div>

        {/* Cloud Services Status */}
        <div className="mb-6">
          <CloudStatusPanel />
        </div>

        {/* Pump Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {pumps.map(pump => (
            <PumpCard
              key={pump.id}
              pump={pump}
              isSelected={selectedPump === pump.id}
              onClick={() => setSelectedPump(pump.id)}
              recentAnomalies={anomalies.filter(a => 
                a.pumpId === pump.id && Date.now() - a.timestamp < 300000
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Source Information */}
          <div className="lg:col-span-3 mb-6">
            <DataSourcePanel />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Real-time Sensor Data - {pumps.find(p => p.id === selectedPump)?.name}
                </h2>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              
              {sensorData[selectedPump] && sensorData[selectedPump].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SensorChart
                    data={sensorData[selectedPump]}
                    parameter="vibration"
                    title="Vibration (mm/s)"
                    color="#ef4444"
                  />
                  <SensorChart
                    data={sensorData[selectedPump]}
                    parameter="temperature"
                    title="Temperature (°C)"
                    color="#f97316"
                  />
                  <SensorChart
                    data={sensorData[selectedPump]}
                    parameter="pressure"
                    title="Pressure (bar)"
                    color="#3b82f6"
                  />
                  <SensorChart
                    data={sensorData[selectedPump]}
                    parameter="flowRate"
                    title="Flow Rate (L/min)"
                    color="#10b981"
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start monitoring to see real-time sensor data</p>
                </div>
              )}
            </div>

            {/* AI-Enhanced Report */}
            {report && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">AI-Enhanced Analysis Report</h2>
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <Activity className="w-4 h-4" />
                    <span>Powered by {useOpenAI ? 'ChatGPT (OpenAI)' : 'Google Gemini AI'}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {report}
                  </pre>
                </div>
              </div>
            )}

            {/* AI Pattern Analysis */}
            {aiAnalysis && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Pattern Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Root Cause</h3>
                    <p className="text-sm text-blue-800">{aiAnalysis.rootCause}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">Severity Assessment</h3>
                    <p className="text-sm text-yellow-800 capitalize">{aiAnalysis.severity}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Recommendation</h3>
                    <p className="text-sm text-green-800">{aiAnalysis.recommendation}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-2">Time to Failure</h3>
                    <p className="text-sm text-red-800">{aiAnalysis.timeToFailure}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Anomaly List */}
          <div className="lg:col-span-1">
            <AnomalyList anomalies={anomalies.slice(-20)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;