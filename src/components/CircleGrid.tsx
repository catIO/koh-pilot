import React from 'react';

interface CircleGridProps {
  totalCircles: number;
  completedCircles: number;
  failureCount?: number;
  failureTrackingEnabled?: boolean;
  timeLeft?: number | null;
  onDismissTimer?: () => void;
}

const CircleGrid: React.FC<CircleGridProps> = ({ 
  totalCircles, 
  completedCircles,
  failureCount = 0,
  failureTrackingEnabled = false,
  timeLeft = null,
  onDismissTimer
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

        {/* Center Display: Timer takes precedence, then Failure Count */}
        {timeLeft !== null ? (
          <div 
            onClick={onDismissTimer}
            className="absolute inset-0 flex items-center justify-center cursor-pointer select-none group"
            title="Click to skip timer"
          >
            <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full transform hover:scale-105 active:scale-95 transition-all duration-200">
              <span className="text-6xl font-black text-white/20 tabular-nums animate-timer-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                {timeLeft}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold tracking-wider mt-1 opacity-60 group-hover:opacity-100 transition-opacity uppercase">
                Tap to Skip
              </span>
            </div>
          </div>
        ) : (
          failureTrackingEnabled && failureCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-red-500 drop-shadow-lg">
                {failureCount}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CircleGrid;