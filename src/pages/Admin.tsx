import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Crown, CreditCard, Activity, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function Admin() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setIsLoading(false);
      })
      .catch(err => {
        toast.error(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading metrics...</div>;
  }

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">Access Denied</div>;
  }

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Revenue Dashboard</h1>
            <p className="text-slate-400">Admin overview & financial metrics</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4" /> System Healthy
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> MRR
            </div>
            <div className="text-4xl font-bold text-white mb-2">${stats.currentMRR}</div>
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +12% from last month</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Total Users
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalUsers}</div>
            <div className="text-xs font-medium text-blue-400 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +54 new this week</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" /> Premium Subs
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.premiumUsers}</div>
            <div className="text-xs font-medium text-amber-400 flex items-center gap-1">Converting well</div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" /> ARPU
            </div>
            <div className="text-4xl font-bold text-white mb-2">${stats.totalUsers > 0 ? (stats.currentMRR / stats.totalUsers).toFixed(2) : '0.00'}</div>
            <div className="text-xs font-medium text-slate-500">Average Rev Per User</div>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-96 w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Revenue History Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.revenueHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Customers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
            <h3 className="text-lg font-bold">Recent Signups</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4 font-semibold text-slate-400">User</th>
                  <th className="px-6 py-4 font-semibold text-slate-400">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-400">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/[0.01]">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                           {u.name?.[0] || u.email[0].toUpperCase()}
                         </div>
                         <div>
                           <div className="text-sm font-semibold text-white">{u.name || (u.email.split("@")[0])}</div>
                           <div className="text-xs text-slate-500">{u.email}</div>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       {u.isPremium ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                           <Crown className="w-3.5 h-3.5" /> Pro Active
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                           <Users className="w-3.5 h-3.5" /> Free Tier
                         </span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {stats.recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">No recent users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
