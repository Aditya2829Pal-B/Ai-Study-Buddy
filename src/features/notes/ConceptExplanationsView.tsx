import React from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface Concept {
  concept: string;
  explanation: string;
}

export function ConceptExplanationsView({ concepts }: { concepts: Concept[] }) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-xl">
          <BookOpen className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Detailed Concepts</h3>
          <p className="text-sm font-medium text-slate-400">In-depth explanations of core topics</p>
        </div>
      </div>
      <div className="space-y-6">
        {concepts.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className="p-6 bg-[#111] border border-white/5 rounded-2xl"
          >
            <h4 className="text-lg font-bold text-indigo-300 mb-3">{item.concept}</h4>
            <p className="text-slate-300 leading-relaxed text-sm">{item.explanation}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
