import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Zap, Crown, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState<'' | 'stripe' | 'paypal' | 'razorpay'>('');

  const handleCheckout = async (provider: 'stripe' | 'paypal' | 'razorpay') => {
    setIsProcessing(provider);
    
    try {
      const response = await fetch(`/api/payment/checkout/${provider}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: 'price_placeholder' })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.orderId) {
        alert(`Razorpay order created: ${data.orderId}. Proceeding to checkout...`);
        // Here we would typically initialize Razorpay Checkout via their JS SDK
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      alert(`Checkout error: ${error.message}`);
    } finally {
      setIsProcessing('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-3xl overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.3)] relative my-8 flex flex-col md:flex-row"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Comparison Table */}
            <div className="w-full md:w-1/2 p-8 md:p-12 relative z-10 border-b md:border-b-0 md:border-r border-white/5 bg-[#111]/50 backdrop-blur-xl">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-white tracking-tight mb-4 flex items-center justify-center md:justify-start gap-3">
                  <Crown className="w-8 h-8 text-amber-400" /> Premium Tier
                </h2>
                <p className="text-slate-400">Unlock the full potential of your studies with unrestricted AI synthesis and top-tier resources.</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 pb-4 border-b border-white/5">
                <div className="col-span-1">Features</div>
                <div className="text-center">Free</div>
                <div className="text-center text-amber-400">Premium</div>
              </div>

              <div className="space-y-6">
                {[
                  { feature: 'AI Synthesis', free: '3 / day', premium: 'Unlimited' },
                  { feature: '5-Star Famous Resources', free: 'Locked', premium: 'Included' },
                  { feature: 'Engine Speed', free: 'Standard', premium: 'Priority (3x)' },
                  { feature: 'Global Collab Space', free: 'Basic', premium: 'Pro Tools' },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="col-span-1 text-sm text-slate-300 font-medium">{item.feature}</div>
                    <div className="text-center text-sm font-mono text-slate-500">{item.free}</div>
                    <div className="text-center text-sm font-mono text-amber-400 font-bold flex items-center justify-center gap-1">
                      {item.premium === 'Included' ? <CheckCircle2 className="w-4 h-4" /> : item.premium}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <h3 className="text-4xl font-black text-white mb-2">$9.99 <span className="text-lg text-slate-400 font-medium">/mo</span></h3>
                <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">Cancel anytime</p>
              </div>
            </div>

            {/* Right: Payment Providers */}
            <div className="w-full md:w-1/2 p-8 md:p-12 relative z-10 flex flex-col justify-center">
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Checkout
                </h3>
                <p className="text-xs text-emerald-400/80 font-medium flex items-center justify-center md:justify-start gap-1.5 mb-2">
                  <Lock className="w-3.5 h-3.5" /> End-to-end encrypted PCI-compliant payment
                </p>
                <p className="text-sm text-slate-400">Select your preferred payment method below.</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleCheckout('stripe')}
                  disabled={!!isProcessing}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all bg-[#635BFF] text-white hover:bg-[#5851E5] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isProcessing === 'stripe' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Pay with Stripe (Cards, Apple Pay)
                </button>

                <button
                  onClick={() => handleCheckout('paypal')}
                  disabled={!!isProcessing}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all bg-[#0079C1] text-white hover:bg-[#00609A] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isProcessing === 'paypal' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Pay with PayPal
                </button>
                
                <button
                  onClick={() => handleCheckout('razorpay')}
                  disabled={!!isProcessing}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all bg-[#0288D1] text-white hover:bg-[#0277BD] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isProcessing === 'razorpay' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  Pay with Razorpay (UPI, NetBanking)
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
