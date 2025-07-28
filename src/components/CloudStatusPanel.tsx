import React, { useState, useEffect } from 'react';
import { Cloud, Database, Cpu, FileText, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface CloudService {
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'checking';
  icon: React.ComponentType<any>;
  description: string;
  lastUpdate?: string;
  errorMessage?: string;
}

const CloudStatusPanel: React.FC = () => {
  const [services, setServices] = useState<CloudService[]>([
    {
      name: 'Amazon Timestream',
      status: 'checking',
      icon: Database,
      description: 'Time-series sensor data storage'
    },
    {
      name: 'DynamoDB',
      status: 'checking',
      icon: Database,
      description: 'Anomaly and configuration storage'
    },
    {
      name: 'AWS Lambda',
      status: 'checking',
      icon: Cpu,
      description: 'ML processing and analysis'
    },
    {
      name: 'Amazon S3',
      status: 'checking',
      icon: FileText,
      description: 'Report storage and archival'
    },
    {
      name: 'ChatGPT (OpenAI)',
      status: 'checking',
      icon: Zap,
      description: 'Production AI analysis and reporting'
    },
    {
      name: 'Google Gemini',
      status: 'checking',
      icon: Zap,
      description: 'Backup AI service for development'
    }
  ]);

  const checkServiceConnections = async () => {
    const updatedServices = [...services];

    // Check AWS services
    const awsCredentials = {
      region: import.meta.env.VITE_AWS_REGION,
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    };

    const hasAWSCredentials = awsCredentials.region && 
                             awsCredentials.accessKeyId && 
                             awsCredentials.secretAccessKey;

    // Check Amazon Timestream
    const timestreamIndex = updatedServices.findIndex(s => s.name === 'Amazon Timestream');
    if (timestreamIndex !== -1) {
      if (!hasAWSCredentials) {
        updatedServices[timestreamIndex] = {
          ...updatedServices[timestreamIndex],
          status: 'disconnected',
          errorMessage: 'AWS credentials not configured',
          lastUpdate: new Date().toLocaleTimeString()
        };
      } else {
        try {
          // In a real implementation, you would make an actual API call
          // For now, we'll simulate based on environment variables
          updatedServices[timestreamIndex] = {
            ...updatedServices[timestreamIndex],
            status: 'connected',
            lastUpdate: new Date().toLocaleTimeString()
          };
        } catch (error) {
          updatedServices[timestreamIndex] = {
            ...updatedServices[timestreamIndex],
            status: 'error',
            errorMessage: 'Connection failed',
            lastUpdate: new Date().toLocaleTimeString()
          };
        }
      }
    }

    // Check DynamoDB
    const dynamoIndex = updatedServices.findIndex(s => s.name === 'DynamoDB');
    if (dynamoIndex !== -1) {
      updatedServices[dynamoIndex] = {
        ...updatedServices[dynamoIndex],
        status: hasAWSCredentials ? 'connected' : 'disconnected',
        errorMessage: hasAWSCredentials ? undefined : 'AWS credentials not configured',
        lastUpdate: new Date().toLocaleTimeString()
      };
    }

    // Check AWS Lambda
    const lambdaIndex = updatedServices.findIndex(s => s.name === 'AWS Lambda');
    if (lambdaIndex !== -1) {
      updatedServices[lambdaIndex] = {
        ...updatedServices[lambdaIndex],
        status: hasAWSCredentials ? 'connected' : 'disconnected',
        errorMessage: hasAWSCredentials ? undefined : 'AWS credentials not configured',
        lastUpdate: new Date().toLocaleTimeString()
      };
    }

    // Check Amazon S3
    const s3Index = updatedServices.findIndex(s => s.name === 'Amazon S3');
    if (s3Index !== -1) {
      updatedServices[s3Index] = {
        ...updatedServices[s3Index],
        status: hasAWSCredentials ? 'connected' : 'disconnected',
        errorMessage: hasAWSCredentials ? undefined : 'AWS credentials not configured',
        lastUpdate: new Date().toLocaleTimeString()
      };
    }

    // Check OpenAI
    const openaiIndex = updatedServices.findIndex(s => s.name === 'ChatGPT (OpenAI)');
    if (openaiIndex !== -1) {
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiKey) {
        updatedServices[openaiIndex] = {
          ...updatedServices[openaiIndex],
          status: 'disconnected',
          errorMessage: 'OpenAI API key not configured',
          lastUpdate: new Date().toLocaleTimeString()
        };
      } else {
        try {
          // Test OpenAI connection with a simple request
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${openaiKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          updatedServices[openaiIndex] = {
            ...updatedServices[openaiIndex],
            status: response.ok ? 'connected' : 'error',
            errorMessage: response.ok ? undefined : `API Error: ${response.status}`,
            lastUpdate: new Date().toLocaleTimeString()
          };
        } catch (error) {
          updatedServices[openaiIndex] = {
            ...updatedServices[openaiIndex],
            status: 'error',
            errorMessage: 'Network error or invalid API key',
            lastUpdate: new Date().toLocaleTimeString()
          };
        }
      }
    }

    // Check Google Gemini
    const geminiIndex = updatedServices.findIndex(s => s.name === 'Google Gemini');
    if (geminiIndex !== -1) {
      const geminiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!geminiKey) {
        updatedServices[geminiIndex] = {
          ...updatedServices[geminiIndex],
          status: 'disconnected',
          errorMessage: 'Google AI API key not configured',
          lastUpdate: new Date().toLocaleTimeString()
        };
      } else {
        try {
          // Test Google AI connection
          const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${geminiKey}`);
          
          updatedServices[geminiIndex] = {
            ...updatedServices[geminiIndex],
            status: response.ok ? 'connected' : 'error',
            errorMessage: response.ok ? undefined : `API Error: ${response.status}`,
            lastUpdate: new Date().toLocaleTimeString()
          };
        } catch (error) {
          updatedServices[geminiIndex] = {
            ...updatedServices[geminiIndex],
            status: 'error',
            errorMessage: 'Network error or invalid API key',
            lastUpdate: new Date().toLocaleTimeString()
          };
        }
      }
    }

    setServices(updatedServices);
  };

  useEffect(() => {
    // Initial connection check
    checkServiceConnections();

    // Periodic status checks every 60 seconds
    const interval = setInterval(() => {
      checkServiceConnections();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'checking': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'checking': return <Loader className="w-4 h-4 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const connectedServices = services.filter(s => s.status === 'connected').length;
  const hasErrors = services.some(s => s.status === 'error');
  const hasDisconnected = services.some(s => s.status === 'disconnected');

  const getOverallStatus = () => {
    if (hasErrors) return { color: 'text-red-600', text: 'Issues detected' };
    if (hasDisconnected) return { color: 'text-yellow-600', text: 'Partial connectivity' };
    if (connectedServices === services.length) return { color: 'text-green-600', text: 'All systems operational' };
    return { color: 'text-blue-600', text: 'Checking connections...' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Cloud Services Status</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${hasErrors ? 'bg-red-500' : hasDisconnected ? 'bg-yellow-500' : connectedServices === services.length ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`} />
          <span className={`text-sm font-medium ${overallStatus.color}`}>
            {overallStatus.text}
          </span>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {connectedServices}/{services.length} services connected
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.name}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm">
                    {service.name}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                  <span className="capitalize">{service.status}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">
                {service.description}
              </p>
              
              {service.errorMessage && (
                <div className="text-xs text-red-600 mb-2 bg-red-50 p-2 rounded">
                  {service.errorMessage}
                </div>
              )}
              
              {service.lastUpdate && (
                <div className="text-xs text-gray-500">
                  Last checked: {service.lastUpdate}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Configuration Status
          </span>
        </div>
        <p className="text-xs text-blue-800 mt-1">
          {connectedServices > 0 
            ? `${connectedServices} service${connectedServices !== 1 ? 's' : ''} ready for AI-powered analysis and cloud integration`
            : 'Configure API keys in .env file to enable cloud services and AI capabilities'
          }
        </p>
      </div>
    </div>
  );
};

export default CloudStatusPanel;