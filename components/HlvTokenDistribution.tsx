import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Coins, Flame, ShieldCheck, Zap, TrendingDown, Users, Globe, ArrowRight, Activity, Percent } from 'lucide-react';

const ALLOCATIONS = [
  { name: 'Ecosystem Rewards', value: 40, color: '#10b981' }, // emerald-500
  { name: 'Staking Incentives', value: 25, color: '#6366f1' }, // indigo-500
  { name: 'Strategic Reserve', value: 15, color: '#f59e0b' }, // amber-500
  { name: 'Public Liquidity', value: 10, color: '#06b6d4' }, // cyan-500
  { name: 'Neural Swarm OPS', value: 10, color: '#f43f5e' }, // rose-500
];

const HlvTokenDistribution: React.FC = () => {
  const [circulatingSupply, setCirculatingSupply] = useState(84200000);
  const [totalBurned, setTotalBurned] = useState(14209);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncTimer = setTimeout(() => setIsSyncing(false), 2000);
    
    const interval = setInterval(() => {
      // Simulate token distribution and burn based on protocol activity
      const distributionAmount = Math.random() * 50;
      const burnAmount = Math.random() * 1.5;
      
      setCirculatingSupply(prev => prev + distributionAmount);
      setTotalBurned(prev => prev + burnAmount);
    }, 4500);

    return () => {
      clearTimeout(syncTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* HUD Accents */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
        <Coins className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Coins className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HLV <span className="text-emerald-500">Distribution Matrix</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Sovereign Protocol Allocation v1.0
          </p>
        </div>

        <div className="flex items-center gap-10">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Status</div>
              <div className="text-xl font-black font-mono text-emerald-400 uppercase tracking-tighter">VERIFIED_L12</div>
           </div>
           <div className="h-12 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Stability</div>
              <div className="text-xl font-black font-mono text-white">100% NOMINAL</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Allocation Chart */}
        <div className="xl:col-span-5 bg-slate-950/60 border border-slate-800 rounded-[2rem] p-6 flex flex-col items-center">
           <div className="w-full h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={ALLOCATIONS}
                   cx="50%"
                   cy="50%"
                   innerRadius={65}
                   outerRadius={100}
                   paddingAngle={10}
                   dataKey="value"
                   stroke="none"
                   animationDuration={1500}
                   animationBegin={0}
                 >
                   {ALLOCATIONS.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: '#020617', 
                     border: '1px solid #1e293b', 
                     borderRadius: '12px',
                     fontSize: '10px',
                     fontFamily: 'JetBrains Mono',
                     color: '#fff'
                   }}
                   itemStyle={{ color: '#fff' }}
                 />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified</span>
                <span className="text-2xl font-black text-white font-mono">100%</span>
             </div>
           </div>
           
           <div className="mt-6 grid grid-cols-1 gap-2 w-full">
              {ALLOCATIONS.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-black font-mono text-white">{item.value}%</span>
                </div>
              ))}
           </div>
        </div>

        {/* Protocol Statistics */}
        <div className="xl:col-span-7 flex flex-col gap-6">
           {/* Deflationary Metrics */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group/stat">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover/stat:opacity-10 transition-opacity">
                    <Flame className="w-20 h-20 text-rose-500" />
                 </div>
                 <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Burn Hub</span>
                 </div>
                 <div className="text-2xl font-black font-mono text-white mb-1">
                    {totalBurned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </div>
                 <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                    <TrendingDown className="w-2.5 h-2.5" /> DEFLATION_ACTIVE
                 </div>
              </div>

              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group/stat">
                 <div className="absolute -right-4 -bottom-4 opacity-5 group-hover/stat:opacity-10 transition-opacity">
                    <Users className="w-20 h-20 text-indigo-500" />
                 </div>
                 <div className="flex items-center gap-2 mb-4">
                    <Percent className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Staking Ratio</span>
                 </div>
                 <div className="text-2xl font-black font-mono text-white mb-1">68.42%</div>
                 <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5" /> 12,402 NODES
                 </div>
              </div>
           </div>

           {/* Distribution Feed */}
           <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-3xl flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Zap className="w-3.5 h-3.5 text-amber-500" />
                   Recent Distribution Epochs
                </span>
                {isSyncing ? (
                  <LoaderIcon />
                ) : (
                  <span className="text-[8px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Network Sync: OK</span>
                )}
              </div>
              
              <div className="space-y-3">
                 {[
                   { epoch: '842', type: 'Node Reward', amount: '124.50 HLV', status: 'SETTLED', time: '12m ago' },
                   { epoch: '841', type: 'Fee Rebate', amount: '12.02 HLV', status: 'SETTLED', time: '42m ago' },
                   { epoch: '840', type: 'Staking Yield', amount: '1,402.00 HLV', status: 'SETTLED', time: '1h ago' },
                 ].map((d, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-2xl border border-slate-800 group/feed hover:border-emerald-500/20 transition-all cursor-crosshair">
                      <div className="flex items-center gap-4">
                         <div className="text-[10px] font-mono text-slate-600">#{d.epoch}</div>
                         <div>
                            <div className="text-[10px] font-black text-slate-200 uppercase">{d.type}</div>
                            <div className="text-[8px] text-slate-500 font-mono uppercase">{d.time}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[11px] font-black text-emerald-400 font-mono">+{d.amount}</div>
                         <div className="text-[7px] text-slate-600 font-black uppercase">Confirmed_L12</div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-auto pt-6 flex justify-center">
                 <button className="text-[10px] text-slate-500 hover:text-emerald-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
                    View Comprehensive Tokenomics
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LoaderIcon = () => (
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
  </div>
);

export default HlvTokenDistribution;