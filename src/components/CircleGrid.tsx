import React from 'react';

interface CircleGridProps {
  totalCircles: number;
  completedCircles: number;
  failureCount?: number;
  failureTrackingEnabled?: boolean;
}

const CircleGrid: React.FC<CircleGridProps> = ({ 
  totalCircles, 
  completedCircles,
  failureCount = 0,
  failureTrackingEnabled = false
}) => {
  const radius = 170;
  const strokeWidth = 20;
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
        {/* Failure count display inside circle */}
        {failureTrackingEnabled && failureCount > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-red-500 drop-shadow-lg">
              {failureCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleGrid;