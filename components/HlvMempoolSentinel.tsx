import React, { useState, useEffect, useMemo } from 'react';
import { Database, Zap, Activity, Clock, Layers, ShieldCheck, ArrowRight, Server, Terminal, Info, Cpu, Search, HardDrive } from 'lucide-react';

interface HlvMempoolSentinelProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const HlvMempoolSentinel: React.FC<HlvMempoolSentinelProps> = ({ swarmMetrics }) => {
  const [pendingNeurons, setPendingNeurons] = useState(1420);
  const [processedBatches, setProcessedBatches] = useState(98421);
  const [fees, setFees] = useState({ standard: 1.2, priority: 2.8 });

  useEffect(() => {
    const interval = setInterval(() => {
      const loadFactor = swarmMetrics.processingLoad / 100;
      // Pending count fluctuates based on load
      setPendingNeurons(prev => Math.max(100, Math.floor(prev + (Math.random() * 200 - 80) + (loadFactor * 50))));
      
      // Fees adjust based on congestion
      setFees({
        standard: parseFloat((1.0 + (loadFactor * 2) + Math.random() * 0.2).toFixed(2)),
        priority: parseFloat((2.5 + (loadFactor * 5) + Math.random() * 0.5).toFixed(2))
      });

      // Increment batches
      if (Math.random() > 0.7) {
        setProcessedBatches(prev => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [swarmMetrics.processingLoad]);

  const congestionStatus = useMemo(() => {
    if (swarmMetrics.processingLoad > 85) return { label: 'SATURATED', color: 'text-rose-500', bg: 'bg-rose-500/10' };
    if (swarmMetrics.processingLoad > 50) return { label: 'BUSY', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'OPTIMAL', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  }, [swarmMetrics.processingLoad]);

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group transition-all duration-700 hover:border-emerald-500/30">
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left: Identity and Status */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="relative">
             <div className="w-32 h-32 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-indigo-500/20 animate-pulse" />
                <Database className="w-14 h-14 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                <div className="absolute inset-0 border border-white/5 rounded-3xl" />
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-2xl">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">HLV <span className="text-emerald-500">MEMPOOL</span></h2>
              <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[8px] font-black rounded border border-emerald-500/30 uppercase tracking-widest">Internal_Sync</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-cyan-600" />
                Neural Queue Depth
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-black uppercase tracking-[0.1em] ${congestionStatus.color}`}>
                   STATUS: {congestionStatus.label}
                </span>
                <div className={`w-2 h-2 rounded-full ${congestionStatus.color} animate-pulse shadow-[0_0_8px_currentColor]`} />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Stats */}
        <div className="flex-1 w-full max-w-lg">
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-indigo-400" /> Pending Neurons
                 </div>
                 <div className="text-3xl font-black font-mono text-white tracking-tighter">
                   {pendingNeurons.toLocaleString()}
                 </div>
                 <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Unconfirmed Transmissions</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> Processed Batches
                 </div>
                 <div className="text-3xl font-black font-mono text-emerald-400 tracking-tighter">
                   {processedBatches.toLocaleString()}
                 </div>
                 <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Consensus Established</div>
              </div>
           </div>
           
           {/* Visual Pipeline Bar */}
           <div className="mt-8 p-1 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
              <div className="h-2 flex gap-1">
                 {[...Array(20)].map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-full flex-1 rounded-full transition-all duration-1000 ${i < (swarmMetrics.processingLoad / 5) ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                   />
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Fee Matrix */}
        <div className="flex flex-col gap-4 min-w-[240px]">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] space-y-4 shadow-inner">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Fee Index</span>
                 <Zap className="w-3 h-3 text-amber-500" />
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Standard Priority</span>
                    <span className="text-sm font-black font-mono text-white">{fees.standard} HLV</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">Instant Finality</span>
                    <span className="text-sm font-black font-mono text-emerald-400">{fees.priority} HLV</span>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col justify-center">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Txs / Sec</div>
                 <div className="text-sm font-black font-mono text-white">{(8.4 + (swarmMetrics.processingLoad / 10)).toFixed(1)}</div>
              </div>
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex flex-col justify-center">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Queue Cap</div>
                 <div className="text-sm font-black font-mono text-white">100k</div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-8 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sentry Load: NOMINAL</span>
         </div>
         <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Finality: ~840ms</span>
         </div>
         <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Distributed Ledger: SYNCED</span>
         </div>
         <button className="ml-auto flex items-center gap-2 text-slate-600 hover:text-emerald-400 transition-colors group/btn">
            <span className="text-[9px] font-black uppercase tracking-widest">Open Queue Explorer</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default HlvMempoolSentinel;