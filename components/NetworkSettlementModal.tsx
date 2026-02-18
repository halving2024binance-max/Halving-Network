import React, { useState, useEffect } from 'react';
import { X, PieChart as PieIcon, ShieldCheck, Zap, Layers, Landmark, ArrowUpRight, History, Terminal, CheckCircle2, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface NetworkSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NetworkSettlementModal: React.FC<NetworkSettlementModalProps> = ({ isOpen, onClose }) => {
  const [settledTotal, setSettledTotal] = useState(0.42851203);
  const [logs, setLogs] = useState<string[]>([]);

  const data = [
    { name: 'Layer 1-4 (Validators)', value: 40, color: '#10b981' },
    { name: 'Layer 5-8 (Insurance)', value: 25, color: '#6366f1' },
    { name: 'Layer 9-12 (AI Compute)', value: 35, color: '#f59e0b' },
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Simulate some logs
    const mockLogs = [
      "> Initializing Global Settlement Sequence...",
      "> Aggregating fees from 14,203 transmissions...",
      "> Applying 12-Layer cryptographic split...",
      "> Transferring 0.1714 BTC to Validator Mesh...",
      "> Allocating 0.1071 BTC to Insurance Vaults...",
      "> Syncing AI Sentinel Compute Credits (0.1500 BTC)...",
      "> Settlement Batch #9921 VERIFIED_STABLE."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < mockLogs.length) {
        setLogs(prev => [...prev, mockLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] shadow-[0_0_80px_rgba(99,102,241,0.15)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500" />
        
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/30 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/30">
              <Landmark className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Network <span className="text-indigo-400">Settlement Analytics</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">Protocol-Wide Revenue Distribution</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-95 border border-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Zap className="w-16 h-16 text-amber-500" />
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Settled Fees</span>
               <div className="text-2xl font-black font-mono text-white tracking-tighter">
                 {settledTotal.toFixed(8)} <span className="text-amber-500 text-sm">BTC</span>
               </div>
               <div className="mt-2 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">+12.4% vs Prev. Batch</div>
            </div>
            
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Layers className="w-16 h-16 text-indigo-500" />
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Distribution Layers</span>
               <div className="text-2xl font-black font-mono text-white tracking-tighter">
                 12 <span className="text-indigo-400 text-sm">Active</span>
               </div>
               <div className="mt-2 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Integrity Verified 100%</div>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Globe className="w-16 h-16 text-cyan-500" />
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Avg. Settle Latency</span>
               <div className="text-2xl font-black font-mono text-white tracking-tighter">
                 840 <span className="text-cyan-400 text-sm">MS</span>
               </div>
               <div className="mt-2 text-[9px] font-bold text-cyan-500 uppercase tracking-tighter">Institutional Grade</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart Distribution */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                 <PieIcon className="w-4 h-4 text-indigo-400" />
                 Revenue Split Matrix
               </h3>
               <div className="w-full h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                     <span className="text-2xl font-black text-white">100%</span>
                     <span className="text-[8px] text-slate-500 uppercase font-black">Split_OK</span>
                  </div>
               </div>
               <div className="mt-8 grid grid-cols-1 gap-3 w-full">
                  {data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.name}</span>
                       </div>
                       <span className="text-xs font-black font-mono text-white">{item.value}%</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Trace Logs & Batch History */}
            <div className="flex flex-col gap-6">
              <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 flex-1 flex flex-col">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-emerald-400" />
                   Settlement Trace
                 </h3>
                 <div className="flex-1 bg-black/40 rounded-2xl p-4 font-mono text-[10px] text-emerald-400/80 space-y-2 overflow-y-auto custom-scrollbar shadow-inner border border-slate-900">
                    {logs.map((log, i) => (
                      <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-500">{log}</div>
                    ))}
                    <div className="animate-pulse flex items-center gap-2">
                       <div className="w-1 h-3 bg-emerald-500" />
                       <span>Awaiting next block confirmation...</span>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                   <History className="w-4 h-4 text-amber-400" />
                   Recent Batches
                 </h3>
                 <div className="space-y-3">
                    {[
                      { id: 'BATCH-882', time: '14m ago', status: 'COMPLETED', amount: '0.0124 BTC' },
                      { id: 'BATCH-881', time: '42m ago', status: 'COMPLETED', amount: '0.0098 BTC' },
                      { id: 'BATCH-880', time: '1.2h ago', status: 'COMPLETED', amount: '0.0152 BTC' },
                    ].map((batch, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-900/40 rounded-2xl border border-slate-800/50 group/batch hover:border-emerald-500/30 transition-all cursor-crosshair">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                              <CheckCircle2 className="w-3 h-3" />
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-white">{batch.id}</div>
                              <div className="text-[8px] text-slate-500 uppercase font-bold">{batch.time}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-black font-mono text-emerald-400">{batch.amount}</div>
                           <div className="text-[7px] text-slate-600 font-black uppercase tracking-tighter">SIG_VERIFIED</div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sentry Verification</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter">SECURE_LEVEL_12</span>
                   </div>
                </div>
                <div className="w-px h-8 bg-slate-800 hidden md:block" />
                <div className="flex items-center gap-3">
                   <Zap className="w-5 h-5 text-indigo-400" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compute Efficiency</span>
                      <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter">99.42%_NOMINAL</span>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-[10px] active:scale-95 group/btn flex items-center gap-2"
              >
                Close Settlement Analytics
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NetworkSettlementModal;