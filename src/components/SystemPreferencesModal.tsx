import React from 'react';
import { X, Sliders, Volume2, Cpu, Image as ImageIcon, Sparkles, HardDrive, Shield, Check } from 'lucide-react';
import { DesktopSettings, WallpaperOption, ThemeOption } from '../types';
import { playClickSound, playStartupChime } from '../utils/audio';

interface SystemPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: Partial<DesktopSettings>) => void;
}

export const SystemPreferencesModal: React.FC<SystemPreferencesModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const wallpapers: { id: WallpaperOption; name: string; gradient: string }[] = [
    { id: 'lake', name: 'High Sierra Lake', gradient: 'from-blue-600 via-indigo-600 to-purple-800' },
    { id: 'sunset', name: 'High Sierra Sunset', gradient: 'from-amber-500 via-rose-600 to-purple-900' },
    { id: 'snow', name: 'Alpine Snow', gradient: 'from-slate-300 via-slate-400 to-slate-600' },
    { id: 'granite', name: 'Yosemite Granite', gradient: 'from-zinc-700 via-stone-800 to-black' },
    { id: 'space', name: 'Space Dark', gradient: 'from-indigo-950 via-slate-900 to-black' },
  ];

  const themes: { id: ThemeOption; name: string; desc: string }[] = [
    { id: 'aqua', name: 'Aqua Silver', desc: 'Classic macOS 10.13 Light Silver' },
    { id: 'darksierra', name: 'Dark Sierra', desc: 'Modern High Sierra Dark Mode' },
    { id: 'brushedmetal', name: 'Brushed Metal', desc: 'Retro macOS Aluminum Texture' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-2xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-400 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden font-sans text-gray-800 dark:text-gray-100">
        {/* Modal Window Header */}
        <div className="h-9 px-3 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-750 dark:to-gray-850 border-b border-gray-350 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                playClickSound(settings.soundEffects);
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-600/60 flex items-center justify-center group shadow-sm"
            >
              <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/60" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5 text-sky-500" />
            <span>System Preferences</span>
          </span>
          <div className="w-12" />
        </div>

        {/* Preferences Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* Wallpapers Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center space-x-1.5 border-b border-gray-300 dark:border-gray-700 pb-1.5">
              <ImageIcon className="w-4 h-4 text-sky-500" />
              <span>Desktop Wallpaper</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => {
                    playClickSound(settings.soundEffects);
                    onUpdateSettings({ wallpaper: wp.id });
                  }}
                  className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                    settings.wallpaper === wp.id
                      ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/50'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className={`w-full h-12 rounded-md bg-gradient-to-br ${wp.gradient} shadow-inner mb-1.5`} />
                  <span className="text-[11px] font-medium text-center line-clamp-1">{wp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Theme Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center space-x-1.5 border-b border-gray-300 dark:border-gray-700 pb-1.5">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span>Window Theme & Styling</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    playClickSound(settings.soundEffects);
                    onUpdateSettings({ theme: th.id });
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    settings.theme === th.id
                      ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/50'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="font-medium text-xs text-gray-900 dark:text-white flex items-center justify-between">
                    <span>{th.name}</span>
                    {settings.theme === th.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{th.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hardware Acceleration & Tuning */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center space-x-1.5 border-b border-gray-300 dark:border-gray-700 pb-1.5">
              <Cpu className="w-4 h-4 text-sky-500" />
              <span>Metal 2 GPU VRAM & CPU Hardware Tuning</span>
            </h3>

            {/* VRAM Slider */}
            <div className="space-y-1.5 bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="flex justify-between items-center font-medium">
                <span>Metal 2 VRAM Offload:</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
                  {settings.metalVramPercent}% GPU Unified VRAM
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.metalVramPercent}
                onChange={(e) => onUpdateSettings({ metalVramPercent: Number(e.target.value) })}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                <span>0% (CPU Only)</span>
                <span>50% (Balanced)</span>
                <span>100% (Full Metal 2 GPU)</span>
              </div>
            </div>

            {/* CPU Threads Slider */}
            <div className="space-y-1.5 bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="flex justify-between items-center font-medium">
                <span>CPU Compute Threads:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {settings.cpuThreads} Threads Allocated
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={settings.cpuThreads}
                onChange={(e) => onUpdateSettings({ cpuThreads: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Sound & Audio Effects */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex items-center space-x-1.5 border-b border-gray-300 dark:border-gray-700 pb-1.5">
              <Volume2 className="w-4 h-4 text-sky-500" />
              <span>macOS Audio Effects & Chimes</span>
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-300 dark:border-gray-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
                  className="rounded text-sky-500 focus:ring-sky-500"
                />
                <span className="font-medium">Enable macOS UI Audio Chimes & Sound Effects</span>
              </label>

              <button
                onClick={() => playStartupChime(true)}
                className="px-3 py-1 bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 border border-gray-400 dark:border-gray-600 rounded text-xs font-medium hover:from-sky-100 hover:to-sky-200 shadow-sm"
              >
                Test Startup Chime
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-200/80 dark:bg-gray-850/80 border-t border-gray-300 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => {
              playClickSound(settings.soundEffects);
              onClose();
            }}
            className="px-5 py-1 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-md font-medium shadow-md hover:from-sky-500 hover:to-sky-600 border border-sky-600"
          >
            Close Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
