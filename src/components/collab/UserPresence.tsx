import React from 'react';
import { cn } from '../../lib/utils';
import { usePresenceStore } from '../../stores/collab/usePresenceStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useVoiceStore } from '../../stores/collab/useVoiceStore';

export function UserPresence() {
  const { user } = useAuthStore();
  const isVoiceActive = useVoiceStore(state => state.isVoiceActive);
  const activePeersStore = usePresenceStore(state => state.activePeers);
  
  const activePeers = [
    ...(user ? [{
      id: user.id || 'me',
      name: user.name || 'You',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6366f1&color=fff`,
      isSpeaking: isVoiceActive
    }] : []),
    ...activePeersStore.filter(p => p.id !== user?.id)
  ];

  return (
    <div className="flex items-center mr-2 shrink-0">
      {activePeers.map((p) => (
        <div key={p.id} className={cn("relative w-9 h-9 rounded-full border-2 border-[#050505] -ml-3 first:ml-0 bg-[#111] shadow-md", p.isSpeaking ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#050505]" : "")}>
          <img src={p.avatar} alt={p.name} className="w-full h-full rounded-full object-cover" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#050505] rounded-full" />
        </div>
      ))}
    </div>
  );
}
