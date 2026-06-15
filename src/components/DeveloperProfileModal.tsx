import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code2, Cpu, Rocket, ChevronRight, TerminalSquare } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { cn } from '../lib/utils';

export function DeveloperProfileModal() {
  const { isDeveloperProfileOpen, setDeveloperProfileOpen } = useAppStore();

  const skills = [
    'React', 'Node.js', 'TypeScript', 'Python', 
    'AI Systems', 'Realtime Architectures', 'DSA', 'System Design'
  ];

  return (
    <AnimatePresence>
      {isDeveloperProfileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setDeveloperProfileOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-600/20" />
              <div className="absolute top-[-50%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
              
              <button
                onClick={() => setDeveloperProfileOpen(false)}
                className="absolute top-4 right-4 p-2 bg-transparent text-white/50 hover:text-white rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pb-10 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shrink-0 shadow-xl shadow-indigo-500/20">
                    <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                       <Code2 className="w-10 h-10 text-white/80" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 tracking-tight">Aditya Pal</h2>
                    <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mt-1 mb-3 font-semibold">Full Stack Developer • AI Systems Builder</p>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                      Realtime Collaboration Systems Enthusiast. Strong foundation in Mathematics. Building next-generation AI-powered learning systems.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-inner">
                    <div className="flex items-center gap-2 text-white mb-4 border-b border-white/5 pb-3">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-semibold text-sm tracking-wide">Core Technologies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {skills.slice(0, 4).map(skill => (
                         <span key={skill} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                           {skill}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="bg-[#111] border border-white/5 rounded-xl p-5 shadow-inner">
                    <div className="flex items-center gap-2 text-white mb-4 border-b border-white/5 pb-3">
                      <Rocket className="w-4 h-4 text-pink-400" />
                      <h3 className="font-semibold text-sm tracking-wide">Systems & Architecture</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {skills.slice(4).map(skill => (
                         <span key={skill} className="px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-mono">
                           {skill}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-105 active:scale-95 transition-all">
                    Connect & View Work <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
