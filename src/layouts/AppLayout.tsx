import React, { useState } from 'react';
import { BrainCircuit, Search, Library, Users, Crown, Settings, LogOut, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/useAuthStore';
import { useAppStore } from '../stores/useAppStore';
import { useDashboardStore } from '../stores/useDashboardStore';
import { useSearchStore } from '../stores/useSearchStore';
import { useMaterialStore } from '../stores/useMaterialStore';
import { DeveloperProfileModal } from '../components/DeveloperProfileModal';
import { StreakBadge } from '../features/dashboard/StreakBadge';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, setAuthModalOpen } = useAuthStore();
  const { setCookieModalOpen, isPremium, setIsPremiumModalOpen, setDeveloperProfileOpen } = useAppStore();
  const { view, setView } = useDashboardStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const { result } = useMaterialStore();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname === '/app';
  const isLanding = location.pathname === '/';
  const isPricing = location.pathname === '/pricing';

  const isCollab = location.pathname.startsWith('/collab');

  const showSearch = isDashboard;
  const showDashboardNav = isDashboard || isCollab;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Premium Atmospheric UI Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f0c1b] via-[#050505] to-[#010101]">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen animate-[pulse_8s_ease-in-out_infinite_2s]" />
      </div>

      {/* Header */}
      <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white/[0.02] backdrop-blur-3xl border-b border-white/5 shrink-0 sticky top-0 z-40 transition-all">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-all duration-300 ease-out">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white hidden sm:inline transition-colors">
              Neural Learn
            </span>
          </Link>
        </div>

        {showSearch && result && (
          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-300" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all materials..."
                className="w-full bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 placeholder:text-slate-500 shadow-inner"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4 md:gap-6">
          {showDashboardNav && (
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/5 shadow-inner">
              <button 
                onClick={() => setView('studio')}
                className={cn(
                  "px-5 py-2 rounded-full font-medium text-[13px] transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]",
                  view === 'studio' ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                Studio
              </button>
              <button 
                onClick={() => setView('library')}
                className={cn(
                  "px-5 py-2 rounded-full font-medium text-[13px] transition-all duration-300 ease-out flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]",
                  view === 'library' ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Library className="w-4 h-4" /> Library
              </button>
              <button 
                onClick={() => setView('history')}
                className={cn(
                  "px-5 py-2 rounded-full font-medium text-[13px] transition-all duration-300 ease-out flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]",
                  view === 'history' ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Clock className="w-4 h-4" /> History
              </button>
              <Link 
                to="/collab"
                className="px-5 py-2 rounded-full font-medium text-[13px] transition-all duration-300 ease-out flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <Users className="w-4 h-4 group-hover:text-indigo-400 transition-colors" /> Collab
              </Link>
            </div>
          )}

          {!isDashboard && user && (
            <div className="hidden md:flex items-center gap-2 p-1 bg-white/[0.03] backdrop-blur-xl rounded-full border border-white/5 shadow-inner">
              <Link 
                to="/app"
                className="px-5 py-2 rounded-full font-medium text-[13px] transition-all duration-300 ease-out bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Dashboard
              </Link>
            </div>
          )}

          {!isDashboard && !user && (
            <div className="hidden md:flex items-center gap-4 mr-2">
              <Link to="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</Link>
            </div>
          )}

          <div className="w-px h-6 bg-white/10 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <StreakBadge />
              <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)] hover:border-indigo-400/50 transition-colors">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-14 w-64 bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
                    >
                    <div className="p-4 border-b border-white/5 mb-2">
                       <p className="font-semibold text-white truncate flex items-center gap-2">
                         {user.name || 'Student'} 
                         {isPremium && <Crown className="w-3.5 h-3.5 text-indigo-400" />}
                       </p>
                       <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    {!isPremium && (
                      <button 
                        onClick={() => { setIsPremiumModalOpen(true); setIsUserMenuOpen(false); }} 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                      >
                        <Crown className="w-4 h-4" /> Upgrade to Premium
                      </button>
                    )}
                    <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <Settings className="w-4 h-4" /> Admin Portal
                    </Link>
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <Settings className="w-4 h-4" /> Profile & Uploads
                    </Link>
                    <button onClick={() => { setCookieModalOpen(true); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      <Settings className="w-4 h-4" /> Preferences
                    </button>
                    <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                  </>
                )}
              </AnimatePresence>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)]"
            >
              Log In
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative">
        {children}
      </div>

      {/* Modern Footer */}
      {!isCollab && (
        <footer className="py-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-[#050505]/50 backdrop-blur-md text-xs font-bold text-slate-500 uppercase tracking-widest gap-4 mt-auto">
          <div className="flex items-center gap-2">
             <BrainCircuit className="w-4 h-4 text-indigo-500" />
             <span>Neural Learn <span className="text-indigo-400 opacity-50 ml-1">v2.1</span></span>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-8 justify-center">
            <Link to="/pricing" className="hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">Pricing</Link>
            <Link to="/faq" className="hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">FAQ</Link>
            <Link to="/changelog" className="hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">Changelog</Link>
            <Link to="/roadmap" className="hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">Roadmap</Link>
            <button onClick={() => setCookieModalOpen(true)} className="hover:text-white transition-colors border-b border-transparent hover:border-slate-500 pb-0.5">Privacy & Data</button>
            
            <div className="w-px h-3 bg-white/20 hidden md:block" />
            <button 
              onClick={() => setDeveloperProfileOpen(true)} 
              className="text-indigo-400 hover:text-indigo-300 transition-colors border-b border-transparent hover:border-indigo-400 pb-0.5 tracking-[0.2em] relative group flex items-center"
            >
              DEVELOPED BY ADITYA PAL
              <span className="absolute -inset-x-2 -inset-y-1 bg-indigo-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity -z-10" />
            </button>
          </div>
        </footer>
      )}
      <DeveloperProfileModal />
    </div>
  );
}
