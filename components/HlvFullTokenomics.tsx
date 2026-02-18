import React, { useState, useEffect } from 'react';
import { Coins, Database, Zap, TrendingDown, Percent, Timer, ShieldCheck, ArrowRight, Activity, Cpu, Landmark, Layers, Lock, Globe, Server } from 'lucide-react';

const HlvFullTokenomics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    circulating: 84200421,
    staked: 57580210,
    burned: 14209.85,
    marketCap: 119564600,
    nodes: 12402
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        circulating: prev.circulating + Math.random() * 5,
        staked: prev.staked + (Math.random() > 0.5 ? 10 : -5),
        burned: prev.burned + Math.random() * 0.5,
        marketCap: prev.marketCap + (Math.random() - 0.4) * 1000
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stakingRatio = (metrics.staked / metrics.circulating) * 100;

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
      {/* Background HUD Accents */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Landmark className="w-80 h-80 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Coins className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                HLV <span className="text-emerald-500">Comprehensive Tokenomics</span>
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em]">Protocol Asset Intelligence v1.0.4</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Market Cap</div>
              <div className="text-2xl font-black font-mono text-white">
                ${(metrics.marketCap / 1000000).toFixed(2)}M
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800 hidden md:block" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">HLV Fully Diluted Val.</div>
              <div className="text-2xl font-black font-mono text-emerald-400">$298.2M</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
        {/* utility matrix */}
        <div className="space-y-6 bg-slate-950/40 p-8 rounded-[2rem] border border-slate-800">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <Zap className="w-4 h-4 text-amber-500" />
             Utility & Governance
           </h3>
           <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Server, label: 'Node collateral', value: '50k HLV', color: 'text-indigo-400' },
                { icon: Cpu, label: 'Compute credits', value: '1:1 ratio', color: 'text-cyan-400' },
                { icon: Lock, label: 'Security staking', value: '14.2% APY', color: 'text-emerald-400' },
                { icon: Globe, label: 'Neural settlement', value: 'dynamic', color: 'text-amber-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-all">
                   <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                   </div>
                   <span className="text-[10px] font-black font-mono text-white uppercase">{item.value}</span>
                </div>
              ))}
           </div>
           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight italic text-center">
             HLV acts as the singular gas for the Halving AI neural compute swarm.
           </p>
        </div>

        {/* staking telemetry */}
        <div className="space-y-6 bg-slate-950/40 p-8 rounded-[2rem] border border-slate-800">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <Layers className="w-4 h-4 text-indigo-500" />
             Staking Telemetry
           </h3>
           <div className="flex-1 flex flex-col justify-center">
              <div className="text-center space-y-4 mb-8">
                 <div className="inline-flex items-center justify-center p-8 bg-indigo-500/5 rounded-full border border-indigo-500/20 relative">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
                    <Percent className="w-12 h-12 text-indigo-500 animate-pulse" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Global Staking Ratio</div>
                    <div className="text-4xl font-black font-mono text-white tracking-tighter">{stakingRatio.toFixed(2)}%</div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center">
                    <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Total Staked</div>
                    <div className="text-sm font-black font-mono text-white">{(metrics.staked / 1000000).toFixed(2)}M</div>
                 </div>
                 <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center">
                    <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Active Nodes</div>
                    <div className="text-sm font-black font-mono text-indigo-400">{metrics.nodes}</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Deflationary Schedule Visualization */}
      <div className="mt-12 bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Timer className="w-24 h-24 text-amber-500" />
         </div>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
               <h4 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 Protocol Halving Schedule
               </h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase max-w-lg leading-relaxed">
                 Subsidy reductions occur in tandem with Bitcoin halving events. Each epoch halves the HLV issuance per block across the 12 security layers.
               </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-500 uppercase">Current Epoch</span>
               <span className="text-xl font-black font-mono text-white italic tracking-tighter">EPOCH_03</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {[
              { year: '2024', status: 'Active', reward: '50 HLV', progress: 94, color: 'emerald' },
              { year: '2028', status: 'Pending', reward: '25 HLV', progress: 0, color: 'indigo' },
              { year: '2032', status: 'Locked', reward: '12.5 HLV', progress: 0, color: 'slate' },
              { year: '2036', status: 'Locked', reward: '6.25 HLV', progress: 0, color: 'slate' },
            ].map((epoch, idx) => (
              <div key={idx} className={`p-6 bg-slate-900 border ${epoch.status === 'Active' ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-slate-800 opacity-60'} rounded-3xl space-y-4`}>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-white">{epoch.year} Halving</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${epoch.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{epoch.status}</span>
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Block Subsidy</div>
                    <div className={`text-lg font-black font-mono ${epoch.status === 'Active' ? 'text-white' : 'text-slate-500'}`}>{epoch.reward}</div>
                 </div>
                 {epoch.status === 'Active' && (
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                          <span>Completion</span>
                          <span>{epoch.progress}%</span>
                       </div>
                       <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${epoch.progress}%` }} />
                       </div>
                    </div>
                 )}
              </div>
            ))}
         </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Audit Status</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter">FULLY_VERIFIED_V1</span>
               </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-cyan-400" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Load</span>
                  <span className="text-xs font-mono text-cyan-400 font-bold tracking-tighter">NOMINAL_MESH</span>
               </div>
            </div>
         </div>
         
         <button className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 group/btn">
            Download Economy Specs (PDF)
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default HlvFullTokenomics;