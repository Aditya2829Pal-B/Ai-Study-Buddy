import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn, fileToBase64 } from '../../lib/utils';
import { UploadZone } from '../uploads/UploadZone';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMaterialStore } from '../../stores/useMaterialStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

interface MaterialSetupProps {
  onGenerating: (isGenerating: boolean) => void;
}

export function MaterialSetup({ onGenerating }: MaterialSetupProps) {
  const { user, setAuthModalOpen } = useAuthStore();
  const { topic, setTopic, academicLevel, setAcademicLevel, setResult } = useMaterialStore();
  const { addSession } = useHistoryStore();

  const [syllabus, setSyllabus] = useState<File[]>([]);
  const [papers, setPapers] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!topic) return;
    
    setIsGenerating(true);
    onGenerating(true);
    setResult(null);

    try {
      const syllabusData = syllabus.length > 0 ? {
        data: await fileToBase64(syllabus[0]),
        mimeType: syllabus[0].type
      } : null;

      const papersData = await Promise.all(papers.map(async (f) => ({
        data: await fileToBase64(f),
        mimeType: f.type
      })));

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          syllabus: syllabusData, 
          papers: papersData,
          level: academicLevel
        }),
      });

      if (!response.ok) throw new Error('Failed to generate study materials');
      const data = await response.json();
      setResult(data);
      addSession({ topic, academicLevel, result: data });
    } catch (error) {
      console.error(error);
      alert('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
      onGenerating(false);
    }
  };

  return (
    <motion.div 
      key="setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full space-y-16"
    >
      <div className="text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight font-sans">
          Design Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400 animate-text-move bg-[length:200%_auto]">Genius</span> Moment
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Upload your raw materials and context. We'll architect a highly targeted study experience designed for pure retention.
        </p>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 md:p-12 space-y-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group/form">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-purple-500/[0.02] opacity-0 group-hover/form:opacity-100 transition-opacity duration-700" />
        
        <div className="space-y-4 relative z-10">
          <label htmlFor="topic-input" className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-indigo-400 font-bold">01</span> / Module Vector
          </label>
          <div className="relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g. Advanced Cellular Automata"
              className="relative w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-6 py-5 text-lg md:text-xl text-white focus:outline-none focus:border-indigo-400/50 transition-all font-medium placeholder:text-slate-600 shadow-inner hover:border-white/20"
            />
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-indigo-400 font-bold">02</span> / Academic Altitude
          </label>
          <div className="flex flex-wrap gap-3">
            {['High School', 'UG (Undergrad)', 'PG (Postgrad)', 'Professional'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setAcademicLevel(lvl)}
                className={cn(
                  "px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out border backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]",
                  academicLevel === lvl
                    ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]"
                    : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <UploadZone
            id="syllabus-upload"
            label="03 / Syllabus Graph"
            files={syllabus}
            onFilesChange={setSyllabus}
          />
          <UploadZone
            id="papers-upload"
            label="04 / Previous Exams"
            files={papers}
            onFilesChange={setPapers}
            multiple
          />
        </div>

        <button
          id="generate-btn"
          onClick={handleGenerate}
          disabled={!topic || isGenerating}
          className={cn(
            "w-full py-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 text-base uppercase tracking-widest relative overflow-hidden group/btn z-10",
            !topic || isGenerating 
              ? "bg-white/[0.02] text-slate-500 cursor-not-allowed border border-white/5" 
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover/btn:animate-[shimmer_2s_infinite]" />
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing Data...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              Commence Synthesis
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
