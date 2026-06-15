import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquarePlus, X, Send } from 'lucide-react';
import { toast } from 'sonner';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      setFeedback('');
      toast.success('Thanks for your feedback!', {
        description: "We'll review it and get back to you if needed."
      });
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquarePlus className="w-6 h-6" />
      </button>

      {/* Widget Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
                Leave Feedback
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <p className="text-sm text-slate-400">
                Help us improve! Let us know if you found a bug or have a feature request.
              </p>
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                required
              />
              
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : (
                  <>Send Feedback <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
