import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Copy,
  Terminal,
  Volume2,
  VolumeX,
  Sliders,
  Trash2,
  Plus,
  Sparkles,
  Bot,
  User,
  Clock,
  Zap,
  Check,
  ChevronRight,
  ShieldAlert,
  Mic,
  MicOff,
  Download,
  Upload,
  FileText,
  FileJson,
  Cpu,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage, ConversationSession, DesktopSettings, AIModelSpec } from '../types';
import { playSendSound, playCompletionChime, playClickSound } from '../utils/audio';

interface ChatStudioProps {
  session: ConversationSession;
  onUpdateSession: (updatedSession: ConversationSession) => void;
  onNewSession: () => void;
  onImportSession: (importedSession: ConversationSession) => void;
  allSessions: ConversationSession[];
  onSelectSession: (id: string) => void;
  settings: DesktopSettings;
  availableModels: AIModelSpec[];
  onOpenTerminalWithCommand: (cmd: string) => void;
}

export const ChatStudio: React.FC<ChatStudioProps> = ({
  session,
  onUpdateSession,
  onNewSession,
  onImportSession,
  allSessions,
  onSelectSession,
  settings,
  availableModels,
  onOpenTerminalWithCommand,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Web Speech API Dictation
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, isGenerating]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Calculate live prompt tokens
  const currentModelObj = availableModels.find((m) => m.id === session.model) || availableModels[0];
  const maxContext = currentModelObj?.maxContext || 8192;
  const textTokenEst = inputPrompt.trim() ? Math.ceil(inputPrompt.length / 3.8) : 0;
  const imageTokenEst = attachedImage ? 258 : 0;
  const totalPromptTokens = textTokenEst + imageTokenEst;
  const tokenPercent = Math.min((totalPromptTokens / maxContext) * 100, 100);

  // Toggle Web Speech API Dictation
  const toggleSpeechRecognition = () => {
    playClickSound(settings.soundEffects);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Web Speech API is not supported in this browser environment.');
      setTimeout(() => setSpeechError(null), 3500);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputPrompt((prev) => (prev ? prev.trim() + ' ' + transcript.trim() : transcript.trim()));
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setSpeechError(`Speech error: ${event.error}`);
          setTimeout(() => setSpeechError(null), 3500);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // Export handlers
  const handleExportJSON = () => {
    playClickSound(settings.soundEffects);
    setShowExportMenu(false);
    const jsonString = JSON.stringify(session, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(session.title || 'chat_session').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playCompletionChime(settings.soundEffects);
  };

  const handleExportTXT = () => {
    playClickSound(settings.soundEffects);
    setShowExportMenu(false);
    let txt = `=== HighSierra AI Studio Session Transcript ===\n`;
    txt += `Title: ${session.title}\n`;
    txt += `Model: ${session.model}\n`;
    txt += `Created: ${session.createdAt}\n`;
    txt += `System Prompt: ${session.systemPrompt}\n`;
    txt += `===============================================\n\n`;

    session.messages.forEach((msg) => {
      const roleName = msg.role === 'user' ? 'User' : `AI Assistant (${msg.model || session.model})`;
      txt += `[${roleName} - ${msg.timestamp}]\n`;
      txt += `${msg.content}\n\n`;
      if (msg.codeBlocks && msg.codeBlocks.length > 0) {
        msg.codeBlocks.forEach((cb) => {
          txt += `--- Code Snippet (${cb.language}) ---\n${cb.code}\n--------------------\n\n`;
        });
      }
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(session.title || 'chat_session').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    playCompletionChime(settings.soundEffects);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (Array.isArray(parsed.messages) || parsed.title)) {
          const importedSession: ConversationSession = {
            id: parsed.id || `sess-import-${Date.now()}`,
            title: parsed.title || file.name.replace('.json', ''),
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            systemPrompt: parsed.systemPrompt || 'You are HighSierra AI Studio, a modern macOS 10.13 High Sierra desktop assistant.',
            model: parsed.model || session.model,
            temperature: parsed.temperature ?? 0.7,
            topP: parsed.topP ?? 0.95,
            messages: Array.isArray(parsed.messages) ? parsed.messages : [],
          };
          onImportSession(importedSession);
          playCompletionChime(settings.soundEffects);
        } else {
          alert('Invalid session file structure. File must be a valid session JSON object.');
        }
      } catch (err) {
        alert('Failed to parse JSON session file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Image Upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputPrompt.trim() && !attachedImage) || isGenerating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    playSendSound(settings.soundEffects);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: session.model,
      image: attachedImage || undefined,
    };

    const updatedMessages = [...session.messages, userMsg];
    onUpdateSession({
      ...session,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    });

    const currentPrompt = inputPrompt;
    const currentImage = attachedImage;

    setInputPrompt('');
    setAttachedImage(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          model: session.model,
          history: updatedMessages.slice(0, -1),
          systemPrompt: session.systemPrompt,
          temperature: session.temperature,
          topP: session.topP,
          image: currentImage,
        }),
      });

      const data = await res.json();

      // Extract code blocks if present
      const codeBlocks: { language: string; code: string }[] = [];
      const codeRegex = /```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g;
      let match;
      while ((match = codeRegex.exec(data.content)) !== null) {
        codeBlocks.push({
          language: match[1] || 'bash',
          code: match[2].trim(),
        });
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.content || 'Response generation failed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || session.model,
        tokenCount: data.tokenCount,
        latencyMs: data.latencyMs,
        codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
      };

      onUpdateSession({
        ...session,
        messages: [...updatedMessages, assistantMsg],
        title:
          session.messages.length === 0
            ? currentPrompt.slice(0, 30) || 'New Conversation'
            : session.title,
        updatedAt: new Date().toISOString(),
      });

      playCompletionChime(settings.soundEffects);

      // Auto-speech if enabled
      if (settings.voiceSynthesis && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(data.content.replace(/```[\s\S]*?```/g, 'Code snippet.'));
        utterance.rate = settings.speechRate || 1.0;
        synth.speak(utterance);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Text to Speech toggle
  const toggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    if (speakingId === msgId) {
      synth.cancel();
      setSpeakingId(null);
    } else {
      synth.cancel();
      setSpeakingId(msgId);
      const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block.');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setSpeakingId(null);
      synth.speak(utterance);
    }
  };

  // Copy code handler
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden font-sans">
      {/* Session Sidebar */}
      <div className="w-64 bg-[#ececec]/90 dark:bg-gray-900/90 border-r border-[#cbcbcb] dark:border-gray-800 flex flex-col select-none">
        <div className="p-3 flex items-center justify-between border-b border-[#cbcbcb] dark:border-gray-800">
          <span className="text-[11px] font-bold text-[#666] dark:text-gray-400 uppercase tracking-wider">
            Recent Chats
          </span>
          <div className="flex items-center space-x-1">
            {/* Import Button */}
            <input
              type="file"
              ref={jsonImportRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => jsonImportRef.current?.click()}
              className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow-sm transition-colors"
              title="Import Session (.json)"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow-sm transition-colors"
                title="Export Conversation"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-8 z-50 w-40 bg-white dark:bg-gray-850 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 py-1 text-xs text-gray-800 dark:text-gray-200">
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-3 py-1.5 text-left hover:bg-sky-500 hover:text-white flex items-center space-x-2"
                  >
                    <FileJson className="w-3.5 h-3.5 text-sky-500" />
                    <span>Export as JSON</span>
                  </button>
                  <button
                    onClick={handleExportTXT}
                    className="w-full px-3 py-1.5 text-left hover:bg-sky-500 hover:text-white flex items-center space-x-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Export as Text (.txt)</span>
                  </button>
                </div>
              )}
            </div>

            {/* New Session Button */}
            <button
              onClick={onNewSession}
              className="p-1.5 bg-[#1a73e8] hover:bg-blue-600 text-white rounded-md shadow flex items-center space-x-1 text-[11px] font-medium"
              title="New Session"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {allSessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between group ${
                session.id === s.id
                  ? 'bg-[#1a73e8] text-white font-medium shadow-sm'
                  : 'text-[#444] dark:text-gray-300 hover:bg-[#d8d8d8] dark:hover:bg-gray-800'
              }`}
            >
              <span className="truncate flex-1">{s.title || 'Untitled Session'}</span>
              <span className={`text-[10px] font-mono ${session.id === s.id ? 'opacity-80' : 'text-gray-400'}`}>
                {s.messages.length}
              </span>
            </button>
          ))}
        </div>

        {/* Local Engine Card Footer */}
        <div className="p-3 border-t border-[#cbcbcb] dark:border-gray-800">
          <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 p-2.5 rounded-lg border border-black/5 shadow-sm">
            <div className="w-8 h-8 rounded bg-[#ccc] dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-100 shrink-0">
              {session.model.includes('gemini') ? 'Gemini' : 'Local'}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-[11px] font-bold truncate text-[#222] dark:text-white">
                {availableModels.find((m) => m.id === session.model)?.name || session.model}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium italic">
                Active & Ready
              </div>
            </div>
            <button
              onClick={() => setShowInspector(!showInspector)}
              className="p-1 hover:bg-black/5 rounded text-gray-500"
              title="Toggle Inspector"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Feed Workspace */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {session.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-md flex items-center justify-center text-white font-bold text-xl italic">
                AI
              </div>
              <h3 className="text-xl font-bold text-[#222] dark:text-white tracking-tight">
                HighSierra AI Studio
              </h3>
              <p className="text-[13px] text-[#666] dark:text-gray-400 leading-relaxed">
                Seamlessly leverage cloud Gemini engines and local Metal 2 quantized LLMs with macOS High Sierra performance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left w-full pt-2">
                <button
                  onClick={() => setInputPrompt('How can I best utilize the Metal 2 compute pipeline on macOS 10.13 High Sierra for LLM inference?')}
                  className="p-3 bg-[#f2f2f2] dark:bg-gray-850 rounded-xl border border-black/5 hover:border-blue-400 text-xs text-[#222] dark:text-gray-200 transition-all text-left shadow-sm"
                >
                  <div className="font-semibold text-[#1a73e8]">Metal 2 Pipeline</div>
                  <div className="text-[10px] text-[#666]">Tile shaders & MPS matrix math</div>
                </button>
                <button
                  onClick={() => setInputPrompt('Write a bash script for macOS High Sierra terminal to monitor CPU and Metal 2 VRAM.')}
                  className="p-3 bg-[#f2f2f2] dark:bg-gray-850 rounded-xl border border-black/5 hover:border-blue-400 text-xs text-[#222] dark:text-gray-200 transition-all text-left shadow-sm"
                >
                  <div className="font-semibold text-emerald-600">Terminal Script</div>
                  <div className="text-[10px] text-[#666]">System monitor shell tool</div>
                </button>
              </div>
            </div>
          ) : (
            session.messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full shadow-inner shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${
                    msg.role === 'user' ? 'bg-blue-500' : 'bg-[#333]'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : 'AI'}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm space-y-2 text-[14px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#f2f2f2] dark:bg-gray-850 text-[#222] dark:text-gray-100 rounded-tl-none border border-black/5'
                      : 'bg-[#e7f3ff] dark:bg-sky-950/40 text-[#222] dark:text-gray-100 rounded-tr-none border border-blue-200 dark:border-sky-800'
                  }`}
                >
                  {/* Image attachment if any */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Attachment"
                      className="max-h-48 rounded-lg object-cover border border-black/10 mb-2"
                    />
                  )}

                  {/* Message Text */}
                  <div className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{msg.content}</div>

                  {/* Code Block Snippets */}
                  {msg.codeBlocks &&
                    msg.codeBlocks.map((block, bIdx) => (
                      <div
                        key={bIdx}
                        className="my-2 bg-gray-950 text-emerald-400 rounded-lg overflow-hidden border border-gray-800 font-mono text-[11px]"
                      >
                        <div className="bg-gray-900 px-3 py-1.5 flex items-center justify-between text-gray-400 text-[10px] border-b border-gray-800">
                          <span>{block.language || 'script'}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCopy(block.code, index * 10 + bIdx)}
                              className="hover:text-white flex items-center space-x-1"
                            >
                              {copiedIndex === index * 10 + bIdx ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>

                            <button
                              onClick={() => onOpenTerminalWithCommand(block.code)}
                              className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded flex items-center space-x-1 font-semibold"
                            >
                              <Terminal className="w-3 h-3" />
                              <span>Run in Terminal</span>
                            </button>
                          </div>
                        </div>
                        <pre className="p-3 overflow-x-auto whitespace-pre">{block.code}</pre>
                      </div>
                    ))}

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-[10px] text-[#777] dark:text-gray-400 pt-1 border-t border-black/5 dark:border-white/10">
                    <span className="font-mono">{msg.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      {msg.latencyMs && <span>{msg.latencyMs}ms</span>}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => toggleSpeak(msg.id, msg.content)}
                          className="hover:opacity-100"
                          title="Read aloud"
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {isGenerating && (
            <div className="flex items-center space-x-2 text-xs text-[#1a73e8] font-mono animate-pulse p-2">
              <Bot className="w-4 h-4 animate-spin" />
              <span>Generating response...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Control Box */}
        <div className="p-4 bg-[#f9f9f9] dark:bg-gray-900 border-t border-[#e0e0e0] dark:border-gray-800 space-y-2">
          {/* Top Info Bar: Speech status & Live Token Usage Counter */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono">
            <div className="flex items-center space-x-2">
              {isListening && (
                <span className="flex items-center space-x-1 text-red-600 dark:text-red-400 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>Listening microphone dictation...</span>
                </span>
              )}
              {speechError && (
                <span className="text-amber-600 dark:text-amber-400 text-[10px]">
                  {speechError}
                </span>
              )}
            </div>

            {/* Live Token Usage Indicator */}
            <div className="flex items-center space-x-2 bg-gray-200/80 dark:bg-gray-800/80 px-2.5 py-0.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 ml-auto">
              <Cpu className="w-3 h-3 text-sky-500" />
              <span>
                Tokens: <strong className="font-bold text-sky-600 dark:text-sky-400">{totalPromptTokens.toLocaleString()}</strong> / {maxContext.toLocaleString()} ({tokenPercent.toFixed(1)}%)
              </span>
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    tokenPercent > 80 ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${tokenPercent}%` }}
                />
              </div>
            </div>
          </div>

          {attachedImage && (
            <div className="mb-2 relative inline-block">
              <img src={attachedImage} alt="Preview" className="h-16 rounded border border-blue-400 shadow-md" />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            {/* Image Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 bg-[#e0e0e0] dark:bg-gray-800 border border-[#bbb] dark:border-gray-700 rounded-full flex items-center justify-center text-xl text-[#666] dark:text-gray-200 hover:bg-[#1a73e8] hover:text-white transition-colors shrink-0"
              title="Attach Vision Image"
            >
              +
            </button>

            {/* Dictation Speech Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md'
                  : 'bg-[#e0e0e0] dark:bg-gray-800 border-[#bbb] dark:border-gray-700 text-[#666] dark:text-gray-200 hover:bg-sky-500 hover:text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Dictate Prompt with Microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={isListening ? 'Listening to voice...' : 'Ask anything or dictate with microphone...'}
              disabled={isGenerating}
              className="flex-1 h-10 bg-white dark:bg-gray-950 border border-[#ccc] dark:border-gray-700 rounded-full px-4 text-[#222] dark:text-white text-[13px] shadow-inner outline-none focus:border-blue-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isGenerating || (!inputPrompt.trim() && !attachedImage)}
              className="h-10 px-5 bg-[#1a73e8] hover:bg-blue-600 text-white rounded-full font-medium text-[13px] shadow disabled:opacity-40 flex items-center space-x-1 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Parameter & Performance Inspector */}
      <div className="w-64 bg-[#f6f6f6] dark:bg-gray-900 border-l border-[#cbcbcb] dark:border-gray-800 p-4 flex flex-col gap-6 select-none overflow-y-auto">
        <section>
          <div className="text-[11px] font-bold text-[#666] dark:text-gray-400 uppercase mb-3">
            Performance
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-[#444] dark:text-gray-300">
                <span>VRAM Usage</span>
                <span className="font-mono font-bold">52% (4.2GB)</span>
              </div>
              <div className="h-1.5 bg-[#ddd] dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '52%' }} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-[#444] dark:text-gray-300">
                <span>CPU Compute</span>
                <span className="font-mono font-bold">18%</span>
              </div>
              <div className="h-1.5 bg-[#ddd] dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '18%' }} />
              </div>
            </div>
            <div className="text-[10px] text-[#888] font-mono">48.5 tokens/sec</div>
          </div>
        </section>

        <section>
          <div className="text-[11px] font-bold text-[#666] dark:text-gray-400 uppercase mb-3">
            Parameters
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#222] dark:text-gray-200 flex justify-between">
                <span>Temperature</span>
                <span className="font-mono text-blue-600">{session.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={session.temperature}
                onChange={(e) =>
                  onUpdateSession({ ...session, temperature: parseFloat(e.target.value) })
                }
                className="accent-blue-500 w-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#222] dark:text-gray-200 flex justify-between">
                <span>Top-P Nucleus</span>
                <span className="font-mono text-indigo-600">{session.topP}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={session.topP}
                onChange={(e) => onUpdateSession({ ...session, topP: parseFloat(e.target.value) })}
                className="accent-blue-500 w-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-[#222] dark:text-gray-200">
                Active Engine
              </label>
              <select
                value={session.model}
                onChange={(e) => onUpdateSession({ ...session, model: e.target.value })}
                className="text-[11px] p-1.5 border border-[#ccc] dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-[#222] dark:text-white shadow-sm outline-none"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Bottom App Card */}
        <div className="mt-auto pt-4 border-t border-[#ddd] dark:border-gray-800">
          <div className="p-3 bg-[#e8e8e8] dark:bg-gray-800 rounded-lg border border-white dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg shadow-md mb-2 flex items-center justify-center text-white font-bold text-xs italic">
              AI
            </div>
            <div className="text-[12px] font-bold text-[#222] dark:text-white">HighSierra AI Studio</div>
            <div className="text-[10px] text-[#666] dark:text-gray-400">Version 10.13.6 (Build 17G65)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

