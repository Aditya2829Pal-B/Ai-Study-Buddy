import React, { useState } from 'react';
import { PracticeQuestionsContent } from './PracticeQuestions';
import { useSearchStore } from '../../stores/useSearchStore';
import { BookOpen, Gamepad2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface QuizViewProps {
  questions: Array<{ type: string; question: string; options?: string[]; correctOptionIndex?: number; answer: string }>;
}

export function QuizView({ questions }: QuizViewProps) {
  const { searchQuery } = useSearchStore();
  const [viewMode, setViewMode] = useState<'study' | 'quiz'>('study');
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const filtered = questions.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex bg-white/5 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setViewMode('study')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
            viewMode === 'study' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <BookOpen className="w-4 h-4" /> Study Mode
        </button>
        <button
          onClick={() => setViewMode('quiz')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
            viewMode === 'quiz' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Gamepad2 className="w-4 h-4" /> Interactive Quiz
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'quiz' ? (
          <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <PracticeQuestionsContent questions={filtered} />
          </motion.div>
        ) : (
          <motion.div key="study" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
             {filtered.map((q, idx) => {
               const isExpanded = expandedQ === idx;
               return (
                 <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.04] transition-colors">
                   <button 
                     onClick={() => setExpandedQ(isExpanded ? null : idx)} 
                     className="w-full p-6 text-left flex items-start gap-4"
                   >
                     <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold font-mono text-sm border border-indigo-500/20">
                       {idx + 1}
                     </span>
                     <div className="flex-1 space-y-1 mt-1">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{q.type}</span>
                       <h4 className="text-lg font-medium text-slate-200">{q.question}</h4>
                     </div>
                     {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500 shrink-0 mt-2" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0 mt-2" />}
                   </button>
                   
                   <AnimatePresence>
                     {isExpanded && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <div className="p-6 pt-0 ml-12 text-slate-400 space-y-4">
                           {q.options && (
                             <ul className="space-y-2 mb-4">
                               {q.options.map((opt, i) => (
                                 <li key={i} className="flex gap-4 items-center bg-black/20 p-3 rounded-lg border border-white/5">
                                   <span className="font-mono text-xs text-slate-500">{String.fromCharCode(65 + i)}.</span>
                                   <span className={cn("text-sm", q.correctOptionIndex === i ? "text-emerald-400 font-bold" : "")}>{opt}</span>
                                 </li>
                               ))}
                             </ul>
                           )}
                           <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5 text-indigo-200">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/50 mb-2">Detailed Answer</div>
                             <div className="text-sm leading-relaxed whitespace-pre-line">{q.answer}</div>
                           </div>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               );
             })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
