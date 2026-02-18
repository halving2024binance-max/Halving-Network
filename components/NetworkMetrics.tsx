import React, { useState, useEffect, useRef } from 'react';
import { Activity, ArrowUpRight, ArrowDownLeft, Server, Link, Info, ShieldCheck, Globe, Zap, Cpu, Terminal, Layers } from 'lucide-react';

interface MetricTooltipProps {
  content: string;
  children: React.ReactNode;
}

const MetricTooltip: React.FC<MetricTooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl text-[10px] leading-relaxed text-slate-300 animate-in fade-in slide-in-from-bottom-1">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-700"></div>
          {content}
        </div>
      )}
    </div>
  );
};

const NetworkMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    connections: 342,
    dataIn: 12.4,
    dataOut: 8.7,
    consensus: 99.42,
    latency: 12,
    status: 'OPTIMAL' as 'OPTIMAL' | 'BALANCING' | 'SYNCING' | 'PROTECTED'
  });

  const [layerStatus, setLayerStatus] = useState(new Array(12).fill(true));

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        connections: Math.max(100, Math.min(999, prev.connections + Math.floor(Math.random() * 5 - 2))),
        dataIn: parseFloat((prev.dataIn + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        dataOut: parseFloat((prev.dataOut + (Math.random() * 0.3 - 0.15)).toFixed(1)),
        consensus: parseFloat(Math.min(100, Math.max(99.4, prev.consensus + (Math.random() * 0.05 - 0.025))).toFixed(2)),
        latency: Math.max(8, Math.min(25, prev.latency + Math.floor(Math.random() * 3 - 1))),
        status: Math.random() > 0.98 ? 'BALANCING' : 'PROTECTED'
      }));

      // Randomly flicker a layer for "active check" feel
      if (Math.random() > 0.8) {
        const idx = Math.floor(Math.random() * 12);
        setLayerStatus(prev => {
          const next = [...prev];
          next[idx] = false;
          setTimeout(() => {
            setLayerStatus(p => {
              const n = [...p];
              n[idx] = true;
              return n;
            });
          }, 200);
          return next;
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/80 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col transition-all duration-700 hover:border-emerald-500/30 group">
      {/* Absolute Overlays for Tactical Feel */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Server className="w-64 h-64 text-emerald-500" />
      </div>

      {/* Header with Hero Status */}
      <div className="p-8 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sentry <span className="text-emerald-500">Command Center</span></h2>
            <div className="px-3 py-1 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded shadow-lg animate-pulse">Live Health Protocol</div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-500" />
              Global Synchronization Active
            </span>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="text-[10px] text-slate-500 font-mono font-bold">NODE: STATION-BETA-PRIME</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Network Status</span>
              <div className="flex items-center gap-3">
                 <span className={`text-sm font-black font-mono transition-colors ${metrics.status === 'PROTECTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                   {metrics.status}
                 </span>
                 <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className={`w-1.5 h-4 rounded-sm ${metrics.status === 'PROTECTED' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'} ${i > 3 ? 'opacity-20' : 'animate-pulse'}`} style={{ animationDelay: `${i * 150}ms` }} />
                   ))}
                 </div>
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800 hidden lg:block" />
           <div className="hidden lg:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency Matrix</span>
              <div className="text-xl font-black font-mono text-cyan-400">{metrics.latency}ms</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-800/50 relative z-10">
        {/* Main Stats Column */}
        <div className="lg:col-span-8 bg-slate-950/50 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Active Nodes Hub */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                  <Link className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distributed Nodes</h4>
                  <div className="text-3xl font-black font-mono text-white mt-1">{metrics.connections}</div>
                </div>
              </div>
              <MetricTooltip content="Number of verified full nodes participating in consensus. Increasing node count improves censorship resistance.">
                <Info className="w-4 h-4 text-slate-700 hover:text-cyan-400 cursor-help" />
              </MetricTooltip>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                <span>Cluster Saturation</span>
                <span>84%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-cyan-500 rounded-full w-[84%] shadow-[0_0_10px_#06b6d4]" />
              </div>
            </div>
          </div>

          {/* Consensus Finality Hub */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consensus Integrity</h4>
                  <div className="text-3xl font-black font-mono text-white mt-1">{metrics.consensus}%</div>
                </div>
              </div>
              <MetricTooltip content="The aggregated agreement percentage between the 12 security layers. Finality is achieved at 99.4%+.">
                <Info className="w-4 h-4 text-slate-700 hover:text-emerald-400 cursor-help" />
              </MetricTooltip>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                <span>Cryptographic Finality</span>
                <span>VERIFIED</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-emerald-500 rounded-full w-[99%] shadow-[0_0_10px_#10b981] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Data Traffic Control */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
             <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl group/traffic transition-all hover:border-emerald-500/30">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover/traffic:animate-bounce">
                   <ArrowDownLeft className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Inbound</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className="text-2xl font-black font-mono text-white">{metrics.dataIn}</div>
                 <span className="text-[10px] text-slate-600 font-bold uppercase">MB/s</span>
               </div>
             </div>

             <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl group/traffic transition-all hover:border-indigo-500/30">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover/traffic:animate-bounce">
                   <ArrowUpRight className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Outbound</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <div className="text-2xl font-black font-mono text-white">{metrics.dataOut}</div>
                 <span className="text-[10px] text-slate-600 font-bold uppercase">MB/s</span>
               </div>
             </div>
          </div>
        </div>

        {/* 12-Layer Monitoring Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/40 p-8 flex flex-col justify-between space-y-8">
           <div>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
               <Layers className="w-4 h-4 text-emerald-500" />
               12-Layer Sync Status
             </h4>
             <div className="grid grid-cols-6 gap-3">
               {layerStatus.map((active, i) => (
                 <div 
                   key={i} 
                   className={`aspect-square rounded border transition-all duration-300 flex items-center justify-center ${
                     active 
                       ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.1)]' 
                       : 'bg-slate-800 border-slate-700 text-slate-600'
                   }`}
                   title={`Layer ${i + 1} Status: ${active ? 'ACTIVE' : 'CHECKING'}`}
                 >
                   <span className="text-[8px] font-black">{i + 1}</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sentry Diagnostics</span>
              </div>
              <div className="space-y-2 font-mono text-[9px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">CPU LOAD:</span>
                  <span className="text-emerald-500">14.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">MEM USAGE:</span>
                  <span className="text-emerald-500">2.4GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">THREATS_MITIGATED:</span>
                  <span className="text-indigo-400">4,902</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 px-8 flex justify-between items-center text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse" />
            Core Consensus: OK
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse" />
            Neural Link: SECURE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Institutional Grade Pipeline Active</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkMetrics;