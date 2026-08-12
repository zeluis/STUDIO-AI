import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minus, Copy, Trash2, Play } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommand?: string;
  soundEffects: boolean;
}

interface TerminalLog {
  cmd: string;
  output: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  isOpen,
  onClose,
  initialCommand,
  soundEffects,
}) => {
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      cmd: 'sw_vers',
      output: 'ProductName:\tMac OS X\nProductVersion:\t10.13.6\nBuildVersion:\t17G66',
    },
  ]);
  const [inputCmd, setInputCmd] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCommand) {
      executeCommand(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const executeCommand = async (cmdStr: string) => {
    if (!cmdStr.trim()) return;

    playClickSound(soundEffects);
    setIsExecuting(true);

    try {
      const res = await fetch('/api/terminal/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdStr }),
      });
      const data = await res.json();

      setLogs((prev) => [...prev, { cmd: cmdStr, output: data.output || '' }]);
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        { cmd: cmdStr, output: 'bash: command execution failed. Network error.' },
      ]);
    } finally {
      setIsExecuting(false);
      setInputCmd('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputCmd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-3xl bg-gray-950 border border-gray-700 rounded-xl shadow-2xl overflow-hidden font-mono text-xs text-gray-200 flex flex-col h-[500px]">
        {/* Terminal Titlebar */}
        <div className="h-8 px-3 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                playClickSound(soundEffects);
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-600/60 flex items-center justify-center group"
            >
              <X className="w-2 h-2 text-red-950 opacity-0 group-hover:opacity-100" />
            </button>
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/60" />
          </div>

          <div className="flex items-center space-x-1.5 text-gray-300 font-medium text-xs">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>developer — -bash — 80x24 (macOS High Sierra 10.13.6)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLogs([])}
              className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
              title="Clear Terminal"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 p-4 bg-black/90 text-emerald-400 overflow-y-auto space-y-3 font-mono leading-relaxed">
          <div className="text-gray-500 text-[11px] border-b border-gray-800 pb-2">
            Last login: {new Date().toLocaleTimeString()} on ttys001
            <br />
            Type <span className="text-emerald-300 font-bold">sw_vers</span>,{' '}
            <span className="text-emerald-300 font-bold">uname -a</span>, or{' '}
            <span className="text-emerald-300 font-bold">system_profiler</span> for High Sierra specs.
          </div>

          {logs.map((log, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <span className="text-sky-400">macbook-pro:ai-studio developer$</span>
                <span>{log.cmd}</span>
              </div>
              <pre className="whitespace-pre-wrap text-emerald-300 text-[11px] pl-2 font-mono">
                {log.output}
              </pre>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 pt-1 text-white">
            <span className="text-sky-400 font-bold">macbook-pro:ai-studio developer$</span>
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              disabled={isExecuting}
              placeholder={isExecuting ? 'Executing command...' : 'Type bash command...'}
              className="flex-1 bg-transparent border-none outline-none font-mono text-emerald-400 placeholder-gray-600 focus:ring-0"
              autoFocus
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
