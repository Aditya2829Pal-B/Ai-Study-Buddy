import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useAppStore } from '../stores/useAppStore';
import { toast } from 'sonner';

export function Pricing() {
  const { user, setAuthModalOpen } = useAuthStore();
  const { isPremium, setIsPremiumModalOpen, setIsPremium } = useAppStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true' || searchParams.get('paypal_success') === 'true') {
      setIsPremium(true);
      toast.success('Payment successful! Welcome to Pro.');
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Payment was canceled. You have not been charged.');
    }
  }, [searchParams, setIsPremium]);

  const handleProClick = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!isPremium) {
      setIsPremiumModalOpen(true);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch('/api/payment/portal/stripe', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Could not open subscription portal');
      }
    } catch (e: any) {
      toast.error('Failed to connect to billing portal.');
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-20 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">geniuses.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Whether you're a curious student or a rigorous academic, we've got a plan for you. Cancel anytime.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 relative z-10">
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[2.5rem] flex flex-col hover:border-white/10 transition-colors"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Hobby</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold text-white">$0</span>
              <span className="text-slate-400 font-medium">/ forever</span>
            </div>
            <p className="text-slate-400 font-medium">For casual learners.</p>
          </div>
          
          <div className="space-y-4 mb-12 flex-1">
            {['10 Uploads per month', 'Basic AI Models', 'Standard Roadmaps', 'Community support'].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-500" />
                <span className="text-slate-300 font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <button 
            disabled
            className="w-full py-4 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold flex items-center justify-center gap-2 cursor-default"
          >
            {user && !isPremium ? 'Current Plan' : 'Free Forever'}
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-b from-indigo-500/10 to-purple-500/5 backdrop-blur-3xl border border-indigo-500/30 p-8 md:p-12 rounded-[2.5rem] flex flex-col relative shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]"
        >
          <div className="absolute top-0 right-8 -translate-y-1/2">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]">
              Most Popular
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Pro</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold text-white">$12</span>
              <span className="text-slate-400 font-medium">/ month</span>
            </div>
            <p className="text-indigo-200 font-medium">For serious academics.</p>
          </div>
          
          <div className="space-y-4 mb-12 flex-1">
            {[
              'Unlimited Uploads', 
              'Premium Gemini 3.1 Pro Model', 
              'Advanced Exam Simulator', 
              'Deep Research Mode',
              'Priority Support'
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-white font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleProClick}
            disabled={isPremium}
            className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
              isPremium 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]'
              : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]'
            }`}
          >
            {isPremium ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Active Plan
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" /> Upgrade to Pro
              </>
            )}
          </button>
          
          {isPremium && (
            <button 
              onClick={handleManageSubscription}
              className="mt-4 w-full py-3 rounded-full text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all text-center"
            >
              Manage Subscription (Customer Portal)
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
