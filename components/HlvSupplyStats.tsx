import React, { useState, useEffect, useMemo } from 'react';
import { Coins, Database, Zap, TrendingDown, Percent, Timer, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

const HlvSupplyStats: React.FC = () => {
  const MAX_SUPPLY = 210000000;
  const [totalSupply, setTotalSupply] = useState(84200000);
  const [burnedAmount, setBurnedAmount] = useState(14209.42);
  const [nextHalvingProgress, setNextHalvingProgress] = useState(94.2);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slow supply growth (minting) and burn activity
      const mintAmount = Math.random() * 0.5;
      const burnIncrement = Math.random() * 0.1;
      
      setTotalSupply(prev => prev + mintAmount);
      setBurnedAmount(prev => prev + burnIncrement);
      
      // Halving progress slow tick
      setNextHalvingProgress(prev => Math.min(100, prev + 0.00001));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const circulatingPercent = useMemo(() => (totalSupply / MAX_SUPPLY) * 100, [totalSupply]);

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Database className="w-64 h-64 text-emerald-400" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Coins className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HLV <span className="text-emerald-500">Supply Analytics</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Protocol Emission Monitor v1.0
          </p>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Max Supply Cap</div>
              <div className="text-3xl font-black font-mono text-slate-200">
                {MAX_SUPPLY.toLocaleString()}
                <span className="text-[10px] text-slate-500 ml-1 uppercase">HLV</span>
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Deflation Status</div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black font-mono text-rose-500 uppercase tracking-tighter">Active_Burn</span>
                <TrendingDown className="w-4 h-4 text-rose-500 animate-bounce" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Total Supply Card */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Current Total Supply
              </span>
           </div>
           <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black font-mono text-white">
                {totalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <span className="text-[10px] font-bold text-emerald-500">HLV</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                 <span>Issuance Progress</span>
                 <span>{circulatingPercent.toFixed(2)}%</span>
              </div>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${circulatingPercent}%` }} />
              </div>
           </div>
        </div>

        {/* Burn Metrics Card */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                Cumulative Burn
              </span>
           </div>
           <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black font-mono text-white">
                {burnedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] font-bold text-rose-500">HLV</span>
           </div>
           <div className="flex items-center gap-2 text-[8px] font-mono text-slate-500 uppercase">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Verified Protocol Removal
           </div>
        </div>

        {/* Halving Progress Card */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-amber-500" />
                HLV Halving Progress
              </span>
           </div>
           <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black font-mono text-white">
                {nextHalvingProgress.toFixed(1)}%
              </div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter animate-pulse">Epoch_3</span>
           </div>
           <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]" style={{ width: `${nextHalvingProgress}%` }} />
           </div>
           <div className="flex justify-between text-[7px] font-mono text-slate-600 uppercase">
              <span>Current: Block 840,321</span>
              <span>Next: 840,000*</span>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Database className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Ledger: SYNCED</span>
            </div>
            <div className="flex items-center gap-2">
               <Percent className="w-3.5 h-3.5 text-indigo-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Staking Rate: 68.4%</span>
            </div>
         </div>
         <button className="text-[10px] text-emerald-400 hover:text-white uppercase font-black tracking-widest transition-all flex items-center gap-2 group/btn">
            Full Tokenomics Data
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

// Fixed: Corrected export name to HlvSupplyStats
export default HlvSupplyStats;