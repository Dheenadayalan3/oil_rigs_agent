import React from 'react';
import { Anomaly } from '../types';
import { AlertTriangle, Info, AlertCircle, Zap } from 'lucide-react';

interface AnomalyListProps {
  anomalies: Anomaly[];
}

const AnomalyList: React.FC<AnomalyListProps> = ({ anomalies }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('ml') || type.includes('pattern')) {
      return <Zap className="w-3 h-3 text-purple-500" />;
    }
    return <AlertTriangle className="w-3 h-3 text-gray-500" />;
  };

  const sortedAnomalies = [...anomalies].sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
                        (severityOrder[a.severity as keyof typeof severityOrder] || 0);
    if (severityDiff !== 0) return severityDiff;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Anomalies</h2>
        <span className="text-sm text-gray-500">{anomalies.length} total</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedAnomalies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No anomalies detected</p>
            <p className="text-sm">All systems operating normally</p>
          </div>
        ) : (
          sortedAnomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className={`border-l-4 p-3 rounded-r-lg ${getSeverityColor(anomaly.severity)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(anomaly.severity)}
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {anomaly.severity} Alert
                  </span>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(anomaly.type)}
                    <span className="text-xs text-gray-500">
                      {anomaly.type.includes('ml') ? 'ML' : 'Physics'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(anomaly.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-700 mb-1">{anomaly.description}</p>
                <p className="text-xs text-gray-600">{anomaly.recommendation}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Pump:</span>
                  <span className="font-medium">{anomaly.pumpId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="font-medium">{(anomaly.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              {anomaly.parameters.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {anomaly.parameters.map((param, index) => (
                    <span
                      key={index}
                      className="inline-block bg-white bg-opacity-60 text-xs px-2 py-1 rounded-full"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnomalyList;