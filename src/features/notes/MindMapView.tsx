import React from 'react';
import { Network } from 'lucide-react';
import { motion } from 'motion/react';

interface MindMapNode {
  concept: string;
  subConcepts: string[];
}

export function MindMapView({ nodes }: { nodes: MindMapNode[] }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-xl">
          <Network className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Mind Map Structure</h3>
          <p className="text-sm font-medium text-slate-400">Conceptual connections and hierarchies</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className="group block p-6 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors" />
            <h4 className="text-lg font-bold text-white mb-4 pl-4">{node.concept}</h4>
            <ul className="space-y-2 pl-4">
              {node.subConcepts.map((sub, j) => (
                <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{sub}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
