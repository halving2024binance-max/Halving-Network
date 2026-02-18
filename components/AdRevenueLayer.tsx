import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Zap, MousePointer2, Eye, DollarSign, ArrowRight, ShieldCheck, Target, Activity } from 'lucide-react';

const AdRevenueLayer: React.FC = () => {
  const [revenue, setRevenue] = useState(42105.82);
  const [impressions, setImpressions] = useState(8420951);
  const [ctr, setCtr] = useState(1.42);
  const [revHalvingProgress, setRevHalvingProgress] = useState(84.2);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live ad traffic and revenue settlement
      const newImp = Math.floor(Math.random() * 50) + 10;
      const revClick = Math.random() * 0.5;
      
      setImpressions(prev => prev + newImp);
      setRevenue(prev => prev + revClick);
      setCtr(prev => Math.min(5, Math.max(0.1, prev + (Math.random() * 0.1 - 0.05))));
      setRevHalvingProgress(prev => Math.min(100, prev + 0.0001));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group transition-all duration-700 hover:border-amber-500/30">
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left: Identity and Icon Hub */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="relative">
             <div className="w-32 h-32 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-emerald-500/20 animate-pulse" />
                <BarChart3 className="w-14 h-14 text-amber-500 group-hover:text-amber-400 transition-colors" />
                <div className="absolute inset-0 border border-white/5 rounded-3xl" />
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-slate-900 border border-amber-500/30 rounded-xl shadow-2xl">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">AD_REVENUE <span className="text-amber-500">MESH</span></h2>
              <div className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[8px] font-black rounded border border-amber-500/30 uppercase tracking-widest">Protocol_V2</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                Global Ad Settlement Tier
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-black uppercase tracking-[0.1em]">Decentralized Revenue Layer</span>
            </div>
          </div>
        </div>

        {/* Center: Live Revenue Counters */}
        <div className="flex-1 w-full max-w-lg">
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-3 h-3" /> 24H Impressions
                 </div>
                 <div className="text-3xl font-black font-mono text-white tracking-tighter">
                   {impressions.toLocaleString()}
                 </div>
              </div>
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <MousePointer2 className="w-3 h-3" /> Average CTR
                 </div>
                 <div className="text-3xl font-black font-mono text-amber-400 tracking-tighter">
                   {ctr.toFixed(2)}%
                 </div>
              </div>
           </div>
           
           <div className="mt-8 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl relative overflow-hidden group/mini shadow-inner">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-40 group-hover/mini:opacity-100 transition-opacity" />
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Settled (BTC EQV)</span>
                 <span className="text-[8px] font-mono text-emerald-500 font-black">SIG_VERIFIED</span>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black font-mono text-white tracking-tighter">${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                 <span className="text-xs font-black text-slate-600 uppercase">HLV_CREDITS</span>
              </div>
           </div>
        </div>

        {/* Right: Revenue Halving Progress */}
        <div className="flex flex-col gap-4 min-w-[240px]">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Revenue Halving</span>
                 <span className="text-xl font-black font-mono text-white">{revHalvingProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                 <div 
                   className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                   style={{ width: `${revHalvingProgress}%` }} 
                 />
              </div>
              <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase">
                 <span>Next Adjustment: May 2024</span>
                 <span className="text-amber-500">Tier_3_Active</span>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">eCPM (Avg)</div>
                 <div className="text-sm font-black font-mono text-amber-400">$14.20</div>
              </div>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Growth</div>
                 <div className="text-sm font-black font-mono text-emerald-400">+12.4%</div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-8 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Audit Status: PASS</span>
         </div>
         <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Settlement: ACTIVE</span>
         </div>
         <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Load: NOMINAL</span>
         </div>
         <button className="ml-auto flex items-center gap-2 text-slate-600 hover:text-amber-400 transition-colors group/btn">
            <span className="text-[9px] font-black uppercase tracking-widest">Explore Revenue Explorer</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default AdRevenueLayer;