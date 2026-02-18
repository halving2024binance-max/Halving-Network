import React, { useState, useEffect, useMemo } from 'react';
import { Globe, Zap, ShieldCheck, Activity, ArrowRight, DollarSign, Layers, Terminal, Server, Cpu, Database, TrendingUp, BarChart3 } from 'lucide-react';
import AdRevenueExplorerModal from './AdRevenueExplorerModal';

interface MeshSector {
  id: string;
  name: string;
  load: number;
  settled: number;
  status: 'CLEARING' | 'PENDING' | 'STABLE';
}

interface HlvAdMeshSettlementProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const HlvAdMeshSettlement: React.FC<HlvAdMeshSettlementProps> = ({ swarmMetrics }) => {
  const [sectors, setSectors] = useState<MeshSector[]>([
    { id: 'S1', name: 'NORTH_ATLANTIC_MESH', load: 42, settled: 1420.50, status: 'STABLE' },
    { id: 'S2', name: 'EURO_CENTRAL_CORE', load: 68, settled: 984.20, status: 'CLEARING' },
    { id: 'S3', name: 'PACIFIC_NEURAL_LINK', load: 84, settled: 2105.85, status: 'CLEARING' },
    { id: 'S4', name: 'LATAM_SETTLE_CLUSTER', load: 21, settled: 420.12, status: 'STABLE' },
    { id: 'S5', name: 'SOUTH_ASIA_GRID', load: 55, settled: 1142.30, status: 'PENDING' },
  ]);

  const [totalSettled, setTotalSettled] = useState(842095.42);
  const [pendingCredits, setPendingCredits] = useState(14205.10);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      const tick = Math.random() * 5.5;
      
      setTotalSettled(prev => prev + tick);
      setPendingCredits(prev => Math.max(5000, prev + (Math.random() * 20 - 15)));

      setSectors(prev => prev.map(s => {
        const delta = (Math.random() - 0.45) * 5;
        const newLoad = Math.max(10, Math.min(100, s.load + delta));
        return {
          ...s,
          load: newLoad,
          settled: s.settled + (Math.random() * 0.5),
          status: newLoad > 80 ? 'CLEARING' : newLoad < 30 ? 'PENDING' : 'STABLE'
        };
      }));

      setTimeout(() => setIsSyncing(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/60 border border-amber-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background HUD Graphics */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Globe className="w-80 h-80 text-amber-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <BarChart3 className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Ad Network <span className="text-amber-500">Mesh Settlement</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Proof-of-Performance Credit Distribution
          </p>
        </div>

        <div className="flex items-center gap-10 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Mesh Settlement</div>
              <div className={`text-3xl font-black font-mono text-white tracking-tighter transition-all ${isSyncing ? 'text-emerald-400 scale-[1.02]' : ''}`}>
                ${totalSettled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pending Ad-Credits</div>
              <div className="text-xl font-black font-mono text-amber-500">
                ${pendingCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Settlement Map / Grid */}
        <div className="xl:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <div key={sector.id} className="p-5 bg-slate-950/60 border border-slate-800 rounded-3xl group/sector hover:border-amber-500/30 transition-all duration-500">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${
                           sector.status === 'CLEARING' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' :
                           sector.status === 'PENDING' ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]' :
                           'bg-slate-600'
                         }`} />
                         <span className="text-[9px] font-black text-slate-400 uppercase truncate max-w-[120px]">{sector.name}</span>
                      </div>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border ${
                        sector.status === 'CLEARING' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                        'bg-slate-800 border-slate-700 text-slate-500'
                      }`}>{sector.status}</span>
                   </div>
                   <div className="flex items-end justify-between mb-3">
                      <div className="text-xl font-black font-mono text-white">${sector.settled.toFixed(2)}</div>
                      <div className="text-[8px] font-bold text-slate-600 uppercase">Settled_Layer_12</div>
                   </div>
                   <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          sector.load > 80 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                          sector.load > 50 ? 'bg-amber-500' : 'bg-slate-700'
                        }`} 
                        style={{ width: `${sector.load}%` }} 
                      />
                   </div>
                </div>
              ))}
              {/* Summary Sector */}
              <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl flex flex-col justify-center items-center text-center space-y-2 group/all hover:bg-indigo-500/10 transition-all">
                 <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 mb-1">
                    <Layers className="w-5 h-5 animate-bounce" />
                 </div>
                 <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Aggregate Mesh Velocity</div>
                 <div className="text-xl font-black font-mono text-white">142.4 GB/S</div>
                 <div className="text-[8px] font-bold text-indigo-500/60 uppercase">Settlement Sync Rate: 99.98%</div>
              </div>
           </div>
        </div>

        {/* Live Settlement Trace */}
        <div className="xl:col-span-4 flex flex-col gap-4">
           <div className="bg-black/60 border border-slate-800 rounded-[2rem] p-6 flex-1 flex flex-col shadow-inner">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Settlement Handshakes</span>
                 </div>
                 <span className="text-[8px] font-mono text-slate-600">ENCRYPTED_FEED</span>
              </div>
              <div className="flex-1 font-mono text-[9px] text-emerald-500/60 space-y-1.5 overflow-hidden">
                 <div className="animate-in fade-in slide-in-from-left-2">{'>'} REVENUE_INBOUND: $42.85</div>
                 <div className="animate-in fade-in slide-in-from-left-2 delay-75">{'>'} SIG_AUTH: LAYER_12_SENTINEL</div>
                 <div className="animate-in fade-in slide-in-from-left-2 delay-150">{'>'} ALLOCATING_CREDITS_TO_MESH...</div>
                 <div className="text-indigo-400/80 animate-in fade-in slide-in-from-left-2 delay-300">{'>'} SECTOR_EURO_SYNC_SUCCESS</div>
                 <div className="text-amber-400/80 animate-in fade-in slide-in-from-left-2 delay-500">{'>'} PENDING_AUDIT: $14.20_REMAINING</div>
                 <div className="animate-pulse">{'>'} _</div>
              </div>
           </div>

           <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] flex flex-col justify-center gap-3">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Status</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900 border border-white/5 p-3 rounded-xl">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-600 uppercase">Verification Level</span>
                    <span className="text-xs font-mono font-bold text-white">L12_INSTITUTIONAL</span>
                 </div>
                 <div className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[8px] font-black rounded uppercase">Verified</div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Database className="w-4 h-4 text-indigo-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Nodes Rewardable: 10M</span>
            </div>
            <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-cyan-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Epoch Stability: 100%</span>
            </div>
         </div>
         <button 
           onClick={() => setIsExplorerOpen(true)}
           className="text-[10px] text-amber-500 hover:text-white font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn active:scale-95"
         >
            Detailed Ad Revenue Explorer
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>

      <AdRevenueExplorerModal isOpen={isExplorerOpen} onClose={() => setIsExplorerOpen(false)} />
    </div>
  );
};

export default HlvAdMeshSettlement;