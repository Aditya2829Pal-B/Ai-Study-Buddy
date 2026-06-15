import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function Changelog() {
  const updates = [
    {
      version: 'v2.1.0',
      date: 'May 18, 2026',
      title: 'Premium Subscriptions & Stripe',
      changes: [
        'Added professional Pro Tier billing system via Stripe',
        'Implemented PCI-compliant payment flows',
        'Introduced Admin Dashboard for revenue tracking'
      ]
    },
    {
      version: 'v2.0.0',
      date: 'April 30, 2026',
      title: 'Neural Learn Rebrand & Expansion',
      changes: [
        'Complete UI overhaul to dark mode startup aesthetic',
        'Added robust OAuth backend system',
        'Introduced Team Collaboration Spaces',
        'Upgraded to Gemini 3.1 Pro'
      ]
    },
    {
      version: 'v1.5.0',
      date: 'March 15, 2026',
      title: 'Mobile Optimization',
      changes: [
        'Fluid responsive design for all mobile devices',
        'Touch-optimized spaced repetition UI',
        'Added PWA manifest'
      ]
    }
  ];

  return (
    <div className="min-h-screen py-24 px-6 relative">
      <div className="absolute top-0 right-1/4 w-[30%] h-[300px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto space-y-16 relative z-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Changelog
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            New updates and improvements to Neural Learn.
          </p>
        </div>

        <div className="space-y-12 border-l border-white/10 pl-6 md:pl-8 ml-2 md:ml-0">
          {updates.map((update, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 bg-[#050505] rounded-full border border-indigo-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              </div>
              
              <div className="mb-4">
                <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase bg-indigo-500/10 px-3 py-1 rounded-full mr-4 inline-block mb-3">
                  {update.version}
                </span>
                <span className="text-slate-500 font-medium text-sm">{update.date}</span>
                <h3 className="text-2xl font-bold text-white mt-2">{update.title}</h3>
              </div>
              
              <ul className="space-y-3 mt-4">
                {update.changes.map((change, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-400">
                    <ChevronRight className="w-5 h-5 text-slate-600 shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
