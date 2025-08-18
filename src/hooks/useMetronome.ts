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
    const { clickTone, volume } = settings;
    
    switch (clickTone) {
      case 'beep':
        generateClick(800, 0.1, volume);
        break;
      case 'click':
        generateClick(1000, 0.05, volume);
        break;
      case 'tick':
        generateClick(1200, 0.03, volume);
        break;
      case 'woodblock':
        // Woodblock sound - multiple frequencies
        generateClick(200, 0.1, volume * 0.7);
        setTimeout(() => generateClick(400, 0.08, volume * 0.5), 10);
        setTimeout(() => generateClick(600, 0.06, volume * 0.3), 20);
        break;
      default:
        generateClick(1000, 0.05, volume);
    }
  }, [settings, generateClick]);

  // Start metronome
  const startMetronome = useCallback(() => {
    if (settings.isPlaying) return;

    initAudioContext();
    setSettings(prev => ({ ...prev, isPlaying: true }));

    const interval = 60000 / settings.bpm; // Convert BPM to milliseconds
    nextClickTimeRef.current = audioContextRef.current!.currentTime;

    const scheduleClick = () => {
      const currentTime = audioContextRef.current!.currentTime;
      
      while (nextClickTimeRef.current < currentTime + 0.1) {
        playClick();
        nextClickTimeRef.current += interval / 1000;
      }
    };

    intervalRef.current = setInterval(scheduleClick, 25);
  }, [settings.bpm, settings.isPlaying, initAudioContext, playClick]);

  // Stop metronome
  const stopMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSettings(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Update BPM
  const setBpm = useCallback((bpm: number) => {
    const clampedBpm = Math.max(20, Math.min(250, bpm));
    setSettings(prev => ({ ...prev, bpm: clampedBpm }));
  }, []);

  // Update click tone
  const setClickTone = useCallback((tone: MetronomeSettings['clickTone']) => {
    setSettings(prev => ({ ...prev, clickTone: tone }));
  }, []);

  // Update volume
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setSettings(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  // Toggle play/pause
  const toggleMetronome = useCallback(() => {
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
