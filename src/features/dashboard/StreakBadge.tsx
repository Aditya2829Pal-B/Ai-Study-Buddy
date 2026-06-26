import React, { useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useStreakStore } from '../../stores/useStreakStore';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export function StreakBadge() {
  const { streakCount, logActivity } = useStreakStore();

  useEffect(() => {
    logActivity();
  }, [logActivity]);

  if (streakCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full shadow-inner"
      title={`${streakCount} Day Study Streak`}
    >
      <Flame className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-bold text-orange-500">{streakCount}</span>
    </motion.div>
  );
}
