import React from 'react';
import { Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const CeoCompactBanner: React.FC = () => {
  return (
    <div className="w-full bg-black h-6 flex items-center relative overflow-hidden group select-none">
      {/* Precision Scanning Line */}
      <div className="absolute inset-y-0 left-0 w-1 bg-amber-500 shadow-[0_0_10px_#f59e0b] z-20" />
      
      {/* Ultra-subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center h-full relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Crown className="w-2.5 h-2.5 text-amber-500" />
              <div className="absolute inset-0 bg-amber-500/20 blur-sm rounded-full animate-pulse" />
            </div>
            <span className="text-[9px] font-black text-white uppercase tracking-tighter italic">
              HOPÎRDA <span className="text-amber-500">ADRIAN</span>
            </span>
          </div>
          
          <div className="h-2 w-px bg-slate-800" />
          
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">CHIEF EXECUTIVE OFFICER</span>
            <div className="flex items-center gap-1">
               <Zap className="w-2 h-2 text-amber-500/50" />
               <span className="text-[7px] font-mono text-amber-500/40">V_GENESIS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[8px] font-mono font-black text-amber-500/70 uppercase tracking-[0.2em] animate-in fade-in duration-1000">
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            <span className="hidden sm:inline">EXECUTIVE STRATEGY PROTOCOL</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-2 py-0 bg-amber-500 text-black rounded-[2px] text-[7px] font-black uppercase tracking-tighter shadow-[0_0_8px_rgba(245,158,11,0.4)]">
              LIVE_SENTRY
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Animated Shine Sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out" />
    </div>
  );
};

export default CeoCompactBanner;