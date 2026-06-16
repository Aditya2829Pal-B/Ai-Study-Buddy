import React, { useRef, useEffect, memo } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/useAuthStore';

interface ChatPanelProps {
  chatMessages: any[];
  chatInput: string;
  setChatInput: (val: string) => void;
  handleSendMessage: (e?: React.FormEvent) => void;
  isFullscreenCanvas: boolean;
}

export const ChatPanel = memo(function ChatPanel({ chatMessages, chatInput, setChatInput, handleSendMessage, isFullscreenCanvas }: ChatPanelProps) {
  const { user } = useAuthStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div className={cn("w-full h-full bg-[#0A0A0A] border border-white/10 rounded-[2rem] flex flex-col shadow-2xl relative transition-all duration-500 overflow-hidden", isFullscreenCanvas ? "hidden" : "")}>
      <div className="p-6 border-b border-white/5 bg-[#111]">
         <h3 className="text-white font-bold tracking-tight">Live Chat</h3>
         <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Study Questions</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
         {chatMessages.map((msg, i) => {
           const isMe = msg.sender === (user?.name || 'You');
           const isSystem = msg.sender === 'System';
           
           if (isSystem) {
             return (
               <div key={msg.id} className="flex justify-center my-4">
                 <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-indigo-500/20 text-center mx-4">{msg.text}</span>
               </div>
             );
           }

           return (
             <div key={msg.id} className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
               <div className="flex items-end gap-2 max-w-[90%]">
                 {!isMe && (
                   <div className="w-5 h-5 rounded-full bg-slate-800 shrink-0 overflow-hidden border border-white/10 pb-1">
                     <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender)}&background=random&color=fff`} alt={msg.sender} className="w-full h-full object-cover" />
                   </div>
                 )}
                 <div className={cn("px-3 py-2.5 text-xs leading-relaxed max-w-[200px]", isMe ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm" : "bg-[#161616] border border-white/5 text-slate-300 rounded-2xl rounded-bl-sm")}>
                   {msg.text}
                 </div>
               </div>
               <span className="text-[9px] text-slate-600 font-mono px-6">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {isMe ? 'You' : msg.sender}</span>
             </div>
           );
         })}
         <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-[#111] border-t border-white/5">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 shadow-inner"
          />
          <button 
            type="submit"
            disabled={!chatInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
});
