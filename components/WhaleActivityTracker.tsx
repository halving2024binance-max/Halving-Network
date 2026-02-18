
import React, { useState, useEffect, useMemo } from 'react';
import { Waves, TrendingUp, Anchor, Activity, AlertCircle, Maximize2 } from 'lucide-react';

interface WhaleMovement {
  id: string;
  amount: number;
  from: string;
  to: string;
  timestamp: string;
  intensity: number; // 0 to 1
}

const WhaleActivityTracker: React.FC = () => {
  const [grid, setGrid] = useState<number[]>(new Array(40).fill(0));
  const [movements, setMovements] = useState<WhaleMovement[]>([]);

  // Simulate grid activity
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prev => {
        const next = [...prev];
        // Decay existing intensity
        for (let i = 0; i < next.length; i++) {
          next[i] = Math.max(0, next[i] - 0.1);
        }
        // Random "Whale" event
        if (Math.random() > 0.7) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = Math.random() * 0.5 + 0.5;
          
          // Add to movement log
          const amount = Math.floor(Math.random() * 5000) + 500;
          const newMvmt: WhaleMovement = {
            id: Math.random().toString(36).substring(2, 7).toUpperCase(),
            amount,
            from: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 4)}`,
            to: Math.random() > 0.5 ? 'EXCHANGE' : `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 4)}`,
            timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }),
            intensity: amount / 5500
          };
          setMovements(m => [newMvmt, ...m].slice(0, 5));
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Waves className="w-4 h-4 text-indigo-400" />
            Whale Activity Heatmap
          </h3>
          <p className="text-[10px] text-slate-600 font-mono mt-0.5">Tactical Deep-Volume Surveillance</p>
        </div>
        <div className="flex gap-2">
           <div className="px-2 py-1 bg-slate-950/50 border border-slate-800 rounded flex items-center gap-2">
             <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
             <span className="text-[10px] font-mono text-cyan-400">PULSE: NORM</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Heatmap Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-1.5">
            {grid.map((intensity, i) => (
              <div 
                key={i}
                className="aspect-square rounded-[2px] border border-slate-800/50 transition-all duration-1000"
                style={{
                  backgroundColor: intensity > 0 
                    ? `rgba(99, 102, 241, ${intensity})` 
                    : 'rgba(15, 23, 42, 0.4)',
                  boxShadow: intensity > 0.6 
                    ? `0 0 10px rgba(99, 102, 241, ${intensity * 0.5})` 
                    : 'none'
                }}
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Grid Segment: Alpha-9</span>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
              <span>Low</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
              <span>High Vol</span>
            </div>
          </div>
        </div>

        {/* Live Ticker */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-500 uppercase">
            <TrendingUp className="w-3 h-3" />
            Recent Large Incursions
          </div>
          <div className="space-y-2 flex-1 overflow-hidden">
            {movements.length === 0 ? (
              <div className="h-full flex items-center justify-center opacity-30 italic text-[10px] text-slate-400">
                Scanning deep liquidity channels...
              </div>
            ) : (
              movements.map((mvmt, idx) => (
                <div 
                  key={mvmt.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950/40 border border-slate-800/50 rounded-lg hover:border-indigo-500/30 transition-all animate-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-slate-900 border ${mvmt.intensity > 0.6 ? 'border-rose-500/50 text-rose-500' : 'border-indigo-500/30 text-indigo-400'}`}>
                      <Anchor className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-white">{mvmt.amount.toLocaleString()} BTC</span>
                        <span className="text-[8px] text-slate-600 font-mono">{mvmt.timestamp}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                        {mvmt.from} <TrendingUp className="w-2 h-2 rotate-90" /> {mvmt.to}
                      </div>
                    </div>
                  </div>
                  {mvmt.intensity > 0.8 && (
                    <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase font-bold">24H Whale Vol</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">142,903 BTC</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Inflow Bias</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">+12.4%</span>
          </div>
        </div>
        <button className="text-[10px] text-indigo-400 hover:text-white flex items-center gap-1 uppercase font-bold tracking-widest transition-colors">
          Open Full Analytics
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default WhaleActivityTracker;
