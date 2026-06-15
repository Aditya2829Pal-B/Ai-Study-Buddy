import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BrainCircuit, BookOpen, Layers, Zap, ArrowRight, CheckCircle2, Terminal } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export function Landing() {
  const { user, setAuthModalOpen } = useAuthStore();

  return (
    <div className="min-h-[80vh] flex flex-col pt-12 md:pt-20">
      {/* Hero Section */}
      <section className="relative px-6 flex-1 flex items-center justify-center mb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-sm font-medium text-slate-300 backdrop-blur-md mb-4"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Neural Learn 2.0 is now live</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1]"
          >
            Study with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              artificial intelligence.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Upload your materials, generate intelligent flashcards, roadmaps, and practice questions in seconds. The ultimate educational co-pilot.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            {user ? (
              <Link 
                to="/app" 
                className="px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Start Learning For Free <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <Link
              to="/pricing"
              className="px-8 py-4 rounded-full bg-white/[0.03] border border-white/5 text-white font-semibold text-base hover:bg-white/[0.08] transition-all w-full sm:w-auto justify-center text-center"
            >
              View Pricing
            </Link>
          </motion.div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-16 max-w-4xl mx-auto"
          >
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Trusted by students at top universities
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {['Stanford', 'MIT', 'Harvard', 'Oxford', 'Berkeley'].map((uni) => (
                <span key={uni} className="text-xl md:text-2xl font-black tracking-tighter text-slate-300">
                  {uni}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative">
        <div className="absolute top-0 right-1/4 w-[30%] h-[200px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to ace it.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Powerful AI features designed to cut your study time in half.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Terminal className="w-8 h-8 text-indigo-400" />,
              title: "AI Matrix Generation",
              desc: "Instantly synthesize complex topics into readable, focused study chunks. Save hours of manual notes."
            },
            {
              icon: <Layers className="w-8 h-8 text-pink-400" />,
              title: "Spaced Repetition",
              desc: "Automatically generated smart flashcards with mastery tracking for optimal long-term retention."
            },
            {
              icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
              title: "Exam Simulator",
              desc: "Practice with AI-generated questions mapped exactly to your uploaded curriculum materials."
            }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] w-max border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by learners everywhere.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah J.", role: "Med Student", text: "This app literally saved my finals. The AI flashcards are better than what I write manually." },
            { name: "David L.", role: "Computer Science", text: "The study roadmap feature helps me break down complex topics so easily." },
            { name: "Emily R.", role: "High School", text: "I used to spend hours making study guides. Now Neural does it in 10 seconds." }
          ].map((t, i) => (
             <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10"
            >
              <div className="flex text-amber-400 mb-4">
                {'★★★★★'.split('').map((star, idx) => <span key={idx}>{star}</span>)}
              </div>
              <p className="text-slate-300 italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-5xl mx-auto px-6 py-24 mb-12 text-center">
        <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight relative z-10">Stop guessing.<br/>Start acing.</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto relative z-10">Join thousands of top students who have upgraded their study routine.</p>
          <div className="relative z-10 flex justify-center">
            {user ? (
               <Link 
                 to="/app" 
                 className="px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2"
               >
                 Launch App <ArrowRight className="w-5 h-5" />
               </Link>
            ) : (
               <button 
                 onClick={() => setAuthModalOpen(true)}
                 className="px-8 py-4 rounded-full bg-white text-black font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center gap-2"
               >
                 Get Started For Free <ArrowRight className="w-5 h-5" />
               </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
