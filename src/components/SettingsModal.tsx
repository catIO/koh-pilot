import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TimerIcon from '@mui/icons-material/Timer';
import { MetronomeSettings } from '../hooks/useMetronome';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleCount: number;
  onCircleCountChange: (count: number) => void;
  metronomeSettings: MetronomeSettings;
  toggleMetronome: () => Promise<void>;
  setBpm: (bpm: number) => void;
  setClickTone: (tone: MetronomeSettings['clickTone']) => void;
  setVolume: (volume: number) => void;
  startMetronome: () => Promise<void>;
  stopMetronome: () => void;
  failureTrackingEnabled: boolean;
  onFailureTrackingToggle: (enabled: boolean) => void;
  timerDuration: number;
  onTimerDurationChange: (duration: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  circleCount, 
  onCircleCountChange,
  metronomeSettings,
  toggleMetronome,
  setBpm,
  setClickTone,
  setVolume,
  startMetronome,
  stopMetronome,
  failureTrackingEnabled,
  onFailureTrackingToggle,
  timerDuration,
  onTimerDurationChange
}) => {

  const [bpmInput, setBpmInput] = React.useState(metronomeSettings.bpm.toString());

  // Update input when metronome settings change
  React.useEffect(() => {
    setBpmInput(metronomeSettings.bpm.toString());
  }, [metronomeSettings.bpm]);

  if (!isOpen) return null;

  const clickTones = [
    { value: 'beep', label: 'Beep' },
    { value: 'click', label: 'Click' },
    { value: 'tick', label: 'Tick' },
    { value: 'woodblock', label: 'Woodblock' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <SettingsIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Repetitions Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Number of Repetitions
              </label>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => onCircleCountChange(num)}
                    className={`
                      p-3 rounded-lg font-medium transition-all duration-200
                      ${circleCount === num 
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Failure Tracking Section */}
            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <ErrorOutlineIcon className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Failure Tracking</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Track failures when clicking the fail button
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onFailureTrackingToggle(!failureTrackingEnabled)}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    failureTrackingEnabled
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-slate-700/50 hover:bg-slate-600/50 text-gray-300'
                  }`}
                >
                  {failureTrackingEnabled ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            {/* Countdown Timer Section */}
            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <TimerIcon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Interval Timer</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Rest timer duration between iterations
                  </p>
                </div>
              </div>

              {/* Timer Duration Control */}
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="3"
                  max="60"
                  value={timerDuration}
                  onChange={(e) => onTimerDurationChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="3"
                  max="300"
                  value={timerDuration}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      onTimerDurationChange(value);
                    }
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value);
                    if (isNaN(value) || value < 3) {
                      onTimerDurationChange(3);
                    } else if (value > 300) {
                      onTimerDurationChange(300);
                    }
                  }}
                  className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center text-sm focus:outline-none focus:border-indigo-500"
                />
                <span className="text-sm text-gray-300">sec</span>
              </div>
            </div>

            {/* Metronome Section */}
            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <MusicNoteIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Metronome</h3>
                </div>
                <button
                  onClick={toggleMetronome}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    metronomeSettings.isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  }`}
                >
                  {metronomeSettings.isPlaying ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayArrowIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* BPM Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  BPM
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="20"
                    max="250"
                    value={metronomeSettings.bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="number"
                    min="20"
                    max="250"
                    value={bpmInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBpmInput(value);
                      
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 20 && numValue <= 250) {
                        setBpm(numValue);
                      }
                    }}
                    onBlur={() => {
                      // Validate and set final value when input loses focus
                      const numValue = parseInt(bpmInput);
                      if (isNaN(numValue) || numValue < 20) {
                        setBpmInput('20');
                        setBpm(20);
                      } else if (numValue > 250) {
                        setBpmInput('250');
                        setBpm(250);
                      } else {
                        setBpmInput(numValue.toString());
                        setBpm(numValue);
                      }
                    }}
                    className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Click Tone Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Click Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {clickTones.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setClickTone(tone.value)}
                      className={`
                        p-3 rounded-lg font-medium transition-all duration-200 text-sm
                        ${metronomeSettings.clickTone === tone.value 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                        }
                      `}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Volume: {Math.round(metronomeSettings.volume * 100)}%
                </label>
                <div className="flex items-center space-x-3">
                  <VolumeUpIcon className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={metronomeSettings.volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/50">
              <button
                onClick={onClose}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/25"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SettingsModal;