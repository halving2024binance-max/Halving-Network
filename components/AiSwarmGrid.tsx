import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Shield, Target, Microscope, Eye, Activity } from 'lucide-react';
import { AgentSpecialty } from '../types';

interface AiSwarmGridProps {
  metrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const SPECIALTIES: AgentSpecialty[] = ['Infrastructure', 'QuantumDefense', 'Hashrate', 'Consensus', 'Vision2030', 'Security'];
const COLORS = {
  active: '#10b981', // emerald-500
  processing: '#f59e0b', // amber-500
  QuantumDefense: '#6366f1', // indigo-500
  Infrastructure: '#06b6d4', // cyan-500
  Consensus: '#10b981',
  Vision2030: '#f59e0b',
  Security: '#f43f5e', // rose-500
  Hashrate: '#10b981'
};

const AiSwarmGrid: React.FC<AiSwarmGridProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Total Agents upgraded to 10,000,000
  const totalAgents = 10000000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set resolution - using a dense pixel representation
    const width = canvas.width = 1200;
    const height = canvas.height = 500;
    
    // Efficiently pre-calculate states for a sub-sample of the 10M agents for performance
    const sampleSize = width * height; 
    const states = new Uint8Array(sampleSize);
    for(let i=0; i<sampleSize; i++) states[i] = Math.random() > 0.98 ? 1 : 0;

    let animationFrameId: number;
    
    const render = () => {
      // Clear with dark background
      ctx.fillStyle = '#020617'; 
      ctx.fillRect(0, 0, width, height);

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Render granular representation of the 10,000,000 agent swarm
      for (let i = 0; i < sampleSize; i++) {
        // High-frequency "thinking" flicker for 10M agent density simulation
        if (Math.random() > 0.9997) {
          states[i] = states[i] === 1 ? 0 : 1;
        }

        const x = i % width;
        const y = Math.floor(i / width);
        if (y >= height) break;

        const pixelIndex = (y * width + x) * 4;
        const isProcessing = states[i] === 1;
        
        // Dynamic Color mapping
        if (isProcessing) {
          data[pixelIndex] = 245;     // R
          data[pixelIndex + 1] = 158; // G
          data[pixelIndex + 2] = 11;  // B
          data[pixelIndex + 3] = 255; // A
        } else {
          // Intense noise variance for 10M scale complexity
          const noise = Math.random() * 80;
          data[pixelIndex] = 16;      // R
          data[pixelIndex + 1] = 140 + noise; // G (Slightly darker base for more noise visibility)
          data[pixelIndex + 2] = 129; // B
          data[pixelIndex + 3] = 180; // A
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      // Dynamic "Exascale Neural Scan" sweep lines
      const time = Date.now();
      const sweepY = (time / 12) % height;
      const sweepY2 = (time / 20) % height;

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, sweepY); ctx.lineTo(width, sweepY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, sweepY2); ctx.lineTo(width, sweepY2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
        <Cpu className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
            Neural Agent Swarm <span className="text-emerald-500">v4.0_ULTRA</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest mt-1">
            10,000,000 Active Nodes • Petaflop Intelligence Matrix
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center min-w-[100px]">
            <div className="text-xs font-black text-emerald-400">{metrics.activeAgents.toLocaleString()}</div>
            <div className="text-[8px] text-slate-500 font-bold uppercase">Synced_Nodes</div>
          </div>
          <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <div className="text-xs font-black text-amber-400">{metrics.processingLoad}%</div>
            <div className="text-[8px] text-slate-500 font-bold uppercase">Load</div>
          </div>
          <div className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center">
             <div className="text-xs font-black text-cyan-400">{metrics.hashrate} ZH/s</div>
             <div className="text-[8px] text-slate-500 font-bold uppercase">Global Capacity</div>
          </div>
        </div>
      </div>

      {/* The 10,000,000 Node Canvas Renderer */}
      <div className="relative w-full aspect-[25/9] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-40"></div>
        
        {/* Live Overlay Labels */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg text-[8px] font-mono text-emerald-400 shadow-xl">
            <Activity className="w-3 h-3" />
            LIVE_MESH_SATURATION: 10,000,000_VERIFIED
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-slate-800 pt-6">
        {[
          { icon: Microscope, label: 'Quantum Sentinels', count: '1,650,000', color: 'text-indigo-400' },
          { icon: Target, label: 'Hashrate Architects', count: '2,400,000', color: 'text-emerald-400' },
          { icon: Shield, label: 'Defensive Clusters', count: '3,950,000', color: 'text-rose-400' },
          { icon: Eye, label: '2030 Prophets', count: '2,000,000', color: 'text-amber-400' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}:</span>
            <span className="text-[10px] font-mono text-white font-black">{item.count}</span>
          </div>
        ))}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AiSwarmGrid;