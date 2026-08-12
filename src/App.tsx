import React, { useState, useEffect } from 'react';
import { TopMenuBar } from './components/TopMenuBar';
import { WindowChrome } from './components/WindowChrome';
import { ChatStudio } from './components/ChatStudio';
import { LocalModelHub } from './components/LocalModelHub';
import { SystemMonitor } from './components/SystemMonitor';
import { PersonaStudio } from './components/PersonaStudio';
import { AboutThisMacModal } from './components/AboutThisMacModal';
import { SystemPreferencesModal } from './components/SystemPreferencesModal';
import { TerminalWindow } from './components/TerminalWindow';
import { SiriOverlay } from './components/SiriOverlay';
import { DesktopSettings, ConversationSession, AIModelSpec, WallpaperOption } from './types';
import { playStartupChime } from './utils/audio';

const STORAGE_KEY_SETTINGS = 'highsierra_ai_settings_v1';
const STORAGE_KEY_SESSIONS = 'highsierra_ai_sessions_v1';

const DEFAULT_SETTINGS: DesktopSettings = {
  wallpaper: 'lake',
  theme: 'aqua',
  soundEffects: true,
  startupChime: true,
  metalVramPercent: 80,
  cpuThreads: 8,
  contextLength: 8192,
  localEndpoint: 'http://localhost:11434',
  ollamaEndpoint: 'http://localhost:11434',
  lmStudioEndpoint: 'http://localhost:1234',
  defaultModel: 'gemini-3.6-flash',
  voiceSynthesis: true,
  speechRate: 1.0,
  fontSize: 'medium',
};

const INITIAL_MODELS: AIModelSpec[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Google Gemini 3.6 Flash',
    type: 'cloud',
    provider: 'Google Gemini',
    description: 'High-speed cloud AI model with ultra-low latency & multimodal capabilities.',
    vramRequired: 'Server Cloud',
    maxContext: 1048576,
    status: 'online',
    badge: 'Recommended',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Google Gemini 3.1 Pro',
    type: 'cloud',
    provider: 'Google Gemini',
    description: 'Deep reasoning cloud engine for complex coding & architectural problems.',
    vramRequired: 'Server Cloud',
    maxContext: 2097152,
    status: 'online',
    badge: 'Pro Reasoning',
  },
  {
    id: 'llama-3-8b-gguf',
    name: 'Llama 3 8B Instruct (GGUF Q4_K_M)',
    type: 'local',
    provider: 'Metal 2 Engine',
    description: 'Meta Llama 3 8B quantized for Metal 2 GPU VRAM offloading.',
    vramRequired: '5.2 GB VRAM',
    maxContext: 8192,
    status: 'ready',
    badge: 'Quantized',
  },
  {
    id: 'deepseek-r1-7b-gguf',
    name: 'DeepSeek R1 7B Distill (GGUF)',
    type: 'local',
    provider: 'Metal 2 Engine',
    description: 'Deep reasoning local LLM with chain-of-thought analysis.',
    vramRequired: '4.8 GB VRAM',
    maxContext: 16384,
    status: 'ready',
    badge: 'Deep Reasoner',
  },
  {
    id: 'qwen-2.5-7b-gguf',
    name: 'Qwen 2.5 7B Coder (GGUF)',
    type: 'local',
    provider: 'Metal 2 Engine',
    description: 'Alibaba Qwen 2.5 specialized code generation model.',
    vramRequired: '4.6 GB VRAM',
    maxContext: 32768,
    status: 'ready',
    badge: 'Code Master',
  },
  {
    id: 'mistral-7b-gguf',
    name: 'Mistral 7B Instruct v0.3 (GGUF)',
    type: 'local',
    provider: 'Metal 2 Engine',
    description: 'Mistral AI fast 7B local model for swift general responses.',
    vramRequired: '4.4 GB VRAM',
    maxContext: 8192,
    status: 'ready',
  },
];

