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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Iteration Tracker</h1>
          <p className="text-gray-400 text-sm">Track your successful iterations</p>
        </div>
        
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-slate-800/50 backdrop-blur-lg hover:bg-slate-700/50 rounded-full transition-all duration-200 shadow-lg border border-slate-700/50"
        >
          <Settings className="w-6 h-6 text-gray-300" />
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Display */}
          <div className="text-center mb-12">
            <div className="inline-block bg-slate-800/30 backdrop-blur-lg rounded-2xl px-6 py-4 border border-slate-700/50">
              <div className="text-4xl font-bold text-white mb-2">
                {completedCircles} / {circleCount}
              </div>
              <div className="text-gray-400 text-sm">Iterations Completed</div>
            </div>
          </div>

          {/* Circle Grid */}
          <div className="mb-16">
            <CircleGrid totalCircles={circleCount} completedCircles={completedCircles} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-8">
            <button
              onClick={handleCheck}
              disabled={completedCircles >= circleCount}
              className="group relative p-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full transition-all duration-200 shadow-2xl shadow-emerald-500/25 disabled:shadow-none"
            >
              <Check className="w-8 h-8 text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 group-active:scale-95 transition-transform duration-200" />
            </button>
            
            <button
              onClick={handleReset}
              className="group relative p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 shadow-2xl shadow-red-500/25"
            >
              <X className="w-8 h-8 text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 group-active:scale-95 transition-transform duration-200" />
            </button>
          </div>

          {/* Button Labels */}
          <div className="flex justify-center space-x-8 mt-4">
            <div className="text-center">
              <div className="text-gray-300 text-sm font-medium">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-gray-300 text-sm font-medium">Reset</div>
            </div>
          </div>
        </div>
      </main>

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