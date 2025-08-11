import React from 'react';

interface CircleGridProps {
  totalCircles: number;
  completedCircles: number;
}

const CircleGrid: React.FC<CircleGridProps> = ({ totalCircles, completedCircles }) => {
  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (completedCircles / totalCircles) * circumference;

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Background circle */}
        <svg
          width={radius * 2}
          height={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="rgba(255, 255, 255, 0.2)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke="#10b981"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {completedCircles}/{totalCircles}
            </div>
            <div className="text-sm text-gray-300">Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleGrid;