import React, { useState, useEffect } from 'react';
import { Cloud, Database, Cpu, FileText, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface CloudService {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: React.ComponentType<any>;
  description: string;
  lastUpdate?: string;
}

const CloudStatusPanel: React.FC = () => {
  const [services, setServices] = useState<CloudService[]>([
    {
      name: 'Amazon Timestream',
      status: 'connected',
      icon: Database,
      description: 'Time-series sensor data storage',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      name: 'DynamoDB',
      status: 'connected',
      icon: Database,
      description: 'Anomaly and configuration storage',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      name: 'AWS Lambda',
      status: 'connected',
      icon: Cpu,
      description: 'ML processing and analysis',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      name: 'Amazon S3',
      status: 'connected',
      icon: FileText,
      description: 'Report storage and archival',
      lastUpdate: new Date().toLocaleTimeString()
    },
    {
      name: 'OpenAI GPT-4',
      status: 'connected',
      icon: Zap,
      description: 'AI-powered report generation',
      lastUpdate: new Date().toLocaleTimeString()
    }
  ]);

  useEffect(() => {
    // Simulate periodic status checks
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastUpdate: new Date().toLocaleTimeString()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'disconnected': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const connectedServices = services.filter(s => s.status === 'connected').length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Cloud Services Status</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">
            {connectedServices}/{services.length} services active
          </span>
        </div>
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
              
              {service.lastUpdate && (
                <div className="text-xs text-gray-500">
                  Last update: {service.lastUpdate}
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
            Enhanced AI Capabilities Active
          </span>
        </div>
        <p className="text-xs text-blue-800 mt-1">
          Real-time data streaming to AWS, AI-powered analysis with ChatGPT, and automated report generation
        </p>
      </div>
    </div>
  );
};

export default CloudStatusPanel;