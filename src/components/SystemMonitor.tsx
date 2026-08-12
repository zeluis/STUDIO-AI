import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, RefreshCw, XCircle, ShieldCheck } from 'lucide-react';
import { TelemetryData } from '../types';

export const SystemMonitor: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    vramUsedGB: 6.4,
    vramTotalGB: 8.0,
    cpuUsagePercent: 14.2,
    cpuCores: 8,
    activeThreads: 16,
    tokensPerSec: 48.5,
    gpuTempC: 54,
    apfsStorageGB: {
      system: 24.2,
      models: 8.5,
      user: 3.1,
      free: 464.2,
      total: 500.0,
    },
    processes: [
      { pid: 4820, name: 'HighSierra AI Core', cpu: 18.5, memoryMB: 1240, status: 'Running (Metal 2)' },
      { pid: 11434, name: 'ollama_inference_srv', cpu: 12.1, memoryMB: 2840, status: 'Listening (11434)' },
      { pid: 1234, name: 'lmstudio_express_proxy', cpu: 0.2, memoryMB: 256, status: 'Idle (1234)' },
      { pid: 8812, name: 'gemini_stream_bridge', cpu: 1.4, memoryMB: 180, status: 'Active (TLS)' },
      { pid: 1, name: 'launchd_darwin_kernel', cpu: 0.1, memoryMB: 18, status: 'System Root' },
    ],
  });

  const [history, setHistory] = useState<{ vram: number; cpu: number; speed: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cpuRand = Math.floor(Math.random() * 15 + 10);
      const vramRand = Number((Math.random() * 0.4 + 6.2).toFixed(1));
      const speedRand = Number((Math.random() * 6 + 45).toFixed(1));

      setTelemetry((prev) => ({
        ...prev,
        cpuUsagePercent: cpuRand,
        vramUsedGB: vramRand,
        tokensPerSec: speedRand,
        gpuTempC: Math.floor(Math.random() * 3 + 53),
      }));

      setHistory((prev) => {
        const next = [...prev, { vram: vramRand, cpu: cpuRand, speed: speedRand }];
        if (next.length > 25) next.shift();
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 font-sans text-xs select-none">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Activity Monitor & Metal 2 Telemetry
          </h2>
        </div>
        <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
          macOS 10.13.6 Kernel Telemetry Active
        </span>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Metal 2 VRAM */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 shadow-sm space-y-2">
          <div className="text-gray-500 dark:text-gray-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Metal 2 VRAM</span>
            <Cpu className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 font-mono">
            {telemetry.vramUsedGB} GB
          </div>
          <div className="text-[10px] text-gray-500">Allocated of {telemetry.vramTotalGB} GB Total</div>
        </div>

        {/* CPU Load */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 shadow-sm space-y-2">
          <div className="text-gray-500 dark:text-gray-400 text-[11px] font-semibold flex items-center justify-between">
            <span>CPU Compute Load</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {telemetry.cpuUsagePercent}%
          </div>
          <div className="text-[10px] text-gray-500">{telemetry.cpuCores} Cores / {telemetry.activeThreads} Threads</div>
        </div>

        {/* Token Output Speed */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 shadow-sm space-y-2">
          <div className="text-gray-500 dark:text-gray-400 text-[11px] font-semibold flex items-center justify-between">
            <span>Inference Speed</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
            {telemetry.tokensPerSec} tok/s
          </div>
          <div className="text-[10px] text-gray-500">Quantized GGUF Throughput</div>
        </div>

        {/* GPU Temperature */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 shadow-sm space-y-2">
          <div className="text-gray-500 dark:text-gray-400 text-[11px] font-semibold flex items-center justify-between">
            <span>GPU Thermal</span>
            <span className="font-mono font-bold text-amber-500">{telemetry.gpuTempC}°C</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
            Nominal
          </div>
          <div className="text-[10px] text-gray-500">AMD Radeon Metal 2 Pipeline</div>
        </div>
      </div>

      {/* SVG Telemetry Real-time Chart */}
      <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 text-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Telemetry Graph (CPU % & Metal VRAM GB)</span>
          </span>
          <span className="font-mono text-[10px] text-gray-400">Interval: 1.5s</span>
        </div>

        <div className="h-32 w-full relative flex items-end justify-between space-x-1 pt-4 px-2 border-b border-gray-800">
          {history.map((pt, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end space-y-0.5">
              <div
                style={{ height: `${pt.cpu * 2}%` }}
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t opacity-90"
                title={`CPU: ${pt.cpu}%`}
              />
              <div
                style={{ height: `${(pt.vram / 8) * 100}%` }}
                className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-t opacity-80"
                title={`VRAM: ${pt.vram} GB`}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono pt-1">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded bg-emerald-400" />
              <span>CPU Load %</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded bg-sky-400" />
              <span>Metal 2 VRAM (GB)</span>
            </span>
          </div>
          <span>macOS High Sierra 10.13.6</span>
        </div>
      </div>

      {/* Active Process List Table */}
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-gray-850/80 border border-gray-300 dark:border-gray-700 space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white">Active System Processes</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700 text-gray-400">
                <th className="py-2">PID</th>
                <th className="py-2">Process Name</th>
                <th className="py-2">% CPU</th>
                <th className="py-2">Memory MB</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {telemetry.processes.map((proc) => (
                <tr key={proc.pid} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="py-2 font-bold text-gray-500">{proc.pid}</td>
                  <td className="py-2 font-semibold text-gray-900 dark:text-white">{proc.name}</td>
                  <td className="py-2 text-emerald-600 dark:text-emerald-400">{proc.cpu}%</td>
                  <td className="py-2 text-sky-600 dark:text-sky-400">{proc.memoryMB} MB</td>
                  <td className="py-2 text-gray-600 dark:text-gray-300">{proc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
