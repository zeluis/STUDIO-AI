import React, { useState, useEffect, useRef } from 'react';
import { Apple, Wifi, Sparkles, Cpu, HardDrive, Terminal as TerminalIcon, Sliders, Info, ShieldCheck, Activity, Layers, ExternalLink } from 'lucide-react';
import { DesktopSettings, AIModelSpec } from '../types';
import { playClickSound } from '../utils/audio';

interface TopMenuBarProps {
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: Partial<DesktopSettings>) => void;
  onOpenAboutModal: () => void;
  onOpenPreferencesModal: () => void;
  onOpenTerminal: () => void;
  onToggleSiri: () => void;
  onSelectTab: (tab: 'chat' | 'local' | 'monitor' | 'persona') => void;
  onNewChat: () => void;
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  availableModels: AIModelSpec[];
  cpuUsage: number;
  vramUsed: number;
}

export const TopMenuBar: React.FC<TopMenuBarProps> = ({
  settings,
  onUpdateSettings,
  onOpenAboutModal,
  onOpenPreferencesModal,
  onOpenTerminal,
  onToggleSiri,
  onSelectTab,
  onNewChat,
  activeModel,
  onSelectModel,
  availableModels,
  cpuUsage,
  vramUsed,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      };
      setCurrentTime(now.toLocaleString('en-US', options).replace(',', ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    playClickSound(settings.soundEffects);
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  return (
    <div
      ref={menuRef}
      className="relative z-50 h-6 bg-white/80 dark:bg-gray-850/80 backdrop-blur-md border-b border-black/10 text-[13px] text-black dark:text-gray-100 font-sans flex items-center justify-between px-4 select-none"
    >
      {/* Left Menu Items */}
      <div className="flex items-center space-x-1">
        {/* Apple Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('apple')}
            className={`px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center transition-colors ${
              activeMenu === 'apple' ? 'bg-black/15 dark:bg-white/20' : ''
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-black dark:text-white fill-current" />
          </button>
          {activeMenu === 'apple' && (
            <div className="absolute top-6 left-0 w-64 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-b-md shadow-2xl py-1 text-xs text-gray-800 dark:text-gray-200 z-50">
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenAboutModal();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span className="font-medium">About HighSierra AI Studio</span>
                <Info className="w-3.5 h-3.5" />
              </button>
              <div className="my-1 border-t border-gray-300 dark:border-gray-700" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenPreferencesModal();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>System Preferences...</span>
                <Sliders className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSelectTab('monitor');
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>Activity Monitor (Metal 2 VRAM)</span>
                <Activity className="w-3.5 h-3.5" />
              </button>
              <div className="my-1 border-t border-gray-300 dark:border-gray-700" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenTerminal();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>HighSierra Terminal Shell</span>
                <TerminalIcon className="w-3.5 h-3.5" />
              </button>
              <div className="my-1 border-t border-gray-300 dark:border-gray-700" />
              <div className="px-4 py-1 text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>macOS Version</span>
                <span className="font-mono">10.13.6 (17G66)</span>
              </div>
            </div>
          )}
        </div>

        {/* App Title Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('app')}
            className={`px-2 py-0.5 rounded font-bold hover:bg-black/10 dark:hover:bg-white/10 ${
              activeMenu === 'app' ? 'bg-black/15 dark:bg-white/20' : ''
            }`}
          >
            HighSierra AI Studio
          </button>
          {activeMenu === 'app' && (
            <div className="absolute top-6 left-0 w-56 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-b-md shadow-2xl py-1 text-xs text-gray-800 dark:text-gray-200 z-50">
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenPreferencesModal();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>Preferences...</span>
                <span className="text-[10px] text-gray-400">⌘,</span>
              </button>
              <div className="my-1 border-t border-gray-300 dark:border-gray-700" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onNewChat();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>New AI Session</span>
                <span className="text-[10px] text-gray-400">⌘N</span>
              </button>
            </div>
          )}
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('file')}
            className={`px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 ${
              activeMenu === 'file' ? 'bg-black/15 dark:bg-white/20' : ''
            }`}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="absolute top-6 left-0 w-48 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-b-md shadow-2xl py-1 text-xs text-gray-800 dark:text-gray-200 z-50">
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onNewChat();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>New Conversation</span>
                <span className="text-[10px] text-gray-400">⌘N</span>
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSelectTab('local');
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>Local Model Hub</span>
                <HardDrive className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Model Engine Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('model')}
            className={`px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center space-x-1 ${
              activeMenu === 'model' ? 'bg-black/15 dark:bg-white/20' : ''
            }`}
          >
            <span>Model</span>
            <span className="text-[10px] px-1 bg-sky-500/20 text-sky-600 dark:text-sky-300 rounded font-mono">
              {availableModels.find((m) => m.id === activeModel)?.name || activeModel}
            </span>
          </button>
          {activeMenu === 'model' && (
            <div className="absolute top-6 left-0 w-64 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-b-md shadow-2xl py-1 text-xs text-gray-800 dark:text-gray-200 z-50">
              <div className="px-3 py-1 font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                Cloud Gemini Engines
              </div>
              {availableModels
                .filter((m) => m.type === 'cloud')
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setActiveMenu(null);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-sky-500 hover:text-white flex items-center justify-between ${
                      activeModel === m.id ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-[10px] opacity-75">{m.description}</div>
                    </div>
                    {activeModel === m.id && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                ))}
              <div className="my-1 border-t border-gray-300 dark:border-gray-700" />
              <div className="px-3 py-1 font-semibold text-[10px] text-gray-400 uppercase tracking-wider">
                Local GGUF Metal 2 Models
              </div>
              {availableModels
                .filter((m) => m.type === 'local')
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setActiveMenu(null);
                    }}
                    className={`w-full text-left px-4 py-1.5 hover:bg-sky-500 hover:text-white flex items-center justify-between ${
                      activeModel === m.id ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-[10px] opacity-75">{m.vramRequired}</div>
                    </div>
                    {activeModel === m.id && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('view')}
            className={`px-2 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 ${
              activeMenu === 'view' ? 'bg-black/15 dark:bg-white/20' : ''
            }`}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className="absolute top-6 left-0 w-52 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-700 rounded-b-md shadow-2xl py-1 text-xs text-gray-800 dark:text-gray-200 z-50">
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSelectTab('chat');
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white"
              >
                Chat Studio Workspace
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSelectTab('local');
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white"
              >
                Local Model Hub
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSelectTab('monitor');
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white"
              >
                Activity Monitor & Telemetry
              </button>
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onSelectTab('persona');
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white"
              >
                System Prompt Persona Studio
              </button>
              <div className="my-1 border-t border-gray-300 dark:border-gray-700" />
              <button
                onClick={() => {
                  setActiveMenu(null);
                  onOpenTerminal();
                }}
                className="w-full text-left px-4 py-1 hover:bg-sky-500 hover:text-white flex items-center justify-between"
              >
                <span>HighSierra Terminal Shell</span>
                <span className="text-[10px] text-gray-400">⌥⌘T</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Menu Items & Telemetry */}
      <div className="flex items-center space-x-3 text-[11px] font-mono">
        {/* Metal VRAM Indicator */}
        <div
          onClick={() => onSelectTab('monitor')}
          className="cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 px-1.5 py-0.5 rounded flex items-center space-x-1"
          title="Metal 2 VRAM Allocation"
        >
          <Cpu className="w-3 h-3 text-sky-500" />
          <span className="hidden sm:inline">Metal 2:</span>
          <span className="font-semibold text-sky-600 dark:text-sky-400">{vramUsed.toFixed(1)}GB</span>
        </div>

        {/* CPU Load Indicator */}
        <div
          onClick={() => onSelectTab('monitor')}
          className="cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 px-1.5 py-0.5 rounded flex items-center space-x-1"
          title="CPU Compute Load"
        >
          <Activity className="w-3 h-3 text-emerald-500" />
          <span className="hidden sm:inline">CPU:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cpuUsage}%</span>
        </div>

        {/* Wi-Fi Icon */}
        <Wifi className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" title="Connected to High Sierra Network" />

        {/* Siri AI Trigger Button */}
        <button
          onClick={onToggleSiri}
          className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow hover:opacity-90 transition-opacity"
          title="Trigger Siri AI Floating Assistant"
        >
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span className="text-[10px] font-sans font-medium hidden md:inline">Siri AI</span>
        </button>

        {/* Clock */}
        <span className="font-sans font-medium text-gray-800 dark:text-gray-100">{currentTime}</span>
      </div>
    </div>
  );
};
