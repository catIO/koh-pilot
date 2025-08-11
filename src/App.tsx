import React, { useState, useEffect } from 'react';
import { Check, X, Settings } from 'lucide-react';
import CircleGrid from './components/CircleGrid';
import SettingsModal from './components/SettingsModal';

// Fireworks-style confetti function
const createConfetti = () => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff',
    '#ff7675', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e', '#00b894', '#e17055',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84',
    '#ff3838', '#ff6348', '#ffa502', '#ffb142', '#ff5252', '#ff4081'
  ];
  
  const shapes = ['square', 'circle', 'triangle'];
  
  // Fireworks burst from center
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Create multiple bursts for fireworks effect
  for (let burst = 0; burst < 3; burst++) {
    setTimeout(() => {
      // Each burst creates multiple particles
      for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        const size = 4 + Math.random() * 8;
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Set base styles
        confetti.style.position = 'fixed';
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = shape === 'circle' ? '50%' : '1px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        confetti.style.willChange = 'transform, opacity';
        
        // Create triangle shape
        if (shape === 'triangle') {
          confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        }
        
        document.body.appendChild(confetti);
        
        // Fireworks physics - burst outward from center
        let startTime = Date.now();
        const duration = 3000 + Math.random() * 2000;
        
        // Random angle for 360-degree burst
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const velocity = 200 + Math.random() * 300; // Initial burst velocity
        const gravity = 0.5 + Math.random() * 0.5; // Gravity effect
        
        // Calculate end position based on angle and velocity
        const endX = centerX + Math.cos(angle) * velocity;
        const endY = centerY + Math.sin(angle) * velocity;
        
        // Add some randomness to the trajectory
        const wobbleAmount = 50 + Math.random() * 100;
        const wobbleSpeed = 0.5 + Math.random() * 1.5;
        const rotationSpeed = 2 + Math.random() * 8;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Fireworks easing - fast start, slow end
          const easeOut = 1 - Math.pow(1 - progress, 2);
          
          // Calculate position with gravity effect
          const currentX = centerX + (endX - centerX) * easeOut;
          const currentY = centerY + (endY - centerY) * easeOut + (gravity * progress * progress * 200);
          
          // Add wobble for more natural movement
          const wobble = Math.sin(progress * wobbleSpeed * Math.PI * 2) * wobbleAmount * (1 - progress);
          const finalX = currentX + wobble;
          const finalY = currentY;
          
          // Calculate rotation
          const rotation = progress * rotationSpeed * 360;
          
          // Calculate opacity with fireworks fade
          const opacity = progress < 0.7 ? 1 : (1 - progress) / 0.3;
          
          // Apply transforms
          confetti.style.transform = `translate(${finalX - centerX}px, ${finalY - centerY}px) rotate(${rotation}deg)`;
          confetti.style.opacity = opacity.toString();
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            document.body.removeChild(confetti);
          }
        };
        
        // Start animation immediately for burst effect
        requestAnimationFrame(animate);
      }
    }, burst * 300); // Stagger bursts by 300ms
  }
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // Check if React context is available
  if (typeof React.useState !== 'function') {
    return null;
  }

  const [isInitialized, setIsInitialized] = useState(false);
  const [circleCount, setCircleCount] = useState(() => {
    const saved = localStorage.getItem('iterationTracker_circleCount');
    return saved ? parseInt(saved, 10) : 5;
  });
  
  const [completedCircles, setCompletedCircles] = useState(() => {
    const saved = localStorage.getItem('iterationTracker_completed');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Ensure component is properly initialized
  useEffect(() => {
    setIsInitialized(true);
  }, []);

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
        // Use vanilla JavaScript confetti instead of React component
        createConfetti();
        // Reset after confetti animation
        setTimeout(() => {
          setCompletedCircles(0);
        }, 3000);
      }
    }
  };

  const handleReset = () => {
    setCompletedCircles(0);
  };

  const handleCircleCountChange = (count: number) => {
    setCircleCount(count);
    if (completedCircles > count) {
      setCompletedCircles(count);
    }
  };

  // Don't render until initialized to prevent hook issues
  if (!isInitialized) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen p-8"
        style={{
          background: 'linear-gradient(135deg, #404040 0%, #202020 35%, #000000 100%)',
          minHeight: '100vh'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Practice Koh-Pilot
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

        {/* Confetti will be handled differently to prevent hook errors */}
      </div>
    </ErrorBoundary>
  );
}

export default App;