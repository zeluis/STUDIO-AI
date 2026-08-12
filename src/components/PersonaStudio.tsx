import React, { useState } from 'react';
import { UserCheck, Sparkles, Plus, Edit2, Check, Trash2, Sliders, Shield } from 'lucide-react';
import { Persona, DesktopSettings } from '../types';
import { playClickSound, playCompletionChime } from '../utils/audio';

interface PersonaStudioProps {
  onSelectPersonaPrompt: (prompt: string, model?: string) => void;
  settings: DesktopSettings;
}

export const PersonaStudio: React.FC<PersonaStudioProps> = ({
  onSelectPersonaPrompt,
  settings,
}) => {
  const [personas, setPersonas] = useState<Persona[]>([
    {
      id: 'p1',
      name: 'macOS High Sierra Genius',
      role: 'System Architect & Cocoa Specialist',
      avatar: '💻',
      description: 'Expert in macOS 10.13 internals, APFS filesystem, Metal 2 API, Cocoa, and Swift 4.',
      systemPrompt:
        'You are the macOS High Sierra System Genius. You possess authoritative knowledge of Mac OS X / macOS 10.13.6 internals, Cocoa frameworks, Objective-C/Swift, APFS, Metal 2 graphics, and Darwin shell scripting.',
      defaultModel: 'gemini-3.6-flash',
      defaultTemp: 0.5,
      tags: ['macOS 10.13', 'Metal 2', 'APFS', 'Swift'],
    },
    {
      id: 'p2',
      name: 'UNIX Shell Wizard',
      role: 'Bash & Terminal Administrator',
      avatar: '🧙‍♂️',
      description: 'Master of command line tools, AWK, Sed, Bash/Zsh automation scripts, and sysadmin.',
      systemPrompt:
        'You are a UNIX Shell Wizard. Respond primarily with concise, safe, high-performance Bash and Zsh shell scripts formatted for macOS Terminal with clear execution instructions.',
      defaultModel: 'gemini-3.6-flash',
      defaultTemp: 0.3,
      tags: ['Bash', 'CLI', 'Automation', 'POSIX'],
    },
    {
      id: 'p3',
      name: 'Senior Software Architect',
      role: 'Full-Stack Systems Engineer',
      avatar: '🏛️',
      description: 'Specialist in TypeScript, Node.js, React, Rust, clean code architecture, and optimization.',
      systemPrompt:
        'You are a Senior Software Architect. Provide production-ready, clean, well-typed TypeScript and system architecture code. Always prioritize elegance, maintainability, and security.',
      defaultModel: 'gemini-3.1-pro-preview',
      defaultTemp: 0.7,
      tags: ['TypeScript', 'React', 'Node.js', 'Architecture'],
    },
    {
      id: 'p4',
      name: 'Deep Reasoning Engine',
      role: 'Logic & Math Specialist',
      avatar: '🧠',
      description: 'Step-by-step chain of thought reasoning, mathematics, algorithmic proofs, and deep analysis.',
      systemPrompt:
        'You are a Deep Reasoning Engine. Deconstruct complex problems into step-by-step logic. Always present structured reasoning inside <think></think> tags before delivering your final concise solution.',
      defaultModel: 'gemini-3.1-pro-preview',
      defaultTemp: 0.2,
      tags: ['Chain-of-Thought', 'Logic', 'Math'],
    },
  ]);

  const [activePersonaId, setActivePersonaId] = useState<string>('p1');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const selectedPersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  const handleApplyPersona = (p: Persona) => {
    playClickSound(settings.soundEffects);
    setActivePersonaId(p.id);
    onSelectPersonaPrompt(p.systemPrompt, p.defaultModel);
    playCompletionChime(settings.soundEffects);
  };

  const handleCreatePersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrompt.trim()) return;

    playClickSound(settings.soundEffects);
    const newP: Persona = {
      id: `p-custom-${Date.now()}`,
      name: customName,
      role: customRole || 'Custom Persona',
      avatar: '⚙️',
      description: 'Custom user defined persona.',
      systemPrompt: customPrompt,
      defaultModel: 'gemini-3.6-flash',
      defaultTemp: 0.7,
      tags: ['Custom'],
      isCustom: true,
    };

    setPersonas([...personas, newP]);
    setActivePersonaId(newP.id);
    setCustomName('');
    setCustomRole('');
    setCustomPrompt('');
    setIsEditing(false);
    playCompletionChime(settings.soundEffects);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 font-sans text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              System Prompt & Persona Studio
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Choose or create specialized AI personas tailored for High Sierra engineering, shell scripting, or deep reasoning.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound(settings.soundEffects);
            setIsEditing(!isEditing);
          }}
          className="px-4 py-2 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-xl font-medium shadow hover:from-sky-500 hover:to-sky-600 border border-sky-600 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Editor' : 'Create Custom Persona'}</span>
        </button>
      </div>

      {/* Editor Form if creating */}
      {isEditing && (
        <form onSubmit={handleCreatePersona} className="p-5 rounded-2xl bg-white/90 dark:bg-gray-850/90 border border-sky-500/40 shadow-lg space-y-3">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Create New Custom Persona</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Persona Name:</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Cocoa API Specialist"
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Role Subtitle:</label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g. Swift 4 & Metal Developer"
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">System Prompt Instruction:</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              placeholder="Specify instructions for this AI persona..."
              className="w-full p-2.5 rounded-lg bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-xl font-bold shadow hover:from-sky-500 hover:to-sky-600 border border-sky-600"
            >
              Save Persona
            </button>
          </div>
        </form>
      )}

      {/* Personas Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {personas.map((p) => {
          const isSelected = activePersonaId === p.id;

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/30'
                  : 'bg-white/80 dark:bg-gray-850/80 border-gray-300 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xl shadow text-white shrink-0">
                    {p.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{p.name}</h3>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                      {p.role}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {p.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono text-[9px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                {isSelected ? (
                  <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check className="w-4 h-4" />
                    <span>Active System Persona</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyPersona(p)}
                    className="px-4 py-1.5 bg-gradient-to-b from-sky-400 to-sky-500 text-white rounded-lg font-medium shadow hover:from-sky-500 hover:to-sky-600 border border-sky-600"
                  >
                    Apply Persona
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected System Prompt Sandbox */}
      <div className="p-5 rounded-2xl bg-gray-900 text-white border border-gray-800 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2">
          <span className="font-bold text-xs text-sky-400">
            Active System Instruction Prompt:
          </span>
          <span className="text-[10px] text-gray-400">{selectedPersona.name}</span>
        </div>
        <pre className="p-3 bg-black/60 rounded-xl text-emerald-400 text-xs whitespace-pre-wrap leading-relaxed">
          {selectedPersona.systemPrompt}
        </pre>
      </div>
    </div>
  );
};
