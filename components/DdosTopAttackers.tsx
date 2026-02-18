import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Globe, Activity, Zap, Flag, ArrowRight, ShieldCheck, Terminal, Crosshair } from 'lucide-react';
import GlobalThreatMapModal from './GlobalThreatMapModal';

interface CountryAttackData {
  country: string;
  code: string;
  count: number;
  vector: string;
  severity: 'high' | 'medium' | 'low';
}

const VECTORS = ['UDP_FLOOD', 'SYN_INC', 'L7_STRESS', 'BOTNET_PING', 'TCP_STORM'];

const INITIAL_COUNTRIES: CountryAttackData[] = [
  { country: 'United States', code: 'US', count: 42109, vector: 'UDP_FLOOD', severity: 'high' },
  { country: 'China', code: 'CN', count: 38421, vector: 'SYN_INC', severity: 'high' },
  { country: 'Russia', code: 'RU', count: 31205, vector: 'L7_STRESS', severity: 'high' },
  { country: 'Brazil', code: 'BR', count: 18402, vector: 'BOTNET_PING', severity: 'medium' },
  { country: 'India', code: 'IN', count: 15904, vector: 'UDP_FLOOD', severity: 'medium' },
  { country: 'Germany', code: 'DE', count: 12402, vector: 'TCP_STORM', severity: 'medium' },
  { country: 'Vietnam', code: 'VN', count: 9842, vector: 'SYN_INC', severity: 'low' },
  { country: 'Netherlands', code: 'NL', count: 7205, vector: 'L7_STRESS', severity: 'low' },
  { country: 'United Kingdom', code: 'GB', count: 5402, vector: 'UDP_FLOOD', severity: 'low' },
  { country: 'France', code: 'FR', count: 4821, vector: 'BOTNET_PING', severity: 'low' },
];

const DdosTopAttackers: React.FC = () => {
  const [attackers, setAttackers] = useState<CountryAttackData[]>(INITIAL_COUNTRIES);
  const [totalIntercepted, setTotalIntercepted] = useState(142095);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttackers(prev => {
        const next = prev.map(a => {
          const increment = Math.floor(Math.random() * 50);
          if (Math.random() > 0.8) {
            return {
              ...a,
              count: a.count + increment,
              vector: Math.random() > 0.95 ? VECTORS[Math.floor(Math.random() * VECTORS.length)] : a.vector
            };
          }
          return a;
        });
        return [...next].sort((a, b) => b.count - a.count);
      });
      setTotalIntercepted(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maxCount = useMemo(() => Math.max(...attackers.map(a => a.count)), [attackers]);

  return (
    <div className="bg-slate-900/60 border border-rose-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Globe className="w-80 h-80 text-rose-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Origin <span className="text-rose-500">Threat Matrix</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Top 10 Global DDoS Incursion Sources
          </p>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Interceptions Active</span>
              <span className="text-xl font-black font-mono text-rose-400">{totalIntercepted.toLocaleString()}</span>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Status</span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
                 <span className="text-[10px] font-black font-mono text-white">SCRUBBING_L12</span>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {attackers.map((attacker, idx) => (
          <div key={attacker.code} className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl group/row hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-48 shrink-0">
                <span className="text-[10px] font-mono text-slate-600 font-black">#{String(idx + 1).padStart(2, '0')}</span>
                <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg group-hover/row:border-rose-500/20 transition-colors">
                  <Flag className="w-3 h-3 text-slate-500 group-hover/row:text-rose-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">{attacker.country}</h4>
                  <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">MESH_NODE_{attacker.code}</span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center text-[8px] font-black uppercase">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Zap className="w-2.5 h-2.5 text-amber-500" />
                    Vector: {attacker.vector}
                  </span>
                  <span className={attacker.severity === 'high' ? 'text-rose-500' : 'text-slate-500'}>
                    {attacker.count.toLocaleString()} REQ/MIN
                  </span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${
                      attacker.severity === 'high' ? 'bg-rose-500' : 
                      attacker.severity === 'medium' ? 'bg-amber-500' : 
                      'bg-slate-700'
                    }`} 
                    style={{ width: `${(attacker.count / maxCount) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="w-24 text-right">
                 <div className={`text-[10px] font-black italic tracking-tighter ${attacker.severity === 'high' ? 'text-rose-400' : 'text-slate-600'}`}>
                   {attacker.severity === 'high' ? 'MITIGATING' : 'DROPPED'}
                 </div>
                 <div className="flex gap-0.5 justify-end mt-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`w-1 h-1.5 rounded-full ${attacker.severity === 'high' && i < 3 ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'}`} style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Forensic Sync: Global</span>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol V2.7 Ready</span>
            </div>
         </div>
         <button 
           onClick={() => setIsMapOpen(true)}
           className="text-[10px] text-slate-500 hover:text-rose-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn active:scale-95"
         >
            Detailed Global Map
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>

      <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent -translate-x-full animate-[scan_5s_linear_infinite]" />
      </div>

      <GlobalThreatMapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default DdosTopAttackers;