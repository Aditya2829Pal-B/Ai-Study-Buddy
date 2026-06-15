import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, FileUp, Star, Crown, Sparkles, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAppStore } from '../../stores/useAppStore';
import { useDashboardStore } from '../../stores/useDashboardStore';
import { useMaterialStore } from '../../stores/useMaterialStore';

export function LibraryView() {
  const { user, setAuthModalOpen } = useAuthStore();
  const { isPremium, setIsPremiumModalOpen } = useAppStore();
  const { setView } = useDashboardStore();
  const { setTopic, setAcademicLevel, setResult } = useMaterialStore();
  
  const [hasContributed, setHasContributed] = React.useState(false);

  const downloadDummyPDF = (title: string, level: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // We defer importing jsPDF to the implementation directly to avoid bundling issues if not needed yet
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(`Study Guide: ${title}`, 20, 20);
      doc.setFontSize(14);
      doc.text(`Level: ${level}`, 20, 35);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("This is an unedited pre-uploaded document from the Community Library.", 20, 45);
      doc.save(`${title.replace(/\s+/g, '_')}_Library.pdf`);
    });
  };

  const handleLibraryGenerate = (title: string, level: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setTopic(title);
    setAcademicLevel(level);
    setResult(null);
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      key="library"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto w-full space-y-16"
    >
      <div className="text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight">
          Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Library</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">
          Unlock access to thousands of study materials shared by students worldwide.
        </p>
      </div>

      {!hasContributed && user && (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-[2.5rem] p-12 text-center space-y-8 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Unlock Unlimited Access</h2>
              <p className="text-indigo-200/80 mb-10 max-w-lg mx-auto text-lg">Like Scribd, our community thrives on sharing. Upload just one study document to unlock lifetime downloads globally.</p>
              
              <div className="w-full max-w-md mx-auto">
                <label className="flex items-center justify-center gap-3 w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-[1.02] cursor-pointer transition-transform shadow-2xl shadow-indigo-900/50">
                    <FileUp className="w-5 h-5" />
                    Upload to Unlock
                    <input type="file" className="hidden" onChange={async (e) => { 
                      if(e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        try {
                          const buffer = await file.arrayBuffer();
                          const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                          const hashArray = Array.from(new Uint8Array(hashBuffer));
                          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                          
                          const existingHashes = JSON.parse(localStorage.getItem('lib_hashes') || '[]');
                          if (existingHashes.includes(hashHex)) {
                            alert("This document already exists in our community library! Please upload a new, unique document to unlock.");
                            return;
                          }
                          
                          existingHashes.push(hashHex);
                          localStorage.setItem('lib_hashes', JSON.stringify(existingHashes));
                          
                          setTimeout(() => setHasContributed(true), 1500);
                        } catch (err) {
                          console.error(err);
                          setTimeout(() => setHasContributed(true), 1500);
                        }
                      }
                    }} />
                </label>
              </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Advanced Calculus Cheat Sheet', level: 'UG (Undergrad)', size: '2.4 MB', rating: 4.8, reviews: 1250, isPremium: true },
          { title: 'Machine Learning Notes 2026', level: 'PG (Postgrad)', size: '15.1 MB', rating: 4.9, reviews: 3420, isPremium: true },
          { title: 'Cell Biology Diagrams', level: 'High School', size: '5.8 MB', rating: 3.5, reviews: 45, isPremium: false },
          { title: '19th Century History', level: 'UG (Undergrad)', size: '1.2 MB', rating: 4.1, reviews: 112, isPremium: false },
          { title: 'Software Engineering Best Practices', level: 'Professional', size: '8.4 MB', rating: 4.7, reviews: 890, isPremium: true },
          { title: 'Quantum Mechanics Form.', level: 'PG (Postgrad)', size: '3.3 MB', rating: 4.6, reviews: 412, isPremium: true }
        ].map((doc, i) => (
          <div key={i} className={cn("border rounded-[2rem] p-8 space-y-6 hover:border-white/10 transition-all group relative overflow-hidden", doc.isPremium ? "bg-gradient-to-b from-[#151226] to-[#0A0A0A] border-indigo-500/20" : "bg-[#111] border-white/5 hover:bg-[#161616]")}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono bg-indigo-500/10 px-3 py-1.5 rounded-lg">{doc.level}</span>
                  {doc.isPremium && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 font-bold uppercase tracking-widest font-mono bg-amber-400/10 px-2 py-1 rounded">
                      <Crown className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">{doc.title}</h3>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-sm font-bold ml-1">{doc.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">({doc.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{doc.size}</span>
                </div>
            </div>
            {hasContributed || !user ? (
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/5">
                <button 
                  onClick={() => {
                    if(doc.isPremium && !isPremium) {
                      setIsPremiumModalOpen(true);
                      return;
                    }
                    downloadDummyPDF(doc.title, doc.level);
                  }}
                  className={cn("w-full py-4 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors", doc.isPremium && !isPremium ? "bg-white/5 hover:bg-white/10" : "bg-white/5 hover:bg-white/10")}
                >
                  {doc.isPremium && !isPremium ? <Lock className="w-4 h-4 text-amber-400" /> : <Download className="w-4 h-4 text-slate-400" />} {doc.isPremium && !isPremium ? 'Locked' : 'DL'}
                </button>
                <button 
                  onClick={() => {
                    if(doc.isPremium && !isPremium) {
                      setIsPremiumModalOpen(true);
                      return;
                    }
                    handleLibraryGenerate(doc.title, doc.level);
                  }}
                  className={cn("w-full py-4 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors", (doc.isPremium && !isPremium) ? "bg-white/5 text-slate-500 hover:bg-amber-500/20 hover:text-amber-400 border border-dashed border-white/10 transition-all cursor-pointer" : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50")}
                >
                  {doc.isPremium && !isPremium ? <Crown className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />} {(doc.isPremium && !isPremium) ? 'Premium' : 'AI Gen'}
                </button>
              </div>
            ) : (
              <button disabled className="w-full py-4 mt-6 bg-white/5 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed border border-dashed border-white/10">
                <Lock className="w-4 h-4" /> Locked (Upload to Unlock)
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
