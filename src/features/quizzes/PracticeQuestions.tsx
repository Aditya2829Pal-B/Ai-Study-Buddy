import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Timer, Award, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  type: string;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  answer: string;
}

interface PracticeQuestionsProps {
  questions: Question[];
}

export const PracticeQuestionsContent: React.FC<PracticeQuestionsProps> = ({ questions }) => {
  const mcqs = questions.filter(q => q.type === 'MCQ');
  const [examStarted, setExamStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mcqs.length * 60); // 1 minute per question

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setExamFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeLeft]);

  const handleStart = () => {
    setExamStarted(true);
    setExamFinished(false);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTimeLeft(mcqs.length * 60);
  };

  const handleSelectOption = (idx: number) => {
    if (showExplanation || examFinished) return;
    
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: idx }));
    
    const currQ = mcqs[currentQIndex];
    let isCorrect = false;
    if (currQ.correctOptionIndex !== undefined) {
      isCorrect = currQ.correctOptionIndex === idx;
    } else if (currQ.options) {
      isCorrect = currQ.answer.toLowerCase().includes(currQ.options[idx].toLowerCase());
    }

    if (isCorrect) setScore(s => s + 1);
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQIndex < mcqs.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setShowExplanation(false);
    } else {
      setExamFinished(true);
    }
  };

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!examStarted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 min-h-[50vh]">
        <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)]">
          <Award className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-black tracking-tight text-white">Exam Simulator</h3>
          <p className="text-slate-400 max-w-lg">Test your knowledge with a simulated exam environment based on the previous examination papers you uploaded. You'll have {mcqs.length} minutes for {mcqs.length} questions.</p>
        </div>
        <button 
          onClick={handleStart}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:scale-105"
        >
          Begin Simulator
        </button>
      </div>
    );
  }

  if (examFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
          <Award className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="space-y-4">
          <h3 className="text-5xl font-black tracking-tighter text-white">Simulation Complete</h3>
          <p className="text-2xl text-slate-300">You scored <span className="text-emerald-400 font-bold">{score}</span> out of {mcqs.length}</p>
        </div>
        <button 
          onClick={handleStart}
          className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all"
        >
          Retake Simulator
        </button>
      </div>
    );
  }

  const currentQ = mcqs[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in mt-8 fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between mb-8 bg-black/40 p-6 rounded-2xl border border-white/5">
        <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span className="text-indigo-400">Question {currentQIndex + 1}</span>
          <span>/</span>
          <span>{mcqs.length}</span>
        </div>
        <div className={cn("flex items-center gap-2 font-mono text-xl font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10", timeLeft < 60 ? "text-rose-400 animate-pulse border-rose-400/50 bg-rose-400/10" : "text-white")}>
          <Timer className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <h4 className="text-2xl md:text-3xl font-semibold tracking-tight text-white leading-snug relative z-10">
          {currentQ.question}
        </h4>

        <div className="grid gap-3 relative z-10">
          {currentQ.options?.map((option, idx) => {
            const isSelected = selectedAnswers[currentQIndex] === idx;
            let isCorrect = false;
            if (currentQ.correctOptionIndex !== undefined) {
              isCorrect = currentQ.correctOptionIndex === idx;
            } else if (currentQ.options) {
              isCorrect = currentQ.answer.toLowerCase().includes(currentQ.options[idx].toLowerCase());
            }

            let btnClass = "bg-black/40 border-white/5 hover:border-indigo-400/50 hover:shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)] text-slate-300";
            let icon = null;

            if (showExplanation) {
              if (isCorrect) {
                btnClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
              } else if (isSelected) {
                btnClass = "bg-rose-500/10 border-rose-500/30 text-rose-300 ring-1 ring-rose-500/50";
                icon = <XCircle className="w-5 h-5 text-rose-400" />;
              } else {
                btnClass = "opacity-40 bg-black/40 border-white/5 text-slate-500";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={showExplanation}
                className={cn(
                  "p-5 rounded-2xl text-left transition-all duration-300 w-full flex items-center justify-between group border relative overflow-hidden",
                  btnClass,
                  !showExplanation && "hover:-translate-y-0.5 hover:bg-white/[0.04]"
                )}
              >
                {!showExplanation && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500-[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
                <div className="flex items-center gap-4 relative z-10">
                  <span className={cn("font-mono text-sm uppercase tracking-widest opacity-50", showExplanation && (isCorrect || isSelected) ? "opacity-100" : "")}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-base font-medium">{option}</span>
                </div>
                {icon && <div className="relative z-10">{icon}</div>}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl relative z-10 flex gap-4 text-sm leading-relaxed text-indigo-100">
                 <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                 <div>
                   <p className="font-bold text-indigo-300 mb-1 uppercase tracking-widest text-[10px]">Explanation</p>
                   {currentQ.answer}
                 </div>
              </div>
              <div className="mt-8 flex justify-end relative z-10">
                <button 
                  onClick={nextQuestion}
                  className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-white/10"
                >
                  {currentQIndex < mcqs.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
