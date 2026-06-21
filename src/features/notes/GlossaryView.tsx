import React from 'react';
import { BookA } from 'lucide-react';
import { motion } from 'motion/react';

interface GlossaryItem {
  term: string;
  definition: string;
}

export function GlossaryView({ glossary }: { glossary: GlossaryItem[] }) {
  if (!glossary || glossary.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-500/10 rounded-xl">
          <BookA className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Keyword Glossary</h3>
          <p className="text-sm font-medium text-slate-400">Essential terminology and definitions</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {glossary.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            key={i}
            className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.04] transition-colors"
          >
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-slate-200 mb-1">{item.term}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.definition}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
