import React, { useState, useEffect, useMemo } from 'react';
import { Waves, Zap, Activity, Cpu, ShieldCheck, Target, TrendingUp, Droplet, ArrowRight, Sparkles } from 'lucide-react';

interface NeuralLiquidityLayerProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const NeuralLiquidityLayer: React.FC<NeuralLiquidityLayerProps> = ({ swarmMetrics }) => {
  const [velocity, setVelocity] = useState(142.4);
  const [depth, setDepth] = useState(88.5);
  const [nodes, setNodes] = useState(new Array(32).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluid liquidity shifts
      setVelocity(prev => parseFloat((prev + (Math.random() * 4 - 2)).toFixed(1)));
      setDepth(prev => Math.min(99.9, Math.max(70, prev + (Math.random() * 1 - 0.5))));
      
      // Update individual "liquidity node" heat
      setNodes(prev => prev.map(() => Math.random()));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const viscosity = useMemo(() => {
    return (swarmMetrics.processingLoad / 100) * 0.8 + 0.2;
  }, [swarmMetrics.processingLoad]);

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-[3rem] p-10 relative overflow-hidden group transition-all duration-700 hover:border-indigo-500/30">
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Section: Identity & Core Pulse */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="relative">
             <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-cyan-500/20 animate-pulse" />
                <Waves className="w-14 h-14 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                
                {/* Micro-spark particles */}
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 bg-white rounded-full animate-ping opacity-20"
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 300}ms`
                    }} 
                  />
                ))}
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-slate-900 border border-indigo-500/30 rounded-xl shadow-2xl">
                <Droplet className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">NEURAL <span className="text-indigo-400">LIQUIDITY</span></h2>
              <div className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black rounded border border-indigo-500/30 uppercase tracking-widest">Protocol_V4</div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Fluid Compute Provisioning
              </span>
              <span className="text-[10px] text-indigo-400 font-mono font-black uppercase tracking-[0.1em]">10,000,000 NODE POOL ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Center Section: Main Metric Heatmap */}
        <div className="flex-1 w-full max-w-lg space-y-4">
           <div className="flex justify-between items-end mb-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cross-Layer Velocity Mesh</span>
              <span className="text-[9px] font-mono font-black text-indigo-400">{velocity} TB/S NOMINAL</span>
           </div>
           <div className="h-16 flex items-end gap-1.5 px-1">
              {nodes.map((heat, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-indigo-500/20 rounded-t-lg transition-all duration-1000 ease-in-out relative group/bar"
                  style={{ 
                    height: `${20 + (heat * 80)}%`,
                    opacity: 0.3 + (heat * 0.7),
                    backgroundColor: heat > 0.8 ? 'rgba(129, 140, 248, 0.6)' : 'rgba(99, 102, 241, 0.2)'
                  }}
                >
                   {heat > 0.9 && (
                     <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8] animate-ping" />
                   )}
                </div>
              ))}
           </div>
           <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase font-black">
              <span>Layer 01_INFRA</span>
              <span className="text-indigo-500">EXASCALE TRANSIT</span>
              <span>Layer 12_AI_CORE</span>
           </div>
        </div>

        {/* Right Section: Deep Telemetry */}
        <div className="flex flex-col gap-4 min-w-[240px]">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-inner">
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compute Depth</span>
                 <span className="text-xl font-black font-mono text-white">{depth.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                 <div 
                   className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                   style={{ width: `${depth}%` }} 
                 />
              </div>
              <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase">
                 <span>Provisioning...</span>
                 <span className="text-indigo-500">Stable_Sync</span>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Viscosity</div>
                 <div className="text-sm font-black font-mono text-indigo-400">{(viscosity * 10).toFixed(2)} cP</div>
              </div>
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                 <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Saturation</div>
                 <div className="text-sm font-black font-mono text-cyan-400">OPTIMAL</div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-8 items-center justify-center lg:justify-start">
         <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Provisioning: ACTIVE</span>
         </div>
         <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Integrity Seal: L12_VERIFIED</span>
         </div>
         <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency Pulse: 8ms</span>
         </div>
         <button className="ml-auto flex items-center gap-2 text-slate-600 hover:text-indigo-400 transition-colors group/btn">
            <span className="text-[9px] font-black uppercase tracking-widest">Liquidity Explorer</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default NeuralLiquidityLayer;