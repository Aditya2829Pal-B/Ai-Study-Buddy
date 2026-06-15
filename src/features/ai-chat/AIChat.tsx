import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMaterialStore } from '../../stores/useMaterialStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const { user } = useAuthStore();
  const { topic } = useMaterialStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI Study Buddy. I can answer any questions you have about **${topic}**. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to get answer');
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try asking again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none" />
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 hide-scrollbar relative z-10">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              key={msg.id} 
              className={cn("flex flex-col gap-2 max-w-[85%]", isUser ? "ml-auto items-end" : "mr-auto items-start")}
            >
              <div className="flex items-end gap-3">
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
                
                <div className={cn(
                  "px-5 py-4 text-sm leading-relaxed rounded-2xl shadow-md", 
                  isUser 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm" 
                    : "bg-white/[0.04] backdrop-blur-lg border border-white/5 text-slate-200 rounded-bl-sm"
                )}>
                  {msg.content}
                </div>
                
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 shrink-0 overflow-hidden shadow-[0_0_10px_-2px_rgba(0,0,0,0.5)]">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff`} alt="User" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 px-11 opacity-50">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              </span>
            </motion.div>
          );
        })}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
               <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="bg-white/[0.04] backdrop-blur-lg border border-white/5 rounded-2xl rounded-bl-sm px-5 py-4">
               <span className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(129,140,248,0.8)]" />
                 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-75 shadow-[0_0_5px_rgba(129,140,248,0.8)]" />
                 <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-150 shadow-[0_0_5px_rgba(129,140,248,0.8)]" />
               </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 relative z-10 shrink-0 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask a question about ${topic}...`}
            className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl pl-6 pr-28 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 placeholder:text-slate-500 shadow-inner"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] md:hover:scale-[1.05] active:scale-95",
                isListening ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:hover:bg-indigo-600 md:hover:scale-[1.05] active:scale-95 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
