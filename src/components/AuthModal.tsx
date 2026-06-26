import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import { Loader2, X, Github, Mail, Key, User } from 'lucide-react';
import { LoginSchema, RegisterSchema } from '../lib/schemas';
import { useAuthStore } from '../stores/useAuthStore';
import { cn } from '../lib/utils';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, checkAuth } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setFormData({ email: '', password: '', name: '' });
      setErrors({});
      setMode('login');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (mode === 'login') {
        LoginSchema.parse(formData);
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        await checkAuth();
        setAuthModalOpen(false);
      } else {
        RegisterSchema.parse(formData);
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        await checkAuth();
        setAuthModalOpen(false);
      }
    } catch (err: any) {
      if (err && err.errors && Array.isArray(err.errors)) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          if (e.path && e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: err.message || 'Authentication failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startOAuth = async () => {
    try {
      const res = await fetch('/api/auth/oauth/url?redirectUri=' + encodeURIComponent(window.location.origin + '/auth/callback'));
      const data = await res.json();
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(
        data.url,
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const handleMessage = async (event: MessageEvent) => {
        if (!event.origin.includes('localhost') && !event.origin.endsWith('.run.app')) return;
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          await checkAuth();
          setAuthModalOpen(false);
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error(error);
      setErrors({ general: 'OAuth failed to initialize' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAuthModalOpen(false)} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none" />
        
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 z-10 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-sm text-slate-400">
              {mode === 'login' ? 'Sign in to access your library' : 'Create an account to start sharing'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium text-center">
                {errors.general}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1 relative">
                <div className="absolute left-4 top-[1.1rem] text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
                {errors.name && <p className="text-rose-400 text-xs pl-2">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-1 relative">
              <div className="absolute left-4 top-[1.1rem] text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              />
              {errors.email && <p className="text-rose-400 text-xs pl-2">{errors.email}</p>}
            </div>

            <div className="space-y-1 relative">
              <div className="absolute left-4 top-[1.1rem] text-slate-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              />
              {errors.password && <p className="text-rose-400 text-xs pl-2">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 rounded-2xl bg-indigo-600 text-white font-bold text-sm tracking-wide hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/30 flex justify-center items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="my-6 relative flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="flex-shrink-0 px-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={startOAuth}
            className="w-full relative py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wide hover:bg-slate-200 transition-colors flex justify-center items-center gap-3"
          >
            <Github className="w-5 h-5" />
            Google / GitHub
          </button>

          <p className="mt-8 text-center text-xs text-slate-500 font-medium">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline decoration-indigo-400/30 underline-offset-4"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
