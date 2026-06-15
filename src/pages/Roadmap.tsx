import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Target, Navigation, CheckCircle2 } from 'lucide-react';

export function Roadmap() {
  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="absolute top-1/4 left-1/4 w-[40%] h-[400px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Public Roadmap
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            See what we're working on and what's coming next for Neural Learn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-8">
          {/* Completed */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
            </h3>
            <div className="space-y-4">
              {['Gemini 3.1 Integration', 'Premium Subscriptions', 'Dark Mode Startup UI', 'Spaced Repetition System'].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 line-through text-slate-500">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> In Progress
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/30 text-white font-medium">
                Deep Research Mode
                <div className="w-full bg-black/50 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[65%]" />
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300">
                Offline PWA Support
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300">
                Zapier / Notion Integrations
              </div>
            </div>
          </div>

          {/* Planned */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Planned (Q3)
            </h3>
            <div className="space-y-4">
              {['Native iOS / Android Apps', 'Voice Mode Conversations', 'PDF Annotation Tools', 'Tutor Chatbot Persona'].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 border-dashed text-slate-400">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
