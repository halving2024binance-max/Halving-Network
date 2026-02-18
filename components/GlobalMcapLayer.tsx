import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, Zap, Activity, Globe, ArrowUpRight, Target, ShieldCheck, Cpu } from 'lucide-react';

interface GlobalMcapLayerProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const GlobalMcapLayer: React.FC<GlobalMcapLayerProps> = ({ swarmMetrics }) => {
  // Updated to $14.82 Trillion
  const [mcap, setMcap] = useState(14820000000000);
  const [change24h, setChange24h] = useState(4.42);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      // Small fluctuations relative to a trillion-dollar scale
      const shift = (Math.random() - 0.45) * 500000000; // ~500M shift
      setMcap(prev => prev + shift);
      setChange24h(prev => prev + (shift / 100000000000));
      setTimeout(() => setPulse(false), 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const progressToMilestone = useMemo(() => {
    // Progress towards 20 Trillion Milestone
    return (mcap / 20000000000000) * 100;
  }, [mcap]);

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group transition-all duration-700 hover:border-emerald-500/30 shadow-2xl">
      {/* HUD Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -right-20 -top-20 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left: Identity and Visual Orb */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="relative">
             <div className={`w-32 h-32 rounded-full border-2 transition-all duration-500 flex items-center justify-center relative overflow-hidden ${pulse ? 'border-emerald-400 scale-105 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-emerald-500/20 scale-100'}`}>
                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/10 to-transparent animate-[spin_4s_linear_infinite]" />
                <DollarSign className={`w-12 h-12 transition-all duration-300 ${pulse ? 'text-emerald-400 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'text-emerald-500'}`} />
             </div>
             {/* Secondary stats ring */}
             <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-xl">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">NETWORK <span className="text-emerald-500">GLOBAL MCAP</span></h2>
              <div className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[8px] font-black rounded border border-emerald-500/30 uppercase tracking-widest animate-pulse">Sovereign_Class</div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-600" />
                Exascale Valuation Matrix
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[10px] text-emerald-400 font-mono font-black uppercase tracking-[0.2em]">Institutional Tier Verified</span>
            </div>
          </div>
        </div>

        {/* Center: Main Numbers */}
        <div className="flex-1 flex flex-col items-center lg:items-end">
           <div className="text-right space-y-1">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Network Capitalization (USD)</div>
              <div className={`text-7xl font-black font-mono tracking-tighter transition-all duration-500 ${pulse ? 'text-emerald-400' : 'text-white'}`}>
                ${(mcap / 1000000000000).toFixed(2)}T
              </div>
              <div className="flex items-center justify-end gap-3 mt-2">
                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black transition-all ${change24h >= 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    {change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                    {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                 </div>
                 <span className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest">24H Neural Performance</span>
              </div>
           </div>
        </div>

        {/* Right: Technical Anchors */}
        <div className="flex flex-col gap-4 min-w-[240px]">
           <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Global Ranking</span>
                 <span className="text-emerald-400">#01_DECENTRALIZED</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '92%' }} />
              </div>
              <div className="text-[8px] font-bold text-slate-600 uppercase text-right italic">Macro Dominance Index: 42.8%</div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col justify-center gap-1 hover:bg-emerald-500/10 transition-colors">
                 <span className="text-[8px] font-black text-emerald-500 uppercase">Hash-Backed</span>
                 <span className="text-sm font-black font-mono text-white tracking-tighter">842 PH/S</span>
              </div>
              <div className={`p-4 border rounded-2xl flex flex-col justify-center gap-1 transition-colors ${pulse ? 'bg-indigo-500/20 border-indigo-400' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                 <span className="text-[8px] font-black text-indigo-400 uppercase">Neural Reserve</span>
                 <span className="text-sm font-black font-mono text-white tracking-tighter">99.4% NOM</span>
              </div>
           </div>
        </div>
      </div>

      {/* Progress to institutional status */}
      <div className="mt-12 pt-8 border-t border-slate-800">
         <div className="flex justify-between items-end mb-4">
            <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  PLANETARY LIQUIDITY MILESTONE
               </div>
               <div className="text-[9px] text-slate-600 font-bold uppercase mt-1 italic">Epoch Progress: Towards $20.0T Threshold</div>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-mono font-black text-white">{progressToMilestone.toFixed(2)}%</span>
            </div>
         </div>
         <div className="h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_30px_rgba(16,185,129,0.4)] relative"
              style={{ width: `${progressToMilestone}%` }}
            >
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
               <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white/40 animate-pulse" />
            </div>
         </div>
      </div>

      {/* Dynamic footer status */}
      <div className="mt-8 flex flex-wrap gap-10 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-amber-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Saturation: OPTIMAL</span>
         </div>
         <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compute Valuation: $1.42 / G-NODE</span>
         </div>
         <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Finality: L12_LOCKED</span>
         </div>
         <div className="ml-auto flex items-center gap-2 text-slate-600 hover:text-emerald-400 transition-colors">
            <span className="text-[9px] font-black uppercase tracking-widest">Open Economic Spec v1.0</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
         </div>
      </div>
    </div>
  );
};

export default GlobalMcapLayer;
