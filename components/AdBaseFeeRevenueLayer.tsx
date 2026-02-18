import React, { useState, useEffect, useMemo } from 'react';
import { Ticket, Coins, Activity, Zap, ShieldCheck, ArrowRight, BarChart3, TrendingUp, Flame, Server } from 'lucide-react';

const AdBaseFeeRevenueLayer: React.FC = () => {
  const [baseFees, setBaseFees] = useState(242095.82);
  const [avgFeePerImp, setAvgFeePerImp] = useState(0.0042);
  const [burnContribution, setBurnContribution] = useState(42.5);
  const [networkLoad, setNetworkLoad] = useState(14.2);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live incoming base fees from the ad mesh
      const incrementalFee = Math.random() * 0.8;
      setBaseFees(prev => prev + incrementalFee);
      
      // Volatility in average fee per impression
      setAvgFeePerImp(prev => Math.max(0.001, prev + (Math.random() * 0.0002 - 0.0001)));
      
      // Subtle fluctuations in burn contribution
      setBurnContribution(prev => Math.min(50, Math.max(30, prev + (Math.random() * 0.1 - 0.05))));
      
      // Load shifts
      setNetworkLoad(prev => Math.max(5, Math.min(45, prev + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group transition-all duration-700 hover:border-amber-500/30 shadow-2xl">
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Section: Identity & Foundational Icon */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="relative">
             <div className="w-32 h-32 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 animate-pulse" />
                <Ticket className="w-14 h-14 text-amber-500 group-hover:text-amber-400 transition-colors" />
                <div className="absolute inset-0 border border-white/5 rounded-3xl" />
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-slate-900 border border-amber-500/30 rounded-xl shadow-2xl">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter italic">AD_BASE_FEE <span className="text-amber-500">REVENUE</span></h2>
              <div className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[8px] font-black rounded border border-amber-500/30 uppercase tracking-widest">LAYER_AD_FOUNDATION</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Mandatory Consensus Settlement
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-black uppercase tracking-[0.1em]">Verified_Block_03_Active</span>
            </div>
          </div>
        </div>

        {/* Center Section: Core Fee Counters */}
        <div className="flex-1 w-full max-w-lg">
           <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Coins className="w-3 h-3 text-amber-400" /> Base HLV Cleared
                 </div>
                 <div className="text-3xl font-black font-mono text-white tracking-tighter">
                   {baseFees.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                 </div>
                 <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest italic">Aggregated Protocol Volume</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400" /> Mesh Sync Rate
                 </div>
                 <div className="text-3xl font-black font-mono text-cyan-400 tracking-tighter">
                   99.42%
                 </div>
                 <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest italic">L12 Synchronization Active</div>
              </div>
           </div>
           
           <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl relative overflow-hidden group/mini shadow-inner">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-40 group-hover/mini:opacity-100 transition-opacity" />
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Settlement Velocity</span>
                 <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <div className="h-1 bg-slate-950 rounded-full overflow-hidden mb-3">
                 <div 
                   className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b] transition-all duration-1000" 
                   style={{ width: `${networkLoad * 2}%` }} 
                 />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase font-black">
                 <span>{networkLoad.toFixed(1)} GB/S</span>
                 <span>NOMINAL_SATURATION</span>
              </div>
           </div>
        </div>

        {/* Right Section: Deflationary Impact */}
        <div className="flex flex-col gap-4 min-w-[240px]">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-inner">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Burn Hub</span>
                 <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-black font-mono text-rose-400">{burnContribution.toFixed(1)}%</span>
                 <span className="text-[8px] font-black text-slate-600 uppercase">of Base Fees Burned</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-rose-600 transition-all duration-1000 shadow-[0_0_10px_rgba(225,29,72,0.4)]" style={{ width: `${burnContribution}%` }} />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col justify-center">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Fee / Imp</div>
                 <div className="text-sm font-black font-mono text-white">{avgFeePerImp.toFixed(4)}</div>
              </div>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col justify-center">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Yield Mod</div>
                 <div className="text-sm font-black font-mono text-emerald-400">1.42x</div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-8 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-amber-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Base Fee Ledger: IMMUTABLE</span>
         </div>
         <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sentry Compliance: FULL</span>
         </div>
         <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Revenue Momentum: +8.4%</span>
         </div>
         <button className="ml-auto flex items-center gap-2 text-slate-600 hover:text-amber-400 transition-colors group/btn">
            <span className="text-[9px] font-black uppercase tracking-widest">Fee Settlement Explorer</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default AdBaseFeeRevenueLayer;