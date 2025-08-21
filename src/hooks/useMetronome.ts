import { useState, useEffect, useRef, useCallback } from 'react';

export interface MetronomeSettings {
  bpm: number;
  clickTone: 'beep' | 'click' | 'tick' | 'woodblock';
  volume: number;
  isPlaying: boolean;
}

export const useMetronome = () => {
  const [settings, setSettings] = useState<MetronomeSettings>(() => {
    const saved = localStorage.getItem('metronome_settings');
    return saved ? JSON.parse(saved) : {
      bpm: 60,
      clickTone: 'click',
      volume: 0.7,
      isPlaying: false
    };
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextClickTimeRef = useRef<number>(0);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('metronome_settings', JSON.stringify(settings));
  }, [settings]);



  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Generate click sound
  const generateClick = useCallback((frequency: number, duration: number, volume: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  // Play click based on selected tone
  const playClick = useCallback(() => {
    // Read current settings dynamically
    const currentSettings = JSON.parse(localStorage.getItem('metronome_settings') || '{}');
    const { clickTone = 'click', volume = 0.7 } = currentSettings;
    
    switch (clickTone) {
      case 'beep':
        generateClick(800, 0.1, volume);
        break;
      case 'click':
        generateClick(500, 0.05, volume);
        break;
      case 'tick':
        generateClick(1200, 0.03, volume);
        break;
      case 'woodblock':
        // Woodblock sound - knocking on wood effect
        generateClick(350, 0.2, volume); // Lower, longer base tone
        break;
      default:
        generateClick(1000, 0.05, volume);
    }
  }, [generateClick]);

  // Start metronome
  const startMetronome = useCallback(() => {
    initAudioContext();
    setSettings(prev => ({ ...prev, isPlaying: true }));

    const scheduleClick = () => {
      const currentTime = audioContextRef.current!.currentTime;
      // Read current settings dynamically
      const currentSettings = JSON.parse(localStorage.getItem('metronome_settings') || '{}');
      const currentBpm = currentSettings.bpm || 60;
      const isCurrentlyPlaying = currentSettings.isPlaying || false;
      
      // Stop if no longer playing
      if (!isCurrentlyPlaying) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      
      const interval = 60000 / currentBpm; // Convert BPM to milliseconds
      
      if (nextClickTimeRef.current === 0) {
        nextClickTimeRef.current = currentTime;
      }
      
      while (nextClickTimeRef.current < currentTime + 0.1) {
        playClick();
        nextClickTimeRef.current += interval / 1000;
      }
    };

    intervalRef.current = setInterval(scheduleClick, 25);
  }, [initAudioContext, playClick]);

  // Stop metronome
  const stopMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    nextClickTimeRef.current = 0;
    setSettings(prev => ({ ...prev, isPlaying: false }));
  }, []);



  // Update BPM with preview
  const setBpm = useCallback((bpm: number) => {
    const clampedBpm = Math.max(20, Math.min(250, bpm));
    setSettings(prev => ({ ...prev, bpm: clampedBpm }));
    
    // Play preview sound when BPM changes
    setTimeout(() => {
      initAudioContext();
      playClick();
    }, 50);
  }, [initAudioContext, playClick]);

  // Update click tone with preview
  const setClickTone = useCallback((tone: MetronomeSettings['clickTone']) => {
    setSettings(prev => ({ ...prev, clickTone: tone }));
    
    // Play preview sound when tone changes
    setTimeout(() => {
      initAudioContext();
      playClick();
    }, 50);
  }, [initAudioContext, playClick]);

  // Update volume with preview
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setSettings(prev => ({ ...prev, volume: clampedVolume }));
    
    // Play preview sound when volume changes (but only if volume is not 0)
    if (clampedVolume > 0) {
      setTimeout(() => {
        initAudioContext();
        playClick();
      }, 50);
    }
  }, [initAudioContext, playClick]);

  // Toggle play/pause
  const toggleMetronome = useCallback(() => {
    // Use current React state instead of localStorage for immediate UI updates
    if (settings.isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [settings.isPlaying, startMetronome, stopMetronome]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    settings,
    setBpm,
    setClickTone,
    setVolume,
    toggleMetronome,
    startMetronome,
    stopMetronome
  };
};
