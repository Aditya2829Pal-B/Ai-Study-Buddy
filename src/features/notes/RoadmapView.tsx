import React from 'react';

interface RoadmapModule {
  title: string;
  duration: string;
  description: string;
  keyTopics: string[];
}

interface RoadmapViewProps {
  roadmap: RoadmapModule[];
}

export function RoadmapView({ roadmap }: RoadmapViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-indigo-500/0 before:via-indigo-500/30 before:to-transparent">
        {roadmap.map((moduleItem, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-[#050505] bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] absolute left-0 md:left-1/2 -translate-x-1/2 -ml-[1px] md:ml-0 z-10 shrink-0 group-hover:scale-125 transition-transform duration-300">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] p-8 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-3xl hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)] group-hover:-translate-y-1 group-hover:scale-[1.01]">
               <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3 mb-4">
                 <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">{moduleItem.title}</h4>
                 <span className="text-xs font-semibold tracking-widest text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full ring-1 ring-indigo-500/30 shrink-0 self-start">{moduleItem.duration}</span>
               </div>
               <p className="text-base text-slate-400 leading-relaxed mb-6">{moduleItem.description}</p>
               <div className="flex flex-wrap gap-2">
                 {moduleItem.keyTopics.map((topicItem, tIdx) => (
                   <span key={tIdx} className="text-xs font-medium bg-black/50 text-slate-300 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">{topicItem}</span>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
