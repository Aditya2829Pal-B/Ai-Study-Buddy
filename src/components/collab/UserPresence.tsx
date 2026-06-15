import React from 'react';
import { cn } from '../../lib/utils';
import { usePresenceStore } from '../../stores/collab/usePresenceStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useVoiceStore } from '../../stores/collab/useVoiceStore';

interface UserPresenceProps {
  // If we still want to pass mock data or override, we can. 
  // For now, let's just grab the active peers from props to keep it stateless or from store.
  // Actually, we'd better consume the store directly for cleaner architecture.
}

export function UserPresence({}: UserPresenceProps) {
  const { user } = useAuthStore();
  const isVoiceActive = useVoiceStore(state => state.isVoiceActive);
  
  // Active Peers State (Mock data from original code)
  // We can merge this with the presence store later.
  const activePeers = [
    { id: '1', name: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isSpeaking: false },
    { id: '2', name: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', isSpeaking: true },
    { id: '3', name: user?.name || 'You', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`, isSpeaking: isVoiceActive },
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
