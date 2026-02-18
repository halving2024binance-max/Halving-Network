import React, { useState, useEffect } from 'react';
import { Hexagon, Zap, Shield, Cpu, Activity, ShieldCheck, Database, Layers, ArrowUpRight, Radio, Server, Terminal } from 'lucide-react';

const HlvProtocolHub: React.FC = () => {
  const [protocolHealth, setProtocolHealth] = useState(99.98);
  const [finalityTime, setFinalityTime] = useState(842);
  const [activeLayers, setActiveLayers] = useState(new Array(12).fill(true));
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProtocolHealth(prev => Math.min(100, Math.max(99.4, prev + (Math.random() * 0.04 - 0.02))));
      setFinalityTime(prev => Math.max(800, Math.min(950, prev + Math.floor(Math.random() * 20 - 10))));
      
      // Randomly flicker layers for "re-verification" effect
      if (Math.random() > 0.8) {
        const idx = Math.floor(Math.random() * 12);
        setActiveLayers(prev => {
          const next = [...prev];
          next[idx] = false;
          setTimeout(() => {
            setActiveLayers(p => {
              const n = [...p];
              n[idx] = true;
              return n;
            });
          }, 400);
          return next;
        });
      }
    }, 4000);

    const progressTimer = setInterval(() => {
      setSyncProgress(p => (p + 0.1) % 100);
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Server className="w-80 h-80 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                HALVING <span className="text-emerald-500">PROTOCOL ENGINE</span>
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-[0.4em]">Core_Genesis_V1.0.4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5">
           <div className="text-right">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Protocol Integrity</span>
              <div className="text-3xl font-black font-mono text-white tracking-tighter">
                {protocolHealth.toFixed(2)}%
                <span className="text-[10px] text-emerald-500 ml-1">NOMINAL</span>
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mean Finality</span>
              <div className="text-xl font-black font-mono text-cyan-400">{finalityTime}ms</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Layer Status Hex Grid */}
        <div className="lg:col-span-7 bg-slate-950/40 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <Hexagon className="w-5 h-5 text-indigo-400" />
                 <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">12-Layer Verification Matrix</span>
              </div>
              <div className="flex gap-1">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {activeLayers.map((active, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-1 group/hex ${
                    active ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/40 scale-95 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  }`}
                >
                   <span className={`text-[8px] font-black font-mono transition-colors ${active ? 'text-slate-600' : 'text-rose-400'}`}>L_{String(i+1).padStart(2, '0')}</span>
                   <div className={`w-2 h-2 rounded-full transition-all ${active ? 'bg-emerald-500 group-hover/hex:shadow-[0_0_10px_#10b981]' : 'bg-rose-500 animate-ping'}`} />
                   {active ? (
                     <span className="text-[6px] font-black text-emerald-500/60 uppercase group-hover/hex:text-emerald-400 transition-colors">Verified</span>
                   ) : (
                     <span className="text-[6px] font-black text-rose-500 uppercase">Checking</span>
                   )}
                </div>
              ))}
           </div>

           <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-end">
              <div className="space-y-1">
                 <span className="text-[9px] font-black text-slate-600 uppercase">Synchronizing All Nodes</span>
                 <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_8px_#10b981]" style={{ width: `${syncProgress}%` }} />
                 </div>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-mono text-emerald-400 font-black">9.8M NODES_SYNCED</span>
              </div>
           </div>
        </div>

        {/* Technical Brief Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                 <Terminal className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Diagnostics</span>
              </div>
              <div className="space-y-2 font-mono text-[10px]">
                 <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <span className="text-slate-500">Hashrate Variance:</span>
                    <span className="text-emerald-400">0.02% [NOMINAL]</span>
                 </div>
                 <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <span className="text-slate-500">Neural Load:</span>
                    <span className="text-indigo-400">14.2% [IDLE]</span>
                 </div>
                 <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <span className="text-slate-500">Exascale Delay:</span>
                    <span className="text-cyan-400">8ms [ULTRA_LOW]</span>
                 </div>
                 <div className="flex justify-between p-2 bg-slate-900/50 rounded-lg border border-white/5">
                    <span className="text-slate-500">Sentry Signature:</span>
                    <span className="text-emerald-400">VERIFIED_L12</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-emerald-600/5 border border-emerald-600/20 rounded-3xl relative overflow-hidden group/btn cursor-pointer hover:bg-emerald-600/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Consensus Ledger</span>
                 </div>
                 <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover/btn:text-emerald-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase">
                 Access the immutable genesis block architecture and protocol evolution records.
              </p>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-800 flex flex-wrap gap-8 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Broadcasting: PROTOCOL_STABLE</span>
         </div>
         <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mesh Depth: 12_FULL</span>
         </div>
         <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-cyan-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Sync: COMPLETED</span>
         </div>
         <div className="ml-auto">
            <span className="text-[10px] font-black text-slate-600 uppercase italic tracking-widest">Validated by AI SENTINEL CORE</span>
         </div>
      </div>
    </div>
  );
};

export default HlvProtocolHub;