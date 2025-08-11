import React, { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 confetti-particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confettiFall 3s ease-out forwards`
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;