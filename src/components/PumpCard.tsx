import React from 'react';
import { Pump, Anomaly } from '../types';
import { AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';

interface PumpCardProps {
  pump: Pump;
  isSelected: boolean;
  onClick: () => void;
  recentAnomalies: Anomaly[];
}

const PumpCard: React.FC<PumpCardProps> = ({ pump, isSelected, onClick, recentAnomalies }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'offline': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const criticalAnomalies = recentAnomalies.filter(a => a.severity === 'critical').length;
  const highAnomalies = recentAnomalies.filter(a => a.severity === 'high').length;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{pump.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{pump.location}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(pump.status)}`}>
          {getStatusIcon(pump.status)}
          <span className="capitalize">{pump.status}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Efficiency</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  pump.efficiency >= 90 ? 'bg-green-500' : 
                  pump.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${pump.efficiency}%` }}
              />
            </div>
            <span className="text-xs font-medium">{pump.efficiency}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Operating Hours</span>
          <span className="font-medium">{pump.operatingHours.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 flex items-center space-x-1">
            <Wrench className="w-3 h-3" />
            <span>Last Maintenance</span>
          </span>
          <span className="font-medium">{new Date(pump.lastMaintenance).toLocaleDateString()}</span>
        </div>

        {recentAnomalies.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Recent Alerts</span>
              <div className="flex items-center space-x-2">
                {criticalAnomalies > 0 && (
                  <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-medium">
                    {criticalAnomalies} Critical
                  </span>
                )}
                {highAnomalies > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-medium">
                    {highAnomalies} High
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PumpCard;