import React from 'react';
import { AgentState } from '../types';
import { Database, Brain, BarChart3, FileText, CheckCircle } from 'lucide-react';

interface AgentFlowProps {
  agentState: AgentState;
}

const AgentFlow: React.FC<AgentFlowProps> = ({ agentState }) => {
  const agents = [
    {
      id: 'collecting',
      name: 'Data Collector',
      icon: Database,
      description: 'Gathering sensor data'
    },
    {
      id: 'physics',
      name: 'Physics Checker',
      icon: BarChart3,
      description: 'Threshold analysis'
    },
    {
      id: 'ml',
      name: 'ML Model',
      icon: Brain,
      description: 'Pattern detection'
    },
    {
      id: 'reporting',
      name: 'Reporter',
      icon: FileText,
      description: 'Generating insights'
    },
    {
      id: 'complete',
      name: 'Complete',
      icon: CheckCircle,
      description: 'Analysis finished'
    }
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = agents.findIndex(a => a.id === agentState.step);
    const stepIndex = agents.findIndex(a => a.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">LangGraph Agent Flow</h2>
        <div className="text-sm text-gray-600">
          Progress: {agentState.progress}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${agentState.progress}%` }}
          />
        </div>
      </div>

      {/* Agent Steps */}
      <div className="flex items-center justify-between mb-4">
        {agents.map((agent, index) => {
          const status = getStepStatus(agent.id);
          const Icon = agent.icon;
          
          return (
            <div key={agent.id} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${getStepColor(status)}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-900">{agent.name}</div>
                <div className="text-xs text-gray-500">{agent.description}</div>
              </div>
              
              {index < agents.length - 1 && (
                <div className="hidden sm:block absolute">
                  <div
                    className={`w-16 h-0.5 mt-6 ml-12 transition-all duration-300 ${
                      getStepStatus(agents[index + 1].id) === 'completed' ? 'bg-green-300' :
                      getStepStatus(agents[index + 1].id) === 'active' ? 'bg-blue-300' : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Status Message */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">{agentState.currentAgent}:</span>
          <span className="text-sm text-gray-600">{agentState.message}</span>
        </div>
      </div>
    </div>
  );
};

export default AgentFlow;