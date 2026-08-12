import React, { useState } from 'react';
import { Sparkles, X, Send, Mic, Volume2 } from 'lucide-react';
import { playSendSound, playCompletionChime } from '../utils/audio';

interface SiriOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  soundEffects: boolean;
  activeModel: string;
}

export const SiriOverlay: React.FC<SiriOverlayProps> = ({
  isOpen,
  onClose,
  soundEffects,
  activeModel,
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAskSiri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    playSendSound(soundEffects);
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Siri Assistant Quick Response: ${query}`,
          model: activeModel,
          systemPrompt: 'You are macOS High Sierra Siri AI. Give concise, extremely clear, helpful answers in 2-3 sentences.',
        }),
      });

      const data = await res.json();
      setResponse(data.content || 'Siri AI was unable to complete the request.');
      playCompletionChime(soundEffects);

      // Web Speech API Voice synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.content || '');
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setResponse('Siri AI encountered a network issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-8 right-4 z-50 w-80 sm:w-96 bg-gray-900/90 text-white rounded-2xl border border-sky-500/40 shadow-2xl backdrop-blur-2xl overflow-hidden font-sans select-none animate-in fade-in slide-in-from-top-4 duration-200">
      {/* Header */}
      <div className="p-3 bg-black/40 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 flex items-center justify-center animate-spin-slow">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-xs text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">
            High Sierra Siri AI
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Soundwave animation bar */}
      <div className="h-2 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse" />

      {/* Body */}
      <div className="p-4 space-y-3 text-xs">
        {response ? (
          <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-sky-400 font-mono flex items-center justify-between">
              <span>Siri Response:</span>
              <Volume2 className="w-3 h-3 text-sky-400 animate-pulse" />
            </div>
            <p className="text-gray-200 leading-relaxed font-sans">{response}</p>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-2 italic font-mono text-[11px]">
            {isLoading ? 'Siri is listening and processing...' : 'What can I help you with today on macOS High Sierra?'}
          </p>
        )}

        {/* Input Form */}
        <form onSubmit={handleAskSiri} className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Siri anything..."
            className="flex-1 bg-black/50 border border-gray-700 focus:border-sky-500 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-white rounded-full shadow"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
