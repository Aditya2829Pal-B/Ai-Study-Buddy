import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Bookmark, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { useHistoryStore } from '../../stores/useHistoryStore';

const mockActivities = [
  {
    id: 1,
    action: 'Completed Quiz: Cellular Respiration',
    timestamp: '2 hours ago',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    id: 2,
    action: 'Generated Study Roadmap: Machine Learning Basics',
    timestamp: 'Yesterday at 3:45 PM',
    icon: Bookmark,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  },
  {
    id: 3,
    action: 'Practiced Flashcards: AP History Review',
    timestamp: 'Yesterday at 2:10 PM',
    icon: HelpCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10'
  },
  {
    id: 4,
    action: 'Achieved 12-Day Study Streak',
    timestamp: 'May 20, 2026',
    icon: Trophy,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  }
];

export function RecentActivity() {
  const { sessions } = useHistoryStore();
  
  const dynamicActivities = sessions.slice(0, 4).map((session, i) => ({
    id: session.id,
    action: `Generated Study Materials: ${session.topic}`,
    timestamp: new Date(session.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    icon: Sparkles,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  }));

  const activities = dynamicActivities.length > 0 ? dynamicActivities : mockActivities;

  return (
    <div className="w-full mb-16">
      <h3 className="text-xl font-bold text-white tracking-tight mb-6">
        Recent Activity
      </h3>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 relative"
              >
                {index !== activities.length - 1 && (
                  <div className="absolute left-[1.125rem] top-10 bottom-[-1.5rem] w-px bg-white/10" />
                )}
                <div className={`w-9 h-9 rounded-full ${activity.bg} flex items-center justify-center shrink-0 relative z-10`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 pt-1.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                  <p className="text-xs text-slate-500 font-mono">{activity.timestamp}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
