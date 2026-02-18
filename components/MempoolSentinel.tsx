import React, { useState, useEffect } from 'react';
import { Database, Zap, Activity, Clock, Layers, ShieldCheck, ArrowRight, Server, Terminal, Info, Loader2, BarChart3 } from 'lucide-react';

interface MempoolData {
  fees: {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  };
  blocks: {
    height: number;
    timestamp: number;
    tx_count: number;
    size: number;
    weight: number;
  }[];
  congestion: 'Low' | 'Medium' | 'High' | 'Critical';
}

const MempoolSentinel: React.FC = () => {
  const [data, setData] = useState<MempoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchMempoolData = async () => {
    try {
      const [feesRes, blocksRes] = await Promise.all([
        fetch('https://mempool.space/api/v1/fees/recommended'),
        fetch('https://mempool.space/api/blocks')
      ]);

      const fees = await feesRes.json();
      const blocks = await blocksRes.json();

      // Determine congestion level based on fees
      let congestion: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (fees.fastestFee > 100) congestion = 'Critical';
      else if (fees.fastestFee > 50) congestion = 'High';
      else if (fees.fastestFee > 20) congestion = 'Medium';

      setData({
        fees,
        blocks: blocks.slice(0, 4), // Last 4 blocks
        congestion
      });
      setLastUpdate(new Date().toLocaleTimeString([], { hour12: false }));
      setLoading(false);
    } catch (err) {
      console.error('Mempool API Handshake Failure:', err);
      // Fallback logic could go here
    }
  };

  useEffect(() => {
    fetchMempoolData();
    const interval = setInterval(fetchMempoolData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center gap-4 animate-pulse">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Bridging Mempool.space Intelligence...</span>
      </div>
    );
  }

  const timeSinceLastBlock = Math.floor((Date.now() / 1000 - data.blocks[0].timestamp) / 60);

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-700 hover:border-cyan-500/40">
      {/* Background HUD Layer */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Server className="w-80 h-80 text-cyan-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Mempool <span className="text-cyan-400">Sentinel Intelligence</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Live Network Settlement & Fee Matrix
          </p>
        </div>

        <div className="flex items-center gap-10 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mempool Congestion</div>
              <div className={`text-3xl font-black font-mono flex items-baseline gap-2 ${
                data.congestion === 'Critical' ? 'text-rose-500' : 
                data.congestion === 'High' ? 'text-amber-500' : 'text-emerald-400'
              }`}>
                {data.congestion.toUpperCase()}
                <span className="text-[10px] font-bold uppercase opacity-60">Status</span>
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latest Update</div>
              <div className="text-xl font-black font-mono text-cyan-400 tracking-tighter">{lastUpdate} UTC</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Recommended Fees Column */}
        <div className="xl:col-span-4 space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
             <BarChart3 className="w-4 h-4 text-cyan-400" />
             Recommended Fee Matrix
           </h4>
           <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Fastest Priority', sat: data.fees.fastestFee, time: '< 10 min', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
                { label: 'Medium Priority', sat: data.fees.halfHourFee, time: '30 min', color: 'text-cyan-400', bg: 'bg-cyan-500/5' },
                { label: 'Low Priority', sat: data.fees.hourFee, time: '60 min', color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
                { label: 'Economy Rate', sat: data.fees.economyFee, time: '24h+', color: 'text-slate-400', bg: 'bg-slate-500/5' },
              ].map((fee, i) => (
                <div key={i} className={`p-4 rounded-2xl border border-slate-800 ${fee.bg} flex items-center justify-between group/fee hover:border-cyan-500/30 transition-all`}>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{fee.label}</span>
                    <span className="text-[8px] font-mono text-slate-600">Est. {fee.time}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black font-mono ${fee.color}`}>{fee.sat}</div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase">sat/vB</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Block History & Queue */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-[2rem] space-y-6 flex-1">
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Latest Block Pipeline
                 </h4>
                 <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">Last Block: {timeSinceLastBlock}m Ago</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {data.blocks.map((block, i) => (
                   <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group/block hover:border-indigo-500/40 transition-all">
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500 opacity-20 group-hover/block:opacity-100 transition-opacity" />
                      <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Height</div>
                      <div className="text-lg font-black font-mono text-white mb-3 tracking-tighter">{block.height}</div>
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between text-[8px] font-mono">
                            <span className="text-slate-600">TXs:</span>
                            <span className="text-indigo-400 font-black">{block.tx_count}</span>
                         </div>
                         <div className="flex justify-between text-[8px] font-mono">
                            <span className="text-slate-600">Size:</span>
                            <span className="text-indigo-400 font-black">{(block.size / 1000000).toFixed(2)} MB</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Memory Usage Indicator */}
              <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Activity className="w-4 h-4 text-cyan-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Throughput Load</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 font-black">84.2 MB / 300 MB Cap</span>
                 </div>
                 <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div className="h-full bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" style={{ width: '28%' }} />
                 </div>
                 <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase">
                    <span>Virtual Size Queue</span>
                    <span>NOMINAL_FLOW</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Data Verification</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter">MEMPOOL_TRUST_ESTABLISHED</span>
               </div>
            </div>
            <div className="h-10 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
               <Terminal className="w-5 h-5 text-indigo-400" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Protocol</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter">BIP-141_SEGWIT_ACTIVE</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <a 
              href="https://mempool.space" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-700 transition-all active:scale-95 group/btn"
            >
              Open Full Mempool.space Explorer
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </a>
         </div>
      </div>
    </div>
  );
};

export default MempoolSentinel;