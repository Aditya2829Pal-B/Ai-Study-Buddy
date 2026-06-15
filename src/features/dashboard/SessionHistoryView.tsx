import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { useHistoryStore } from '../../stores/useHistoryStore';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { useMaterialStore } from '../../stores/useMaterialStore';
import { cn } from '../../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export function SessionHistoryView() {
  const { sessions, clearHistory, removeSession } = useHistoryStore();
  const { setView } = useDashboardStore();
  const { setTopic, setAcademicLevel, setResult } = useMaterialStore();

  const handleRestoreSession = (session: any) => {
    setTopic(session.topic);
    setAcademicLevel(session.academicLevel);
    setResult(session.result);
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <motion.div 
      key="history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full space-y-12"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Session History
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Review and restore your past generated study materials.
          </p>
        </div>
        {sessions.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-sm font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-3xl">
          <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
          <p className="text-slate-400 mb-6">Generate your first study materials to see them here.</p>
          <button 
            onClick={() => setView('studio')}
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Go to Studio
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest pl-2 font-mono">
                {date}
              </h3>
              <div className="grid gap-4">
                {dateSessions.map((session, i) => (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                          {session.academicLevel}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white tracking-tight truncate">
                        {session.topic}
                      </h4>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                           {session.result.flashcards?.length || 0} Cards
                        </span>
                        <span className="flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                           {session.result.practiceQuestions?.length || 0} Questions
                        </span>
                        <span className="flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                           {session.result.roadmap?.length || 0} Roadmap Steps
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button 
                        onClick={() => removeSession(session.id)}
                        className="p-3 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors shrink-0 md:opacity-0 md:group-hover:opacity-100"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRestoreSession(session)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-900/50 transition-all"
                      >
                        Restore Session <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
