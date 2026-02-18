import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Zap, Landmark, DollarSign, Activity, ShieldCheck, ArrowRight, PieChart, Coins, Flame, Timer } from 'lucide-react';

const HlvProtocolRevenueLayer: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState(842095.42);
  const [dailyEarnings, setDailyEarnings] = useState(14205.80);
  const [burnRate, setBurnRate] = useState(12.4);
  const [yieldMultiplier, setYieldMultiplier] = useState(3.125);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live protocol settlement activity
      const tick = Math.random() * 2.5;
      setTotalRevenue(prev => prev + tick);
      setDailyEarnings(prev => prev + (tick * 0.1));
      setBurnRate(prev => Math.min(25, Math.max(8, prev + (Math.random() * 0.4 - 0.2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const serviceMix = [
    { label: 'Security Audits', value: 42, color: 'bg-emerald-500' },
    { label: 'Neural Compute', value: 35, color: 'bg-indigo-500' },
    { label: 'Institutional Radar', value: 23, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group transition-all duration-700 hover:border-emerald-500/30">
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Section: Identity and Main Counter */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="relative">
             <div className="w-32 h-32 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-amber-500/20 animate-pulse" />
                <Landmark className="w-14 h-14 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                <div className="absolute inset-0 border border-white/5 rounded-3xl" />
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl">
                <DollarSign className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">PROTOCOL <span className="text-emerald-500">REVENUE</span></h2>
              <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[8px] font-black rounded border border-emerald-500/30 uppercase tracking-widest">Revenue_Core_V1</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Network Settlement Engine
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.1em] text-emerald-400">
                   STATUS: YIELD_POSITIVE
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Live Earnings Matrix */}
        <div className="flex-1 w-full max-w-lg">
           <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Coins className="w-3 h-3 text-indigo-400" /> Total Protocol Revenue
                 </div>
                 <div className="text-3xl font-black font-mono text-white tracking-tighter">
                   ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </div>
                 <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest italic">Aggregated desde Genesis</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" /> 24H Settlement
                 </div>
                 <div className="text-3xl font-black font-mono text-emerald-400 tracking-tighter">
                   +${dailyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </div>
                 <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest italic">Inbound Service Fees</div>
              </div>
           </div>
           
           {/* Service Mix Bar */}
           <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                 <span>Protocol Service Mix</span>
                 <span className="text-emerald-500">100% AUDITED</span>
              </div>
              <div className="h-2.5 flex rounded-full overflow-hidden border border-slate-800 p-0.5 bg-slate-900">
                 {serviceMix.map((mix, i) => (
                   <div 
                    key={i} 
                    className={`h-full ${mix.color} transition-all duration-1000 first:rounded-l-full last:rounded-r-full opacity-80 hover:opacity-100`}
                    style={{ width: `${mix.value}%` }}
                    title={`${mix.label}: ${mix.value}%`}
                   />
                 ))}
              </div>
              <div className="flex gap-4 mt-2">
                 {serviceMix.map((mix, i) => (
                   <div key={i} className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${mix.color}`} />
                      <span className="text-[8px] font-black text-slate-600 uppercase">{mix.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Section: Halving Yield Stats */}
        <div className="flex flex-col gap-4 min-w-[240px]">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] space-y-4 shadow-inner group/halving">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Halving Subsidy Yield</span>
                 <Timer className="w-3 h-3 text-amber-500 group-hover/halving:rotate-180 transition-transform duration-1000" />
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Current Multiplier</span>
                    <span className="text-sm font-black font-mono text-white">{yieldMultiplier} HLV / Block</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Neural Burn Rate</span>
                    <span className="text-sm font-black font-mono text-rose-500">{burnRate.toFixed(1)}% / Vol</span>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col justify-center transition-all hover:bg-emerald-500/10">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">APR (Staked)</div>
                 <div className="text-sm font-black font-mono text-emerald-400">14.2%</div>
              </div>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col justify-center transition-all hover:bg-amber-500/10">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Net Margin</div>
                 <div className="text-sm font-black font-mono text-amber-500">88.4%</div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-8 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Settlement Layer: L12_ULTRA</span>
         </div>
         <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Burn: ACTIVE</span>
         </div>
         <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ecosystem Growth: STABLE</span>
         </div>
         <button className="ml-auto flex items-center gap-2 text-slate-600 hover:text-emerald-400 transition-colors group/btn">
            <span className="text-[9px] font-black uppercase tracking-widest">Full Economic Spec</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default HlvProtocolRevenueLayer;