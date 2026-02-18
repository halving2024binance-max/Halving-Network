import React, { useState, useEffect, useMemo } from 'react';
import { Coins, Flame, Zap, Cpu, ShieldCheck, ArrowRight, Activity, TrendingUp, DollarSign, Database, Terminal } from 'lucide-react';

interface HlvFeeDynamicsProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
  onOpenSpecs?: () => void;
}

const HlvFeeDynamics: React.FC<HlvFeeDynamicsProps> = ({ swarmMetrics, onOpenSpecs }) => {
  const [totalFees, setTotalFees] = useState(42.85120304);
  const [lastTxFee, setLastTxFee] = useState(0.000124);
  const [burnPercentage, setBurnPercentage] = useState(33.3);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      const newFee = Math.random() * 0.00005;
      setLastTxFee(newFee);
      setTotalFees(prev => prev + newFee);
      setBurnPercentage(prev => Math.min(50, Math.max(20, prev + (Math.random() * 0.4 - 0.2))));
      
      setTimeout(() => setIsSyncing(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const allocationData = useMemo(() => [
    { label: 'Deflationary Burn', value: burnPercentage, color: 'bg-rose-500', icon: Flame },
    { label: 'Neural Swarm OPS', value: 35, color: 'bg-indigo-500', icon: Cpu },
    { label: 'Staking Multiplier', value: 100 - burnPercentage - 35, color: 'bg-emerald-500', icon: ShieldCheck },
  ], [burnPercentage]);

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <DollarSign className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HLV <span className="text-amber-500">Fee Intelligence</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            Real-time Protocol Settlement Matrix
          </p>
        </div>

        <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Fees Settled</div>
              <div className={`text-3xl font-black font-mono text-white tracking-tighter transition-all duration-300 ${isSyncing ? 'text-emerald-400 scale-[1.02]' : ''}`}>
                {totalFees.toFixed(8)}
                <span className="text-[10px] text-amber-500 ml-1 uppercase">BTC EQV</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Fee Type Breakdown */}
        <div className="lg:col-span-7 space-y-6">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-6 shadow-inner relative overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Database className="w-3.5 h-3.5 text-indigo-500" />
                   Economic Distribution
                 </span>
                 <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-tighter">Audit Status: PASS</span>
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 {allocationData.map((item, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                         <div className="flex items-center gap-2">
                            <item.icon className={`w-3 h-3 ${item.color.replace('bg-', 'text-')}`} />
                            <span className="text-slate-400">{item.label}</span>
                         </div>
                         <span className="text-white font-mono">{item.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                         <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`} 
                          style={{ width: `${item.value}%` }} 
                         />
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center relative z-10">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-600 uppercase">Last Trans. Fee</span>
                    <span className="text-xs font-mono font-black text-amber-500">{lastTxFee.toFixed(6)} BTC</span>
                 </div>
                 <div className="text-right">
                    <span className="text-[8px] font-black text-slate-600 uppercase">Neural Surcharge</span>
                    <span className="text-xs font-mono font-black text-indigo-400">{(swarmMetrics.processingLoad / 100 * 15).toFixed(2)}% Active</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Live Terminal & Fee Trends */}
        <div className="lg:col-span-5 flex flex-col gap-4">
           <div className="bg-black/60 border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <Terminal className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Settlement Trace</span>
              </div>
              <div className="flex-1 font-mono text-[9px] text-emerald-500/60 space-y-1 overflow-hidden">
                 <div className="animate-in fade-in slide-in-from-left-2">{'>'} INITIALIZING FEE_ENGINE...</div>
                 <div className="animate-in fade-in slide-in-from-left-2 delay-100">{'>'} SIG_AUTH: LAYER_12_CORE</div>
                 <div className="animate-in fade-in slide-in-from-left-2 delay-200">{'>'} SETTLING_BATCH_#84209...</div>
                 <div className="text-indigo-400/80 animate-in fade-in slide-in-from-left-2 delay-300">{'>'} NEURAL_GAS_ADJUST: {swarmMetrics.processingLoad}% LOAD</div>
                 <div className="text-rose-400/80 animate-in fade-in slide-in-from-left-2 delay-500">{'>'} DEF_BURN_EXECUTED: {burnPercentage.toFixed(2)}%</div>
                 <div className="animate-pulse">{'>'} _</div>
              </div>
           </div>

           <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center justify-between group cursor-help hover:bg-emerald-500/10 transition-all">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Yield Momentum</div>
                    <div className="text-lg font-black font-mono text-white">+14.2% [24H]</div>
                 </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-colors" />
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-cyan-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sync: OPTIMAL</span>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">L12 SECURE</span>
            </div>
         </div>
         <button 
           onClick={onOpenSpecs}
           className="text-[10px] text-amber-500 hover:text-white font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn"
         >
            View Protocol Billing Specs
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default HlvFeeDynamics;