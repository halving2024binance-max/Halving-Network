import React, { useState, useEffect } from 'react';
import { Globe, ShieldCheck, Zap, Activity, Shield, Terminal, Globe2, Network, Lock, Fingerprint, ArrowUpRight } from 'lucide-react';

const DomainController: React.FC = () => {
  const [dnsSync, setDnsSync] = useState(99.98);
  const [propagation, setPropagation] = useState(100);
  const [sslExpiry, setSslExpiry] = useState(364);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setDnsSync(prev => Math.min(100, Math.max(99.9, prev + (Math.random() * 0.01 - 0.005))));
      setTimeout(() => setPulse(false), 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-[3.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-700 hover:border-cyan-500/40">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Globe2 className="w-80 h-80 text-cyan-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HALVINGNETWORK<span className="text-cyan-500">.IO</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Sovereign Domain Protocol v1.0
          </p>
        </div>

        <div className="flex items-center gap-10">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mesh DNS Sync</div>
              <div className={`text-4xl font-black font-mono text-white flex items-baseline gap-1 transition-all duration-500 ${pulse ? 'text-cyan-400 scale-105' : ''}`}>
                {dnsSync.toFixed(2)}%
                <span className="text-xs text-emerald-400">NOMINAL</span>
              </div>
           </div>
           <div className="h-12 w-px bg-slate-800 hidden md:block" />
           <div className="hidden md:flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Propagation</div>
              <div className="text-xl font-black font-mono text-indigo-400 uppercase tracking-tighter">10M_NODES_OK</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* SSL Guard */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-4 shadow-inner group/card hover:border-cyan-500/30 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-500" />
                SSL Core Integrity
              </span>
           </div>
           <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black font-mono text-white">SHA-256</div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Verisign_Exascale</span>
           </div>
           <div className="flex items-center gap-2 text-[8px] font-mono text-slate-600 uppercase">
              <Activity className="w-3 h-3 text-cyan-600" />
              Valid: {sslExpiry} Epochs Remaining
           </div>
        </div>

        {/* DNS Root Cluster */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-4 shadow-inner group/card hover:border-indigo-500/30 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Network className="w-3.5 h-3.5 text-indigo-500" />
                Mesh Routing Table
              </span>
           </div>
           <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black font-mono text-white">Anycast</div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Uplink_Alpha_9</span>
           </div>
           <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[92%] shadow-[0_0_8px_#6366f1]" />
           </div>
        </div>

        {/* Identity Verification */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-4 shadow-inner group/card hover:border-emerald-500/30 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-500" />
                Domain Sovereignty
              </span>
           </div>
           <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black font-mono text-white">L12_MAX</div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified_Owner</span>
           </div>
           <p className="text-[8px] font-black text-slate-700 uppercase tracking-tighter">AUTH: HOPÎRDA ADRIAN EXCLUSIVE</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-amber-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Handshake: STABLE</span>
            </div>
            <div className="flex items-center gap-2">
               <Shield className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">12-Layer Shielding: ARMED</span>
            </div>
         </div>
         <button className="text-[10px] text-cyan-400 hover:text-white uppercase font-black tracking-widest transition-all flex items-center gap-2 group/btn">
            WHOIS Neural Audit
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default DomainController;