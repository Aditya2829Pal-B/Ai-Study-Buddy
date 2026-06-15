import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Globe, ExternalLink, MessageCircle, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMaterialStore } from '../../stores/useMaterialStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from 'sonner';

import { RoadmapView } from '../notes/RoadmapView';
import { FlashcardList } from '../flashcards/FlashcardList';
import { QuizView } from '../quizzes/QuizView';
import { AIChat } from '../ai-chat/AIChat';

export function MaterialResult() {
  const { topic, setTopic, result, setResult, setAcademicLevel } = useMaterialStore();
  const { user, setAuthModalOpen } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'roadmap' | 'flashcards' | 'questions' | 'chat' | 'sources'>('roadmap');
  const [isSaving, setIsSaving] = useState(false);

  const downloadPDF = () => {
    if (!result) return;
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(`Study Guide: ${topic}`, 20, y);
      y += 15;
      doc.setFontSize(14);
      doc.text("Roadmap", 20, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const text = result.roadmap.map(m => `${m.title} (${m.duration})\n${m.description}\nTopics: ${m.keyTopics.join(', ')}`).join('\n\n');
      const splitNotes = doc.splitTextToSize(text, 170);
      doc.text(splitNotes, 20, y);
      y += (splitNotes.length * 5) + 10;
      doc.save(`${topic.replace(/\s+/g, '_')}_Kit.pdf`);
    });
  };

  const handleSaveToProfile = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        topic,
        roadmap: result?.roadmap,
        flashcards: result?.flashcards,
        practiceQuestions: result?.practiceQuestions,
        sources: result?.sources
      };
      const res = await fetch('/api/profile/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Saved to Profile", { description: "You can view this material anytime from your profile." });
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to save material to profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) return null;

  return (
    <motion.div 
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Result Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative">
        <div className="absolute top-0 left-1/4 w-[40%] h-[100px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-indigo-400 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Synthesis Complete
          </span>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">{topic}</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
          <button 
            onClick={() => {
              setResult(null); 
              setTopic(''); 
              setAcademicLevel('UG (Undergrad)');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.03] rounded-xl text-white hover:bg-white/[0.08] transition-all duration-300 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98]"
          >
            New Analysis
          </button>
          <button 
            onClick={downloadPDF}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-black rounded-xl hover:bg-slate-200 transition-all duration-300 text-sm font-semibold shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button 
            onClick={handleSaveToProfile}
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-500 rounded-xl text-white hover:bg-indigo-600 disabled:bg-indigo-500/50 transition-all duration-300 text-sm font-semibold shadow-[0_4px_15px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save to Profile"}
          </button>
        </div>
      </div>

       {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 relative z-10">
        {[
          { id: 'roadmap', label: 'Syllabus Roadmap' },
          { id: 'flashcards', label: 'AI Flashcards' },
          { id: 'questions', label: 'Exam Simulator' },
          { id: 'sources', label: 'Neural Sources' },
          { id: 'chat', label: 'AI Chat' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]",
              activeTab === tab.id 
                ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]" 
                : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[60vh] py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <RoadmapView roadmap={result.roadmap} />
            </motion.div>
          )}

          {activeTab === 'flashcards' && (
            <motion.div
              key="flashcards-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <FlashcardList flashcards={result.flashcards} />
            </motion.div>
          )}

          {activeTab === 'questions' && (
            <motion.div
              key="questions-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <QuizView questions={result.practiceQuestions} />
            </motion.div>
          )}
          
          {activeTab === 'chat' && (
            <motion.div
              key="chat-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AIChat />
            </motion.div>
          )}

          {activeTab === 'sources' && (
            <motion.div
              key="sources-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl space-y-8"
            >
              <div className="grid gap-6">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-8 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2rem] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl ring-1 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all duration-300">
                          <Globe className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        </div>
                        <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-50 transition-colors">{source.title}</h4>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-base text-slate-400 leading-relaxed pl-16 mb-5 relative z-10">{source.description}</p>
                    <div className="pl-16 relative z-10">
                      <span className="text-xs font-mono text-indigo-300/70 bg-indigo-500/10 px-3 py-1.5 rounded-lg truncate inline-block max-w-[90%] ring-1 ring-indigo-500/20">
                        {source.url}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
