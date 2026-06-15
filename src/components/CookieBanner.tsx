import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, Settings, Check, X } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { cn } from '../lib/utils';
import { CookieSettings } from '../lib/schemas';

export function CookieBanner() {
  const { hasAcceptedCookies, acceptAllCookies, setCookieModalOpen, isCookieModalOpen, cookieSettings, setCookieSettings } = useAppStore();
  const [localSettings, setLocalSettings] = useState<CookieSettings>(cookieSettings);

  const saveSettings = () => {
    setCookieSettings(localSettings);
    setCookieModalOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!hasAcceptedCookies && !isCookieModalOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-[#111] border border-white/10 p-6 rounded-[2rem] shadow-2xl z-40"
          >
            <div className="flex items-start gap-4">
               <div className="p-3 bg-indigo-500/20 rounded-xl shrink-0">
                 <Cookie className="w-6 h-6 text-indigo-400" />
               </div>
               <div className="space-y-3">
                 <h3 className="text-sm font-bold text-white tracking-tight">We value your privacy</h3>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   We use cookies to enhance your browsing experience, analyze site traffic, and serve tailored content.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-2 pt-2">
                   <button 
                     onClick={acceptAllCookies}
                     className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
                   >
                     Accept All
                   </button>
                   <button 
                     onClick={() => setCookieModalOpen(true)}
                     className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-colors border border-white/10"
                   >
                     Manage
                   </button>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {isCookieModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCookieModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 shadow-2xl z-10"
            >
              <button 
                onClick={() => setCookieModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <Settings className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white tracking-tight">Cookie Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Strictly Necessary</h4>
                    <p className="text-xs text-slate-400">Required for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <div className="shrink-0 w-10 h-6 bg-indigo-600 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                       <Check className="w-3 h-3 text-indigo-600" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Analytics</h4>
                    <p className="text-xs text-slate-400">Helps us understand how visitors interact with the website.</p>
                  </div>
                  <button 
                    onClick={() => setLocalSettings(p => ({ ...p, analytics: !p.analytics }))}
                    className={cn("shrink-0 w-10 h-6 rounded-full relative transition-colors", localSettings.analytics ? "bg-indigo-600" : "bg-white/20")}
                  >
                    <motion.div 
                      layout
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      initial={false}
                      animate={{ 
                        left: localSettings.analytics ? "calc(100% - 20px)" : "4px"
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Marketing</h4>
                    <p className="text-xs text-slate-400">Used to deliver relevant advertisements and track ad performance.</p>
                  </div>
                  <button 
                    onClick={() => setLocalSettings(p => ({ ...p, marketing: !p.marketing }))}
                    className={cn("shrink-0 w-10 h-6 rounded-full relative transition-colors", localSettings.marketing ? "bg-indigo-600" : "bg-white/20")}
                  >
                    <motion.div 
                      layout
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      initial={false}
                      animate={{ 
                        left: localSettings.marketing ? "calc(100% - 20px)" : "4px"
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                   onClick={saveSettings}
                   className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/40"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
