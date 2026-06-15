import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'motion/react';
import { Clock, Target, Flame } from 'lucide-react';

const studyData = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 3.5 },
  { day: 'Fri', hours: 2.9 },
  { day: 'Sat', hours: 4.1 },
  { day: 'Sun', hours: 3.2 },
];

const masteryData = [
  { subject: 'Biology', A: 85, fullMark: 100 },
  { subject: 'Physics', A: 65, fullMark: 100 },
  { subject: 'History', A: 90, fullMark: 100 },
  { subject: 'Math', A: 75, fullMark: 100 },
  { subject: 'Comp. Sci', A: 95, fullMark: 100 },
];

export function StudyProgress() {
  return (
    <div className="w-full space-y-8 mb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Study Progress</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-indigo-400">12 Day Streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Hours Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-200">Study Hours (This Week)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Topic Mastery Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-slate-200">Topic Mastery</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={masteryData}>
                <PolarGrid stroke="#ffffff1a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Mastery %" dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#c084fc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
