import React from 'react';
import { SensorData } from '../types';

interface SensorChartProps {
  data: SensorData[];
  parameter: keyof Omit<SensorData, 'timestamp' | 'pumpId'>;
  title: string;
  color: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, parameter, title, color }) => {
  if (data.length === 0) return null;

  const values = data.map(d => d[parameter]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const currentValue = values[values.length - 1];

  // Create SVG path for the line chart
  const width = 300;
  const height = 60;
  const padding = 10;

  const points = data.slice(-20).map((d, index) => {
    const x = padding + (index / Math.max(1, data.slice(-20).length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d[parameter] - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const pathData = data.slice(-20).length > 1 ? `M ${points.split(' ').join(' L ')}` : '';

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className="text-lg font-bold" style={{ color }}>
          {currentValue.toFixed(2)}
        </span>
      </div>
      
      <div className="relative">
        <svg width={width} height={height} className="w-full">
          {/* Grid lines */}
          <defs>
            <pattern id={`grid-${parameter}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${parameter})`} />
          
          {/* Data line */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Data points */}
          {data.slice(-20).map((d, index) => {
            const x = padding + (index / Math.max(1, data.slice(-20).length - 1)) * (width - 2 * padding);
            const y = height - padding - ((d[parameter] - minValue) / range) * (height - 2 * padding);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className="opacity-70"
              />
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Min: {minValue.toFixed(2)}</span>
        <span>Max: {maxValue.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SensorChart;