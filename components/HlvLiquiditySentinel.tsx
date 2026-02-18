
import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Zap, Activity, Droplets, Target, ShieldCheck, TrendingUp, Info, ArrowRight } from 'lucide-react';

interface HlvLiquiditySentinelProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const HlvLiquiditySentinel: React.FC<HlvLiquiditySentinelProps> = ({ swarmMetrics }) => {
  const [metrics, setMetrics] = useState({
    tvl: 42850000,
    volume24h: 12400000,
    neuralBacking: 94.2,
    depth: 82.5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate liquidity metrics based on swarm load
      const volatility = (Math.random() - 0.5) * 50000;
      const loadFactor = swarmMetrics.processingLoad / 100;
      
      setMetrics(prev => ({
        tvl: prev.tvl + volatility + (loadFactor * 10000),
        volume24h: prev.volume24h + (Math.random() - 0.4) * 25000,
        neuralBacking: Math.min(99.9, Math.max(90, prev.neuralBacking + (Math.random() * 0.2 - 0.1))),
        depth: Math.min(100, Math.max(70, 80 + (loadFactor * 15) + (Math.random() * 2 - 1)))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [swarmMetrics.processingLoad]);

  return (
    <div className="bg-slate-900/60 border border-indigo-500/30 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background HUD elements */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
        <Droplets className="w-64 h-64 text-indigo-400" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HLV <span className="text-indigo-400">Liquidity Sentinel</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            Neural-Provisioned Asset Depth
          </p>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">HLV Total Value Locked</div>
              <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1">
                ${(metrics.tvl / 1000000).toFixed(2)}M
                <span className="text-[10px] text-emerald-500 font-bold uppercase ml-2 animate-pulse">Stable</span>
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Neural Backing Ratio</div>
              <div className="text-xl font-black font-mono text-indigo-400">{metrics.neuralBacking.toFixed(1)}%</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Liquidity Depth Visualization */}
        <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-3xl space-y-6">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                DEX Aggregation Depth
              </span>
              <span className="text-[9px] font-mono text-indigo-400 font-bold">{metrics.depth.toFixed(1)}% SATURATION</span>
           </div>
           
           <div className="relative h-24 flex items-end gap-1 px-2">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-indigo-500/20 rounded-t-sm transition-all duration-1000 ease-in-out relative group/bar"
                  style={{ 
                    height: `${Math.max(15, (metrics.depth * (0.4 + Math.random() * 0.6)))}%`,
                    backgroundColor: i > 15 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)'
                  }}
                >
                   <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover/bar:opacity-40 transition-opacity" />
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="px-3 py-1 bg-slate-900/90 border border-slate-700 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest backdrop-blur-sm">
                   Live Order Book Clusters
                 </div>
              </div>
           </div>

           <div className="flex justify-between items-center pt-2">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-600 uppercase">Slippage Tolerance (Avg)</span>
                 <span className="text-xs font-mono font-black text-white">0.024%</span>
              </div>
              <div className="flex flex-col text-right">
                 <span className="text-[8px] font-black text-slate-600 uppercase">Provider Incentives</span>
                 <span className="text-xs font-mono font-black text-emerald-400">14.2% APY</span>
              </div>
           </div>
        </div>

        {/* Volume & Neural Stats */}
        <div className="grid grid-cols-1 gap-4">
           <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-3xl flex items-center justify-between group/vol hover:border-indigo-500/20 transition-all">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 group-hover/vol:bg-indigo-500 group-hover/vol:text-slate-950 transition-all">
                    <Activity className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">24H Trading Volume</div>
                    <div className="text-xl font-black font-mono text-white">${(metrics.volume24h / 1000000).toFixed(2)}M</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1 justify-end">
                    <TrendingUp className="w-2.5 h-2.5" /> +12.4%
                 </div>
                 <div className="text-[9px] text-slate-600 font-mono">NEURAL_ROUTED</div>
              </div>
           </div>

           <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-3xl flex items-center justify-between group/backing hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover/backing:bg-emerald-500 group-hover/backing:text-slate-950 transition-all">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pool Security Level</div>
                    <div className="text-xl font-black font-mono text-white">L12_SENTRY</div>
                 </div>
              </div>
              <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-1.5 h-5 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 150}ms`, height: '80%' }} />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Droplets className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Liquid Mesh: OPTIMAL</span>
            </div>
            <div className="flex items-center gap-2">
               <Info className="w-3.5 h-3.5 text-slate-600" />
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Liquidity provided by swarm agents</span>
            </div>
         </div>
         <button className="text-[10px] text-indigo-400 hover:text-white uppercase font-black tracking-widest transition-all flex items-center gap-2 group/btn">
            Detailed Pool Analytics
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default HlvLiquiditySentinel;
