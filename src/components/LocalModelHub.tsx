import React, { useState } from 'react';
import {
  Cpu,
  HardDrive,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  Layers,
  Server,
  Play,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AIModelSpec, DesktopSettings } from '../types';
import { playClickSound, playCompletionChime } from '../utils/audio';

interface LocalModelHubProps {
  availableModels: AIModelSpec[];
  activeModel: string;
  onSelectModel: (modelId: string) => void;
  settings: DesktopSettings;
  onUpdateSettings: (newSettings: Partial<DesktopSettings>) => void;
}

export const LocalModelHub: React.FC<LocalModelHubProps> = ({
  availableModels,
  activeModel,
  onSelectModel,
  settings,
  onUpdateSettings,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [loadingModelId, setLoadingModelId] = useState<string | null>(null);

  const handlePingServers = () => {
    playClickSound(settings.soundEffects);
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      playCompletionChime(settings.soundEffects);
    }, 800);
  };

  const handleLoadModel = (modelId: string) => {
    playClickSound(settings.soundEffects);
    setLoadingModelId(modelId);
    setTimeout(() => {
      onSelectModel(modelId);
      setLoadingModelId(null);
      playCompletionChime(settings.soundEffects);
    }, 1200);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 font-sans text-xs">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white font-mono text-[10px] font-bold">
              Metal 2 Unified GPU
            </span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Local LLM Model Hub & Server Pipeline
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Connect to Ollama (<span className="font-mono text-sky-600 dark:text-sky-400">11434</span>) & LM Studio (<span className="font-mono text-indigo-600 dark:text-indigo-400">1234</span>) or load local GGUF quantized models directly with Metal 2 VRAM offloading.
          </p>
        </div>

        <button
          onClick={handlePingServers}
          disabled={isPinging}
          className="px-4 py-2 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-xl font-medium shadow-md hover:from-sky-500 hover:to-sky-600 border border-sky-600 flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Pinging Servers...' : 'Refresh Local Servers'}</span>
        </button>
      </div>

      {/* Local Server Connection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ollama Server Box */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-sky-500" />
              <span className="font-bold text-gray-900 dark:text-white">Ollama Local Server</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>http://localhost:11434</span>
            </span>
          </div>

          <div className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
            Native Ollama runner detecting GGUF models. Metal 2 memory pipeline assigned with zero copy overhead.
          </div>
        </div>

        {/* LM Studio Box */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-gray-900 dark:text-white">LM Studio Local Server</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-mono text-[10px] font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>http://localhost:1234</span>
            </span>
          </div>

          <div className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">
            OpenAI-compatible local server interface. Ready for custom GGUF quantized models.
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-500" />
          <span>Available AI Models & Metal 2 Quantizations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModels.map((m) => {
            const isSelected = activeModel === m.id;
            const isLoadingThis = loadingModelId === m.id;

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/30'
                    : 'bg-white/80 dark:bg-gray-850/80 border-gray-300 dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{m.name}</h4>
                      {m.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-mono text-[9px] font-bold">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{m.description}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      m.type === 'cloud'
                        ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                        : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                    }`}
                  >
                    {m.provider}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-[10px] font-mono text-gray-600 dark:text-gray-300">
                  <div>
                    <span className="block text-gray-400">Required VRAM:</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{m.vramRequired}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Context Window:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {m.maxContext.toLocaleString()} tokens
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-400">Status:</span>
                    <span className="font-bold text-sky-500 uppercase">{m.status}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  {isSelected ? (
                    <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Active Engine in VRAM</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleLoadModel(m.id)}
                      disabled={isLoadingThis}
                      className="px-3 py-1.5 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-lg font-medium shadow hover:from-sky-500 hover:to-sky-600 border border-sky-600 flex items-center space-x-1"
                    >
                      {isLoadingThis ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Loading Metal 2 VRAM...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Load Model into VRAM</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hardware Configuration Sliders */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2 border-b border-gray-300 dark:border-gray-700 pb-2">
          <Sliders className="w-4 h-4 text-sky-500" />
          <span>Metal 2 Memory & Thread Allocations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Metal 2 GPU VRAM Offload:</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
                {settings.metalVramPercent}% GPU
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={settings.metalVramPercent}
              onChange={(e) => onUpdateSettings({ metalVramPercent: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span>CPU Compute Threads:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {settings.cpuThreads} Threads
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
      </div>
    </div>
  );
};
