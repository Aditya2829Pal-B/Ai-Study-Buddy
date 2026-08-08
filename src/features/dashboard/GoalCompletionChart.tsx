import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Activity, Target } from 'lucide-react';

const data = [
  { day: 'Mon', studyHours: 2.5, goalCompletion: 80 },
  { day: 'Tue', studyHours: 3.2, goalCompletion: 95 },
  { day: 'Wed', studyHours: 1.5, goalCompletion: 60 },
  { day: 'Thu', studyHours: 4.0, goalCompletion: 100 },
  { day: 'Fri', studyHours: 3.8, goalCompletion: 90 },
  { day: 'Sat', studyHours: 5.2, goalCompletion: 100 },
  { day: 'Sun', studyHours: 4.5, goalCompletion: 100 },
];

export function GoalCompletionChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 w-full mb-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Target className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-200">Weekly Progress & Goals</h3>
            <p className="text-sm text-slate-400">Study hours vs. daily goal completion rate</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-300">On Track</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
          >
            <CartesianGrid stroke="#ffffff0a" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              yAxisId="left" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar 
              yAxisId="left" 
              dataKey="studyHours" 
              name="Study Hours" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="goalCompletion" 
              name="Goal Completion (%)" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#0f172a', stroke: '#10b981', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: '#10b981' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
