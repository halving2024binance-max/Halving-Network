import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShieldAlert, Terminal, Zap, Radar, Activity, Crosshair, Cpu, ChevronRight, AlertTriangle, ShieldCheck, Waves, Search, X } from 'lucide-react';

interface InterceptEntry {
  id: string;
  timestamp: string;
  vector: string;
  action: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  origin: string;
}

const VECTORS = [
  'UPLINK_ALPHA_9',
  'NEURAL_CORE_MESH',
  'L12_GATEWAY',
  'SAT_ORBITAL_V3',
  'CEX_API_BRIDGE',
  'GENESIS_NODE_PRIME',
  'QUANTUM_VAULT_P'
];

const ACTIONS = [
  'SCRUBBED',
  'ISOLATED',
  'NEUTRALIZED',
  'RE-ROUTED',
  'DROPPED',
  'AUTH_CHALLENGED',
  'PROTOCOL_LOCK'
];

const ORIGINS = [
  'IP: 142.92.xx.xx',
  'MESH_NODE: 8420',
  'UPLINK: STARLINK_B',
  'Neural Drift: 0.12ms',
  'Packet Size: 4.2MB'
];

const ThreatInterceptLog: React.FC = () => {
  const [entries, setEntries] = useState<InterceptEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate initial sample data
    const initial = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date(Date.now() - (8 - i) * 30000).toLocaleTimeString([], { hour12: false }),
      vector: VECTORS[Math.floor(Math.random() * VECTORS.length)],
      action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
      severity: (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const)[Math.floor(Math.random() * 4)],
      origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)]
    }));
    setEntries(initial);

    const interval = setInterval(() => {
      const rand = Math.random();
      const sev: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = rand > 0.95 ? 'CRITICAL' : rand > 0.8 ? 'HIGH' : rand > 0.4 ? 'MEDIUM' : 'LOW';
      
      const newEntry: InterceptEntry = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        vector: VECTORS[Math.floor(Math.random() * VECTORS.length)],
        action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
        severity: sev,
        origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)]
      };

      setEntries(prev => [...prev.slice(-14), newEntry]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const filteredEntries = useMemo(() => {
    if (!searchTerm.trim()) return entries;
    const query = searchTerm.toLowerCase();
    return entries.filter(e => 
      e.vector.toLowerCase().includes(query) ||
      e.action.toLowerCase().includes(query) ||
      e.severity.toLowerCase().includes(query) ||
      e.origin.toLowerCase().includes(query)
    );
  }, [entries, searchTerm]);

  useEffect(() => {
    if (scrollRef.current && !searchTerm) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, searchTerm]);

  return (
    <div className="bg-slate-900 border border-indigo-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col h-[500px] transition-all duration-700 hover:border-indigo-500/40 group">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      {/* Tactical Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950/40 backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/30">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
              Threat Intercept Tactical Log
              <span className="px-1.5 py-0.5 bg-rose-500 text-slate-950 text-[8px] font-black rounded uppercase">LIVE_SURVEILLANCE</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-tighter">Perimeter Defense: 100% NOMINAL</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           {/* SEARCH BAR */}
           <div className="relative group/search flex-1 md:flex-none">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${searchTerm ? 'text-indigo-400' : 'text-slate-600'}`} />
              <input 
                type="text" 
                placeholder="FORENSIC_SEARCH..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-[10px] font-mono text-indigo-100 placeholder:text-slate-700 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
           </div>

           <div className="hidden lg:flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-600 uppercase">Neural Processing</span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-tighter">142.4 GFLOP/S</span>
           </div>
           <div className="p-2 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
             <Terminal className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Terminal Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-2 custom-scrollbar bg-black/20"
      >
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-white/5 text-slate-600 font-black uppercase tracking-widest sticky top-0 bg-slate-900/80 backdrop-blur z-20">
           <div className="col-span-2">TIMESTAMP</div>
           <div className="col-span-3">VECTOR</div>
           <div className="col-span-3">ACTION_MITIGATION</div>
           <div className="col-span-2">SEVERITY</div>
           <div className="col-span-2 text-right">ORIGIN</div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 italic space-y-4">
            <Search className="w-12 h-12" />
            <p>No matching anomalies found in current buffer...</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="grid grid-cols-12 gap-4 py-2 border-b border-white/[0.03] items-center group/log animate-in slide-in-from-bottom-1 duration-500"
            >
              <div className="col-span-2 text-slate-500 font-bold">
                {entry.timestamp}
              </div>
              <div className="col-span-3 text-indigo-400 font-black tracking-tighter truncate">
                [{entry.vector}]
              </div>
              <div className="col-span-3 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 <span className="text-emerald-400 font-bold">{entry.action}</span>
              </div>
              <div className="col-span-2">
                 <span className={`px-2 py-0.5 rounded-[4px] font-black text-[9px] border inline-block ${
                   entry.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 animate-pulse' :
                   entry.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' :
                   entry.severity === 'MEDIUM' ? 'bg-indigo-500/20 text-indigo-500 border-indigo-500/40' :
                   'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                 }`}>
                   {entry.severity}
                 </span>
              </div>
              <div className="col-span-2 text-right text-slate-600 font-bold group-hover/log:text-slate-400 transition-colors truncate">
                {entry.origin}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Status Summary */}
      <div className="bg-slate-950 border-t border-slate-800 p-4 px-8 flex justify-between items-center z-10">
        <div className="flex gap-8">
           <div className="flex items-center gap-3">
             <Activity className="w-4 h-4 text-emerald-400" />
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-600 uppercase">Detection Rate</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">99.98%</span>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <Zap className="w-4 h-4 text-amber-500" />
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-600 uppercase">Auto-Mitigation</span>
                <span className="text-[10px] font-mono text-amber-500 font-bold">ENABLED</span>
             </div>
           </div>
        </div>
        <button className="text-[10px] text-slate-500 hover:text-indigo-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
           Detailed Forensics
           <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ThreatInterceptLog;