import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useMaterialStore } from '../stores/useMaterialStore';

import { LibraryView } from '../features/library/LibraryView';
import { MaterialSetup } from '../features/materials/MaterialSetup';
import { MaterialResult } from '../features/materials/MaterialResult';
import { StudyProgress } from '../features/dashboard/StudyProgress';
import { RecentActivity } from '../features/dashboard/RecentActivity';
import { SessionHistoryView } from '../features/dashboard/SessionHistoryView';

export function Home() {
  const { view } = useDashboardStore();
  const { result } = useMaterialStore();
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 backdrop-blur-3xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent" />
            <div className="relative flex flex-col items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Synthesizing Matrix
                </h3>
                <p className="text-slate-400 font-medium text-sm">
                  Generating study pathways...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn("max-w-7xl mx-auto w-full px-6 py-16 transition-all", (!result || view === 'library' || view === 'history') && "min-h-[80vh] flex flex-col items-center justify-center")}>
        <AnimatePresence mode="wait">
          {view === 'history' ? (
            <SessionHistoryView key="history" />
          ) : view === 'library' ? (
            <LibraryView key="library" />
          ) : !result ? (
            <div key="setup" className="w-full flex flex-col mt-8">
              <StudyProgress />
              <RecentActivity />
              <MaterialSetup onGenerating={setShowLoadingOverlay} />
            </div>
          ) : (
            <MaterialResult key="result" />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
