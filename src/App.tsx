import React, { useState, useEffect } from 'react';
import { Check, X, Settings } from 'lucide-react';
import CircleGrid from './components/CircleGrid';
import SettingsModal from './components/SettingsModal';
import ConfettiAnimation from './components/ConfettiAnimation';

function App() {
  const [circleCount, setCircleCount] = useState(() => {
    const saved = localStorage.getItem('iterationTracker_circleCount');
    return saved ? parseInt(saved, 10) : 5;
  });
  
  const [completedCircles, setCompletedCircles] = useState(() => {
    const saved = localStorage.getItem('iterationTracker_completed');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('iterationTracker_circleCount', circleCount.toString());
  }, [circleCount]);

  useEffect(() => {
    localStorage.setItem('iterationTracker_completed', completedCircles.toString());
  }, [completedCircles]);

  const handleCheck = () => {
    if (completedCircles < circleCount) {
      const newCompleted = completedCircles + 1;
      setCompletedCircles(newCompleted);
      
      if (newCompleted === circleCount) {
        setShowConfetti(true);
      }
    }
  };

  const handleReset = () => {
    setCompletedCircles(0);
    setShowConfetti(false);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
    setCompletedCircles(0);
  };

  const handleCircleCountChange = (count: number) => {
    setCircleCount(count);
    if (completedCircles > count) {
      setCompletedCircles(count);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Koh-Pilot
          </h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-all duration-200 shadow-sm border border-white/20"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Circle Grid */}
          <div className="mb-8">
            <CircleGrid totalCircles={circleCount} completedCircles={completedCircles} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6">
            <button
              onClick={handleCheck}
              disabled={completedCircles >= circleCount}
              className="group relative p-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm"
            >
              <Check className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={handleReset}
              className="group relative p-4 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 shadow-sm"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        circleCount={circleCount}
        onCircleCountChange={handleCircleCountChange}
      />

      <ConfettiAnimation
        isActive={showConfetti}
        onComplete={handleConfettiComplete}
      />
    </div>
  );
}

export default App;