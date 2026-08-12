export type WallpaperOption = 'lake' | 'sunset' | 'snow' | 'granite' | 'space';
export type ThemeOption = 'aqua' | 'darksierra' | 'brushedmetal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model: string;
  image?: string; // base64 or data URL
  codeBlocks?: { language: string; code: string }[];
  executionOutput?: string;
  tokenCount?: number;
  latencyMs?: number;
  isStreaming?: boolean;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  topP: number;
  messages: ChatMessage[];
}

export interface AIModelSpec {
  id: string;
  name: string;
  type: 'cloud' | 'local';
  provider: 'Google Gemini' | 'Ollama Local' | 'LM Studio Local' | 'Metal 2 Engine';
  description: string;
  vramRequired: string;
  maxContext: number;
  status: 'online' | 'ready' | 'connecting' | 'offline';
  badge?: string;
  quantization?: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string; // emoji or icon name
  description: string;
  systemPrompt: string;
  defaultModel: string;
  defaultTemp: number;
  tags: string[];
  isCustom?: boolean;
}

export interface TelemetryData {
  vramUsedGB: number;
  vramTotalGB: number;
  cpuUsagePercent: number;
  cpuCores: number;
  activeThreads: number;
  tokensPerSec: number;
  gpuTempC: number;
  apfsStorageGB: {
    system: number;
    models: number;
    user: number;
    free: number;
    total: number;
  };
  processes: {
    pid: number;
    name: string;
    cpu: number;
    memoryMB: number;
    status: string;
  }[];
}

export interface DesktopSettings {
  wallpaper: WallpaperOption;
  theme: ThemeOption;
  soundEffects: boolean;
  startupChime: boolean;
  metalVramPercent: number;
  cpuThreads: number;
  contextLength: number;
  localEndpoint: string;
  ollamaEndpoint: string;
  lmStudioEndpoint: string;
  defaultModel: string;
  voiceSynthesis: boolean;
  speechRate: number;
  fontSize: 'small' | 'medium' | 'large';
}
