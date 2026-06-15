import React from 'react';
import { MicOff, Mic } from 'lucide-react';
import { useVoiceStore } from '../../stores/collab/useVoiceStore';
import { useCollabSocket } from '../../hooks/useCollabSocket';

interface VoiceControlsProps {
  startVoice: () => void;
  stopVoice: () => void;
}

export function VoiceControls({ startVoice, stopVoice }: VoiceControlsProps) {
  const isVoiceActive = useVoiceStore(state => state.isVoiceActive);

  if (isVoiceActive) {
    return (
      <button 
        onClick={stopVoice}
        className="whitespace-nowrap px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500/20 transition-all shrink-0"
      >
        <MicOff className="w-4 h-4" /> Stop Live Talk
      </button>
    );
  }

  return (
    <button 
      onClick={startVoice}
      className="whitespace-nowrap px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500/20 transition-all hover:scale-105 shrink-0"
    >
      <Mic className="w-4 h-4" /> Live Talk
    </button>
  );
}
