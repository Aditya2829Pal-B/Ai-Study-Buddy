import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Users2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserPresence } from './UserPresence';
import { VoiceControls } from './VoiceControls';

interface SessionHeaderProps {
  isFullscreenCanvas: boolean;
  startVoice: () => void;
  stopVoice: () => void;
  inviteSent: boolean;
  handleSendInvite: () => void;
}

export const SessionHeader = memo(function SessionHeader({
  isFullscreenCanvas,
  startVoice,
  stopVoice,
  inviteSent,
  handleSendInvite
}: SessionHeaderProps) {
  return (
    <div className="w-full max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-4 z-20 relative shrink-0">
      <Link to="/app" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors shrink-0">
        <ArrowLeft className="w-5 h-5" /> Back to Studio
      </Link>
      
      <div className={cn("text-center transition-all duration-500 hidden md:block", isFullscreenCanvas && "opacity-0 invisible")}>
        <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-indigo-500 to-emerald-500 animate-text-move bg-[length:200%_auto]">
          Collab Space
        </h1>
      </div>

      <div className="flex items-center gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        {/* Active Peers Avatars */}
        <UserPresence />

        {/* Voice Chat Controls */}
        <VoiceControls startVoice={startVoice} stopVoice={stopVoice} />

        {/* Invite Controls */}
        <button type="button" 
          onClick={handleSendInvite}
          className={cn(
            "whitespace-nowrap px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shrink-0",
            inviteSent ? "bg-emerald-500 text-white shadow-emerald-900/30" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/30"
          )}
        >
          {inviteSent ? <Check className="w-4 h-4" /> : <Users2 className="w-4 h-4" />}
          {inviteSent ? 'Link Copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
});
