import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, Search, Globe, Activity, ShieldAlert, Cpu, Zap, Lock, Radio, X } from 'lucide-react';

interface SurveillanceLog {
  id: string;
  timestamp: string;
  status: 'OK' | 'WARN' | 'ALERT' | 'INFO';
  module: string;
  message: string;
}

const MODULES = [
  'PACKET_SCRUBBER',
  'NEURAL_BRIDGE',
  'LAYER_12_CORE',
  'MESH_VALIDATOR',
  'IP_REPUTATION',
  'HASH_INTEGRITY',
  'SENTINEL_AI'
];

const MESSAGES = [
  'Inbound packet scrubbed: Source Sector Alpha-9',
  'Neural handshake verified: Peer 0x4f...a2',
  'Anomalous traffic signature dropped: Port 443',
  'Consensus heartbeat: All layers synchronized',
  'Cryptographic finality reached: Block 840,421',
  'Whale movement detected: Analyzing liquidity impact',
  'DDoS mitigation active: Scrubbing node 12.44.02',
  'Institutional flow detected: Signature match - IBIT',
  'Peer discovery: 142 new nodes indexed',
  'Security layer 09: Liquidity sentinel active',
  'Exascale compute load: 14.2% nominal'
];

const GlobalSurveillanceStream: React.FC = () => {
  const [logs, setLogs] = useState<SurveillanceLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate initial logs
    const initialLogs = Array.from({ length: 15 }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      status: (['OK', 'INFO', 'OK', 'WARN'] as const)[Math.floor(Math.random() * 4)],
      module: MODULES[Math.floor(Math.random() * MODULES.length)],
      message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    }));
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const statusArr: ('OK' | 'WARN' | 'ALERT' | 'INFO')[] = ['OK', 'INFO', 'OK', 'WARN', 'ALERT'];
      const rand = Math.random();
      const status = rand > 0.95 ? 'ALERT' : rand > 0.85 ? 'WARN' : rand > 0.4 ? 'OK' : 'INFO';
      
      const newLog: SurveillanceLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        status,
        module: MODULES[Math.floor(Math.random() * MODULES.length)],
        message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      };

      setLogs(prev => [...prev.slice(-49), newLog]);
    }, 1500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(l => 
      l.module.toLowerCase().includes(q) ||
      l.message.toLowerCase().includes(q) ||
      l.status.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  useEffect(() => {
    if (scrollRef.current && !searchQuery) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, searchQuery]);

  return (
    <div className="bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col h-[500px] transition-all duration-700 hover:border-emerald-500/20 group">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
              Global Surveillance Stream
              <span className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[8px] font-black rounded uppercase tracking-tighter">Live</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">Authorized Sentry Access Only</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* SEARCH BAR */}
          <div className="relative group/search flex-1 md:flex-none">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-emerald-400' : 'text-slate-600'}`} />
            <input 
              type="text" 
              placeholder="SEARCH_MESH_LOGS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-56 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-[10px] font-mono text-emerald-100 placeholder:text-slate-700 outline-none focus:border-emerald-500/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex flex-col items-end mr-4">
             <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol Version</span>
             <span className="text-[10px] font-mono text-emerald-500/60 font-bold">V-2.7.9-EXT</span>
          </div>
        </div>
      </div>

      {/* Surveillance Feed Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[10px] space-y-1 custom-scrollbar scroll-smooth"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 italic space-y-4">
            <Terminal className="w-12 h-12" />
            <p>No telemetry segments matched for given query...</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="grid grid-cols-12 gap-4 py-1 border-b border-white/[0.02] items-center group/log animate-in slide-in-from-right-2"
            >
              <div className="col-span-1 text-slate-600 font-bold opacity-40 group-hover/log:opacity-100 transition-opacity">
                {log.timestamp}
              </div>
              <div className="col-span-2">
                 <span className={`px-1.5 py-0.5 rounded-[4px] font-black text-[9px] w-full block text-center border ${
                   log.status === 'OK' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                   log.status === 'WARN' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                   log.status === 'ALERT' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' :
                   'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                 }`}>
                   {log.status}
                 </span>
              </div>
              <div className="col-span-3 text-slate-400 font-black group-hover/log:text-emerald-400 transition-colors uppercase tracking-tighter truncate">
                 [{log.module}]
              </div>
              <div className="col-span-6 text-slate-500 font-medium tracking-tight group-hover/log:text-slate-200 transition-colors truncate">
                {log.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Metrics */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 px-8 flex justify-between items-center z-10">
        <div className="flex gap-8">
           <div className="flex items-center gap-2">
             <Activity className="w-3.5 h-3.5 text-cyan-400" />
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-500 uppercase">Throughput</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">14.2 GB/S</span>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-500 uppercase">Incursions</span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">0 Active</span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right">
              <span className="text-[7px] font-black text-slate-500 uppercase block tracking-[0.2em]">Neural Sync</span>
              <div className="flex gap-0.5">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="w-3 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      {/* Scan Line Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
         <div className="w-full h-[2px] bg-emerald-500/10 shadow-[0_0_10px_#10b981] absolute top-0 left-0 animate-[scan_8s_linear_infinite]" />
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default GlobalSurveillanceStream;