export default function App() {
  // Desktop Settings State
  const [settings, setSettings] = useState<DesktopSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // Sessions State
  const [sessions, setSessions] = useState<ConversationSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    const initialSession: ConversationSession = {
      id: `sess-${Date.now()}`,
      title: 'macOS High Sierra AI Studio Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      systemPrompt: 'You are HighSierra AI Studio, a modern macOS 10.13 High Sierra desktop assistant.',
      model: 'gemini-3.6-flash',
      temperature: 0.7,
      topP: 0.95,
      messages: [],
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'chat' | 'local' | 'monitor' | 'persona'>('chat');
  const [activeModel, setActiveModel] = useState<string>('gemini-3.6-flash');

  // Modals & Overlays
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInitialCmd, setTerminalInitialCmd] = useState<string>('');
  const [isSiriOpen, setIsSiriOpen] = useState(false);

  // Telemetry loop stats
  const [cpuUsage, setCpuUsage] = useState(14.2);
  const [vramUsed, setVramUsed] = useState(6.4);

  // Save Settings & Sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  // Telemetry loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 12 + 12));
      setVramUsed(Number((Math.random() * 0.4 + 6.2).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Active Session
  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions[0] || {
      id: 'sess-default',
      title: 'New Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      systemPrompt: 'You are HighSierra AI Studio, a modern macOS 10.13 High Sierra desktop assistant.',
      model: activeModel,
      temperature: 0.7,
      topP: 0.95,
      messages: [],
    };

  const handleUpdateSettings = (newSettings: Partial<DesktopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpdateSession = (updatedSession: ConversationSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleNewSession = () => {
    const newS: ConversationSession = {
      id: `sess-${Date.now()}`,
      title: 'New Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      systemPrompt: 'You are HighSierra AI Studio, a modern macOS 10.13 High Sierra desktop assistant.',
      model: activeModel,
      temperature: 0.7,
      topP: 0.95,
      messages: [],
    };
    setSessions([newS, ...sessions]);
    setActiveSessionId(newS.id);
  };

  const handleImportSession = (importedSession: ConversationSession) => {
    // Ensure unique ID if session already exists
    const existingIndex = sessions.findIndex((s) => s.id === importedSession.id);
    let finalSession = { ...importedSession };

    if (existingIndex !== -1) {
      finalSession.id = `sess-imported-${Date.now()}`;
    }

    setSessions((prev) => [finalSession, ...prev]);
    setActiveSessionId(finalSession.id);
  };

  const handleOpenTerminalWithCommand = (cmd: string) => {
    setTerminalInitialCmd(cmd);
    setIsTerminalOpen(true);
  };

  const handleSelectPersonaPrompt = (prompt: string, model?: string) => {
    handleUpdateSession({
      ...activeSession,
      systemPrompt: prompt,
      model: model || activeSession.model,
    });
    if (model) setActiveModel(model);
    setActiveTab('chat');
  };

  // Get Background Wallpaper
  const getWallpaperStyle = (wp: WallpaperOption): React.CSSProperties => {
    switch (wp) {
      case 'sunset':
        return {
          background: 'linear-gradient(135deg, #964f58 0%, #cfb4a4 100%)',
        };
      case 'snow':
        return {
          background: 'linear-gradient(135deg, #4d5c6e 0%, #9baab8 100%)',
        };
      case 'granite':
        return {
          background: 'linear-gradient(135deg, #2b333c 0%, #636f7d 100%)',
        };
      case 'space':
        return {
          background: 'linear-gradient(135deg, #1b2838 0%, #3e536c 100%)',
        };
      case 'lake':
      default:
        return {
          background: 'linear-gradient(135deg, #4f6f96 0%, #a4b9cf 100%)',
          backgroundImage:
            'radial-gradient(at 0% 0%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(0,0,0,0.1) 0%, transparent 50%)',
        };
    }
  };

  return (
    <div
      style={getWallpaperStyle(settings.wallpaper)}
      className="min-h-screen w-full h-screen overflow-hidden flex flex-col relative font-sans text-gray-900 select-none"
    >
      {/* Top macOS Menu Bar */}
      <TopMenuBar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenAboutModal={() => setIsAboutOpen(true)}
        onOpenPreferencesModal={() => setIsPreferencesOpen(true)}
        onOpenTerminal={() => {
          setTerminalInitialCmd('system_profiler');
          setIsTerminalOpen(true);
        }}
        onToggleSiri={() => setIsSiriOpen(!isSiriOpen)}
        onSelectTab={setActiveTab}
        onNewChat={handleNewSession}
        activeModel={activeModel}
        onSelectModel={setActiveModel}
        availableModels={INITIAL_MODELS}
        cpuUsage={cpuUsage}
        vramUsed={vramUsed}
      />

      {/* Main Desktop Workspace Area */}
      <div className="flex-1 overflow-hidden p-2 flex items-center justify-center">
        <WindowChrome
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          theme={settings.theme}
          soundEffects={settings.soundEffects}
          onOpenTerminal={() => {
            setTerminalInitialCmd('sw_vers');
            setIsTerminalOpen(true);
          }}
        >
          {activeTab === 'chat' && (
            <ChatStudio
              session={activeSession}
              onUpdateSession={handleUpdateSession}
              onNewSession={handleNewSession}
              onImportSession={handleImportSession}
              allSessions={sessions}
              onSelectSession={setActiveSessionId}
              settings={settings}
              availableModels={INITIAL_MODELS}
              onOpenTerminalWithCommand={handleOpenTerminalWithCommand}
            />
          )}

          {activeTab === 'local' && (
            <LocalModelHub
              availableModels={INITIAL_MODELS}
              activeModel={activeModel}
              onSelectModel={setActiveModel}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {activeTab === 'monitor' && <SystemMonitor />}

          {activeTab === 'persona' && (
            <PersonaStudio
              onSelectPersonaPrompt={handleSelectPersonaPrompt}
              settings={settings}
            />
          )}
        </WindowChrome>
      </div>

      {/* Modals & Overlays */}
      <AboutThisMacModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        soundEffects={settings.soundEffects}
        onOpenSystemReport={() => {
          setIsAboutOpen(false);
          setActiveTab('monitor');
        }}
      />

      <SystemPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <TerminalWindow
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        initialCommand={terminalInitialCmd}
        soundEffects={settings.soundEffects}
      />

      <SiriOverlay
        isOpen={isSiriOpen}
        onClose={() => setIsSiriOpen(false)}
        soundEffects={settings.soundEffects}
        activeModel={activeModel}
      />
    </div>
  );
}
