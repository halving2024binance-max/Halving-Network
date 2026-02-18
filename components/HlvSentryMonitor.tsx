import React, { useState, useEffect, useMemo } from 'react';
import { Shield, ShieldAlert, Zap, Cpu, Activity, Radar, Search, AlertCircle, ShieldCheck, Crown, CheckCircle } from 'lucide-react';
import { SECURITY_LAYERS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const HlvSentryMonitor: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [threatLevel, setThreatLevel] = useState(4.2);
  const [scanPulse, setScanPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
      setScanPulse(prev => (prev + 1) % 100);
      
      if (Math.random() > 0.95) {
        setActiveLayer(Math.floor(Math.random() * 12));
        setTimeout(() => setActiveLayer(null), 1500);
      }

      setThreatLevel(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Math.max(1.0, Math.min(10.0, prev + delta));
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/80 border border-emerald-500/20 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(16,185,129,0.05)] relative overflow-hidden group transition-all duration-700 hover:border-emerald-500/40">
      {/* Background HUD Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
        {/* The Sentinel Eye / Radar */}
        <div className="relative w-72 h-72 shrink-0">
          {/* Pulsing Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-ping opacity-20" />
          
          {/* Main 12-Layer Ring */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-linear"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SECURITY_LAYERS.map((layer, i) => {
              const angle = (i * 360) / 12;
              const isActive = activeLayer === i;
              return (
                <div 
                  key={layer.id}
                  className="absolute"
                  style={{ transform: `rotate(${angle}deg) translateY(-120px)` }}
                >
                  <div className={`w-1.5 h-6 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-emerald-400 shadow-[0_0_15px_#10b981] h-10' : 'bg-slate-800'
                  }`} />
                  {isActive && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                       <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                         LAYER_{layer.id.toString().padStart(2, '0')}_LOCKED
                       </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Center Neural Core */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-40 h-40 rounded-full border border-emerald-500/20 flex items-center justify-center relative overflow-hidden bg-slate-950/40 backdrop-blur-xl">
                {/* Radar Sweep Effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/10 to-transparent"
                  style={{ transform: `rotate(${rotation * 4}deg)` }}
                />
                
                <div className="text-center space-y-1 relative z-20">
                   <Shield className={`w-10 h-10 mx-auto transition-all duration-500 ${threatLevel > 7 ? 'text-rose-500 animate-bounce' : 'text-emerald-500 animate-pulse'}`} />
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">AI_Sentinel</div>
                   <div className="text-2xl font-black font-mono text-white tracking-tighter">SECURE</div>
                   <div className="flex items-center gap-1.5 justify-center mt-1">
                      <Crown className="w-2 h-2 text-amber-500" />
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">H. Adrian</span>
                   </div>
                </div>
                
                {/* Radial Scan Pulse */}
                <div 
                  className="absolute inset-0 border-2 border-emerald-500/30 rounded-full opacity-0"
                  style={{ 
                    animation: 'radar-pulse 4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
                    animationDelay: '0s'
                  }}
                />
             </div>
          </div>
        </div>

        {/* Telemetry Display */}
        <div className="flex-1 w-full space-y-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                 <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-lg shadow-lg">HLV_SENTINEL_LIVE</div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase flex items-center gap-2">
                       <Crown className="w-2.5 h-2.5 text-amber-500" />
                       Lead Architect: Hopîrda Adrian
                    </div>
                 </div>
                 <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mt-3">
                    Protocol <span className="text-emerald-500">Defense HUD</span>
                 </h2>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    Neural Threat Index
                 </div>
                 <div className={`text-5xl font-black font-mono tracking-tighter transition-colors duration-500 ${threatLevel > 7 ? 'text-rose-500' : threatLevel > 4 ? 'text-amber-500' : 'text-emerald-400'}`}>
                    {threatLevel.toFixed(1)}
                    <span className="text-sm text-slate-600 font-bold ml-2">/ 10.0</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-[2rem] flex items-center justify-between group/stat">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                       <motion.div
                         animate={{ scale: [1, 1.2, 1] }}
                         transition={{ duration: 2, repeat: Infinity }}
                       >
                         <ShieldCheck className="w-6 h-6" />
                       </motion.div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Defenses</div>
                       <div className="text-xl font-black font-mono text-white flex items-center gap-2">
                         12/12 LAYERS
                         <motion.div
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
                         >
                           <CheckCircle className="w-4 h-4 text-emerald-500" />
                         </motion.div>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                 </div>
              </div>

              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-[2rem] flex items-center justify-between group/stat">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                       <Radar className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Scan Rate</div>
                       <div className="text-xl font-black font-mono text-white">14.2ms JITTER</div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <div className="text-[8px] font-black text-emerald-500 uppercase">Latency: Stable</div>
                    <Activity className="w-6 h-4 text-emerald-500/40" />
                 </div>
              </div>
           </div>

           <div className="bg-slate-950/80 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Surveillance Stream</span>
                 </div>
                 <div className="text-[8px] font-mono text-slate-600">BUFFERING_ENCRYPTED_FEED...</div>
              </div>
              <div className="h-24 font-mono text-[10px] text-slate-500 space-y-2 overflow-hidden relative z-10">
                 <div className="flex gap-4 animate-in slide-in-from-left-2 duration-500">
                    <span className="text-emerald-500">[OK]</span>
                    <span>LAYER_09: LIQUIDITY_SENTINEL_SYNCED</span>
                    <span className="ml-auto text-slate-700">14:42:01</span>
                 </div>
                 <div className="flex gap-4 animate-in slide-in-from-left-2 duration-500 delay-100">
                    <span className="text-indigo-500">[INFO]</span>
                    <span>NEURAL_SWARM: 10M AGENTS_ACTIVE_BALANCING</span>
                    <span className="ml-auto text-slate-700">14:42:05</span>
                 </div>
                 <div className="flex gap-4 animate-in slide-in-from-left-2 duration-500 delay-200">
                    <span className="text-amber-500">[WARN]</span>
                    <span>INSTITUTIONAL_FLOW: LARGE_CEX_WITHDRAWAL_DETECTED</span>
                    <span className="ml-auto text-slate-700">14:42:08</span>
                 </div>
                 <div className="flex gap-4 animate-in slide-in-from-left-2 duration-500 delay-300">
                    <span className="text-emerald-500">[OK]</span>
                    <span>AI_SENTINEL: ARCHITECT_SIGN_VALID [H. ADRIAN]</span>
                    <span className="ml-auto text-slate-700">14:42:12</span>
                 </div>
              </div>
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-2 w-full animate-[scan_3s_linear_infinite]" />
           </div>
        </div>
      </div>

      <style>{`
        @keyframes radar-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
};

export default HlvSentryMonitor;