import React, { useState, useEffect, useMemo } from 'react';
import { Target, Zap, ArrowUp, ArrowDown, Info, Layers } from 'lucide-react';

interface ClusterNode {
  price: number;
  volume: number;
  type: 'bid' | 'ask';
  intensity: number;
}

const LiquidityCluster: React.FC = () => {
  const [basePrice, setBasePrice] = useState(68432);
  const [clusters, setClusters] = useState<ClusterNode[]>([]);

  // Initialize and update clusters
  useEffect(() => {
    const generateClusters = (price: number): ClusterNode[] => {
      const nodes: ClusterNode[] = [];
      const step = 50; // $50 increments
      
      // Generate 10 levels above and 10 below
      for (let i = -12; i <= 12; i++) {
        if (i === 0) continue;
        const offset = i * step;
        const type = i > 0 ? 'ask' : 'bid';
        // Randomly assign volume clusters
        const volume = Math.random() * 100 + (Math.random() > 0.8 ? 150 : 0);
        nodes.push({
          price: price + offset,
          volume,
          type,
          intensity: volume / 250
        });
      }
      return nodes;
    };

    setClusters(generateClusters(basePrice));

    const interval = setInterval(() => {
      setBasePrice(prev => prev + (Math.random() - 0.5) * 20);
      setClusters(prev => prev.map(node => ({
        ...node,
        volume: Math.max(10, node.volume + (Math.random() - 0.5) * 15)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sortedClusters = useMemo(() => {
    return [...clusters].sort((a, b) => b.price - a.price);
  }, [clusters]);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group h-[500px] flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Target className="w-16 h-16 text-cyan-500" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Liquidity Clusters
          </h3>
          <p className="text-[10px] text-slate-600 font-mono mt-0.5 uppercase tracking-tighter">Real-time Order Book Depth Simulation</p>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono rounded flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            HIGH_RES
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col font-mono">
        {/* Center Price Marker */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 z-10 flex items-center justify-end">
           <div className="bg-white text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-l shadow-[0_0_15px_rgba(255,255,255,0.5)]">
             ${basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
           </div>
        </div>

        <div className="flex-1 space-y-[2px] overflow-hidden flex flex-col justify-center">
          {sortedClusters.map((cluster, idx) => (
            <div key={idx} className="flex items-center gap-3 h-4 group/row">
              <span className={`text-[9px] w-12 text-right ${cluster.type === 'ask' ? 'text-rose-500/70' : 'text-emerald-500/70'}`}>
                {cluster.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              
              <div className="flex-1 flex items-center relative h-full">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-sm ${
                    cluster.type === 'ask' 
                      ? 'bg-gradient-to-r from-rose-500/40 to-rose-500/5' 
                      : 'bg-gradient-to-r from-emerald-500/40 to-emerald-500/5'
                  }`}
                  style={{ 
                    width: `${(cluster.volume / 250) * 100}%`,
                    opacity: 0.3 + (cluster.intensity * 0.7)
                  }}
                />
                
                {/* Heat Highlight for high volume */}
                {cluster.volume > 180 && (
                  <div className={`absolute top-0 bottom-0 w-1 ${cluster.type === 'ask' ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse shadow-[0_0_10px_currentColor]`} />
                )}
              </div>

              <span className="text-[8px] text-slate-600 w-8 text-right font-bold group-hover/row:text-slate-300">
                {(cluster.volume / 10).toFixed(1)}M
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <ArrowUp className="w-2 h-2 text-rose-500" /> Key Resistance
            </span>
            <span className="text-xs font-mono text-rose-400 font-black tracking-tight">$68,850 - 42.1M</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[9px] text-slate-500 uppercase font-bold justify-end flex items-center gap-1">
              Key Support <ArrowDown className="w-2 h-2 text-emerald-500" />
            </span>
            <span className="text-xs font-mono text-emerald-400 font-black tracking-tight">$68,100 - 38.4M</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-[9px] text-slate-600 font-bold uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-rose-500/40 rounded-sm" />
             <span>Ask Depth</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500/40 rounded-sm" />
             <span>Bid Depth</span>
           </div>
           <Info className="w-3 h-3 hover:text-cyan-400 cursor-help" />
        </div>
      </div>
    </div>
  );
};

export default LiquidityCluster;