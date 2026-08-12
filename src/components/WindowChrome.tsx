import React, { useState } from 'react';
import { MessageSquare, Cpu, Activity, UserCheck, Terminal, Maximize2, Minimize2, Minus, X, RefreshCw } from 'lucide-react';
import { ThemeOption } from '../types';
import { playClickSound } from '../utils/audio';

interface WindowChromeProps {
  children: React.ReactNode;
  activeTab: 'chat' | 'local' | 'monitor' | 'persona';
  onSelectTab: (tab: 'chat' | 'local' | 'monitor' | 'persona') => void;
  theme: ThemeOption;
  soundEffects: boolean;
  onOpenTerminal: () => void;
  title?: string;
}

export const WindowChrome: React.FC<WindowChromeProps> = ({
  children,
  activeTab,
  onSelectTab,
  theme,
  soundEffects,
  onOpenTerminal,
  title = 'HighSierra AI Studio 10.13.6',
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const getThemeStyles = () => {
    switch (theme) {
      case 'darksierra':
        return 'bg-gray-900 text-gray-100 border-gray-700 shadow-2xl';
      case 'brushedmetal':
        return 'bg-[#e5e5e5] text-gray-900 border-white/50 shadow-2xl';
      case 'aqua':
      default:
        return 'bg-[#f0f0f0] dark:bg-gray-900 text-gray-900 border-white/40 shadow-2xl';
    }
  };

  const getTitleBarTheme = () => {
    switch (theme) {
      case 'darksierra':
        return 'bg-gradient-to-b from-gray-800 to-gray-850 border-gray-700 text-gray-200';
      case 'brushedmetal':
        return 'bg-gradient-to-b from-[#e0e0e0] to-[#c4c4c4] border-[#a0a0a0] text-[#333]';
      case 'aqua':
      default:
        return 'bg-gradient-to-b from-[#e8e8e8] to-[#cecece] dark:from-gray-800 dark:to-gray-850 border-[#a0a0a0] dark:border-gray-700 text-[#444] dark:text-gray-200';
    }
  };

  return (
    <div
      className={`transition-all duration-300 flex flex-col rounded-xl overflow-hidden border ${getThemeStyles()} ${
        isMaximized ? 'w-full h-[calc(100vh-1.5rem)] my-0 rounded-none' : 'w-full max-w-7xl h-[calc(100vh-3.2rem)] my-1'
      }`}
    >
      {/* macOS High Sierra Titlebar */}
      <div
        className={`h-12 px-4 flex items-center justify-between border-b select-none relative ${getTitleBarTheme()}`}
      >
        {/* Traffic Light Window Controls */}
        <div className="flex items-center space-x-2 w-32 shrink-0">
          <button
            onClick={() => {
              playClickSound(soundEffects);
              setIsMinimized(false);
              setIsMaximized(false);
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center group shadow-sm transition-transform active:scale-90"
            title="Close / Reset Window"
          >
            <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => {
              playClickSound(soundEffects);
              setIsMinimized(!isMinimized);
            }}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center group shadow-sm transition-transform active:scale-90"
            title="Minimize Window"
          >
            <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => {
              playClickSound(soundEffects);
              setIsMaximized(!isMaximized);
            }}
            className="w-3 h-3 rounded-full bg-[#28c940] border border-[#1aab29] flex items-center justify-center group shadow-sm transition-transform active:scale-90"
            title="Zoom / Fullscreen Window"
          >
            <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex-1 flex justify-center">
          <div className="flex bg-[#b8b8b8]/30 dark:bg-black/30 rounded-[5px] p-[1px] border border-black/10 overflow-hidden shadow-inner">
            <button
              onClick={() => {
                playClickSound(soundEffects);
                onSelectTab('chat');
              }}
              className={`px-4 py-1 text-[11px] font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-black rounded-[4px] shadow-sm font-bold'
                  : 'text-[#444] dark:text-gray-300 hover:text-black hover:bg-white/40'
              }`}
            >
              Chat
            </button>

            <button
              onClick={() => {
                playClickSound(soundEffects);
                onSelectTab('local');
              }}
              className={`px-4 py-1 text-[11px] font-medium transition-all ${
                activeTab === 'local'
                  ? 'bg-white text-black rounded-[4px] shadow-sm font-bold'
                  : 'text-[#444] dark:text-gray-300 hover:text-black hover:bg-white/40'
              }`}
            >
              Models
            </button>

            <button
              onClick={() => {
                playClickSound(soundEffects);
                onSelectTab('monitor');
              }}
              className={`px-4 py-1 text-[11px] font-medium transition-all ${
                activeTab === 'monitor'
                  ? 'bg-white text-black rounded-[4px] shadow-sm font-bold'
                  : 'text-[#444] dark:text-gray-300 hover:text-black hover:bg-white/40'
              }`}
            >
              Activity Monitor
            </button>

            <button
              onClick={() => {
                playClickSound(soundEffects);
                onSelectTab('persona');
              }}
              className={`px-4 py-1 text-[11px] font-medium transition-all ${
                activeTab === 'persona'
                  ? 'bg-white text-black rounded-[4px] shadow-sm font-bold'
                  : 'text-[#444] dark:text-gray-300 hover:text-black hover:bg-white/40'
              }`}
            >
              Personas
            </button>
          </div>
        </div>

        {/* Right Terminal Launcher & Info Button */}
        <div className="flex items-center space-x-2 w-32 justify-end shrink-0">
          <button
            onClick={onOpenTerminal}
            className="px-2.5 py-1 rounded-[4px] bg-white/40 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 text-[#444] dark:text-gray-200 flex items-center space-x-1 text-[11px] font-medium border border-black/10"
            title="Open HighSierra Terminal Shell"
          >
            <Terminal className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline font-mono text-[10px]">Terminal</span>
          </button>
        </div>
      </div>

      {/* Main Window Body */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm">
          {children}
        </div>
      )}

      {/* Minimized Dock Bar Preview */}
      {isMinimized && (
        <div className="p-4 bg-gray-200/90 dark:bg-gray-800/90 text-center text-xs flex items-center justify-between">
          <span className="font-mono text-gray-600 dark:text-gray-300">
            HighSierra AI Studio (Window Minimized to Dock)
          </span>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-3 py-1 bg-sky-500 text-white rounded text-xs hover:bg-sky-600 shadow"
          >
            Restore Window
          </button>
        </div>
      )}
    </div>
  );
};
