import React from 'react';

interface CircleGridProps {
  totalCircles: number;
  completedCircles: number;
}

const CircleGrid: React.FC<CircleGridProps> = ({ totalCircles, completedCircles }) => {
  const getGridCols = (count: number) => {
    if (count <= 3) return 'grid-cols-3';
    if (count <= 6) return 'grid-cols-3';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className={`grid ${getGridCols(totalCircles)} gap-6 max-w-md mx-auto`}>
      {Array.from({ length: totalCircles }).map((_, index) => (
        <div
          key={index}
          className={`
            w-16 h-16 rounded-full border-4 transition-all duration-300 ease-out transform
            ${index < completedCircles 
              ? 'bg-emerald-400 border-emerald-300 shadow-lg shadow-emerald-400/50 scale-110' 
              : 'bg-gray-600 border-gray-500 shadow-md'
            }
          `}
        >
          {index < completedCircles && (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CircleGrid;