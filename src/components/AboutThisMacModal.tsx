import React from 'react';
import { Apple, X, HardDrive, Cpu, ShieldCheck, Activity, Layers, Terminal } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AboutThisMacModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEffects: boolean;
  onOpenSystemReport: () => void;
}

export const AboutThisMacModal: React.FC<AboutThisMacModalProps> = ({
  isOpen,
  onClose,
  soundEffects,
  onOpenSystemReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-lg bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-400 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden font-sans text-gray-800 dark:text-gray-100">
        {/* Modal Window Header */}
        <div className="h-9 px-3 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-750 dark:to-gray-850 border-b border-gray-350 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                playClickSound(soundEffects);
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-600/60 flex items-center justify-center group shadow-sm"
            >
              <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/60" />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            About HighSierra AI Studio
          </span>
          <div className="w-12" />
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Apple Logo Icon */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/20">
              <Apple className="w-14 h-14 text-white fill-current" />
            </div>
            <span className="text-[10px] font-mono mt-2 text-gray-500 dark:text-gray-400">
              macOS 10.13.6
            </span>
          </div>

          {/* Machine Info */}
          <div className="flex-1 space-y-3 text-xs">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                macOS High Sierra
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-[11px]">
                Version 10.13.6 (Build 17G66)
              </p>
            </div>

            <div className="space-y-1.5 font-sans border-t border-b border-gray-300 dark:border-gray-700 py-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">MacBook Pro:</span>
                <span className="font-semibold">Retina, 15-inch, Mid 2015</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Processor:</span>
                <span>2.8 GHz Quad-Core Intel Core i7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Memory:</span>
                <span>16 GB 1600 MHz DDR3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Graphics:</span>
                <span className="text-sky-600 dark:text-sky-400 font-medium">
                  Metal 2 API Acceleration (8GB VRAM)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">AI Engines:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  Gemini 3.6 + Local GGUF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Serial Number:</span>
                <span className="font-mono text-gray-600 dark:text-gray-300">C02RL07XG8WP</span>
              </div>
            </div>

            {/* APFS Storage Gauge */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-semibold flex items-center space-x-1">
                  <HardDrive className="w-3 h-3 text-sky-500" />
                  <span>Macintosh HD (APFS Volume)</span>
                </span>
                <span className="font-mono text-gray-500 dark:text-gray-400">
                  464.2 GB free of 500 GB
                </span>
              </div>

              {/* APFS Bar */}
              <div className="h-3.5 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden flex p-0.5 border border-gray-400/40">
                <div className="h-full bg-sky-500 rounded-l-full w-[12%]" title="System (24.2 GB)" />
                <div className="h-full bg-indigo-500 w-[6%]" title="AI Models (8.5 GB)" />
                <div className="h-full bg-emerald-500 w-[3%]" title="User Cache (3.1 GB)" />
                <div className="h-full bg-gray-200 dark:bg-gray-800 flex-1 rounded-r-full" title="Free APFS Space" />
              </div>

              <div className="flex items-center space-x-3 text-[10px] text-gray-500 dark:text-gray-400 pt-0.5">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>System</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Quantized Models</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>User Data</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-gray-200/80 dark:bg-gray-850/80 border-t border-gray-300 dark:border-gray-700 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              playClickSound(soundEffects);
              onOpenSystemReport();
            }}
            className="px-3 py-1 bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 border border-gray-400 dark:border-gray-600 rounded-md font-medium text-gray-800 dark:text-gray-200 hover:from-sky-100 hover:to-sky-200 shadow-sm flex items-center space-x-1"
          >
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>Activity Monitor Report...</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEffects);
              onClose();
            }}
            className="px-4 py-1 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-md font-medium shadow-md hover:from-sky-500 hover:to-sky-600 border border-sky-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
