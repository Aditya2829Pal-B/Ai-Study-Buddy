import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: "How does Neural Learn generate study materials?",
    a: "We use Google's state-of-the-art Gemini 3.1 Pro model to analyze your uploaded documents (syllabus, past papers). It semantically understands the academic context and synthesizes targeted roadmaps, spaced-repetition flashcards, and practice exams."
  },
  {
    q: "Is my uploaded data private?",
    a: "Yes. Your uploads are processed in memory to generate your study materials and are not permanently stored or used to train public models. We enforce strict data privacy standards."
  },
  {
    q: "What file formats do you support?",
    a: "Currently, we support PDF files, Word Documents (.docx), and plain text files up to 50MB per upload."
  },
  {
    q: "Can I cancel my Pro subscription at any time?",
    a: "Absolutely. You can cancel your subscription from the Settings page. You will continue to have Pro access until the end of your billing cycle."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Frequently Asked
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-lg text-slate-200">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-400 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-3xl border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-slate-400 font-medium">Can't find the answer you're looking for?</p>
          </div>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Chat to our team
          </button>
        </div>
      </div>
    </div>
  );
}
