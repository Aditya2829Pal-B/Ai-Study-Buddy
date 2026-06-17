import React, { useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useStreakStore } from '../../stores/useStreakStore';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function StreakTracker() {
  const { streakCount, logActivity } = useStreakStore();

  useEffect(() => {
    logActivity();
  }, [logActivity]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-center justify-between shadow-lg mb-8"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-xl border",
          streakCount > 0 
            ? "bg-gradient-to-br from-orange-500 to-red-500 border-orange-400" 
            : "bg-slate-800 border-slate-700"
        )}>
          <Flame className={cn(
            "w-6 h-6",
            streakCount > 0 ? "text-white" : "text-slate-500"
          )} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {streakCount} Day Streak!
          </h3>
          <p className="text-sm font-medium text-slate-400">
            {streakCount > 0 
              ? "You're on fire! Keep up the daily learning habit." 
              : "Start learning today to build your streak!"}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex gap-1">
        {/* Visual blocks for the last 7 days */}
        {[...Array(7)].map((_, i) => {
          // Simplistic visual representation for demo: 
          // If streak is N, the right-most min(N, 7) blocks are lit.
          const isLit = i >= 7 - Math.min(streakCount, 7);
          return (
            <div 
              key={i} 
              className={cn(
                "w-8 h-10 rounded-md border",
                isLit ? "bg-orange-500 border-orange-400" : "bg-white/5 border-white/10"
              )}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
