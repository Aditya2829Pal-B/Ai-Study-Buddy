import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FlashcardProps {
  front: string;
  back: string;
  id: string;
}

export const Flashcard: React.FC<FlashcardProps> = ({ front, back, id }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMastered, setIsMastered] = useState(false);

  return (
    <div className="relative group">
      <div 
        id={id}
        className="perspective-1000 w-full h-64 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className={cn("relative w-full h-full preserve-3d transition-all duration-300", isMastered && "opacity-50 grayscale hover:grayscale-0 hover:opacity-100")}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:bg-white/[0.05] group-hover:border-white/10 group-hover:shadow-[0_12px_40px_rgba(99,102,241,0.2)] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
            </div>
            {isMastered && (
              <div className="absolute top-5 right-5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30">Mastered</div>
            )}
            <p className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight z-10">{front}</p>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-semibold uppercase tracking-[0.2em]">Click to Flip</span>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-400/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center rotate-y-180 shadow-[0_12px_40px_rgba(79,70,229,0.4)]">
             <div className="absolute top-5 left-5 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            {isMastered && (
              <div className="absolute top-5 right-5 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]">Mastered</div>
            )}
            <p className="text-lg md:text-xl font-medium tracking-tight text-white leading-relaxed z-10">{back}</p>
          </div>
        </motion.div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMastered(!isMastered);
          }}
          className={cn(
            "text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]",
            isMastered 
              ? "bg-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]" 
              : "bg-white/[0.03] text-slate-400 border border-white/5 hover:bg-white/[0.08] hover:text-white"
          )}
        >
          <Check className="w-4 h-4" />
          {isMastered ? 'Mastered' : 'Mark as Mastered'}
        </button>
      </div>
    </div>
  );
};
