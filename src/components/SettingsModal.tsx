import React from 'react';
import { Settings, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleCount: number;
  onCircleCountChange: (count: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, circleCount, onCircleCountChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Number of Circles
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