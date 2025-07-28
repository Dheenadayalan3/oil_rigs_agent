import React, { useState } from 'react';
import { Database, Info, Settings, TrendingUp, Zap } from 'lucide-react';
import { DataExplainer } from '../data/dataExplainer';

const DataSourcePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'flow'>('overview');
  const dataInfo = DataExplainer.getDataSourceInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Data Sources</h2>
        </div>
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'parameters', label: 'Parameters', icon: Settings },
            { id: 'flow', label: 'Flow', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 text-sm rounded-md flex items-center space-x-1 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Data Source: {dataInfo.source}</span>
            </div>
            <p className="text-sm text-blue-800">
              Realistic simulation of offshore centrifugal pump sensor data with {dataInfo.updateFrequency.toLowerCase()} updates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataInfo.pumpTypes.map(pump => (
              <div key={pump.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{pump.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pump.baselineHealth.includes('Excellent') ? 'bg-green-100 text-green-800' :
                    pump.baselineHealth.includes('Good') ? 'bg-blue-100 text-blue-800' :
                    pump.baselineHealth.includes('Fair') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {pump.baselineHealth.split(' - ')[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{pump.type}</p>
                <p className="text-xs text-gray-500">{pump.application}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Real-World Sensor Equivalents</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              {dataInfo.realWorldEquivalents.map((sensor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>{sensor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parameters' && (
        <div className="space-y-3">
          {dataInfo.parameters.map(param => (
            <div key={param.name} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{param.name}</span>
                <span className="text-sm text-gray-500">{param.unit}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{param.purpose}</p>
              <div className="flex justify-between text-xs">
                <span className="text-green-600">Normal: {param.normalRange} {param.unit}</span>
                <span className="text-red-600">Critical: {param.criticalThreshold} {param.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'flow' && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {DataExplainer.explainDataFlow()}
            </pre>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-800">Sensor Parameters</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3s</div>
              <div className="text-sm text-green-800">Update Frequency</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">100</div>
              <div className="text-sm text-purple-800">Historical Readings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSourcePanel;